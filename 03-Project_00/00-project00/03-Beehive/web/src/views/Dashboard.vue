<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="banner-title">欢迎使用 Beehive 授权管理平台</h1>
        <p class="banner-desc">为 B/S 架构项目提供企业级软件授权保护，支持机器绑定/防时间回退/联网校准等安全特性。</p>
      </div>
      <div class="banner-decoration">
        <div class="deco-circle c1"></div>
        <div class="deco-circle c2"></div>
        <div class="deco-circle c3"></div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="(stat, idx) in statCards" :key="idx">
        <div class="stat-card" :style="{ background: stat.gradient }">
          <div class="stat-left">
            <div class="stat-num">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-trend" v-if="stat.trend"><i :class="stat.trendIcon"></i> {{ stat.trend }}</div>
          </div>
          <div class="stat-icon">{{ stat.icon }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 下方内容 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="14">
        <el-card>
          <div slot="header" class="card-header">
            <span>🛡️ 安全特性</span>
            <el-tag size="small" type="success">全部已启用</el-tag>
          </div>
          <div class="feature-grid">
            <div class="feature-item" v-for="f in features" :key="f.name">
              <div class="feature-icon" :style="{ background: f.color }">{{ f.icon }}</div>
              <div class="feature-info">
                <div class="feature-name">{{ f.name }}</div>
                <div class="feature-desc">{{ f.desc }}</div>
              </div>
              <el-tag type="success" size="mini" effect="plain">已启用</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header" class="card-header">
            <span>⚡ 快速操作</span>
          </div>
          <div class="quick-actions">
            <div class="action-btn" @click="$router.push('/license/gen')">
              <div class="action-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">📝</div>
              <div class="action-text">
                <div class="action-title">生成授权</div>
                <div class="action-sub">为项目签发新授权</div>
              </div>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="action-btn" @click="$router.push('/license/list')">
              <div class="action-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7)">📋</div>
              <div class="action-text">
                <div class="action-title">授权列表</div>
                <div class="action-sub">管理已签发授权</div>
              </div>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="action-btn" @click="$router.push('/project')">
              <div class="action-icon" style="background: linear-gradient(135deg, #fa709a, #fee140)">📦</div>
              <div class="action-text">
                <div class="action-title">项目管理</div>
                <div class="action-sub">管理受保护项目</div>
              </div>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="action-btn" @click="$router.push('/time-check')">
              <div class="action-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c)">⏰</div>
              <div class="action-text">
                <div class="action-title">时间校准</div>
                <div class="action-sub">查看服务器时间</div>
              </div>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <el-divider />
          <div class="flow-tip">
            <div class="tip-title">📌 授权流程</div>
            <div class="tip-steps">
              <span class="step">添加项目</span>
              <i class="el-icon-arrow-right"></i>
              <span class="step">生成授权</span>
              <i class="el-icon-arrow-right"></i>
              <span class="step">分发.lic</span>
              <i class="el-icon-arrow-right"></i>
              <span class="step">客户端导入</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLicenseList, getProjects, getServerTime } from "@/api";

export default {
  name: "Dashboard",
  data() {
    return {
      stats: { licenseCount: 0, projectCount: 0 },
      serverTimeStr: "--",
      features: [
        {
          name: "RSA 非对称签名",
          desc: "私钥签发，公钥验证，无法伪造",
          icon: "🔐",
          color: "linear-gradient(135deg,#667eea,#764ba2)"
        },
        {
          name: "AES-256 加密",
          desc: "授权文件加密存储，防止篡改",
          icon: "🔒",
          color: "linear-gradient(135deg,#43e97b,#38f9d7)"
        },
        {
          name: "机器指纹绑定",
          desc: "绑定CPU+MAC+硬盘，不可拷贝",
          icon: "💻",
          color: "linear-gradient(135deg,#fa709a,#fee140)"
        },
        {
          name: "防时间回退",
          desc: "检测系统时间调回，自动冻结",
          icon: "⏰",
          color: "linear-gradient(135deg,#f093fb,#f5576c)"
        },
        {
          name: "联网时间校准",
          desc: "时间回退后可联网校准恢复",
          icon: "🌐",
          color: "linear-gradient(135deg,#4facfe,#00f2fe)"
        },
        {
          name: "功能级授权",
          desc: "可控制哪些功能模块可用",
          icon: "🎯",
          color: "linear-gradient(135deg,#a8edea,#fed6e3)"
        }
      ]
    };
  },
  computed: {
    statCards() {
      return [
        {
          label: "授权文件总数",
          value: this.stats.licenseCount,
          icon: "📄",
          gradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
          trend: "本月新增 0",
          trendIcon: "el-icon-top"
        },
        {
          label: "已接入项目",
          value: this.stats.projectCount,
          icon: "📦",
          gradient: "linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)",
          trend: "运行正常",
          trendIcon: "el-icon-circle-check"
        },
        {
          label: "加密强度",
          value: "RSA-2048",
          icon: "🔐",
          gradient: "linear-gradient(135deg,#fa709a 0%,#fee140 100%)",
          trend: "AES-256",
          trendIcon: "el-icon-lock"
        },
        {
          label: "服务器时间",
          value: this.serverTimeStr,
          icon: "⏰",
          gradient: "linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)",
          trend: "UTC+8",
          trendIcon: "el-icon-time"
        }
      ];
    }
  },
  async mounted() {
    await this.loadStats();
    this.timer = setInterval(this.loadServerTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async loadStats() {
      try {
        const [licRes, projRes] = await Promise.all([getLicenseList(), getProjects()]);
        this.stats.licenseCount = licRes.data.total || 0;
        this.stats.projectCount = projRes.data.total || 0;
      } catch (e) {}
    },
    async loadServerTime() {
      try {
        const res = await getServerTime();
        this.serverTimeStr = new Date(res.data.serverTime).toLocaleTimeString("zh-CN", { hour12: false });
      } catch (e) {}
    }
  }
};
</script>

<style lang="less" scoped>
.welcome-banner {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #0050b3 100%);
  border-radius: 12px;
  padding: 28px 32px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  color: #fff;
  .banner-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
  }
  .banner-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .banner-desc {
    font-size: 14px;
    line-height: 1.7;
    opacity: 0.9;
  }
  .banner-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 100%;
    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }
    .c1 {
      width: 200px;
      height: 200px;
      top: -60px;
      right: 40px;
    }
    .c2 {
      width: 120px;
      height: 120px;
      bottom: -30px;
      right: 120px;
      background: rgba(255, 255, 255, 0.08);
    }
    .c3 {
      width: 80px;
      height: 80px;
      top: 50%;
      right: 20px;
      background: rgba(255, 255, 255, 0.12);
    }
  }
}

.stat-row {
  margin-bottom: 4px;
}
.stat-card {
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  .stat-num {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
  }
  .stat-label {
    font-size: 13px;
    opacity: 0.85;
    margin-top: 6px;
  }
  .stat-trend {
    font-size: 12px;
    opacity: 0.75;
    margin-top: 8px;
    i {
      margin-right: 2px;
    }
  }
  .stat-icon {
    font-size: 40px;
    opacity: 0.4;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 12px;
  background: #f8f9fc;
  transition: all 0.2s ease;
  &:hover {
    background: #f0f2ff;
    transform: translateX(4px);
  }
  .feature-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .feature-info {
    flex: 1;
    .feature-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .feature-desc {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #f5f7ff;
    transform: translateX(4px);
  }
  .action-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .action-text {
    flex: 1;
    .action-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .action-sub {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }
  }
  i {
    color: #c0c4cc;
  }
}

.flow-tip {
  .tip-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 12px;
  }
  .tip-steps {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    .step {
      padding: 6px 14px;
      border-radius: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }
    i {
      color: #c0c4cc;
      font-size: 12px;
    }
  }
}
</style>
