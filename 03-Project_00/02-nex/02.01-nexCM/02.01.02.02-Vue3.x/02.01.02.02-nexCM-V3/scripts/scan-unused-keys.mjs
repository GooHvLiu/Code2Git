/**
 * 未使用 i18n key 扫描器
 * 扫描 .vue/.ts 中实际引用的 i18n key，对比 i18n 定义文件，输出未被引用的冗余 key
 * 动态拼接 key (如 t('status.' + code)) 会保留其父级下所有兄弟 key
 *
 * 作者: GooHv
 */
import fs from 'fs'
import path from 'path'

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')
const srcDir = path.join(projectRoot, 'src')

// Load flattened zh keys (produced by symmetry script)
const zhFlat = JSON.parse(fs.readFileSync(path.join(projectRoot, 'scripts/.i18n-zh-flat.json'), 'utf8'))
const allDefinedKeys = new Set(Object.keys(zhFlat))

function walk(dir, ext, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, ext, out)
    else if (ext.some(x => e.name.endsWith(x))) out.push(full)
  }
  return out
}

const files = [
  ...walk(srcDir, ['.vue']),
  ...walk(srcDir, ['.ts'])
].filter(f => !f.replace(/\\/g, '/').includes('/i18n/modules'))

// Collect used key literals and dynamic prefixes
const usedLiteralKeys = new Set()
const dynamicPrefixes = new Set() // e.g. 'device.status'

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  // Match $t('...') / t('...') / i18n.t('...') / te('...') / tm('...')
  // Capture the first string argument
  const re = /(?:\$t|\bt\b|\bte\b|\btm\b|\btn\b)\s*\(\s*(['"`])([^'"`]+)\1/g
  let m
  while ((m = re.exec(src)) !== null) {
    const key = m[2]
    if (/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(key)) {
      usedLiteralKeys.add(key)
    }
  }
  // Dynamic: t('prefix.' + xxx) or t(`prefix.${...}`)
  const dynRe = /(?:\$t|\bt\b)\s*\(\s*(['"`])([a-zA-Z][a-zA-Z0-9_.]*)\.\s*['"`]\s*\+/g
  while ((m = dynRe.exec(src)) !== null) {
    dynamicPrefixes.add(m[2] + '.')
  }
  // template literal: t(`prefix.${...}`)
  const dynRe2 = /(?:\$t|\bt\b)\s*\(\s*`([a-zA-Z][a-zA-Z0-9_.]*)\.\$\{/g
  while ((m = dynRe2.exec(src)) !== null) {
    dynamicPrefixes.add(m[1] + '.')
  }
}

// A key is "used" if:
//  - it is directly referenced, OR
//  - it starts with a dynamic prefix (parent of dynamic concat)
//  - any ancestor of a directly-used key is also used (parent objects aren't leaves anyway)
const used = new Set()
for (const k of usedLiteralKeys) used.add(k)
for (const k of allDefinedKeys) {
  for (const p of dynamicPrefixes) {
    if (k.startsWith(p)) { used.add(k); break }
  }
}

const unused = [...allDefinedKeys].filter(k => !used.has(k)).sort()

console.log('=== Unused i18n key scan ===')
console.log('Defined leaf keys:', allDefinedKeys.size)
console.log('Directly used literal keys:', usedLiteralKeys.size)
console.log('Dynamic prefixes kept:', [...dynamicPrefixes].join(', ') || '(none)')
console.log('Unused count:', unused.length)
console.log('')
unused.forEach(k => console.log('  - ' + k + '  =  ' + JSON.stringify(zhFlat[k])))
