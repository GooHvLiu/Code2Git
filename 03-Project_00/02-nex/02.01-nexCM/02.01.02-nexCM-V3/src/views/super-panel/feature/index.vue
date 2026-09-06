<template>
  <div class="feature-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.superPanel.feature.page.title") }}
        </h2>
        <p class="page-desc">
          {{ $t("menu.superPanel.feature.page.pageDesc") }}
        </p>
      </div>
      <div class="header-right">
        <el-button
          type="warning"
          icon="el-icon-refresh-left"
          size="small"
          :loading="resetting"
          @click="handleResetAll"
        >
          {{ $t("menu.superPanel.feature.page.resetAll") }}
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
          :loading="loading"
          @click="loadData"
        >
          {{ $t("common.refresh") }}
        </el-button>
      </div>
    </div>

    <!-- 主体：左侧分类列表 + 中间分隔 + 右侧功能详情 -->
    <div class="feature-body">
      <!-- 左侧分类列表 -->
      <div class="category-list">
        <div
          v-for="cat in categoryList"
          :key="cat.category"
          class="category-card"
          :class="{ active: currentCategory === cat.category }"
          @click="selectCategory(cat.category)"
        >
          <div class="card-header">
            <span class="category-icon"
              ><i :class="getCategoryIcon(cat.category)"></i
            ></span>
            <span class="category-name">{{
              getCategoryName(cat.category)
            }}</span>
          </div>
          <div class="card-stats">
            <span class="stat">
              <i class="el-icon-circle-check"></i>
              {{ cat.enabled_count }}/{{ cat.total }}
            </span>
            <span class="stat-percent"
              >{{ getPercent(cat.enabled_count, cat.total) }}%</span
            >
          </div>
          <div class="card-progress">
            <div
              class="progress-bar"
              :style="{ width: getPercent(cat.enabled_count, cat.total) + '%' }"
            ></div>
          </div>
          <!-- 选中时的连接箭头 -->
          <div v-if="currentCategory === cat.category" class="card-connector">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- 中间视觉分隔条 -->
      <div class="feature-divider">
        <div class="divider-line"></div>
        <div class="divider-badge">
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="divider-line"></div>
      </div>

      <!-- 右侧功能列表 -->
      <div class="feature-detail" v-loading="loading">
        <!-- 详情头部 -->
        <div class="detail-header">
          <div class="detail-title">
            <i :class="getCategoryIcon(currentCategory)"></i>
            <h3>{{ getCategoryName(currentCategory) }}</h3>
            <el-tag size="small" type="info"
              >{{ currentFeatures.length }}
              {{ $t("menu.superPanel.feature.page.items") }}</el-tag
            >
          </div>
          <div class="detail-actions">
            <el-button
              type="text"
              icon="el-icon-refresh-left"
              size="small"
              @click="handleResetCategory"
            >
              {{ $t("menu.superPanel.feature.page.resetCategory") }}
            </el-button>
          </div>
        </div>

        <!-- 功能列表 -->
        <div class="feature-list">
          <div
            v-for="feature in currentFeatures"
            :key="feature.feature_key"
            class="feature-item"
            :class="{ enabled: feature.current_value === 'true' }"
          >
            <div class="item-main">
              <div class="item-info">
                <div class="item-name">
                  <span
                    class="status-dot"
                    :class="{ on: feature.current_value === 'true' }"
                  ></span>
                  {{ $t(feature.feature_name) }}
                  <el-tag
                    v-if="feature.current_value !== feature.default_value"
                    size="mini"
                    type="warning"
                    effect="plain"
                  >
                    {{ $t("menu.superPanel.feature.page.modified") }}
                  </el-tag>
                </div>
                <div class="item-desc">{{ $t(feature.description) }}</div>
                <div class="item-meta">
                  <span class="meta-key">{{ feature.feature_key }}</span>
                  <span class="meta-default">
                    {{ $t("menu.superPanel.feature.page.defaultValue") }}:
                    <strong
                      :class="{
                        'text-success': feature.default_value === 'true',
                      }"
                    >
                      {{
                        feature.default_value === "true"
                          ? $t("common.enabled")
                          : $t("common.disabled")
                      }}
                    </strong>
                  </span>
                </div>
              </div>
              <div class="item-actions">
                <el-switch
                  :value="feature.current_value === 'true'"
                  active-color="#67C23A"
                  inactive-color="#C0C4CC"
                  @change="(val) => handleToggle(feature, val)"
                />
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-refresh-left"
                  :disabled="feature.current_value === feature.default_value"
                  @click="handleResetFeature(feature)"
                >
                  {{ $t("menu.superPanel.feature.page.reset") }}
                </el-button>
              </div>
            </div>
          </div>

          <el-empty
            v-if="currentFeatures.length === 0"
            :description="$t('menu.superPanel.feature.page.noData')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Message, MessageBox } from "element-ui";
import { useI18n } from "@/composables/useI18n";
import {
  requestGetAllFeatureConfigApi,
  requestUpdateFeatureConfigApi,
  requestResetFeatureConfigApi,
  requestResetCategoryFeatureConfigApi,
  requestResetAllFeatureConfigApi,
} from "@/api";

const { t: $t } = useI18n();

// ===== 响应式数据 =====
const loading = ref(false);
const resetting = ref(false);
const allFeatures = ref([]);
const categoryStats = ref([]);
const currentCategory = ref("notification");

// ===== 计算属性 =====
const categoryList = computed(() => {
  return categoryStats.value.map((s) => ({
    category: s.category,
    enabled_count: s.enabled_count,
    total: s.total,
  }));
});

const currentFeatures = computed(() => {
  return allFeatures.value.filter((f) => f.category === currentCategory.value);
});

// ===== 分类图标映射 =====
const categoryIcons = {
  notification: "el-icon-bell",
  email: "el-icon-message",
  audit: "el-icon-document",
  auth: "el-icon-lock",
  system: "el-icon-setting",
};

function getCategoryIcon(category) {
  return categoryIcons[category] || "el-icon-menu";
}

function getCategoryName(category) {
  const key = `menu.superPanel.feature.category.${category}`;
  const translated = $t(key);
  return translated === key ? category : translated;
}

function getPercent(enabled, total) {
  if (total === 0) return 0;
  return Math.round((enabled / total) * 100);
}

// ===== 方法 =====
function selectCategory(category) {
  currentCategory.value = category;
}

async function loadData() {
  loading.value = true;
  try {
    const res = await requestGetAllFeatureConfigApi();
    allFeatures.value = res.data?.list || [];
    categoryStats.value = res.data?.stats || [];
  } catch (e) {
    // 错误已由拦截器处理
  } finally {
    loading.value = false;
  }
}

async function handleToggle(feature, value) {
  try {
    await requestUpdateFeatureConfigApi(feature.feature_key, String(value));
    feature.current_value = String(value);
    Message.success($t("menu.superPanel.feature.page.updateSuccess"));
    // 更新统计
    const stat = categoryStats.value.find(
      (s) => s.category === feature.category
    );
    if (stat) {
      stat.enabled_count += value ? 1 : -1;
    }
  } catch (e) {
    // 错误已由拦截器处理
  }
}

async function handleResetFeature(feature) {
  try {
    await MessageBox.confirm(
      $t("menu.superPanel.feature.page.resetConfirm"),
      $t("common.tip"),
      { type: "warning" }
    );
    await requestResetFeatureConfigApi(feature.feature_key);
    feature.current_value = feature.default_value;
    Message.success($t("menu.superPanel.feature.page.resetSuccess"));
    // 更新统计
    const stat = categoryStats.value.find(
      (s) => s.category === feature.category
    );
    if (stat) {
      stat.enabled_count = currentFeatures.value.filter(
        (f) => f.current_value === "true"
      ).length;
    }
  } catch (e) {
    if (e !== "cancel") {
      // 错误已由拦截器处理
    }
  }
}

async function handleResetCategory() {
  try {
    await MessageBox.confirm(
      $t("menu.superPanel.feature.page.resetCategoryConfirm"),
      $t("common.tip"),
      { type: "warning" }
    );
    await requestResetCategoryFeatureConfigApi(currentCategory.value);
    Message.success($t("menu.superPanel.feature.page.resetSuccess"));
    await loadData();
  } catch (e) {
    if (e !== "cancel") {
      // 错误已由拦截器处理
    }
  }
}

async function handleResetAll() {
  try {
    await MessageBox.confirm(
      $t("menu.superPanel.feature.page.resetAllConfirm"),
      $t("common.tip"),
      { type: "warning" }
    );
    resetting.value = true;
    await requestResetAllFeatureConfigApi();
    Message.success($t("menu.superPanel.feature.page.resetSuccess"));
    await loadData();
  } catch (e) {
    if (e !== "cancel") {
      // 错误已由拦截器处理
    }
  } finally {
    resetting.value = false;
  }
}

// ===== 初始化 =====
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="less">
.feature-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

// 页面头部
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .header-left {
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }
    .page-desc {
      font-size: 13px;
      color: #909399;
      margin: 0;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

// 主体布局
.feature-body {
  display: flex;
  gap: 0;
  align-items: stretch;
}

// 左侧分类列表
.category-list {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .category-card {
    position: relative;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;

    &:hover {
      background: #ecf5ff;
      transform: translateX(4px);
    }

    &.active {
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
      border-color: #409eff;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

      .category-name,
      .stat,
      .stat-percent,
      .stat i {
        color: #fff !important;
      }

      .category-icon {
        background: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
      }

      .card-progress {
        background: rgba(255, 255, 255, 0.2) !important;
      }

      .progress-bar {
        background: #fff !important;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;

      .category-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: #409eff;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .category-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .card-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .stat {
        font-size: 12px;
        color: #606266;

        i {
          margin-right: 4px;
        }
      }

      .stat-percent {
        font-size: 16px;
        font-weight: 600;
        color: #409eff;
      }
    }

    .card-progress {
      height: 4px;
      background: #e4e7ed;
      border-radius: 2px;
      overflow: hidden;

      .progress-bar {
        height: 100%;
        background: #409eff;
        border-radius: 2px;
        transition: width 0.3s;
      }
    }

    .card-connector {
      position: absolute;
      right: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      background: #409eff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 14px;
      z-index: 10;
    }
  }
}

// 中间分隔条
.feature-divider {
  width: 40px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .divider-line {
    flex: 1;
    width: 1px;
    background: #e4e7ed;
  }

  .divider-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 14px;
  }
}

// 右侧功能详情
.feature-detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    .detail-title {
      display: flex;
      align-items: center;
      gap: 10px;

      i {
        font-size: 20px;
        color: #409eff;
      }

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }
  }

  .feature-list {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;

    .feature-item {
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.3s;
      border-left: 3px solid #e4e7ed;

      &:hover {
        background: #f5f7fa;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }

      &.enabled {
        border-left-color: #67c23a;
      }

      .item-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .item-info {
        flex: 1;
        min-width: 0;

        .item-name {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #c0c4cc;
            flex-shrink: 0;

            &.on {
              background: #67c23a;
              box-shadow: 0 0 6px rgba(103, 194, 58, 0.5);
            }
          }
        }

        .item-desc {
          font-size: 12px;
          color: #909399;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .item-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #c0c4cc;

          .meta-key {
            font-family: monospace;
            background: #f0f2f5;
            padding: 2px 6px;
            border-radius: 3px;
          }

          .meta-default {
            .text-success {
              color: #67c23a;
            }
          }
        }
      }

      .item-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        margin-left: 16px;
      }
    }
  }
}
</style>
