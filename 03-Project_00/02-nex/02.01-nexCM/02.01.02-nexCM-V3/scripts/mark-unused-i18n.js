/**
 * 给国际化文件中未使用的 key 加行内注释
 * 
 * 功能：
 * 1. 扫描所有源文件，获取使用中的国际化 key
 * 2. 加载国际化文件，获取所有定义的 key 及其值
 * 3. 计算未使用的 key
 * 4. 在国际化文件中搜索未使用 key 的定义行，加行内注释 // [未使用]
 * 
 * 使用方法：
 *   node scripts/mark-unused-i18n.js
 *   node scripts/mark-unused-i18n.js --dry-run  # 只预览，不实际修改
 */

const fs = require('fs')
const path = require('path')

// ========== 配置 ==========
const FRONTEND_ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(FRONTEND_ROOT, 'src')
const I18N_DIR = path.join(SRC_DIR, 'i18n', 'langs')
const ZH_CN_FILE = path.join(I18N_DIR, 'zh-CN.js')
const EN_US_FILE = path.join(I18N_DIR, 'en-US.js')

const SEARCH_EXTENSIONS = ['.vue', '.js']
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git']

// 是否为预览模式
const DRY_RUN = process.argv.includes('--dry-run')

// ========== 工具函数 ==========

/**
 * 递归遍历目录，获取所有符合条件的文件
 */
function getAllFiles(dir, extensions, excludeDirs = []) {
  const results = []
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name)
      
      if (item.isDirectory()) {
        if (!excludeDirs.includes(item.name)) {
          walk(fullPath)
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase()
        if (extensions.includes(ext)) {
          results.push(fullPath)
        }
      }
    }
  }
  
  walk(dir)
  return results
}

/**
 * 从文件内容中提取所有使用的国际化 key
 */
function extractI18nKeys(content) {
  const keys = new Set()
  
  // 模式1: $t('xxx') 或 $t("xxx")
  const pattern1 = /\$t\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  let match
  while ((match = pattern1.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  // 模式2: this.$t('xxx')
  const pattern2 = /this\.\$t\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  while ((match = pattern2.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  // 模式3: t('xxx')
  const pattern3 = /[^.$]\bt\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  while ((match = pattern3.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  // 模式4: i18n.t('xxx')
  const pattern4 = /i18n\.t\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  while ((match = pattern4.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  return keys
}

/**
 * 扁平化嵌套对象，返回 { keyPath: value } 的映射
 */
function flattenObject(obj, prefix = '') {
  const result = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  
  return result
}

/**
 * 加载国际化文件，返回 { keyPath: value } 的映射
 */
function loadI18nFile(filePath) {
  try {
    delete require.cache[require.resolve(filePath)]
    const content = require(filePath)
    let i18nData = content
    if (content.default) {
      i18nData = content.default
    }
    return flattenObject(i18nData)
  } catch (err) {
    console.error(`读取国际化文件失败: ${filePath}`)
    console.error(err.message)
    return {}
  }
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 在文件中搜索 key 的定义行，并加注释
 * @param {string} filePath - 文件路径
 * @param {Object} keyValues - { keyPath: value } 映射
 * @param {Set} unusedKeys - 未使用的 key 集合
 * @param {string} label - 标签（中文/英文）
 * @returns {number} 标记的 key 数量
 */
function markUnusedKeys(filePath, keyValues, unusedKeys, label) {
  console.log(`\n[${label}] 正在处理: ${path.basename(filePath)}`)
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const newLines = [...lines]
  
  let markedCount = 0
  
  for (const keyPath of unusedKeys) {
    const value = keyValues[keyPath]
    if (value === undefined || value === null) continue
    
    // 获取 key 名（最后一段）
    const keyName = keyPath.split('.').pop()
    
    // 值转字符串
    let valueStr = String(value)
    
    // 构建搜索正则：匹配 keyName: 'value' 或 keyName: "value" 或 keyName: `value`
    // 同时要确保这行没有 // [未使用] 注释
    const escapedKey = escapeRegExp(keyName)
    const escapedValue = escapeRegExp(valueStr)
    
    // 匹配单引号、双引号、反引号
    const pattern = new RegExp(
      `^\\s*['"]?${escapedKey}['"]?\\s*:\\s*['"\`]${escapedValue}['"\`]\\s*,?\\s*$`
    )
    
    // 也匹配数字、布尔值类型的 value
    const patternNumber = new RegExp(
      `^\\s*['"]?${escapedKey}['"]?\\s*:\\s*${escapedValue}\\s*,?\\s*$`
    )
    
    for (let i = 0; i < newLines.length; i++) {
      const line = newLines[i]
      
      // 跳过已经有 [未使用] 注释的行
      if (line.includes('[未使用]')) continue
      
      // 尝试匹配字符串值
      let matched = pattern.test(line)
      
      // 如果字符串值没匹配到，尝试匹配数字/布尔值
      if (!matched && (typeof value === 'number' || typeof value === 'boolean')) {
        matched = patternNumber.test(line)
      }
      
      if (matched) {
        // 在行末尾添加注释
        newLines[i] = line.trimEnd() + ' // [未使用]'
        markedCount++
        
        if (DRY_RUN) {
          console.log(`  [预览] 第 ${i + 1} 行: ${keyPath} = ${valueStr}`)
        }
        
        // 找到一个就跳出，避免重复标记
        break
      }
    }
  }
  
  if (!DRY_RUN && markedCount > 0) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8')
    console.log(`  ✅ 已标记 ${markedCount} 个未使用的 key`)
  } else if (markedCount === 0) {
    console.log(`  ⏭️  没有需要标记的 key（可能已经标记过了）`)
  } else {
    console.log(`  📋 预览完成，共 ${markedCount} 个 key 将被标记`)
  }
  
  return markedCount
}

// ========== 主函数 ==========

function main() {
  console.log('\n' + '#'.repeat(60))
  console.log('#  国际化未使用 key 标记工具')
  if (DRY_RUN) {
    console.log('#  [预览模式 - 不实际修改文件]')
  }
  console.log('#'.repeat(60))
  
  // 1. 获取所有源文件
  console.log('\n[1/4] 正在扫描源文件...')
  const allFiles = getAllFiles(SRC_DIR, SEARCH_EXTENSIONS, EXCLUDE_DIRS)
  console.log(`  找到 ${allFiles.length} 个源文件`)
  
  // 2. 提取所有使用的国际化 key
  console.log('\n[2/4] 正在提取使用中的国际化 key...')
  const usedKeys = new Set()
  
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      const keys = extractI18nKeys(content)
      for (const key of keys) {
        usedKeys.add(key)
      }
    } catch (err) {
      console.warn(`  警告: 无法读取文件 ${file}: ${err.message}`)
    }
  }
  
  console.log(`  找到 ${usedKeys.size} 个使用中的国际化 key`)
  
  // 3. 加载国际化文件
  console.log('\n[3/4] 正在加载国际化文件...')
  
  const zhKeyValues = loadI18nFile(ZH_CN_FILE)
  const enKeyValues = loadI18nFile(EN_US_FILE)
  
  const zhKeys = Object.keys(zhKeyValues)
  const enKeys = Object.keys(enKeyValues)
  
  console.log(`  中文 (zh-CN): ${zhKeys.length} 个 key`)
  console.log(`  英文 (en-US): ${enKeys.length} 个 key`)
  
  // 4. 计算未使用的 key 并标记
  console.log('\n[4/4] 正在标记未使用的 key...')
  
  // 中文未使用的 key
  const unusedInZh = zhKeys.filter(key => !usedKeys.has(key))
  // 英文未使用的 key
  const unusedInEn = enKeys.filter(key => !usedKeys.has(key))
  
  console.log(`  中文未使用: ${unusedInZh.length} 个`)
  console.log(`  英文未使用: ${unusedInEn.length} 个`)
  
  // 给中文文件加注释
  const zhMarked = markUnusedKeys(ZH_CN_FILE, zhKeyValues, new Set(unusedInZh), '中文')
  
  // 给英文文件加注释
  const enMarked = markUnusedKeys(EN_US_FILE, enKeyValues, new Set(unusedInEn), '英文')
  
  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('  处理完成！')
  console.log('='.repeat(60))
  console.log(`  中文文件: 标记 ${zhMarked} 个未使用 key`)
  console.log(`  英文文件: 标记 ${enMarked} 个未使用 key`)
  console.log(`  总计: ${zhMarked + enMarked} 个 key`)
  console.log('')
  console.log('  提示:')
  console.log('  - 带有 // [未使用] 注释的 key 可以考虑删除')
  console.log('  - 删除前请确认没有动态使用的情况')
  console.log('  - 中英文文件需要同步删除')
  console.log('')
  
  if (DRY_RUN) {
    console.log('  ⚠️  当前为预览模式，文件未被修改')
    console.log('  去掉 --dry-run 参数即可实际修改文件')
  }
}

// 运行
main()
