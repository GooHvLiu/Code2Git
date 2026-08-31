<template>
  <div class="recipe-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ $t("menu.production.recipe.default") }}</h2>
        <p class="page-desc">{{ $t("menu.production.recipe.page.desc") }}</p>
      </div>
      <div class="header-right">
        <el-dropdown
          v-permission="'production:recipe:download'"
          @command="handleDownloadAll"
          trigger="click"
        >
          <el-button type="primary" icon="el-icon-download">
            {{ $t("menu.production.recipe.page.downloadAll")
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="excel">{{
              $t("menu.production.recipe.page.exportExcel")
            }}</el-dropdown-item>
            <el-dropdown-item command="pdf">{{
              $t("menu.production.recipe.page.exportPdf")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 主体：左侧配方列表 + 中间分隔 + 右侧详情 -->
    <div class="recipe-body">
      <!-- 左侧配方列表 -->
      <div class="recipe-list">
        <div
          v-for="recipe in recipeList"
          :key="recipe.id"
          class="recipe-card"
          :class="{
            active: selectedId === recipe.id,
            'in-use': recipe.isActive,
          }"
          @click="selectRecipe(recipe.id)"
        >
          <div class="card-header">
            <span class="recipe-name">{{ recipe.name }}</span>
            <el-tag
              v-if="recipe.isActive"
              size="mini"
              type="success"
              effect="dark"
              >{{ $t("menu.production.recipe.page.inUse") }}</el-tag
            >
          </div>
          <div class="card-info">
            <span class="info-item"
              ><i class="el-icon-goods"></i> {{ recipe.productType }}</span
            >
            <span class="info-item"
              ><i class="el-icon-water-cup"></i> {{ recipe.fillVolume }}ml</span
            >
          </div>
          <div class="card-stats">
            <span class="stat"
              ><i class="el-icon-view"></i> {{ recipe.usageCount }}</span
            >
            <span class="stat" :class="{ danger: recipe.faultRate > 1 }"
              ><i class="el-icon-warning"></i> {{ recipe.faultRate }}%</span
            >
            <span class="stat"
              ><i class="el-icon-circle-check"></i>
              {{ recipe.avgQualifiedRate }}%</span
            >
          </div>
          <!-- 选中时的连接箭头 -->
          <div v-if="selectedId === recipe.id" class="card-connector">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- 中间视觉分隔条 -->
      <div class="recipe-divider">
        <div class="divider-line"></div>
        <div class="divider-badge">
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="divider-line"></div>
      </div>

      <!-- 右侧配方详情 -->
      <div class="recipe-detail" v-if="currentRecipe">
        <!-- 详情头部 -->
        <div class="detail-header">
          <div class="detail-title">
            <h3>{{ currentRecipe.name }}</h3>
          </div>
          <div class="detail-actions">
            <el-tag
              size="small"
              :type="currentRecipe.isActive ? 'success' : 'info'"
            >
              {{
                currentRecipe.isActive
                  ? $t("menu.production.recipe.page.inUse")
                  : $t("menu.production.recipe.page.notInUse")
              }}
            </el-tag>
            <el-dropdown
              v-permission="'production:recipe:download'"
              @command="(cmd) => handleDownloadSingle(cmd, currentRecipe)"
              trigger="click"
            >
              <el-button size="small" icon="el-icon-download">
                {{ $t("menu.production.recipe.page.download")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="excel">{{
                  $t("menu.production.recipe.page.exportExcel")
                }}</el-dropdown-item>
                <el-dropdown-item command="pdf">{{
                  $t("menu.production.recipe.page.exportPdf")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-info"></i
            >{{ $t("menu.production.recipe.page.basicInfo") }}
          </div>
          <div class="info-grid">
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.recipeCode")
              }}</span
              ><span class="value">{{ currentRecipe.code }}</span>
            </div>
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.productType")
              }}</span
              ><span class="value">{{ currentRecipe.productType }}</span>
            </div>
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.fillVolume")
              }}</span
              ><span class="value">{{ currentRecipe.fillVolume }} ml</span>
            </div>
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.lastUsed")
              }}</span
              ><span class="value">{{ currentRecipe.lastUsedTime }}</span>
            </div>
          </div>
        </div>

        <!-- 轴位参数 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-position"></i
            >{{ $t("menu.production.recipe.page.axisParams") }}
          </div>
          <div class="param-card-grid">
            <div
              v-for="(param, index) in axisParams"
              :key="index"
              class="param-card"
            >
              <div class="param-card-label">{{ param.label }}</div>
              <div class="param-card-value">
                <span class="param-card-number">{{ param.value }}</span>
                <span class="param-card-unit">{{ param.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 速度参数 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-odometer"></i
            >{{ $t("menu.production.recipe.page.speedParams") }}
          </div>
          <div class="param-card-grid">
            <div
              v-for="(param, index) in speedParams"
              :key="index"
              class="param-card"
            >
              <div class="param-card-label">{{ param.label }}</div>
              <div class="param-card-value">
                <span class="param-card-number">{{ param.value }}</span>
                <span class="param-card-unit">{{ param.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 延时与工艺参数 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-timer"></i
            >{{ $t("menu.production.recipe.page.delayParams") }}
          </div>
          <div class="info-grid">
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.fillDelay")
              }}</span
              ><span class="value">{{ currentRecipe.fillDelay }} ms</span>
            </div>
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.vacuumDelay")
              }}</span
              ><span class="value">{{ currentRecipe.vacuumDelay }} ms</span>
            </div>
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.fillSpeed")
              }}</span
              ><span class="value">{{ currentRecipe.fillSpeed }} 瓶/h</span>
            </div>
            <div class="info-cell">
              <span class="label">{{
                $t("menu.production.recipe.page.suckBackSpeed")
              }}</span
              ><span class="value">{{ currentRecipe.suckBackSpeed }} 瓶/h</span>
            </div>
          </div>
        </div>

        <!-- 智能分析 -->
        <div class="detail-section analysis-section">
          <div class="section-title">
            <i class="el-icon-data-analysis"></i
            >{{ $t("menu.production.recipe.page.analysis") }}
          </div>
          <div class="analysis-grid">
            <div class="analysis-card">
              <div class="analysis-icon blue"><i class="el-icon-view"></i></div>
              <div class="analysis-content">
                <div class="analysis-value">{{ currentRecipe.usageCount }}</div>
                <div class="analysis-label">
                  {{ $t("menu.production.recipe.page.usageCount") }}
                </div>
              </div>
            </div>
            <div class="analysis-card">
              <div
                class="analysis-icon"
                :class="currentRecipe.faultRate > 1 ? 'red' : 'green'"
              >
                <i class="el-icon-warning"></i>
              </div>
              <div class="analysis-content">
                <div class="analysis-value">{{ currentRecipe.faultRate }}%</div>
                <div class="analysis-label">
                  {{ $t("menu.production.recipe.page.faultRate") }}
                </div>
              </div>
            </div>
            <div class="analysis-card">
              <div class="analysis-icon green">
                <i class="el-icon-circle-check"></i>
              </div>
              <div class="analysis-content">
                <div class="analysis-value">
                  {{ currentRecipe.avgQualifiedRate }}%
                </div>
                <div class="analysis-label">
                  {{ $t("menu.production.recipe.page.avgQualifiedRate") }}
                </div>
              </div>
            </div>
            <div class="analysis-card">
              <div class="analysis-icon orange">
                <i class="el-icon-time"></i>
              </div>
              <div class="analysis-content">
                <div class="analysis-value-sm">
                  {{ currentRecipe.lastUsedTime }}
                </div>
                <div class="analysis-label">
                  {{ $t("menu.production.recipe.page.lastUsed") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import store from "@/store";
import { exportTable } from "@/utils/exportTable";
import { getConfig } from "@/utils/config";
import { useI18n } from "@/composables/useI18n";

const { t: $t } = useI18n();

// ===== 响应式数据 =====
const selectedId = ref(1);

// ===== 计算属性 =====
const recipeList = computed(() => store.getters["device/recipeList"]);
const getRecipeById = computed(() => store.getters["device/getRecipeById"]);

const currentRecipe = computed(
  () => getRecipeById.value(selectedId.value) || recipeList.value[0]
);

// 轴位参数列表
const axisParams = computed(() => {
  const r = currentRecipe.value;
  if (!r) return [];
  return [
    {
      label: $t("menu.production.recipe.page.fillAngle"),
      value: r.fillAngle,
      unit: "度",
    },
    {
      label: $t("menu.production.recipe.page.suckBackAngle"),
      value: r.suckBackAngle,
      unit: "度",
    },
    {
      label: $t("menu.production.recipe.page.fillAxisInit"),
      value: r.fillAxisInit,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.fillAxisReach"),
      value: r.fillAxisReach,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.fixAxisInit"),
      value: r.fixAxisInit,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.fixAxisReach"),
      value: r.fixAxisReach,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.fixAxisPreLift"),
      value: r.fixAxisPreLift,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.stopperAxisInit"),
      value: r.stopperAxisInit,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.stopperAxisPrePress"),
      value: r.stopperAxisPrePress,
      unit: "脉冲",
    },
    {
      label: $t("menu.production.recipe.page.stopperAxisReach"),
      value: r.stopperAxisReach,
      unit: "脉冲",
    },
  ];
});

// 速度参数列表
const speedParams = computed(() => {
  const r = currentRecipe.value;
  if (!r) return [];
  return [
    {
      label: $t("menu.production.recipe.page.fillAxisInitSpeed"),
      value: r.fillAxisInitSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.fillAxisReachSpeed"),
      value: r.fillAxisReachSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.fixAxisInitSpeed"),
      value: r.fixAxisInitSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.fixAxisReachSpeed"),
      value: r.fixAxisReachSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.fixAxisPreLiftSpeed"),
      value: r.fixAxisPreLiftSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.stopperAxisInitSpeed"),
      value: r.stopperAxisInitSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.stopperAxisPrePressSpeed"),
      value: r.stopperAxisPrePressSpeed,
      unit: "脉冲/s",
    },
    {
      label: $t("menu.production.recipe.page.stopperAxisReachSpeed"),
      value: r.stopperAxisReachSpeed,
      unit: "脉冲/s",
    },
  ];
});

// 导出列配置
const exportColumns = computed(() => [
  {
    label: $t("menu.production.recipe.page.recipeCode"),
    prop: "code",
    width: 120,
  },
  {
    label: $t("menu.production.recipe.page.recipeName"),
    prop: "name",
    width: 140,
  },
  {
    label: $t("menu.production.recipe.page.productType"),
    prop: "productType",
    width: 100,
  },
  {
    label: $t("menu.production.recipe.page.fillVolume"),
    prop: "fillVolume",
    width: 80,
  },
  {
    label: $t("menu.production.recipe.page.fillAngle"),
    prop: "fillAngle",
    width: 80,
  },
  {
    label: $t("menu.production.recipe.page.suckBackAngle"),
    prop: "suckBackAngle",
    width: 80,
  },
  {
    label: $t("menu.production.recipe.page.fillSpeed"),
    prop: "fillSpeed",
    width: 80,
  },
  {
    label: $t("menu.production.recipe.page.usageCount"),
    prop: "usageCount",
    width: 80,
  },
  {
    label: $t("menu.production.recipe.page.faultRate"),
    prop: "faultRate",
    width: 80,
  },
  {
    label: $t("menu.production.recipe.page.avgQualifiedRate"),
    prop: "avgQualifiedRate",
    width: 100,
  },
]);

// 当前用户名（导出人）
const exporter = computed(
  () => store?.state?.user?.userInfo?.username || "admin"
);

// PDF水印设置（从系统配置读取）
const pdfWatermark = computed(() => getConfig("pdfWatermarkEnabled", true));
const pdfWatermarkText = computed(
  () => getConfig("pdfWatermarkText", "") || exporter.value
);

// ===== 方法 =====
function selectRecipe(id) {
  selectedId.value = id;
}

// 下载单个配方
function handleDownloadSingle(format, recipe) {
  exportTable({
    data: [recipe],
    columns: exportColumns.value,
    title: `${$t("menu.production.recipe.page.recipe")} - ${recipe.name}`,
    filename: `${$t("menu.production.recipe.page.recipe")}_${recipe.name}`,
    format,
    exporter: exporter.value,
    watermark: pdfWatermark.value,
    watermarkText: pdfWatermarkText.value,
  });
}

// 下载全部配方
function handleDownloadAll(format) {
  exportTable({
    data: recipeList.value,
    columns: exportColumns.value,
    title: $t("menu.production.recipe.page.recipeList"),
    filename: $t("menu.production.recipe.page.recipeList"),
    format,
    exporter: exporter.value,
    watermark: pdfWatermark.value,
    watermarkText: pdfWatermarkText.value,
  });
}
</script>

<style scoped lang="less">
.recipe-container {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .page-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
  }
  .page-desc {
    margin: 4px 0 0;
    font-size: 13px;
    color: #909399;
  }
}

.recipe-body {
  display: flex;
  gap: 0;
  height: calc(100vh - 160px);
  align-items: stretch;
}

// 左侧配方列表
.recipe-list {
  width: 280px;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 12px;

  .recipe-card {
    position: relative;
    background: #fff;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    cursor: pointer;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
      border-color: #dcdfe6;
    }

    &.active {
      border-color: #409eff;
      box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
      background: linear-gradient(135deg, #f0f7ff 0%, #fff 100%);
    }

    &.in-use {
      position: relative;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .recipe-name {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }
    }

    .card-info {
      display: flex;
      gap: 12px;
      margin-bottom: 10px;
      font-size: 12px;
      color: #606266;

      .info-item i {
        margin-right: 3px;
        color: #909399;
      }
    }

    .card-stats {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #909399;
      padding-top: 8px;
      border-top: 1px solid #f0f2f5;

      .stat i {
        margin-right: 2px;
      }
      .stat.danger {
        color: #f56c6c;
      }
    }

    // 选中时的连接箭头
    .card-connector {
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background: #409eff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 12px;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
      animation: connectorPulse 2s infinite;
    }
  }
}

@keyframes connectorPulse {
  0%,
  100% {
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
  }
  50% {
    box-shadow: 0 2px 16px rgba(64, 158, 255, 0.7);
  }
}

// 中间视觉分隔条
.recipe-divider {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .divider-line {
    flex: 1;
    width: 2px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      #dcdfe6 20%,
      #dcdfe6 80%,
      transparent 100%
    );
  }

  .divider-badge {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    margin: 12px 0;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    animation: badgeFloat 3s ease-in-out infinite;
  }
}

@keyframes badgeFloat {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

// 右侧详情
.recipe-detail {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f2f5;

    .detail-title {
      display: flex;
      align-items: center;
      gap: 8px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }

    .detail-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .detail-section {
    margin-bottom: 24px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #409eff;
      margin-bottom: 14px;
      padding-left: 10px;
      border-left: 3px solid #409eff;

      i {
        font-size: 16px;
      }
    }
  }

  // 参数卡片网格
  .param-card-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  .param-card {
    background: #f8f9fc;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 14px 16px;
    transition: all 0.2s ease;

    &:hover {
      background: #fff;
      border-color: #409eff;
      box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
      transform: translateY(-2px);
    }
  }

  .param-card-label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .param-card-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .param-card-number {
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
  }

  .param-card-unit {
    font-size: 12px;
    color: #909399;
  }

  // 响应式：小屏幕减少列数
  @media (max-width: 1200px) {
    .param-card-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 900px) {
    .param-card-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 600px) {
    .param-card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    .info-cell {
      background: #fafbfc;
      border-radius: 6px;
      padding: 12px 14px;
      border: 1px solid #ebeef5;

      .label {
        display: block;
        font-size: 12px;
        color: #909399;
        margin-bottom: 4px;
      }
      .value {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }
  }

  // 智能分析
  .analysis-section {
    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;

      .analysis-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #ebeef5;

        .analysis-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          flex-shrink: 0;

          &.blue {
            background: linear-gradient(135deg, #409eff, #66b1ff);
          }
          &.green {
            background: linear-gradient(135deg, #67c23a, #85ce61);
          }
          &.red {
            background: linear-gradient(135deg, #f56c6c, #f78989);
          }
          &.orange {
            background: linear-gradient(135deg, #e6a23c, #ebb563);
          }
        }

        .analysis-content {
          .analysis-value {
            font-size: 22px;
            font-weight: 700;
            color: #303133;
            line-height: 1.2;
          }
          .analysis-value-sm {
            font-size: 12px;
            font-weight: 600;
            color: #303133;
            line-height: 1.3;
          }
          .analysis-label {
            font-size: 12px;
            color: #909399;
            margin-top: 2px;
          }
        }
      }
    }
  }
}
</style>
