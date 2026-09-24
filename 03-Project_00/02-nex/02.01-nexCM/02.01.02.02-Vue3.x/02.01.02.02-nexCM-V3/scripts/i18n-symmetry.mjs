/**
 * i18n 对称性校验脚本
 * 递归对比 src/i18n/modules/ (zh-CN) 与 src/i18n/modules-en-us/ (en-US) 的完整 key 树
 * 输出: 缺失 key (zh 有 en 无) / 多余 key (en 有 zh 无) / 空值 key
 *
 * 作者: GooHv
 */
import { build } from 'esbuild'
import { pathToFileURL } from 'url'
import path from 'path'
import fs from 'fs'
import os from 'os'

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')

async function bundleEntry(entryPath, outFile) {
  await build({
    entryPoints: [entryPath],
    outfile: outFile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: true,
    logLevel: 'silent',
    resolveExtensions: ['.ts', '.js', '.mjs']
  })
}

function flattenKeys(obj, prefix = '', out = new Map()) {
  if (obj === null || obj === undefined) return out
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    out.set(prefix, obj)
    return out
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flattenKeys(v, p, out)
    } else {
      out.set(p, v)
    }
  }
  return out
}

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-audit-'))
  const zhEntry = path.join(projectRoot, 'src/i18n/modules/index.ts')
  const enEntry = path.join(projectRoot, 'src/i18n/modules-en-us/index.ts')
  const zhOut = path.join(tmpDir, 'zh.mjs')
  const enOut = path.join(tmpDir, 'en.mjs')

  await bundleEntry(zhEntry, zhOut)
  await bundleEntry(enEntry, enOut)

  const zhMod = await import(pathToFileURL(zhOut).href)
  const enMod = await import(pathToFileURL(enOut).href)
  const zhObj = zhMod.default
  const enObj = enMod.default

  const zhFlat = flattenKeys(zhObj)
  const enFlat = flattenKeys(enObj)

  const zhKeys = new Set(zhFlat.keys())
  const enKeys = new Set(enFlat.keys())

  const missingInEn = [...zhKeys].filter(k => !enKeys.has(k)).sort()
  const missingInZh = [...enKeys].filter(k => !zhKeys.has(k)).sort()
  const emptyZh = [...zhFlat.entries()].filter(([k, v]) => v === '' || v === null || v === undefined || (typeof v === 'string' && v.trim() === '')).map(([k]) => k).sort()
  const emptyEn = [...enFlat.entries()].filter(([k, v]) => v === '' || v === null || v === undefined || (typeof v === 'string' && v.trim() === '')).map(([k]) => k).sort()

  console.log('=== i18n Symmetry Check ===')
  console.log(`zh total leaf keys: ${zhFlat.size}`)
  console.log(`en total leaf keys: ${enFlat.size}`)
  console.log('')
  console.log(`[MISSING in en (zh has, en missing)]: ${missingInEn.length}`)
  missingInEn.forEach(k => console.log('  - ' + k + '  =  ' + JSON.stringify(zhFlat.get(k))))
  console.log('')
  console.log(`[MISSING in zh (en has, zh missing)]: ${missingInZh.length}`)
  missingInZh.forEach(k => console.log('  - ' + k + '  =  ' + JSON.stringify(enFlat.get(k))))
  console.log('')
  console.log(`[EMPTY in zh]: ${emptyZh.length}`)
  emptyZh.forEach(k => console.log('  - ' + k))
  console.log('')
  console.log(`[EMPTY in en]: ${emptyEn.length}`)
  emptyEn.forEach(k => console.log('  - ' + k))

  // Also dump the full flattened zh map for downstream tools
  const dumpPath = path.join(projectRoot, 'scripts/.i18n-zh-flat.json')
  fs.writeFileSync(dumpPath, JSON.stringify(Object.fromEntries(zhFlat), null, 2), 'utf8')
  const dumpEnPath = path.join(projectRoot, 'scripts/.i18n-en-flat.json')
  fs.writeFileSync(dumpEnPath, JSON.stringify(Object.fromEntries(enFlat), null, 2), 'utf8')

  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
