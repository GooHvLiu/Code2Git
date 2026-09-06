/**
 * 国际化配置检查脚本
 * 
 * 功能：
 * 1. 搜索前端所有 .vue / .js 文件中使用的国际化 key
 * 2. 读取国际化文件中定义的 key（zh-CN.js / en-US.js）
 * 3. 比较并输出报告：
 *    - 使用了但未定义的 key（需要增加）
 *    - 定义了但未使用的 key（可能需要删除）
 *    - 中英文不一致的 key
 * 
 * 使用方法：
 *   node scripts/check-i18n.js
 *   node scripts/check-i18n.js --fix  # 自动修复（仅提示，不自动删除）
 */

const fs = require('fs')
const path = require('path')

// ========== 配置 ==========
const FRONTEND_ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(FRONTEND_ROOT, 'src')
const I18N_DIR = path.join(SRC_DIR, 'i18n', 'langs')
const ZH_CN_FILE = path.join(I18N_DIR, 'zh-CN.js')
const EN_US_FILE = path.join(I18N_DIR, 'en-US.js')

// 搜索的文件扩展名
const SEARCH_EXTENSIONS = ['.vue', '.js']

// 排除的目录
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git']

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
 * 支持的模式：
 * - $t('xxx') / $t("xxx")
 * - this.$t('xxx')
 * - {{ $t('xxx') }}
 * - t('xxx') (在 setup 中)
 * - i18n.t('xxx')
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
  
  // 模式3: t('xxx') (在 setup 中使用 useI18n)
  const pattern3 = /[^.$]\bt\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  while ((match = pattern3.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  // 模式4: i18n.t('xxx')
  const pattern4 = /i18n\.t\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  while ((match = pattern4.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  // 模式5: $tc('xxx') (复数)
  const pattern5 = /\$tc\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  while ((match = pattern5.exec(content)) !== null) {
    keys.add(match[1])
  }
  
  return keys
}

/**
 * 扁平化嵌套对象为 key 路径数组
 * 例如：{ a: { b: 'c' } } => ['a.b']
 */
function flattenObject(obj, prefix = '') {
  const keys = []
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenObject(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  
  return keys
}

/**
 * 从国际化文件中提取所有定义的 key
 * 注意：国际化文件是 JS 模块，使用 require 加载
 */
function extractDefinedKeys(filePath) {
  try {
    // 清除 require 缓存
    delete require.cache[require.resolve(filePath)]
    const content = require(filePath)
    
    // 处理不同的导出格式
    let i18nData = content
    if (content.default) {
      i18nData = content.default
    }
    
    return flattenObject(i18nData)
  } catch (err) {
    console.error(`读取国际化文件失败: ${filePath}`)
    console.error(err.message)
    return []
  }
}

/**
 * 检查 key 是否可能是动态的（包含变量拼接）
 * 例如：'error.' + code 这种无法静态分析
 */
function isMaybeDynamicKey(key) {
  // 如果 key 中包含 ${} 或 +，可能是动态拼接
  return /\$\{|\+/.test(key)
}

/**
 * 格式化输出
 */
function printSection(title, items, color = 'white') {
  console.log('\n' + '='.repeat(60))
  console.log(`  ${title}`)
  console.log('='.repeat(60))
  
  if (items.length === 0) {
    console.log('  (无)')
    return
  }
  
  items.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item}`)
  })
}

// ========== 主函数 ==========

function main() {
  console.log('\n' + '#'.repeat(60))
  console.log('#  国际化配置检查工具')
  console.log('#'.repeat(60))
  
  // 1. 获取所有源文件
  console.log('\n[1/4] 正在扫描源文件...')
  const allFiles = getAllFiles(SRC_DIR, SEARCH_EXTENSIONS, EXCLUDE_DIRS)
  console.log(`  找到 ${allFiles.length} 个源文件`)
  
  // 2. 提取所有使用的国际化 key
  console.log('\n[2/4] 正在提取使用的国际化 key...')
  const usedKeys = new Set()
  const keyFileMap = {} // key -> [文件路径]
  
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      const keys = extractI18nKeys(content)
      
      for (const key of keys) {
        usedKeys.add(key)
        if (!keyFileMap[key]) {
          keyFileMap[key] = []
        }
        const relativePath = path.relative(FRONTEND_ROOT, file)
        if (!keyFileMap[key].includes(relativePath)) {
          keyFileMap[key].push(relativePath)
        }
      }
    } catch (err) {
      console.warn(`  警告: 无法读取文件 ${file}: ${err.message}`)
    }
  }
  
  console.log(`  找到 ${usedKeys.size} 个使用中的国际化 key`)
  
  // 3. 读取国际化文件中定义的 key
  console.log('\n[3/4] 正在读取国际化文件...')
  
  const zhKeys = extractDefinedKeys(ZH_CN_FILE)
  const enKeys = extractDefinedKeys(EN_US_FILE)
  
  console.log(`  中文 (zh-CN): ${zhKeys.length} 个 key`)
  console.log(`  英文 (en-US): ${enKeys.length} 个 key`)
  
  // 4. 比较分析
  console.log('\n[4/4] 正在分析比较...')
  
  const usedKeysArray = Array.from(usedKeys)
  const zhKeysSet = new Set(zhKeys)
  const enKeysSet = new Set(enKeys)
  
  // 4.1 使用了但未在中文中定义的 key
  const missingInZh = usedKeysArray.filter(key => !zhKeysSet.has(key))
  
  // 4.2 使用了但未在英文中定义的 key
  const missingInEn = usedKeysArray.filter(key => !enKeysSet.has(key))
  
  // 4.3 中文定义了但未使用的 key（可能需要删除）
  const unusedInZh = zhKeys.filter(key => !usedKeys.has(key))
  
  // 4.4 英文定义了但未使用的 key（可能需要删除）
  const unusedInEn = enKeys.filter(key => !usedKeys.has(key))
  
  // 4.5 中英文不一致的 key（一边有另一边没有）
  const zhOnly = zhKeys.filter(key => !enKeysSet.has(key))
  const enOnly = enKeys.filter(key => !zhKeysSet.has(key))
  
  // ========== 输出报告 ==========
  
  console.log('\n\n' + '#'.repeat(60))
  console.log('#  检查报告')
  console.log('#'.repeat(60))
  
  // 统计摘要
  console.log('\n## 统计摘要')
  console.log(`  源文件数量: ${allFiles.length}`)
  console.log(`  使用中的 key: ${usedKeys.size}`)
  console.log(`  中文定义的 key: ${zhKeys.length}`)
  console.log(`  英文定义的 key: ${enKeys.length}`)
  console.log(`  中文缺失: ${missingInZh.length}`)
  console.log(`  英文缺失: ${missingInEn.length}`)
  console.log(`  中文未使用: ${unusedInZh.length}`)
  console.log(`  英文未使用: ${unusedInEn.length}`)
  console.log(`  仅中文有: ${zhOnly.length}`)
  console.log(`  仅英文有: ${enOnly.length}`)
  
  // 详细报告
  printSection('❌ 使用了但未在中文中定义的 key（需要增加）', missingInZh)
  
  if (missingInZh.length > 0) {
    console.log('\n  详细位置:')
    missingInZh.forEach(key => {
      console.log(`\n  [${key}]`)
      keyFileMap[key]?.forEach(file => {
        console.log(`    - ${file}`)
      })
    })
  }
  
  printSection('❌ 使用了但未在英文中定义的 key（需要增加）', missingInEn)
  
  printSection('⚠️  中文定义了但未使用的 key（可能需要删除，请确认）', unusedInZh.slice(0, 50))
  if (unusedInZh.length > 50) {
    console.log(`  ... 还有 ${unusedInZh.length - 50} 个，共 ${unusedInZh.length} 个`)
  }
  
  printSection('⚠️  英文定义了但未使用的 key（可能需要删除，请确认）', unusedInEn.slice(0, 50))
  if (unusedInEn.length > 50) {
    console.log(`  ... 还有 ${unusedInEn.length - 50} 个，共 ${unusedInEn.length} 个`)
  }
  
  printSection('⚠️  仅中文定义的 key（英文缺失）', zhOnly.slice(0, 50))
  if (zhOnly.length > 50) {
    console.log(`  ... 还有 ${zhOnly.length - 50} 个，共 ${zhOnly.length} 个`)
  }
  
  printSection('⚠️  仅英文定义的 key（中文缺失）', enOnly.slice(0, 50))
  if (enOnly.length > 50) {
    console.log(`  ... 还有 ${enOnly.length - 50} 个，共 ${enOnly.length} 个`)
  }
  
  // 生成 JSON 报告文件
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      sourceFiles: allFiles.length,
      usedKeys: usedKeys.size,
      zhKeys: zhKeys.length,
      enKeys: enKeys.length,
      missingInZh: missingInZh.length,
      missingInEn: missingInEn.length,
      unusedInZh: unusedInZh.length,
      unusedInEn: unusedInEn.length,
      zhOnly: zhOnly.length,
      enOnly: enOnly.length
    },
    missingInZh: missingInZh,
    missingInEn: missingInEn,
    unusedInZh: unusedInZh,
    unusedInEn: unusedInEn,
    zhOnly: zhOnly,
    enOnly: enOnly,
    keyFileMap: keyFileMap
  }
  
  const reportPath = path.join(FRONTEND_ROOT, 'i18n-check-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')
  
  console.log('\n' + '='.repeat(60))
  console.log(`  详细报告已保存到: ${reportPath}`)
  console.log('='.repeat(60))
  
  // 退出码
  if (missingInZh.length > 0 || missingInEn.length > 0) {
    console.log('\n⚠️  存在缺失的国际化 key，请及时补充！')
    process.exit(1)
  } else {
    console.log('\n✅ 所有使用中的国际化 key 都已定义！')
    process.exit(0)
  }
}

// 运行
main()
