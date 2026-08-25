<template>
  <div class="recipe-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ $t("recipe.title") }}</h2>
        <p class="page-desc">{{ $t("recipe.desc") }}</p>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleDownloadAll" trigger="click">
          <el-button type="primary" icon="el-icon-download">
            {{ $t("recipe.downloadAll") }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="excel">{{ $t("recipe.exportExcel") }}</el-dropdown-item>
            <el-dropdown-item command="pdf">{{ $t("recipe.exportPdf") }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 主体：左侧配方列表 + 右侧详情 -->
    <div class="recipe-body">
      <!-- 左侧配方列表 -->
      <div class="recipe-list">
        <div
          v-for="recipe in recipeList"
          :key="recipe.id"
          class="recipe-card"
          :class="{ active: selectedId === recipe.id, 'in-use': recipe.isActive }"
          @click="selectRecipe(recipe.id)"
        >
          <div class="card-header">
            <span class="recipe-name">{{ recipe.name }}</span>
            <el-tag v-if="recipe.isActive" size="mini" type="success" effect="dark">{{ $t("recipe.inUse") }}</el-tag>
          </div>
          <div class="card-info">
            <span class="info-item"><i class="el-icon-goods"></i> {{ recipe.productType }}</span>
            <span class="info-item"><i class="el-icon-water-cup"></i> {{ recipe.fillVolume }}ml</span>
          </div>
          <div class="card-stats">
            <span class="stat"><i class="el-icon-view"></i> {{ recipe.usageCount }}</span>
            <span class="stat" :class="{ danger: recipe.faultRate > 1 }"><i class="el-icon-warning"></i> {{ recipe.faultRate }}%</span>
            <span class="stat"><i class="el-icon-circle-check"></i> {{ recipe.avgQualifiedRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 右侧配方详情 -->
      <div class="recipe-detail" v-if="currentRecipe">
        <!-- 详情头部 -->
        <div class="detail-header">
          <div class="detail-title">
            <template v-if="editing">
              <el-input
                v-model="editName"
                size="small"
                style="width: 240px"
                :placeholder="$t('recipe.namePlaceholder')"
              />
              <el-button type="text" icon="el-icon-check" @click="saveName"></el-button>
              <el-button type="text" icon="el-icon-close" @click="cancelEdit"></el-button>
            </template>
            <template v-else>
              <h3>{{ currentRecipe.name }}</h3>
              <el-button type="text" icon="el-icon-edit" @click="startEdit" size="mini"></el-button>
            </template>
          </div>
          <div class="detail-actions">
            <el-tag size="small" :type="currentRecipe.isActive ? 'success' : 'info'">
              {{ currentRecipe.isActive ? $t("recipe.inUse") : $t("recipe.notInUse") }}
            </el-tag>
            <el-dropdown @command="cmd => handleDownloadSingle(cmd, currentRecipe)" trigger="click">
              <el-button size="small" icon="el-icon-download">
                {{ $t("recipe.download") }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="excel">{{ $t("recipe.exportExcel") }}</el-dropdown-item>
                <el-dropdown-item command="pdf">{{ $t("recipe.exportPdf") }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-title"><i class="el-icon-info"></i>{{ $t("recipe.basicInfo") }}</div>
          <div class="info-grid">
            <div class="info-cell"><span class="label">{{ $t("recipe.recipeCode") }}</span><span class="value">{{ currentRecipe.code }}</span></div>
            <div class="info-cell"><span class="label">{{ $t("recipe.productType") }}</span><span class="value">{{ currentRecipe.productType }}</span></div>
            <div class="info-cell"><span class="label">{{ $t("recipe.fillVolume") }}</span><span class="value">{{ currentRecipe.fillVolume }} ml</span></div>
            <div class="info-cell"><span class="label">{{ $t("recipe.lastUsed") }}</span><span class="value">{{ currentRecipe.lastUsedTime }}</span></div>
          </div>
        </div>

        <!-- 轴位参数 -->
        <div class="detail-section">
          <div class="section-title"><i class="el-icon-position"></i>{{ $t("recipe.axisParams") }}</div>
          <el-table :data="axisParams" border size="small" :show-header="true">
            <el-table-column prop="label" :label="$t('recipe.paramName')" width="180" />
            <el-table-column prop="value" :label="$t('recipe.paramValue')" width="120" align="center" />
            <el-table-column prop="unit" :label="$t('recipe.paramUnit')" width="100" align="center" />
          </el-table>
        </div>

        <!-- 速度参数 -->
        <div class="detail-section">
          <div class="section-title"><i class="el-icon-odometer"></i>{{ $t("recipe.speedParams") }}</div>
          <el-table :data="speedParams" border size="small">
            <el-table-column prop="label" :label="$t('recipe.paramName')" width="180" />
            <el-table-column prop="value" :label="$t('recipe.paramValue')" width="120" align="center" />
            <el-table-column prop="unit" :label="$t('recipe.paramUnit')" width="100" align="center" />
          </el-table>
        </div>

        <!-- 延时与工艺参数 -->
        <div class="detail-section">
          <div class="section-title"><i class="el-icon-timer"></i>{{ $t("recipe.delayParams") }}</div>
          <div class="info-grid">
            <div class="info-cell"><span class="label">{{ $t("recipe.fillDelay") }}</span><span class="value">{{ currentRecipe.fillDelay }} ms</span></div>
            <div class="info-cell"><span class="label">{{ $t("recipe.vacuumDelay") }}</span><span class="value">{{ currentRecipe.vacuumDelay }} ms</span></div>
            <div class="info-cell"><span class="label">{{ $t("recipe.fillSpeed") }}</span><span class="value">{{ currentRecipe.fillSpeed }} 瓶/h</span></div>
            <div class="info-cell"><span class="label">{{ $t("recipe.suckBackSpeed") }}</span><span class="value">{{ currentRecipe.suckBackSpeed }} 瓶/h</span></div>
          </div>
        </div>

        <!-- 智能分析 -->
        <div class="detail-section analysis-section">
          <div class="section-title"><i class="el-icon-data-analysis"></i>{{ $t("recipe.analysis") }}</div>
          <div class="analysis-grid">
            <div class="analysis-card">
              <div class="analysis-icon blue"><i class="el-icon-view"></i></div>
              <div class="analysis-content">
                <div class="analysis-value">{{ currentRecipe.usageCount }}</div>
                <div class="analysis-label">{{ $t("recipe.usageCount") }}</div>
              </div>
            </div>
            <div class="analysis-card">
              <div class="analysis-icon" :class="currentRecipe.faultRate > 1 ? 'red' : 'green'"><i class="el-icon-warning"></i></div>
              <div class="analysis-content">
                <div class="analysis-value">{{ currentRecipe.faultRate }}%</div>
                <div class="analysis-label">{{ $t("recipe.faultRate") }}</div>
              </div>
            </div>
            <div class="analysis-card">
              <div class="analysis-icon green"><i class="el-icon-circle-check"></i></div>
              <div class="analysis-content">
                <div class="analysis-value">{{ currentRecipe.avgQualifiedRate }}%</div>
                <div class="analysis-label">{{ $t("recipe.avgQualifiedRate") }}</div>
              </div>
            </div>
            <div class="analysis-card">
              <div class="analysis-icon orange"><i class="el-icon-time"></i></div>
              <div class="analysis-content">
                <div class="analysis-value-sm">{{ currentRecipe.lastUsedTime }}</div>
                <div class="analysis-label">{{ $t("recipe.lastUsed") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { exportTable } from '@/utils/exportTable'
import { getConfig } from '@/utils/config'

export default {
  name: 'RecipeDB',
  data() {
    return {
      selectedId: 1,
      editing: false,
      editName: ''
    }
  },
  computed: {
    ...mapGetters('device', ['recipeList', 'getRecipeById']),
    currentRecipe() {
      return this.getRecipeById(this.selectedId) || this.recipeList[0]
    },
    // 轴位参数列表
    axisParams() {
      const r = this.currentRecipe
      if (!r) return []
      return [
        { label: this.$t('recipe.fillAngle'), value: r.fillAngle, unit: '度' },
        { label: this.$t('recipe.suckBackAngle'), value: r.suckBackAngle, unit: '度' },
        { label: this.$t('recipe.fillAxisInit'), value: r.fillAxisInit, unit: '脉冲' },
        { label: this.$t('recipe.fillAxisReach'), value: r.fillAxisReach, unit: '脉冲' },
        { label: this.$t('recipe.fixAxisInit'), value: r.fixAxisInit, unit: '脉冲' },
        { label: this.$t('recipe.fixAxisReach'), value: r.fixAxisReach, unit: '脉冲' },
        { label: this.$t('recipe.fixAxisPreLift'), value: r.fixAxisPreLift, unit: '脉冲' },
        { label: this.$t('recipe.stopperAxisInit'), value: r.stopperAxisInit, unit: '脉冲' },
        { label: this.$t('recipe.stopperAxisPrePress'), value: r.stopperAxisPrePress, unit: '脉冲' },
        { label: this.$t('recipe.stopperAxisReach'), value: r.stopperAxisReach, unit: '脉冲' }
      ]
    },
    // 速度参数列表
    speedParams() {
      const r = this.currentRecipe
      if (!r) return []
      return [
        { label: this.$t('recipe.fillAxisInitSpeed'), value: r.fillAxisInitSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.fillAxisReachSpeed'), value: r.fillAxisReachSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.fixAxisInitSpeed'), value: r.fixAxisInitSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.fixAxisReachSpeed'), value: r.fixAxisReachSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.fixAxisPreLiftSpeed'), value: r.fixAxisPreLiftSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.stopperAxisInitSpeed'), value: r.stopperAxisInitSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.stopperAxisPrePressSpeed'), value: r.stopperAxisPrePressSpeed, unit: '脉冲/s' },
        { label: this.$t('recipe.stopperAxisReachSpeed'), value: r.stopperAxisReachSpeed, unit: '脉冲/s' }
      ]
    },
    // 导出列配置
    exportColumns() {
      return [
        { label: this.$t('recipe.recipeCode'), prop: 'code', width: 120 },
        { label: this.$t('recipe.recipeName'), prop: 'name', width: 140 },
        { label: this.$t('recipe.productType'), prop: 'productType', width: 100 },
        { label: this.$t('recipe.fillVolume'), prop: 'fillVolume', width: 80 },
        { label: this.$t('recipe.fillAngle'), prop: 'fillAngle', width: 80 },
        { label: this.$t('recipe.suckBackAngle'), prop: 'suckBackAngle', width: 80 },
        { label: this.$t('recipe.fillSpeed'), prop: 'fillSpeed', width: 80 },
        { label: this.$t('recipe.usageCount'), prop: 'usageCount', width: 80 },
        { label: this.$t('recipe.faultRate'), prop: 'faultRate', width: 80 },
        { label: this.$t('recipe.avgQualifiedRate'), prop: 'avgQualifiedRate', width: 100 }
      ]
    },
    // 当前用户名（导出人）
    exporter() {
      return this.$store?.state?.user?.userInfo?.username || 'admin'
    },
    // PDF水印设置（从系统配置读取）
    pdfWatermark() {
      return getConfig('pdfWatermarkEnabled', true)
    },
    pdfWatermarkText() {
      return getConfig('pdfWatermarkText', '') || this.exporter
    }
  },
  methods: {
    selectRecipe(id) {
      this.selectedId = id
      this.editing = false
    },
    startEdit() {
      this.editName = this.currentRecipe.name
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
      this.editName = ''
    },
    saveName() {
      if (!this.editName.trim()) {
        this.$message.warning(this.$t('recipe.nameNotEmpty'))
        return
      }
      this.$store.commit('device/UPDATE_RECIPE', { id: this.selectedId, patch: { name: this.editName.trim() } })
      this.$message.success(this.$t('recipe.nameUpdateSuccess'))
      this.editing = false
    },
    // 下载单个配方
    handleDownloadSingle(format, recipe) {
      exportTable({
        data: [recipe],
        columns: this.exportColumns,
        title: `${this.$t('recipe.recipe')} - ${recipe.name}`,
        filename: `${this.$t('recipe.recipe')}_${recipe.name}`,
        format,
        exporter: this.exporter,
        watermark: this.pdfWatermark,
        watermarkText: this.pdfWatermarkText
      })
    },
    // 下载全部配方
    handleDownloadAll(format) {
      exportTable({
        data: this.recipeList,
        columns: this.exportColumns,
        title: this.$t('recipe.recipeList'),
        filename: this.$t('recipe.recipeList'),
        format,
        exporter: this.exporter,
        watermark: this.pdfWatermark,
        watermarkText: this.pdfWatermarkText
      })
    }
  }
}
</script>

<style scoped lang="less">
.recipe-container {
  padding: 16px;
  background: #f0f2f5;
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
  gap: 16px;
  height: calc(100vh - 160px);
}

// 左侧配方列表
.recipe-list {
  width: 280px;
  flex-shrink: 0;
  overflow-y: auto;

  .recipe-card {
    background: #fff;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      transform: translateY(-1px);
    }

    &.active {
      border-color: #409eff;
      box-shadow: 0 2px 12px rgba(64,158,255,0.2);
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

          &.blue { background: linear-gradient(135deg, #409eff, #66b1ff); }
          &.green { background: linear-gradient(135deg, #67c23a, #85ce61); }
          &.red { background: linear-gradient(135deg, #f56c6c, #f78989); }
          &.orange { background: linear-gradient(135deg, #e6a23c, #ebb563); }
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
