/**
 * 硬编码中文扫描器
 * 扫描 src/ 下 .vue / .ts 文件中的中文字符串
 * 排除: 注释、console.*、i18n 定义文件本身
 *
 * 作者: GooHv
 */
import fs from 'fs'
import path from 'path'

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')
const srcDir = path.join(projectRoot, 'src')

const CJK = /[\u4e00-\u9fff]/

function walk(dir, ext, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      // skip i18n definition dir, node_modules, assets
      if (e.name === 'i18n' && dir.endsWith('src')) continue
      walk(full, ext, out)
    } else if (ext.some(x => e.name.endsWith(x))) {
      out.push(full)
    }
  }
  return out
}

// Remove // and /* */ comments and console.* lines from a JS/TS-ish source
function stripJsCommentsAndConsole(src) {
  let out = ''
  let i = 0
  const n = src.length
  let inStr = null // ', ", `
  while (i < n) {
    const c = src[i]
    const c2 = src[i + 1]
    if (inStr) {
      out += c
      if (c === '\\') { out += src[i+1] || ''; i += 2; continue }
      if (c === inStr) inStr = null
      i++
      continue
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; out += c; i++; continue }
    if (c === '/' && c2 === '/') {
      // line comment - skip to end of line
      while (i < n && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && c2 === '*') {
      i += 2
      while (i < n && !(src[i] === '*' && src[i+1] === '/')) i++
      i += 2
      continue
    }
    out += c
    i++
  }
  // Remove console.* statements (rough: from console. to the matching close paren)
  out = out.replace(/console\s*\.\s*(log|warn|error|info|debug)\s*\([\s\S]*?\)\s*;?/g, '')
  return out
}

// Strip HTML comments <!-- ... -->
function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, '')
}

// Extract Chinese-containing string literals from JS source
function extractChineseStrings(src) {
  const results = []
  // match '...' "..." `...`
  const re = /(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g
  let m
  while ((m = re.exec(src)) !== null) {
    const body = m[2]
    if (CJK.test(body)) {
      // skip template expressions that are i18n keys like `device.status.${x}`
      results.push(body)
    }
  }
  return results
}

function scanVue(file) {
  const raw = fs.readFileSync(file, 'utf8')
  const findings = []

  // Split into template / script blocks
  // Find template block
  const tplMatch = raw.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
  const scriptMatches = [...raw.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]

  if (tplMatch) {
    let tpl = stripHtmlComments(tplMatch[1])
    // Find Chinese in attribute values: attr="中文" or attr='中文'
    const attrRe = /([a-zA-Z-:]+)\s*=\s*"([^"]*[\u4e00-\u9fff][^"]*)"/g
    let m
    while ((m = attrRe.exec(tpl)) !== null) {
      findings.push({ type: 'attr', attr: m[1], text: m[2] })
    }
    const attrRe2 = /([a-zA-Z-:]+)\s*=\s*'([^']*[\u4e00-\u9fff][^']*)'/g
    while ((m = attrRe2.exec(tpl)) !== null) {
      findings.push({ type: 'attr', attr: m[1], text: m[2] })
    }
    // Find Chinese in text content (between > and <)
    const textRe = />([^<>{}]*[\u4e00-\u9fff][^<>{}]*)</g
    while ((m = textRe.exec(tpl)) !== null) {
      const txt = m[1].trim()
      if (txt && CJK.test(txt)) findings.push({ type: 'text', text: txt })
    }
    // Chinese in mustache {{ '中文' }}
    const moustacheRe = /\{\{([^}]*)\}\}/g
    while ((m = moustacheRe.exec(tpl)) !== null) {
      const inner = m[1]
      if (CJK.test(inner)) {
        // check if it's already $t/t
        if (!/\$t\s*\(|\bt\s*\(/.test(inner)) {
          findings.push({ type: 'mustache', text: inner.trim() })
        }
      }
    }
  }

  for (const sm of scriptMatches) {
    let script = stripJsCommentsAndConsole(sm[1])
    // Skip if this is an i18n definition block (it's not, we already exclude i18n dir)
    const strings = extractChineseStrings(script)
    strings.forEach(s => findings.push({ type: 'js-string', text: s }))
  }
  return findings
}

function scanTs(file) {
  const raw = fs.readFileSync(file, 'utf8')
  const stripped = stripJsCommentsAndConsole(raw)
  const strings = extractChineseStrings(stripped)
  return strings.map(s => ({ type: 'js-string', text: s }))
}

const files = [
  ...walk(srcDir, ['.vue']),
  ...walk(srcDir, ['.ts'])
]

// Exclude i18n definition files explicitly
const filtered = files.filter(f => !f.replace(/\\/g, '/').includes('/i18n/'))

const allFindings = []
for (const f of filtered) {
  const rel = path.relative(projectRoot, f)
  let findings = []
  if (f.endsWith('.vue')) findings = scanVue(f)
  else findings = scanTs(f)
  // dedupe
  const seen = new Set()
  findings = findings.filter(x => {
    const k = x.type + '|' + x.text
    if (seen.has(k)) return false
    seen.add(k); return true
  })
  if (findings.length) allFindings.push({ file: rel, findings })
}

let total = 0
for (const f of allFindings) {
  console.log('\n## ' + f.file)
  for (const x of f.findings) {
    total++
    console.log(`  [${x.type}] ${x.attr ? x.attr + '=' : ''}"${x.text}"`)
  }
}
console.log('\n=== TOTAL HARDCODED FINDINGS: ' + total + ' ===')
