<template>
  <div class="page-container about-page">
    <!-- 头部 Hero -->
    <div class="hero-section">
      <div class="hero-badge">
        <img src="/beagle-about.svg" alt="Beagle" />
      </div>
      <div>
        <h1 class="hero-title">Beagle 测试平台</h1>
        <p class="hero-subtitle">通用可扩展的自动化测试平台 · 插件化架构</p>
      </div>
      <el-tag class="hero-version" size="small">v1.0.0</el-tag>
    </div>

    <!-- 核心特性卡片 -->
    <div class="features-grid">
      <div class="feature-card" v-for="f in features" :key="f.title">
        <div class="feature-icon" :style="{ background: f.bg, color: f.color }">
          <el-icon :size="26"><component :is="f.icon" /></el-icon>
        </div>
        <div class="feature-title">{{ f.title }}</div>
        <div class="feature-desc">{{ f.desc }}</div>
      </div>
    </div>

    <!-- 技术架构 -->
    <div class="section-card">
      <div class="section-title">
        <el-icon :size="18"><Cpu /></el-icon>
        <span>技术架构</span>
      </div>
      <div class="tech-grid">
        <div class="tech-item" v-for="t in techStack" :key="t.name">
          <div class="tech-name">{{ t.name }}</div>
          <div class="tech-value">{{ t.value }}</div>
        </div>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="section-card">
      <div class="section-title">
        <el-icon :size="18"><InfoFilled /></el-icon>
        <span>版本信息</span>
      </div>
      <el-descriptions :column="2" border size="default">
        <el-descriptions-item label="平台名称">Beagle Test Platform</el-descriptions-item>
        <el-descriptions-item label="版本">v1.0.0</el-descriptions-item>
        <el-descriptions-item label="前端">Vue 3 + Element Plus + Vite</el-descriptions-item>
        <el-descriptions-item label="后端">Node.js + Express + SQLite</el-descriptions-item>
        <el-descriptions-item label="数据库">SQLite (server/data/beagle.db)</el-descriptions-item>
        <el-descriptions-item label="报告目录">server/reports/</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    icon: "Connection",
    title: "插件化架构",
    desc: "测试功能以插件形式独立开发、独立加载，平台内核零业务耦合，支持热插拔",
    bg: "#ecf5ff",
    color: "#1890ff"
  },
  {
    icon: "Folder",
    title: "多项目管理",
    desc: "每个被测项目独立配置，插件按需绑定到不同项目，项目删除不影响插件本身",
    bg: "#f0f9eb",
    color: "#67c23a"
  },
  {
    icon: "Setting",
    title: "参数全可配",
    desc: "所有测试参数通过页面配置，不写死在代码中，同一插件适配不同项目",
    bg: "#fdf6ec",
    color: "#e6a23c"
  },
  {
    icon: "Tickets",
    title: "报告体系",
    desc: "每次执行生成结构化报告，支持通过率统计、分类筛选、历史趋势分析",
    bg: "#fef0f0",
    color: "#f56c6c"
  },
  {
    icon: "DataLine",
    title: "实时进度",
    desc: "插件自定义测试阶段，平台实时展示执行进度和当前步骤",
    bg: "#f4f4f5",
    color: "#909399"
  },
  {
    icon: "Promotion",
    title: "易于扩展",
    desc: "继承基类即可开发新插件，附带完整开发文档和模板，5分钟上手",
    bg: "#e6f7ff",
    color: "#1890ff"
  }
];

const techStack = [
  { name: "前端框架", value: "Vue 3 (Composition API)" },
  { name: "UI 组件库", value: "Element Plus" },
  { name: "构建工具", value: "Vite" },
  { name: "状态管理", value: "Pinia" },
  { name: "图表", value: "ECharts" },
  { name: "后端框架", value: "Express.js" },
  { name: "数据库", value: "SQLite (sql.js)" },
  { name: "定时任务", value: "node-cron" }
];
</script>

<style scoped>
.about-page {
  max-width: 1100px;
  margin: 0 auto;
}

.hero-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.hero-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.hero-badge img {
  width: 30px;
  height: 30px;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.hero-subtitle {
  font-size: 13px;
  color: #909399;
  margin: 4px 0 0;
}

.hero-version {
  margin-left: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.feature-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.feature-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.section-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.section-title .el-icon {
  color: #1890ff;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.tech-item {
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 8px;
}

.tech-name {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.tech-value {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}
</style>
