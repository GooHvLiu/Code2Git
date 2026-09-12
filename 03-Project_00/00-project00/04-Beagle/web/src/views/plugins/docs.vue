<template>
  <div class="page-container docs-page">
    <div class="docs-hero">
      <div class="docs-title">Beagle 插件开发指南</div>
      <div class="docs-subtitle">从零开发一个完整测试插件 · 以「国际化检测」为实战案例</div>
    </div>

    <div class="toc-card">
      <div class="toc-title">目录</div>
      <div class="toc-list">
        <a v-for="(item, i) in toc" :key="i" :href="'#' + item.id" class="toc-item">{{ i + 1 }}. {{ item.title }}</a>
      </div>
    </div>

    <div class="docs-content">
      <!-- 1 -->
      <section id="arch" class="doc-section">
        <h2>1. 架构概述</h2>
        <p>Beagle 采用<strong>宿主平台 + 插件</strong>架构。平台内核提供项目管理、插件注册、执行调度、报告存储等基础能力，所有测试逻辑封装在独立插件中。</p>
        <div class="arch-diagram">
          <div class="arch-box">
            <div class="arch-title">平台内核（不包含任何业务测试逻辑）</div>
            <div class="arch-items">
              <span>项目管理</span><span>插件注册器</span><span>执行调度</span><span>报告存储</span><span>系统设置</span>
            </div>
          </div>
          <div class="arch-arrow">↕</div>
          <div class="arch-box">
            <div class="arch-title">测试插件（独立目录，可插拔）</div>
            <div class="arch-items">
              <span>i18n-check</span><span>permission-check</span><span>api-test</span><span>自定义...</span>
            </div>
          </div>
        </div>
        <p>插件与项目是<strong>多对多关系</strong>：一个插件可绑定多个项目，一个项目可绑定多个插件。删除项目不卸载插件。</p>
        <h3>数据流</h3>
        <p>插件元信息（名称、图标、作者、版本）<strong>始终从插件代码读取</strong>，数据库只存储用户操作产生的状态（启用/禁用、项目绑定、项目级配置）。修改插件代码中的元信息后重启后端即生效。</p>
      </section>

      <!-- 2 -->
      <section id="prep" class="doc-section">
        <h2>2. 开发前准备</h2>
        <p>确保了解以下目录结构：</p>
        <div class="code-block"><pre>{{ codeStructure }}</pre></div>
      </section>

      <!-- 3 -->
      <section id="create-dir" class="doc-section">
        <h2>3. 第一步：创建插件目录</h2>
        <p>在 <code>server/src/test-modules/</code> 下创建新目录，目录名即插件唯一标识：</p>
        <div class="code-block"><pre>{{ codeMkdir }}</pre></div>
        <el-alert type="info" :closable="false" style="margin: 12px 0">
          命名规范：全小写、中划线分隔。Beagle 启动时自动扫描子目录的 index.js，无需手动注册。
        </el-alert>
      </section>

      <!-- 4 -->
      <section id="meta" class="doc-section">
        <h2>4. 第二步：定义插件元信息</h2>
        <p>元信息全部以静态 getter 定义在插件类上，平台直接读取：</p>
        <div class="code-block"><pre>{{ codeMeta }}</pre></div>
        <el-table :data="metaTable" border size="small" style="margin-top: 12px">
          <el-table-column prop="field" label="属性" width="150" />
          <el-table-column prop="required" label="必填" width="60" align="center" />
          <el-table-column prop="desc" label="说明" />
        </el-table>
      </section>

      <!-- 5 -->
      <section id="stages" class="doc-section">
        <h2>5. 第三步：定义进度阶段</h2>
        <p>插件自定义核心测试节点，前端据此渲染进度条：</p>
        <div class="code-block"><pre>{{ codeStages }}</pre></div>
        <p>建议 3-5 个阶段。每个阶段包含 key（唯一标识）和 label（显示名称）。</p>
      </section>

      <!-- 6 -->
      <section id="config" class="doc-section">
        <h2>6. 第四步：构造函数和配置</h2>
        <p>构造函数接收项目配置和项目级插件配置，合并默认值：</p>
        <div class="code-block"><pre>{{ codeConstructor }}</pre></div>
        <p><code>this.project</code> 包含项目的所有字段（frontend_path、backend_path、api_base_url 等）。<code>this.cfg</code> 是合并后的插件配置。</p>
      </section>

      <!-- 7 -->
      <section id="run" class="doc-section">
        <h2>7. 第五步：实现 run() 核心方法</h2>
        <p>run() 是插件入口，返回统一格式的报告对象：</p>
        <div class="code-block"><pre>{{ codeRun }}</pre></div>
      </section>

      <!-- 8 -->
      <section id="results" class="doc-section">
        <h2>8. 第六步：记录测试结果</h2>
        <div class="code-block"><pre>{{ codeResult }}</pre></div>
        <el-table :data="categoryTable" border size="small" style="margin-top: 12px">
          <el-table-column prop="cat" label="category" width="100" />
          <el-table-column prop="meaning" label="含义" width="140" />
          <el-table-column prop="usage" label="使用场景" />
        </el-table>
      </section>

      <!-- 9 -->
      <section id="deps" class="doc-section">
        <h2>9. 第三方依赖处理</h2>
        <p>如果插件需要额外的 npm 包（如 axios、cheerio、pdf-parse），在 <code>server/</code> 目录下安装：</p>
        <div class="code-block"><pre>{{ codeDeps }}</pre></div>
        <el-alert type="warning" :closable="false" style="margin: 12px 0">
          插件内使用 require() 引入第三方包。平台内核不预装业务依赖，每个插件自行管理所需依赖。
          如果插件目录下有 package.json，也可以在插件目录内独立安装。
        </el-alert>
        <h3>常用场景和推荐依赖</h3>
        <el-table :data="depsTable" border size="small">
          <el-table-column prop="scenario" label="测试场景" width="180" />
          <el-table-column prop="packages" label="推荐 npm 包" />
          <el-table-column prop="note" label="说明" width="200" />
        </el-table>
      </section>

      <!-- 10 -->
      <section id="frontend" class="doc-section">
        <h2>10. 第七步：创建前端配置页面（可选）</h2>
        <p>如果插件需要用户在页面上配置参数，在 <code>web/src/views/modules/</code> 下创建页面：</p>
        <div class="code-block"><pre>{{ codeFrontend }}</pre></div>
        <p>简单插件也可以不建前端页面，使用默认执行界面。</p>
      </section>

      <!-- 11 -->
      <section id="register" class="doc-section">
        <h2>11. 第八步：验证和使用</h2>
        <ol>
          <li>重启后端，打开「插件管理」确认插件出现，图标和作者正确</li>
          <li>点击「绑定项目」，选择要测试的项目</li>
          <li>进入「测试模块」，选择项目，看到插件卡片</li>
          <li>点击执行，观察进度条是否按 progressStages 推进</li>
          <li>执行完成后在「测试报告」中查看结果</li>
        </ol>
      </section>

      <!-- 12 -->
      <section id="api" class="doc-section">
        <h2>12. 基类 API 速查</h2>
        <el-table :data="apiTable" border size="small">
          <el-table-column prop="name" label="方法/属性" width="250" />
          <el-table-column prop="desc" label="说明" min-width="250" />
          <el-table-column prop="example" label="示例" min-width="220" />
        </el-table>
      </section>

      <!-- 13 -->
      <section id="scenarios" class="doc-section">
        <h2>13. 常见测试插件场景</h2>
        <p>Beagle 插件基类支持绝大多数前端/后端测试场景：</p>
        <el-table :data="scenarioTable" border size="small">
          <el-table-column prop="type" label="测试类型" width="160" />
          <el-table-column prop="desc" label="检测内容" min-width="250" />
          <el-table-column prop="approach" label="实现方式" min-width="250" />
        </el-table>
      </section>

      <!-- 14 -->
      <section id="template" class="doc-section">
        <h2>14. 完整插件模板（复制即用）</h2>
        <div class="code-block"><pre>{{ codeTemplate }}</pre></div>
      </section>
    </div>
  </div>
</template>

<script setup>
const toc = [
  { id: 'arch', title: '架构概述' },
  { id: 'prep', title: '开发前准备' },
  { id: 'create-dir', title: '创建插件目录' },
  { id: 'meta', title: '定义插件元信息' },
  { id: 'stages', title: '定义进度阶段' },
  { id: 'config', title: '构造函数和配置' },
  { id: 'run', title: '实现 run() 方法' },
  { id: 'results', title: '记录测试结果' },
  { id: 'deps', title: '第三方依赖处理' },
  { id: 'frontend', title: '创建前端页面' },
  { id: 'register', title: '验证和使用' },
  { id: 'api', title: '基类 API 速查' },
  { id: 'scenarios', title: '常见测试场景' },
  { id: 'template', title: '完整插件模板' }
]

const codeStructure = `04-Beagle/
├── server/
│   └── src/
│       ├── test-modules/       ← 所有插件放这里
│       │   ├── base.js         ← 插件基类（不要修改）
│       │   ├── registry.js     ← 自动注册器（不要修改）
│       │   └── i18n-check/     ← 示例：国际化检测
│       │       └── index.js
│       ├── db/                 ← 数据库
│       ├── modules/            ← 平台 API 路由
│       └── app.js
└── web/
    └── src/
        ├── views/modules/      ← 插件前端页面（可选）
        └── router/index.js     ← 路由配置`

const codeMkdir = `# 创建插件目录
mkdir server/src/test-modules/permission-check

# 创建入口文件
touch server/src/test-modules/permission-check/index.js`

const codeMeta = `const TestModuleBase = require('../base');

class MyCheckModule extends TestModuleBase {
  // 唯一标识（必填，和目录名一致）
  static get moduleType() { return 'my-check'; }

  // 显示名称（必填）
  static get moduleName() { return '我的检测'; }

  // 一句话描述
  static get description() { return '检测说明'; }

  // Element Plus 图标名（PascalCase）
  static get icon() { return 'Tools'; }

  // 分类
  static get category() { return 'quality'; }
  // quality=质量 | permission=权限 | api=接口
  // performance=性能 | security=安全 | other=其他

  // 版本号
  static get version() { return '1.0.0'; }

  // 作者
  static get author() { return 'Your Name'; }
}`

const codeStages = `static get progressStages() {
  return [
    { key: 'init',    label: '初始化' },
    { key: 'scan',    label: '扫描文件' },
    { key: 'analyze', label: '分析结果' }
  ];
}`

const codeConstructor = `constructor(projectConfig, moduleConfig = {}) {
  super(projectConfig, moduleConfig);

  // 插件默认配置（用户可在前端页面覆盖）
  this.defaultConfig = {
    targetDir: 'src',
    ignorePatterns: ['node_modules', 'dist'],
    strictMode: false
  };

  // 合并：默认值 ← 项目级配置
  this.cfg = { ...this.defaultConfig, ...moduleConfig };
}`

const codeRun = `async run() {
  this.startTimer();                        // 开始计时

  // 阶段1
  this.setProgress('init', 100);

  // 阶段2：扫描
  this.setProgress('scan', 0);
  const files = this.scanFiles();           // 你的逻辑
  this.addResult({
    name: '文件扫描',
    passed: true,
    message: '扫描到 ' + files.length + ' 个文件',
    category: 'info'
  });
  this.setProgress('scan', 100);

  // 阶段3：分析
  this.setProgress('analyze', 0);
  // ... 分析逻辑
  this.setProgress('analyze', 100);

  this.stopTimer();                         // 结束计时
  return this.generateReport();             // 返回标准报告
}`

const codeResult = `this.addResult({
  name: '检查项名称',        // 必填
  passed: true,              // 必填：true=通过 false=失败
  message: '结果描述',       // 必填
  expected: '期望值',        // 可选
  actual: '实际值',          // 可选
  detail: { raw: [] },      // 可选：任意 JSON，详情页可展开
  category: 'info'           // info=正常 warn=警告 error=错误
});`

const codeDeps = `# 在 server 目录下安装插件需要的第三方包
cd server
npm install axios cheerio

# 插件代码中直接 require
const axios = require('axios');
const cheerio = require('cheerio');`

const codeFrontend = `// web/src/views/modules/my-check/index.vue
<template>
  <div class="page-container">
    <div class="card">
      <h3>我的检测配置</h3>
      <el-form label-width="120px">
        <el-form-item label="目标目录">
          <el-input v-model="config.targetDir" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="runTest">开始检测</el-button>
    </div>
  </div>
</template>

// 在 web/src/router/index.js 中注册（hidden: true 不在侧边栏显示）
{
  path: 'modules/my-check',
  component: () => import('@/views/modules/my-check/index.vue'),
  meta: { hidden: true }
}`

const codeTemplate = `const TestModuleBase = require('../base');
const fs = require('fs');
const path = require('path');

class MyCheckModule extends TestModuleBase {
  static get moduleType() { return 'my-check'; }
  static get moduleName() { return '我的检测'; }
  static get description() { return '检测说明'; }
  static get icon() { return 'Tools'; }
  static get category() { return 'quality'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'Your Name'; }

  static get progressStages() {
    return [
      { key: 'init', label: '初始化' },
      { key: 'scan', label: '扫描数据' },
      { key: 'analyze', label: '分析结果' }
    ];
  }

  constructor(projectConfig, moduleConfig = {}) {
    super(projectConfig, moduleConfig);
    this.cfg = { optionA: 'default', ...moduleConfig };
  }

  async run() {
    this.startTimer();

    this.setProgress('init', 100);

    this.setProgress('scan', 0);
    // === 你的扫描逻辑 ===
    this.addResult({ name: '检查项1', passed: true, message: '通过', category: 'info' });
    this.setProgress('scan', 100);

    this.setProgress('analyze', 0);
    // === 你的分析逻辑 ===
    this.setProgress('analyze', 100);

    this.stopTimer();
    return this.generateReport();
  }
}

module.exports = MyCheckModule;`

const metaTable = [
  { field: 'moduleType', required: '是', desc: '唯一标识，英文小写中划线，和目录名一致' },
  { field: 'moduleName', required: '是', desc: '显示名称' },
  { field: 'description', required: '否', desc: '一句话描述插件功能' },
  { field: 'icon', required: '否', desc: 'Element Plus 图标组件名 PascalCase，默认 Setting' },
  { field: 'category', required: '否', desc: 'quality/permission/api/performance/security/other' },
  { field: 'version', required: '否', desc: '版本号，默认 1.0.0' },
  { field: 'author', required: '否', desc: '插件作者' }
]

const categoryTable = [
  { cat: 'info', meaning: '正常/信息', usage: '检查通过、结构正常等信息性结果' },
  { cat: 'warn', meaning: '警告', usage: '建议修复但不影响功能的问题' },
  { cat: 'error', meaning: '错误', usage: '阻断性问题、路径不存在、关键检查失败' }
]

const depsTable = [
  { scenario: 'HTTP 接口测试', packages: 'axios / node-fetch', note: '发起 API 请求，验证响应' },
  { scenario: 'HTML/DOM 解析', packages: 'cheerio', note: '服务端 jQuery，解析 HTML 结构' },
  { scenario: '文件扫描', packages: 'fast-glob / glob', note: '递归匹配文件路径' },
  { scenario: 'PDF/Word 解析', packages: 'pdf-parse / mammoth', note: '解析文档内容' },
  { scenario: '代码 AST 分析', packages: '@babel/parser / acorn', note: '解析 JS/TS 语法树' },
  { scenario: 'JSON/YAML 校验', packages: 'ajv / js-yaml', note: 'Schema 校验和格式解析' },
  { scenario: '性能压测', packages: 'autocannon / k6', note: '并发请求和性能指标' }
]

const apiTable = [
  { name: 'this.startTimer()', desc: '开始计时', example: 'this.startTimer()' },
  { name: 'this.stopTimer()', desc: '结束计时', example: 'this.stopTimer()' },
  { name: 'this.setProgress(key, pct)', desc: '报告阶段进度 0-100', example: "this.setProgress('scan', 50)" },
  { name: 'this.addResult(obj)', desc: '添加一条检查结果', example: 'this.addResult({ name, passed, message })' },
  { name: 'this.addResults(arr)', desc: '批量添加结果', example: 'this.addResults([...])' },
  { name: 'this.generateReport()', desc: '生成标准报告（run 返回值）', example: 'return this.generateReport()' },
  { name: 'this.project', desc: '被测项目配置对象', example: 'this.project.frontend_path' },
  { name: 'this.cfg', desc: '合并后的插件配置', example: 'this.cfg.targetDir' }
]

const scenarioTable = [
  { type: '国际化检测', desc: '多语言 key 对称性、缺失、多余、引用完整性', approach: '扫描语言文件 + 前端 $t() 引用对比' },
  { type: '权限检测', desc: '路由权限配置、按钮权限、API 权限一致性', approach: '解析路由配置 + 后端权限表对比' },
  { type: '接口测试', desc: 'API 可达性、参数校验、响应格式、状态码', approach: 'axios 发起请求 + Schema 校验响应' },
  { type: '代码规范', desc: 'ESLint 规则、命名规范、注释覆盖率', approach: '读取源码 + 正则/AST 分析' },
  { type: '安全扫描', desc: 'XSS、硬编码密钥、敏感信息泄露', approach: '正则匹配 + AST 分析' },
  { type: '性能检测', desc: '包体积、首屏加载、接口响应时间', approach: '读取构建产物 + HTTP 压测' },
  { type: '数据库检测', desc: '字段冗余、索引缺失、类型一致性', approach: '连接数据库读取 schema 分析' },
  { type: '文档完整性', desc: 'README、API 文档、变更日志', approach: '扫描项目文件是否存在和内容完整' }
]
</script>

<style scoped>
.docs-page { max-width: 920px; margin: 0 auto; }
.docs-hero {
  background: #fff; border-radius: 10px; padding: 24px; margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.docs-title { font-size: 20px; font-weight: 700; color: #1a1a1a; }
.docs-subtitle { font-size: 13px; color: #909399; margin-top: 6px; }
.toc-card {
  background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.toc-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 12px; }
.toc-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.toc-item { font-size: 13px; color: #606266; text-decoration: none; padding: 4px 0; }
.toc-item:hover { color: #1890ff; }
.arch-diagram {
  display: flex; align-items: center; gap: 20px; margin: 16px 0;
  padding: 16px; background: #f8f9fa; border-radius: 8px;
}
.arch-box { flex: 1; text-align: center; }
.arch-title { font-size: 13px; font-weight: 600; color: #303133; margin-bottom: 10px; }
.arch-items { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.arch-items span {
  background: #fff; border: 1px solid #e4e7ed; border-radius: 4px;
  padding: 4px 10px; font-size: 12px; color: #606266;
}
.arch-arrow { font-size: 18px; color: #909399; }
.docs-content {
  background: #fff; border-radius: 10px; padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.doc-section { margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0; }
.doc-section:last-child { border-bottom: none; margin-bottom: 0; }
.doc-section h2 { font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 0 0 12px; }
.doc-section h3 { font-size: 15px; font-weight: 600; color: #303133; margin: 16px 0 8px; }
.doc-section p { font-size: 14px; color: #606266; line-height: 1.8; margin: 0 0 10px; }
.doc-section ol, .doc-section ul { font-size: 14px; color: #606266; line-height: 2; padding-left: 20px; }
.code-block {
  background: #1e1e2e; border-radius: 8px; padding: 16px; margin: 12px 0; overflow-x: auto;
}
.code-block pre {
  color: #cdd6f4; font-size: 13px; line-height: 1.7; margin: 0; white-space: pre;
  font-family: 'Consolas','Monaco',monospace;
}
.doc-section code {
  background: #f5f7fa; padding: 2px 6px; border-radius: 4px; font-size: 13px;
  color: #c7254e; font-family: 'Consolas','Monaco',monospace;
}
</style>
