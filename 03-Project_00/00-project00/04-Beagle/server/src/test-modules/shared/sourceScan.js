/**
 * 共享静态源码扫描工具
 * 为代码质量/安全类插件提供统一的：文件遍历、逐行扫描、注释感知、命中收集。
 * 规则函数只关心"这一行/这个文件是否命中"，不重复实现遍历逻辑。
 */
const path = require('path');
const { walk, readText, toRel } = require('../i18n-check/lib/fileWalker');

// 常用正则（供各插件复用）
const COMMON_PATTERNS = {
  url: /https?:\/\/[^\s'"`)\]}]+/g,
  wsUrl: /wss?:\/\/[^\s'"`)\]}]+/g,
  ipv4: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?::\d{2,5})?\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  console: /\bconsole\.(log|info|debug|warn|error|trace|table|dir|group)\s*\(/g,
  debugger: /\bdebugger\b/g,
  alert: /\b(?:alert|confirm|prompt)\s*\(/g,
  looseEqual: /[=!]==?[^=]/g,
  varDecl: /\bvar\s+[A-Za-z_$]/g,
  todo: /(?:TODO|FIXME|XXX|HACK)\b/g
};

const LINE_COMMENT = { '.js': '//', '.jsx': '//', '.ts': '//', '.tsx': '//', '.vue': '//', '.mjs': '//', '.cjs': '//', '.java': '//', '.go': '//' };
const DEFAULT_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs', '.cjs'];

/**
 * 判断字符位置是否处于字符串内（粗略，用于减少误报）
 */
function isInString(line, idx) {
  let quote = null;
  for (let i = 0; i < idx; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    }
  }
  return !!quote;
}

/**
 * 去掉一行中的行注释部分（保留字符串内的 //）
 */
function stripLineComment(line, ext) {
  const marker = LINE_COMMENT[ext] || '//';
  let quote = null;
  for (let i = 0; i < line.length - 1; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (marker === '//' && ch === '/' && line[i + 1] === '/') {
      return line.slice(0, i);
    } else if (marker === '#' && ch === '#') {
      return line.slice(0, i);
    }
  }
  return line;
}

/**
 * 逐行扫描一个文件内容
 * @param {string} content 文件全文
 * @param {function} lineFn (ctx)=> hit对象|hit数组|null；ctx:{line,text(去注释),raw,ext,file,rel}
 * @param {object} opts { skipComments, ext }
 */
function scanContent(content, lineFn, opts = {}) {
  const ext = opts.ext || '';
  const lines = content.split('\n');
  let inBlockComment = false;
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    let text = raw;
    // 块注释状态机（粗略，不处理字符串内的 /*）
    const blockOpen = raw.indexOf('/*');
    const blockClose = raw.indexOf('*/');
    if (inBlockComment) {
      if (blockClose !== -1) {
        inBlockComment = false;
        text = raw.slice(blockClose + 2);
      } else {
        continue;
      }
    } else if (blockOpen !== -1 && (blockClose === -1 || blockClose < blockOpen)) {
      text = raw.slice(0, blockOpen);
      inBlockComment = true;
    }
    if (opts.skipComments !== false) text = stripLineComment(text, ext);
    const ctx = { line: i + 1, text, raw, ext, content, file: opts.file, rel: opts.rel };
    try {
      const r = lineFn(ctx);
      if (r) {
        if (Array.isArray(r)) hits.push(...r.filter(Boolean));
        else hits.push(r);
      }
    } catch (e) {
      // 单条规则异常不影响整体扫描
    }
  }
  return hits;
}

/**
 * 遍历目录并扫描
 * @param {string} root 源码根
 * @param {object} opts { exts, ignoreDirs, maxFiles, skipComments }
 * @param {function} lineFn 逐行规则
 * @param {function} fileFn 可选，整文件规则 (ctx)=>(hits)
 * @returns {{ hits: Array, files: number, truncated: boolean, perFile: Object }}
 */
function scanDirectory(root, lineFn, fileFn, opts = {}) {
  if (!root) return { hits: [], files: 0, truncated: false, perFile: {} };
  const { files, truncated } = walk(root, {
    exts: opts.exts || DEFAULT_EXTS,
    ignoreDirs: opts.ignoreDirs,
    maxFiles: opts.maxFiles || 20000
  });
  const allHits = [];
  const perFile = {};
  let scanned = 0;
  for (const file of files) {
    const content = readText(file);
    if (content == null) continue;
    scanned++;
    const rel = toRel(root, file);
    const ext = path.extname(file).toLowerCase();
    const common = { file, rel, ext };
    if (lineFn) {
      const hits = scanContent(content, lineFn, { ...opts, ...common });
      for (const h of hits) {
        allHits.push(h);
        perFile[rel] = (perFile[rel] || 0) + 1;
      }
    }
    if (fileFn) {
      const hits = fileFn({ content, ...common }) || [];
      for (const h of hits) {
        allHits.push(h);
        perFile[rel] = (perFile[rel] || 0) + 1;
      }
    }
    if (allHits.length >= (opts.maxHits || 5000)) break;
  }
  return { hits: allHits, files: scanned, truncated, perFile };
}

/**
 * 用某个全局正则在一行文本中找全部匹配，返回命中片段数组（带列号）
 */
function matchAll(line, text, regex, rule, extra = {}) {
  const out = [];
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({ col: m.index + 1, rule, snippet: m[0].trim().slice(0, 120), match: m[0], ...extra });
    if (!re.global) break;
  }
  return out;
}

module.exports = {
  COMMON_PATTERNS,
  DEFAULT_EXTS,
  isInString,
  stripLineComment,
  scanContent,
  scanDirectory,
  matchAll
};
