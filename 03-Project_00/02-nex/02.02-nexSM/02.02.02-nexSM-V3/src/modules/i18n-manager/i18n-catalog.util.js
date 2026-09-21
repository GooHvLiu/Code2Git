/**
 * 国际化「模块化目录」模型引擎（纯文件层：无 HTTP、无全局状态）
 *
 * 一、目录约定（标准，固定）
 *   一种语言 = 前端 src/i18n 下的一个目录：
 *     中文 zh-CN  固定目录名 modules
 *     其他语言    目录名 = modules-<langCode 全小写>，如 en-US -> modules-en-us、ja-JP -> modules-ja-jp
 *   每个语言目录内部结构完全同构：8 个一级模块子目录 + 每层 index.js 聚合 + 若干叶子文件。
 *
 * 二、组装的唯一事实来源：每层 index.js
 *   import local from './xxx.js' | './xxx/index.js'
 *   export default { ...localSpread, nsKey: local, shorthand }
 *   引擎严格按 index.js 的 import 与 export 块聚合，支持三种形态：
 *     - ...local            展开（如 common 的 action/status/message/table 平铺到 common 下）
 *     - nsKey: local        命名空间挂载（键名可与文件名不同，如 error-page.js -> errorPage、menu-config.js -> menuConfig）
 *     - local               简写（等价 local: local）
 *
 * 三、设计原则：不使用兜底。index 引用缺失、解析失败直接抛错暴露问题。
 */

'use strict'

const fs = require('fs')
const path = require('path')

// 中文（物理基准目录）固定约定。注意：这是「物理目录命名」约定，
// 与「母版语言可在翻译设置中动态配置」互不冲突——母版逻辑语言由 translation-config.masterLanguage 决定。
const PHYSICAL_MASTER_CODE = 'zh-CN'
const PHYSICAL_MASTER_DIR = 'modules'

// 固定的 8 个一级业务模块（标准，不随页面增减）
const TOP_MODULES = [
  'common',
  'layout',
  'system',
  'superPanel',
  'device',
  'production',
  'heartbeat',
  'notification'
]

// ========== langCode <-> 目录名 ==========

/**
 * langCode -> 语言目录名
 * @param {string} langCode 如 zh-CN / en-US / ja-JP
 * @returns {string} modules / modules-en-us
 */
function dirNameForLangCode(langCode) {
  if (!langCode || typeof langCode !== 'string') {
    throw new Error('[i18n-catalog] langCode required')
  }
  if (langCode === PHYSICAL_MASTER_CODE) return PHYSICAL_MASTER_DIR
  return `modules-${langCode.toLowerCase()}`
}

/**
 * 语言目录绝对路径
 */
function langDirPath(i18nRoot, langCode) {
  return path.join(i18nRoot, dirNameForLangCode(langCode))
}

/**
 * 语言模块支持的扩展名（同时兼容 Vue3/TS 工程与 Vue2/JS 工程）
 * 解析优先级：.ts -> .js（同目录下若两者并存，优先 TypeScript 源文件）
 */
const MODULE_EXTS = ['.ts', '.js']

/** 判断文件名是否为语言模块扩展名 */
function hasModuleExt(name) {
  return MODULE_EXTS.some((ext) => name.endsWith(ext))
}

/** 判断文件名是否为目录聚合入口 index（index.ts / index.js） */
function isIndexFile(name) {
  return /^index\.(ts|js)$/.test(name)
}

/**
 * 将一个可能「不带扩展名 / 带 .ts|.js / 指向目录」的模块说明符解析为真实文件。
 * 解析顺序：
 *   1. 说明符本身就是已存在的文件（如 './action.js'）
 *   2. 说明符 + 各扩展名（如 './action' -> './action.ts'）
 *   3. 说明符作为目录，取其下 index.ts / index.js（如 './common' -> './common/index.ts'）
 * @param {string} absCandidate 已 path.resolve 过的绝对路径（可不带扩展名）
 * @returns {string|null} 命中的真实文件绝对路径；未命中返回 null
 */
function resolveModuleFile(absCandidate) {
  if (absCandidate && fs.existsSync(absCandidate) && fs.statSync(absCandidate).isFile()) {
    return absCandidate
  }
  for (const ext of MODULE_EXTS) {
    const withExt = absCandidate + ext
    if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) return withExt
  }
  for (const ext of MODULE_EXTS) {
    const indexInDir = path.join(absCandidate, `index${ext}`)
    if (fs.existsSync(indexInDir) && fs.statSync(indexInDir).isFile()) return indexInDir
  }
  return null
}

/**
 * 解析某语言（或模块）目录下的聚合入口 index.ts / index.js
 * @param {string} dir 目录绝对路径
 * @returns {string|null}
 */
function resolveIndex(dir) {
  for (const ext of MODULE_EXTS) {
    const f = path.join(dir, `index${ext}`)
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f
  }
  return null
}

/**
 * 目录名 -> langCode（还原标准大小写）
 * 优先在已知语言 code（内置 + 预设 + 元数据）中大小写不敏感精确匹配，匹配不到再按 xx-YY 规范化
 * @param {string} dirName 目录名
 * @param {string[]} [knownCodes] 已知标准 langCode 列表
 */
function langCodeFromDirName(dirName, knownCodes) {
  if (dirName === PHYSICAL_MASTER_DIR) return PHYSICAL_MASTER_CODE
  const m = /^modules-(.+)$/.exec(dirName)
  if (!m) return null
  const suffix = m[1]
  if (Array.isArray(knownCodes)) {
    const hit = knownCodes.find((c) => c.toLowerCase() === suffix.toLowerCase())
    if (hit) return hit
  }
  // 未登记语言：按 语言-区域 规范化（语言小写、区域大写）
  const parts = suffix.split('-')
  if (parts.length === 2) {
    return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`
  }
  return suffix
}

/**
 * 列出 i18nRoot 下全部语言目录
 * @returns {Array<{dirName:string,langCode:string,abs:string}>}
 */
function listLangDirs(i18nRoot, knownCodes) {
  if (!fs.existsSync(i18nRoot)) return []
  return fs
    .readdirSync(i18nRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && (d.name === PHYSICAL_MASTER_DIR || /^modules-.+$/.test(d.name)))
    .map((d) => ({
      dirName: d.name,
      langCode: langCodeFromDirName(d.name, knownCodes),
      abs: path.join(i18nRoot, d.name)
    }))
    .filter((x) => !!x.langCode)
}

// ========== 源码解析工具（字符串/括号感知） ==========

/**
 * 从 s[openIdx]（'{'）开始，配平到对应的 '}'，返回其下标；未匹配返回 -1
 */
function matchBrace(s, openIdx) {
  let depth = 0
  let inStr = false
  let quote = ''
  let escaped = false
  let inLineComment = false
  let inBlockComment = false
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i]
    const next = s[i + 1]
    // 行注释：直到行尾
    if (inLineComment) {
      if (c === '\n') inLineComment = false
      continue
    }
    // 块注释：直到 */
    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false
        i++
      }
      continue
    }
    if (inStr) {
      if (escaped) {
        escaped = false
        continue
      }
      if (c === '\\') {
        escaped = true
        continue
      }
      if (c === quote) inStr = false
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = true
      quote = c
      continue
    }
    // 注释起始（字符串态之外才生效，避免误判 URL/文本里的 //）
    if (c === '/' && next === '/') {
      inLineComment = true
      i++
      continue
    }
    if (c === '/' && next === '*') {
      inBlockComment = true
      i++
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/**
 * 提取 export default 后的首个平衡对象文本（含外层 {}）
 */
function extractExportObjectText(content) {
  const idx = content.search(/export\s+default/)
  if (idx === -1) return null
  const braceStart = content.indexOf('{', idx)
  if (braceStart === -1) return null
  const end = matchBrace(content, braceStart)
  if (end === -1) return null
  return content.slice(braceStart, end + 1)
}

/**
 * 按「顶层逗号」切分（感知字符串与 () [] {} 嵌套）
 */
function splitTopLevel(text) {
  const out = []
  let depth = 0
  let inStr = false
  let quote = ''
  let escaped = false
  let inLineComment = false
  let inBlockComment = false
  let buf = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]
    if (inLineComment) {
      buf += c
      if (c === '\n') inLineComment = false
      continue
    }
    if (inBlockComment) {
      buf += c
      if (c === '*' && next === '/') {
        inBlockComment = false
        buf += next
        i++
      }
      continue
    }
    if (inStr) {
      buf += c
      if (escaped) {
        escaped = false
        continue
      }
      if (c === '\\') {
        escaped = true
        continue
      }
      if (c === quote) inStr = false
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = true
      quote = c
      buf += c
      continue
    }
    if (c === '/' && next === '/') {
      inLineComment = true
      buf += c
      continue
    }
    if (c === '/' && next === '*') {
      inBlockComment = true
      buf += c
      continue
    }
    if (c === '{' || c === '[' || c === '(') {
      depth++
      buf += c
      continue
    }
    if (c === '}' || c === ']' || c === ')') {
      depth--
      buf += c
      continue
    }
    if (c === ',' && depth === 0) {
      out.push(buf)
      buf = ''
      continue
    }
    buf += c
  }
  if (buf.trim()) out.push(buf)
  return out
}

/**
 * 去掉 // 行注释（index.js 的 export 块内只有标识符、无字符串值，安全）
 */
function stripLineComments(s) {
  return s
    .split('\n')
    .map((line) => {
      const i = line.indexOf('//')
      return i === -1 ? line : line.slice(0, i)
    })
    .join('\n')
}

// ========== 模块对象 / index 解析 ==========

/**
 * 提取文件中的 ESM import：import local from 'rel'
 */
function parseImports(content, dir) {
  const imports = []
  // (?!type\b) 排除 TS 的 `import type ...`，仅收集运行时 default 导入
  const importRe = /import\s+(?!type\b)([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = importRe.exec(content)) !== null) {
    const resolved = resolveModuleFile(path.resolve(dir, m[2]))
    imports.push({
      local: m[1],
      rel: m[2],
      // 扩展名无关解析（.ts/.js/目录 index）；未命中保留原路径，由读取阶段抛出清晰错误
      target: resolved || path.resolve(dir, m[2])
    })
  }
  return imports
}

/**
 * 通用求值任意语言模块文件
 * 同时支持：index 聚合、纯字面量叶子、「import 同级文件 + 自身字面量 + ...spread」的混合文件
 * 原理：递归求值其 import 得到变量，再把变量作为形参注入，由 JS 引擎原生求值 export default 对象，
 * 从而正确处理 ...展开、键名挂载、简写与嵌套字面量的任意组合（不使用兜底，失败直接抛错）。
 */
function evaluateModule(fileAbs, ctx) {
  // ctx.stack：当前递归求值栈（仅用于截断真正的循环依赖）
  // ctx.memo：已求值完成的文件缓存（DAG 中同一叶子被多个文件引用时复用，不能当成环清空）
  ctx = ctx || { stack: new Set(), memo: new Map() }
  const norm = path.normalize(fileAbs)
  if (ctx.memo.has(norm)) return ctx.memo.get(norm)
  if (ctx.stack.has(norm)) return {}
  ctx.stack.add(norm)

  const content = fs.readFileSync(fileAbs, 'utf-8')
  const dir = path.dirname(fileAbs)
  const imports = parseImports(content, dir)

  const argNames = []
  const argValues = []
  for (const imp of imports) {
    argNames.push(imp.local)
    argValues.push(evaluateModule(imp.target, ctx))
  }

  const objText = extractExportObjectText(content)
  if (!objText) {
    throw new Error(`[i18n-catalog] 文件缺少 export default 对象: ${fileAbs}`)
  }
  let result
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...argNames, `return ${objText}`)
    result = fn(...argValues)
  } catch (e) {
    throw new Error(`[i18n-catalog] 求值语言模块失败: ${fileAbs} -> ${e.message}`)
  }
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error(`[i18n-catalog] export default 不是对象: ${fileAbs}`)
  }
  ctx.stack.delete(norm)
  ctx.memo.set(norm, result)
  return result
}

/**
 * 解析模块文件为 JS 对象（叶子/聚合/混合统一走 evaluateModule）
 */
function parseModuleObject(fileAbs) {
  return evaluateModule(fileAbs)
}

/**
 * 解析一个 index.js：返回其 import 列表与 export 条目
 * @returns {{imports:Array<{local:string,rel:string,target:string}>,items:Array<{kind:'spread'|'ns'|'shorthand',key?:string,local:string}>}}
 */
function parseIndex(indexAbs) {
  const content = fs.readFileSync(indexAbs, 'utf-8')
  const dir = path.dirname(indexAbs)

  const imports = []
  const importRe = /import\s+(?!type\b)([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = importRe.exec(content)) !== null) {
    const resolved = resolveModuleFile(path.resolve(dir, m[2]))
    imports.push({ local: m[1], rel: m[2], target: resolved || path.resolve(dir, m[2]) })
  }

  const objText = extractExportObjectText(content)
  if (!objText) {
    throw new Error(`[i18n-catalog] index.js 缺少 export default 对象: ${indexAbs}`)
  }
  const inner = objText.slice(1, -1) // 去掉外层 { }
  const items = []
  for (let raw of splitTopLevel(inner)) {
    const piece = stripLineComments(raw).trim().replace(/,+$/, '').trim()
    if (!piece) continue
    let mm
    if ((mm = /^\.{3}\s*([A-Za-z_$][\w$]*)$/.exec(piece))) {
      items.push({ kind: 'spread', key: null, local: mm[1] })
    } else if ((mm = /^([A-Za-z_$][\w$]*)\s*:\s*([A-Za-z_$][\w$]*)$/.exec(piece))) {
      items.push({ kind: 'ns', key: mm[1], local: mm[2] })
    } else if ((mm = /^([A-Za-z_$][\w$]*)$/.exec(piece))) {
      items.push({ kind: 'shorthand', key: mm[1], local: mm[1] })
    } else {
      throw new Error(`[i18n-catalog] index.js 存在无法识别的 export 条目「${piece}」: ${indexAbs}`)
    }
  }
  return { imports, items }
}

/**
 * 求值聚合入口 index.js（通用 evaluateModule 的语义化别名）
 * @param {string} indexAbs index.js 绝对路径
 * @param {Set<string>} [seen] 防循环
 */
function evaluateIndex(indexAbs, seen) {
  return evaluateModule(indexAbs, seen)
}

/**
 * 聚合整门语言为一个完整嵌套对象
 */
function assembleLanguage(i18nRoot, langCode) {
  const idx = resolveIndex(langDirPath(i18nRoot, langCode))
  if (!idx) {
    throw new Error(`[i18n-catalog] 语言目录不存在或缺少 index.ts/index.js: ${langCode}`)
  }
  return evaluateIndex(idx)
}

// ========== 叶子文件定位（写入用） ==========

/**
 * 解析语言根 index.js，得到「一级模块 key -> 物理 index/目录」映射
 * 解决聚合 key（superPanel）与物理目录名（super-panel）不一致的问题
 */
function getTopModuleMap(i18nRoot, langCode) {
  const rootIdx = resolveIndex(langDirPath(i18nRoot, langCode))
  if (!rootIdx) {
    throw new Error(`[i18n-catalog] 语言根 index.ts/index.js 不存在: ${langCode}`)
  }
  const { imports } = parseIndex(rootIdx)
  const map = {}
  for (const imp of imports) {
    map[imp.local] = { index: imp.target, dir: path.dirname(imp.target) }
  }
  return map
}

/**
 * 读取某一级模块 index.js 的条目，并解析出每个条目对应的叶子文件
 * @param {string} moduleIndexAbs 该模块 index.js 的物理绝对路径
 * @returns {Array<{kind:string,key:string,local:string,file:string}>|null}
 */
function getModuleEntries(moduleIndexAbs) {
  if (!fs.existsSync(moduleIndexAbs)) return null
  const { imports, items } = parseIndex(moduleIndexAbs)
  const impMap = {}
  imports.forEach((i) => {
    impMap[i.local] = i.target
  })
  return items.map((it) => ({
    kind: it.kind,
    key: it.key,
    local: it.local,
    file: impMap[it.local]
  }))
}

/**
 * 将全局 key 路径定位到具体叶子文件，并给出文件内路径
 * @param {string[]} keySegments 全局 key 段数组（如 ['common','error','types']）
 * @param {{create?:boolean, spreadFile?:string}} [opts] create=新增场景；spreadFile=平铺分类文件名(无扩展)
 * @returns {{file:string, inFileSegments:string[]}}
 */
function locateLeafFile(i18nRoot, langCode, keySegments, opts) {
  const moduleName = keySegments[0]
  const topMap = getTopModuleMap(i18nRoot, langCode)
  const top = topMap[moduleName]
  if (!top) {
    throw new Error(`[i18n-catalog] 一级模块不存在: ${moduleName}`)
  }
  const entries = getModuleEntries(top.index)
  if (!entries) {
    throw new Error(`[i18n-catalog] 模块缺少聚合 index: ${moduleName}`)
  }
  const nsMap = {}
  const spreads = []
  for (const e of entries) {
    if (e.kind === 'spread') spreads.push(e)
    else nsMap[e.key] = e
  }

  const second = keySegments[1]

  // 1) 命中命名空间挂载（含简写）：文件内路径跳过 module 与 ns 两段
  if (second !== undefined && Object.prototype.hasOwnProperty.call(nsMap, second)) {
    return { file: nsMap[second].file, inFileSegments: keySegments.slice(2) }
  }

  // 2) 平铺（common 的 action/status/message/table）：在各 spread 文件中查第二级 key
  for (const e of spreads) {
    if (!e.file || !fs.existsSync(e.file)) continue
    const obj = parseModuleObject(e.file)
    if (second !== undefined && Object.prototype.hasOwnProperty.call(obj, second)) {
      return { file: e.file, inFileSegments: keySegments.slice(1) }
    }
  }

  // 3) 新增平铺 key：必须显式指定落在哪个 spread 分类文件
  if (opts && opts.create) {
    if (opts.spreadFile) {
      const hit = spreads.find((e) => path.basename(e.file, path.extname(e.file)) === opts.spreadFile)
      if (hit) {
        return { file: hit.file, inFileSegments: keySegments.slice(1) }
      }
    }
    throw new Error(
      `[i18n-catalog] 无法为「${keySegments.join('.')}」定位平铺分类文件，新增 common 平铺 key 需指定 spreadFile(action/status/message/table)`
    )
  }

  throw new Error(`[i18n-catalog] 无法定位 key「${keySegments.join('.')}」所属的模块文件`)
}

// ========== 对象路径工具 ==========

function getValueBySegments(obj, segs) {
  let cur = obj
  for (const s of segs) {
    if (cur == null) return undefined
    cur = cur[s]
  }
  return cur
}

function setValueBySegments(obj, segs, value) {
  if (!segs.length) throw new Error('[i18n-catalog] setValueBySegments 路径为空')
  let cur = obj
  for (let i = 0; i < segs.length - 1; i++) {
    const s = segs[i]
    if (cur[s] == null || typeof cur[s] !== 'object') cur[s] = {}
    cur = cur[s]
  }
  cur[segs[segs.length - 1]] = value
}

function deleteBySegments(obj, segs) {
  if (!segs.length) return false
  let cur = obj
  for (let i = 0; i < segs.length - 1; i++) {
    if (cur == null) return false
    cur = cur[segs[i]]
  }
  const last = segs[segs.length - 1]
  if (cur && Object.prototype.hasOwnProperty.call(cur, last)) {
    delete cur[last]
    return true
  }
  return false
}

// ========== 序列化 ==========

/**
 * 将对象序列化为 JS 模块文本（单引号；合法标识符 key 不加引号）
 */
function serializeObject(obj, indent = 0) {
  const pad = '  '.repeat(indent)
  const childPad = '  '.repeat(indent + 1)

  if (obj === null || obj === undefined) return 'null'
  if (typeof obj === 'string') {
    return `'${obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj)
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return `[\n${obj.map((it) => `${childPad}${serializeObject(it, indent + 1)}`).join(',\n')}\n${pad}]`
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'
    const lines = keys.map((k) => {
      const keyStr = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : `'${k}'`
      return `${childPad}${keyStr}: ${serializeObject(obj[k], indent + 1)}`
    })
    return `{\n${lines.join(',\n')}\n${pad}}`
  }
  return String(obj)
}

/**
 * 生成叶子模块文件文本
 * @param {object} obj 模块对象
 * @param {string[]} [headerLines] 文件头说明行，可选；为空则不输出文件头
 */
function buildModuleFileText(obj, headerLines) {
  const lines = Array.isArray(headerLines) ? headerLines : []
  const header = lines.length
    ? `/**\n${lines.map((l) => ` * ${l}`).join('\n')}\n */\n\n`
    : ''
  return `${header}export default ${serializeObject(obj, 0)}\n`
}

/** 提取原文件 export default 之前的头部原文（叶子文件无 import，头部即注释） */
function extractFileHeader(content) {
  const idx = content.search(/export\s+default/)
  return idx >= 0 ? content.slice(0, idx) : ''
}

/**
 * 序列化并写回叶子文件
 * - 传入 headerLines 数组：使用标准文件头
 * - 不传：保留该文件原有头部注释（节点级编辑不丢失文件说明）
 */
function writeModuleObject(fileAbs, obj, headerLines) {
  let text
  if (Array.isArray(headerLines)) {
    text = buildModuleFileText(obj, headerLines)
  } else {
    const raw = fs.existsSync(fileAbs) ? fs.readFileSync(fileAbs, 'utf-8') : ''
    const header = extractFileHeader(raw)
    text = `${header}export default ${serializeObject(obj, 0)}\n`
  }
  fs.writeFileSync(fileAbs, text, 'utf-8')
}

// ========== 目录遍历 / 统计 / 复制 ==========

/** 递归列出语言目录下全部叶子模块（.ts/.js，不含 index 聚合入口） */
function listLeafFiles(langDir) {
  const out = []
  ;(function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name)
      if (ent.isDirectory()) walk(p)
      else if (ent.isFile() && hasModuleExt(ent.name) && !isIndexFile(ent.name)) out.push(p)
    }
  })(langDir)
  return out
}

/** 目录统计：叶子文件总大小、最近修改时间 */
function dirStats(langDir) {
  let size = 0
  let latest = 0
  if (fs.existsSync(langDir)) {
    for (const f of listLeafFiles(langDir)) {
      const st = fs.statSync(f)
      size += st.size
      if (st.mtimeMs > latest) latest = st.mtimeMs
    }
  }
  return { size, updatedAt: latest ? new Date(latest).toISOString() : null }
}

/** 递归清空对象中的字符串叶子（用于「不复制译文」新建语言） */
function clearLeafStrings(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = clearLeafStrings(v)
    } else if (Array.isArray(v)) {
      out[k] = v.map((x) => (x && typeof x === 'object' ? clearLeafStrings(x) : typeof x === 'string' ? '' : x))
    } else {
      out[k] = typeof v === 'string' ? '' : v
    }
  }
  return out
}

/**
 * 以源语言目录为模板，整树复制创建新语言目录
 * @param {boolean} clearValues true=清空所有字符串叶子（待翻译）；false=连同译文一起复制
 */
function copyLanguageTree(i18nRoot, srcLangCode, dstLangCode, clearValues) {
  const src = langDirPath(i18nRoot, srcLangCode)
  const dst = langDirPath(i18nRoot, dstLangCode)
  if (!fs.existsSync(src)) throw new Error(`[i18n-catalog] 源语言目录不存在: ${srcLangCode}`)
  if (fs.existsSync(dst)) throw new Error(`[i18n-catalog] 目标语言目录已存在: ${dstLangCode}`)

  const stamp = new Date().toISOString()
  ;(function walk(s, d) {
    fs.mkdirSync(d, { recursive: true })
    for (const ent of fs.readdirSync(s, { withFileTypes: true })) {
      const sp = path.join(s, ent.name)
      const dp = path.join(d, ent.name)
      if (ent.isDirectory()) {
        walk(sp, dp)
      } else if (ent.isFile() && hasModuleExt(ent.name)) {
        // index 聚合入口与「复制译文」场景直接原样复制，保持组装结构一致
        if (isIndexFile(ent.name) || !clearValues) {
          fs.copyFileSync(sp, dp)
        } else {
          const cleared = clearLeafStrings(parseModuleObject(sp))
          writeModuleObject(dp, cleared, [
            `${dstLangCode} 国际化模块文件（模块化，自动生成）`,
            `基于 ${srcLangCode} 创建，字符串叶子已清空待翻译`,
            `最后生成: ${stamp}`
          ])
        }
      } else if (ent.isFile()) {
        fs.copyFileSync(sp, dp)
      }
    }
  })(src, dst)

  return dst
}

/**
 * 扁平化：{ a:{b:1} } -> { 'a.b':1 }
 */
function flattenObject(obj, prefix = '') {
  const result = {}
  for (const [key, value] of Object.entries(obj || {})) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}

module.exports = {
  PHYSICAL_MASTER_CODE,
  PHYSICAL_MASTER_DIR,
  TOP_MODULES,
  MODULE_EXTS,
  dirNameForLangCode,
  langDirPath,
  langCodeFromDirName,
  hasModuleExt,
  isIndexFile,
  resolveModuleFile,
  resolveIndex,
  listLangDirs,
  matchBrace,
  extractExportObjectText,
  splitTopLevel,
  parseModuleObject,
  parseIndex,
  evaluateIndex,
  assembleLanguage,
  getTopModuleMap,
  getModuleEntries,
  locateLeafFile,
  getValueBySegments,
  setValueBySegments,
  deleteBySegments,
  serializeObject,
  buildModuleFileText,
  writeModuleObject,
  listLeafFiles,
  dirStats,
  clearLeafStrings,
  copyLanguageTree,
  flattenObject
}
