/**
 * 引用图分析器
 * 扫描 ES Module / CommonJS / 动态 import / Vue 组件引用，构建文件依赖图，
 * 从而区分：被引用文件（参与检测）、孤儿文件（疑似无用，列入存疑）、断链引用。
 */
const fs = require('fs');
const path = require('path');
const { walk, readText, toRel, extractScript } = require('./fileWalker');

// 各类 import / require 写法
const IMPORT_PATTERNS = [
  /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g,     // import x from '...' / import '...'
  /export\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g,          // export ... from '...'
  /require\(\s*['"]([^'"]+)['"]\s*\)/g,                    // require('...')
  /import\(\s*['"]([^'"]+)['"]\s*\)/g,                     // 动态 import('...')
  /\b(?:component|modules?)\s*:\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)/g // 路由懒加载
];

// 入口文件名（不会被当作孤儿）
const ENTRY_NAMES = ['main.js', 'main.ts', 'main.mjs', 'index.js', 'index.ts', 'App.vue', 'app.js', 'app.ts', 'server.js', 'app.tsx', 'main.tsx'];

// 非代码静态资源：不作为项目模块解析，也不算断链
const ASSET_RE = /\.(css|scss|sass|less|styl|png|jpe?g|gif|svg|webp|ico|bmp|woff2?|ttf|eot|mp[34]|wav|avi|mov|webm|pdf|zip|rar)$/i;

const RESOLVE_EXTS = ['', '.js', '.ts', '.jsx', '.tsx', '.vue', '.mjs', '.cjs', '.json', '/index.js', '/index.ts', '/index.vue'];

/**
 * 构建引用图
 * @param {string} root 源码根目录
 * @param {Object} opts { alias: {'@':'src'}, exts, maxFiles }
 */
function buildGraph(root, opts = {}) {
  const alias = opts.alias || { '@': 'src' };
  const { files } = walk(root, { exts: opts.exts, maxFiles: opts.maxFiles });
  const fileSet = new Set(files);

  // 被引用计数：file -> 被多少文件引用
  const referencedBy = new Map();
  // 文件 -> 它引用了谁
  const importsOf = new Map();
  const brokenImports = [];

  const resolveSpecifier = (spec, fromFile) => {
    let target = spec;
    let aliased = false;
    // 别名替换（如 @/xxx -> src/xxx）
    for (const [a, dest] of Object.entries(alias)) {
      if (target === a || target.startsWith(a + '/')) {
        target = dest + target.slice(a.length);
        aliased = true;
      }
    }
    let base;
    if (aliased) {
      // 别名路径（替换后可能形如 ./xxx）一律相对源码根解析，优先级最高
      base = path.resolve(root, target);
    } else if (target.startsWith('.')) {
      base = path.resolve(path.dirname(fromFile), target);
    } else if (target.startsWith('/')) {
      base = path.resolve(root, '.' + target);
    } else {
      // 裸模块（npm 包），不解析为项目文件
      return { npm: true, resolved: null };
    }
    for (const ext of RESOLVE_EXTS) {
      // path.normalize 统一混合斜杠（Windows 下 /index.js 与 \index.js 等价）
      const candidate = path.normalize(base + ext);
      if (fileSet.has(candidate)) return { npm: false, resolved: candidate };
    }
    return { npm: false, resolved: null };
  };

  for (const file of files) {
    const raw = readText(file);
    if (raw == null) continue;
    const content = extractScript(raw, file);  // .vue 仅取 script 块
    const deps = new Set();
    for (const re of IMPORT_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(content)) !== null) {
        const spec = m[1];
        if (!spec || ASSET_RE.test(spec)) continue;  // 跳过静态资源
        const { npm, resolved } = resolveSpecifier(spec, file);
        if (npm) continue;
        if (resolved) {
          deps.add(resolved);
          referencedBy.set(resolved, (referencedBy.get(resolved) || 0) + 1);
        } else {
          brokenImports.push({ file: toRel(root, file), specifier: spec });
        }
      }
    }
    importsOf.set(file, [...deps]);
  }

  // 入口文件
  const entryFiles = files.filter(f => ENTRY_NAMES.includes(path.basename(f)));
  const entrySet = new Set(entryFiles);

  // 孤儿文件：没有被任何文件引用，且自身不是入口
  const orphanFiles = files.filter(f => !referencedBy.has(f) && !entrySet.has(f));

  return {
    root,
    allFiles: files,
    fileSet,
    referencedBy,
    importsOf,
    entryFiles,
    orphanFiles: orphanFiles.map(f => toRel(root, f)),
    brokenImports,
    isReferenced(file) {
      return referencedBy.has(file) || entrySet.has(file);
    },
    rel(file) { return toRel(root, file); }
  };
}

module.exports = { buildGraph, IMPORT_PATTERNS, ENTRY_NAMES };
