/**
 * 多框架国际化引用扫描器
 * 支持：vue-i18n、react-intl、i18next、通用 t()、后端 gettext/__/req.t
 * 输出每个 key 的精确引用位置（文件:行号），并识别无法静态确定的动态 key。
 */
const { readText, toRel } = require('./fileWalker');

// 各框架的 key 提取规则
const FRAMEWORK_RULES = [
  { framework: 'vue-i18n', re: /\$tc?\(\s*['"`]([^'"`]+)['"`]/g },
  { framework: 'vue-i18n', re: /i18n(?:\.global)?\.t\(\s*['"`]([^'"`]+)['"`]/g },
  { framework: 'react-intl', re: /formatMessage\(\s*\{[^}]*?id\s*:\s*['"`]([^'"`]+)['"`]/g },
  { framework: 'react-intl', re: /<FormattedMessage[^>]*?\bid\s*=\s*['"`]([^'"`]+)['"`]/g },
  { framework: 'i18next', re: /\bt\(\s*['"`]([^'"`]+)['"`]/g },
  { framework: 'backend', re: /\b(?:__|gettext|ngettext|req\.t|req\.i18n\.t|ctx\.i18n\.t)\(\s*['"`]([^'"`]+)['"`]/g }
];

// 动态 key（参数是变量/模板串，无法静态确定）——列入存疑
const DYNAMIC_RULES = [
  /\$t\(\s*[a-zA-Z_$][\w$.]*\s*[),]/g,
  /\bt\(\s*[a-zA-Z_$][\w$.]*\s*[),]/g,
  /\$t\(\s*`[^`]*\$\{/g,
  /\bt\(\s*`[^`]*\$\{/g,
  /formatMessage\(\s*[a-zA-Z_$]/g
];

// 中文字符串字面量（后端/前端硬编码中文检测）
const CJK_RE = /['"`]([^'"`]*[\u4e00-\u9fa5][^'"`]*)['"`]/g;

function lineOf(content, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (content[i] === '\n') line++;
  return line;
}

/**
 * 扫描一组文件中的 i18n key 引用
 * @returns {{ usages: Object<string, Array>, usedKeys: string[], dynamic: Array, hardcodedCJK: Array }}
 */
function scanFiles(files, root, opts = {}) {
  const frameworks = opts.frameworks || ['vue-i18n', 'react-intl', 'i18next', 'backend'];
  const usages = {};           // key -> [{file,line,framework}]
  const usedSet = new Set();
  const dynamic = [];
  const hardcodedCJK = [];
  const maxHardcoded = opts.maxHardcodedPerFile || 60;

  for (const file of files) {
    const content = readText(file);
    if (content == null) continue;
    const rel = toRel(root, file);

    // 1) 静态 key
    for (const rule of FRAMEWORK_RULES) {
      if (!frameworks.includes(rule.framework)) continue;
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(content)) !== null) {
        const key = m[1];
        if (!key) continue;
        usedSet.add(key);
        if (!usages[key]) usages[key] = [];
        // 限制每个 key 的位置数量，避免爆炸
        if (usages[key].length < 50) {
          usages[key].push({ file: rel, line: lineOf(content, m.index), framework: rule.framework });
        }
      }
    }

    // 2) 动态 key（存疑）
    if (opts.checkDynamic !== false) {
      for (const re of DYNAMIC_RULES) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(content)) !== null) {
          dynamic.push({ file: rel, line: lineOf(content, m.index), snippet: m[0].slice(0, 60) });
          if (dynamic.length > 500) break;
        }
      }
    }

    // 3) 硬编码中文（仅在开启时，且通常只扫 .js/.ts/.vue 的 script 区域；这里全量扫描并限额）
    if (opts.checkHardcoded) {
      let count = 0;
      CJK_RE.lastIndex = 0;
      let m;
      while ((m = CJK_RE.exec(content)) !== null) {
        const text = m[1].trim();
        // 过滤注释式/过短/纯标点
        if (text.length < 2) continue;
        hardcodedCJK.push({ file: rel, line: lineOf(content, m.index), text: text.slice(0, 80) });
        if (++count >= maxHardcoded) break;
      }
    }
  }

  return {
    usages,
    usedKeys: [...usedSet].sort(),
    dynamic,
    hardcodedCJK
  };
}

module.exports = { scanFiles, FRAMEWORK_RULES, DYNAMIC_RULES };
