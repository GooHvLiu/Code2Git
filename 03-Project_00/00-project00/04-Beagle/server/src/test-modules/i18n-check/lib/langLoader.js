/**
 * 语言包加载器
 * 支持多种国际化文件组织方式：
 *  - single-file: 目录下 zh-CN.js / en-US.json 等独立文件
 *  - module-dir:  modules/、modules-en/ 等模块化目录，递归合并
 *  - 嵌套对象 / 扁平 key 自动扁平化
 *  - CommonJS(module.exports) / ESM(export default) / JSON
 *  - 静态重复 key 检测（运行时会被覆盖，必须读源码才能发现）
 */
const fs = require('fs');
const path = require('path');
const { walk, readText } = require('./fileWalker');

/**
 * 扁平化嵌套对象为 { 'a.b.c': value }
 */
function flatten(obj, prefix = '', out = {}, sep = '.') {
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}${sep}${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out, sep);
    } else {
      out[key] = v;
    }
  }
  return out;
}

/**
 * 加载一个 JS/JSON 语言文件为对象（尽量不依赖 require，避免缓存与 ESM 报错）
 */
function loadObjectFile(file) {
  const ext = path.extname(file).toLowerCase();
  const content = readText(file);
  if (content == null) return { ok: false, error: '读取失败', object: {} };

  if (ext === '.json') {
    try {
      return { ok: true, object: JSON.parse(content), raw: content };
    } catch (e) {
      return { ok: false, error: `JSON 解析失败: ${e.message}`, object: {} };
    }
  }

  // JS：优先 require（处理 CommonJS），失败再用源码提取
  try {
    delete require.cache[require.resolve(file)];
    // eslint-disable-next-line import/no-dynamic-require
    const mod = require(file);
    const obj = mod && mod.default ? mod.default : mod;
    if (obj && typeof obj === 'object') return { ok: true, object: obj, raw: content };
  } catch (e) {
    // 落到源码解析
  }
  const obj = parseModuleObject(content);
  if (obj && typeof obj === 'object') return { ok: true, object: obj, raw: content, parsed: true };
  return { ok: false, error: '无法解析为对象', object: {}, raw: content };
}

/**
 * 从源码文本提取 export default / module.exports 后的对象字面量
 * 用括号配平找到完整对象，再用 new Function 求值（纯数据对象，无副作用）
 */
function parseModuleObject(content) {
  const patterns = [
    /export\s+default\s*/,
    /module\.exports\s*=\s*/,
    /exports\.default\s*=\s*/
  ];
  for (const re of patterns) {
    const m = content.match(re);
    if (m) {
      const start = content.indexOf('{', m.index);
      if (start === -1) continue;
      const objStr = matchBalanced(content, start, '{', '}');
      if (objStr) {
        try {
          // eslint-disable-next-line no-new-func
          return new Function(`return (${objStr});`)();
        } catch (e) {
          return null;
        }
      }
    }
  }
  return null;
}

/**
 * 括号/花括号配平，返回从 openPos 开始的完整片段（含字符串感知）
 */
function matchBalanced(src, openPos, openCh, closeCh) {
  let depth = 0;
  let inStr = null;
  for (let i = openPos; i < src.length; i++) {
    const ch = src[i];
    const prev = src[i - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === openCh) depth++;
    if (ch === closeCh) {
      depth--;
      if (depth === 0) return src.slice(openPos, i + 1);
    }
  }
  return null;
}

/**
 * 静态检测一个对象源码文件内的重复键（返回重复键路径数组）
 * 简化策略：逐行提取 "key": 或 'key': 或 key:，按出现次数判断
 */
function findDuplicateKeys(raw) {
  if (!raw) return [];
  const counter = {};
  const keyRe = /(?:^|[,{]\s*)(['"`]?)([A-Za-z0-9_$.-]+)\1\s*:/g;
  let m;
  while ((m = keyRe.exec(raw)) !== null) {
    const k = m[2];
    counter[k] = (counter[k] || 0) + 1;
  }
  return Object.entries(counter).filter(([, n]) => n > 1).map(([k]) => k);
}

/**
 * 从文件名/目录名推断语言代码，如 zh-CN.js -> zh-CN, modules-en-us -> en-US
 */
function inferLangCode(name) {
  const base = name.replace(/\.(js|json|ts|mjs|cjs)$/i, '');
  // 直接匹配 xx-XX 形式
  const direct = base.match(/([a-z]{2,3})[-_]([A-Za-z]{2,4})/);
  if (direct) return `${direct[1]}-${direct[2].toUpperCase()}`;
  // modules-en / modules-en-us
  const modMatch = base.match(/modules?[-_]([a-z]{2,3})(?:[-_]([a-z]{2,4}))?/i);
  if (modMatch) {
    return modMatch[2] ? `${modMatch[1]}-${modMatch[2].toUpperCase()}` : modMatch[1].toLowerCase();
  }
  // 纯语言名 zh / en
  if (/^[a-z]{2,3}$/i.test(base)) return base.toLowerCase();
  return base;
}

/**
 * 加载整个国际化目录
 * @returns {{
 *   structure: string,
 *   packs: Object<string, Object>,   // langCode -> 扁平 key:value
 *   sources: Object<string, string[]>, // langCode -> 源文件列表
 *   errors: Array, duplicates: Object
 * }}
 */
function loadLanguagePacks(i18nPath, opts = {}) {
  const sep = opts.keySeparator || '.';
  const result = {
    structure: 'unknown',
    packs: {},
    sources: {},
    errors: [],
    duplicates: {},
    fileCount: 0
  };
  if (!fs.existsSync(i18nPath)) return result;

  const topEntries = fs.readdirSync(i18nPath, { withFileTypes: true });

  // 模块化目录：名字以 module 开头，或配置指定
  const moduleDirs = topEntries.filter(e =>
    e.isDirectory() && /^modules?/i.test(e.name)
  );
  // 顶层语言文件
  const langFiles = topEntries.filter(e =>
    e.isFile() && /\.(js|json|mjs|cjs|ts)$/i.test(e.name) && !/^index\./i.test(e.name)
  );

  if (moduleDirs.length > 0) {
    result.structure = 'module-dir';
    for (const dir of moduleDirs) {
      const langCode = inferLangCode(dir.name) || 'default';
      const dirPath = path.join(i18nPath, dir.name);
      const { files } = walk(dirPath, {
        exts: ['.js', '.json', '.mjs', '.cjs', '.ts'],
        maxFiles: 5000
      });
      const merged = {};
      result.sources[langCode] = [];
      for (const f of files) {
        if (/index\.(js|ts)$/i.test(path.basename(f))) continue; // 聚合入口跳过
        const loaded = loadObjectFile(f);
        result.fileCount++;
        result.sources[langCode].push(f);
        if (!loaded.ok) {
          result.errors.push({ file: f, error: loaded.error });
          continue;
        }
        const dup = findDuplicateKeys(loaded.raw);
        if (dup.length) result.duplicates[f] = dup;
        // 以相对模块目录的路径作为 key 前缀（更贴近命名空间）
        const rel = path.relative(dirPath, f).replace(/\.(js|json|ts|mjs|cjs)$/i, '').split(path.sep).join('.');
        const flat = flatten(loaded.object, rel, {}, sep);
        Object.assign(merged, flat);
      }
      result.packs[langCode] = merged;
    }
  } else if (langFiles.length > 0) {
    result.structure = 'single-file';
    for (const f of langFiles.map(e => path.join(i18nPath, e.name))) {
      const langCode = inferLangCode(path.basename(f));
      const loaded = loadObjectFile(f);
      result.fileCount++;
      if (!loaded.ok) {
        result.errors.push({ file: f, error: loaded.error });
        continue;
      }
      const dup = findDuplicateKeys(loaded.raw);
      if (dup.length) result.duplicates[f] = dup;
      result.packs[langCode] = flatten(loaded.object, '', {}, sep);
      result.sources[langCode] = [f];
    }
  }

  return result;
}

module.exports = {
  flatten,
  loadObjectFile,
  parseModuleObject,
  findDuplicateKeys,
  inferLangCode,
  loadLanguagePacks
};
