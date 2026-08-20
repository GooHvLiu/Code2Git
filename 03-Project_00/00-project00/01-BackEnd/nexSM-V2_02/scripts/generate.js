/**
 * MVC 代码生成器
 * 用法：npm run gen 模块名
 * 示例：npm run gen device
 * 自动生成 model / service / controller / route 四层文件
 */
const fs = require('fs');
const path = require('path');

// ==================== 工具函数 ====================

/**
 * 小驼峰转大驼峰
 * device => Device
 * plcDevice => PlcDevice
 */
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 小驼峰转下划线
 * device => device
 * plcDevice => plc_device
 */
function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 小驼峰转中划线
 * device => device
 * plcDevice => plc-device
 */
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// ==================== 主逻辑 ====================

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('\n❌ 请输入模块名称');
  console.log('用法: npm run gen <模块名>');
  console.log('示例: npm run gen device\n');
  process.exit(1);
}

const moduleName = args[0];

// 各种格式的模块名
const name = moduleName;                    // 小驼峰: plcDevice
const Name = toPascalCase(moduleName);      // 大驼峰: PlcDevice
const name_snake = toSnakeCase(moduleName); // 下划线: plc_device
const name_kebab = toKebabCase(moduleName); // 中划线: plc-device

// 路径定义
const rootDir = path.resolve(__dirname, '../');
const modulesDir = path.join(rootDir, 'src/modules');
const templatesDir = path.join(__dirname, 'templates');
const targetModuleDir = path.join(modulesDir, name);

// 要生成的文件列表
const files = [
  {
    template: 'model.tpl',
    output: `${name}.model.js`
  },
  {
    template: 'service.tpl',
    output: `${name}.service.js`
  },
  {
    template: 'controller.tpl',
    output: `${name}.controller.js`
  },
  {
    template: 'route.tpl',
    output: `${name}.route.js`
  }
];

/**
 * 替换模板变量
 */
function replaceVariables(content) {
  return content
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{Name\}\}/g, Name)
    .replace(/\{\{name_snake\}\}/g, name_snake)
    .replace(/\{\{name_kebab\}\}/g, name_kebab);
}

/**
 * 生成文件
 */
function generate() {
  console.log(`\n🚀 开始生成模块: ${name}`);
  console.log('========================================');

  // 创建模块目录
  if (!fs.existsSync(targetModuleDir)) {
    fs.mkdirSync(targetModuleDir, { recursive: true });
    console.log(`📁 创建目录: src/modules/${name}`);
  }

  let successCount = 0;
  let skipCount = 0;

  // 生成各个文件
  for (const file of files) {
    const templatePath = path.join(templatesDir, file.template);
    const outputPath = path.join(targetModuleDir, file.output);

    // 检查文件是否已存在
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  已存在，跳过: src/modules/${name}/${file.output}`);
      skipCount++;
      continue;
    }

    // 读取模板
    let templateContent = fs.readFileSync(templatePath, 'utf8');

    // 替换变量
    const fileContent = replaceVariables(templateContent);

    // 写入文件
    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`✅ 生成成功: src/modules/${name}/${file.output}`);
    successCount++;
  }

  console.log('========================================');
  console.log(`🎉 生成完成！成功: ${successCount} 个，跳过: ${skipCount} 个`);
  console.log(`\n📝 模块路径: src/modules/${name}`);
  console.log(`\n💡 提示:`);
  console.log(`   - 路由已自动加载，无需手动注册`);
  console.log(`   - 路由前缀: /api/${name}`);
  console.log(`   - 列表接口: GET /api/${name}/`);
  console.log(`   - 详情接口: GET /api/${name}/:id`);
  console.log(`   - 请先完善 model 中的字段白名单\n`);
}

// 执行生成
generate();
