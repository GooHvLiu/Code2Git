/**
 * 文件遍历器
 * 统一遍历前后端源码，内置常见忽略目录，支持扩展名过滤与文件上限保护
 */
const fs = require('fs');
const path = require('path');

// 默认忽略目录（依赖、构建产物、版本控制、缓存）
const DEFAULT_IGNORE_DIRS = [
  'node_modules', 'dist', 'build', '.git', '.svn', 'coverage',
  '.nuxt', '.next', 'unpackage', '.cache', 'tmp', 'temp', 'logs',
  '.idea', '.vscode', 'miniprogram_npm', 'vendor', 'third_party',
  '__pycache__', '.turbo', 'out', 'target'
];

// 默认扫描的源码扩展名
const DEFAULT_CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs', '.cjs'];

/**
 * 递归遍历目录，返回全部文件（绝对路径）
 * @param {string} root 根目录
 * @param {Object} opts { ignoreDirs, exts, maxFiles, followSymlink }
 * @returns {{files: string[], truncated: boolean, scannedDirs: number}}
 */
function walk(root, opts = {}) {
  const ignoreDirs = new Set([...DEFAULT_IGNORE_DIRS, ...(opts.ignoreDirs || [])]);
  const exts = opts.exts ? opts.exts.map(e => e.toLowerCase()) : null;
  const maxFiles = opts.maxFiles || 20000;

  const files = [];
  let truncated = false;
  let scannedDirs = 0;

  if (!root || !fs.existsSync(root)) {
    return { files, truncated, scannedDirs };
  }

  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      continue;
    }
    scannedDirs++;
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) stack.push(full);
      } else if (entry.isFile()) {
        if (exts) {
          if (!exts.includes(path.extname(entry.name).toLowerCase())) continue;
        }
        files.push(full);
        if (files.length >= maxFiles) {
          truncated = true;
          return { files, truncated, scannedDirs };
        }
      }
    }
  }
  return { files, truncated, scannedDirs };
}

/**
 * 转为相对路径（用正斜杠，便于跨平台展示）
 */
function toRel(root, file) {
  let rel = path.relative(root, file);
  return rel.split(path.sep).join('/');
}

/**
 * 读取文本文件（安全，失败返回 null）
 */
function readText(file) {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (e) {
    return null;
  }
}

/**
 * 对 .vue 单文件组件提取 <script> 块内容（import/require 只可能出现在这里）；
 * 非 .vue 文件原样返回
 */
function extractScript(content, file) {
  if (!file || !file.toLowerCase().endsWith('.vue') || content == null) return content;
  const m = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return m ? m[1] : '';
}

module.exports = {
  walk,
  toRel,
  readText,
  extractScript,
  DEFAULT_IGNORE_DIRS,
  DEFAULT_CODE_EXTS
};
