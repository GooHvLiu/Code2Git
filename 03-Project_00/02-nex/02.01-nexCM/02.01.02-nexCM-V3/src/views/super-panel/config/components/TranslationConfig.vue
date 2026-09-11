<template>
  <div class="translation-config-panel">
    <!-- 操作栏 -->
    <div class="translation-toolbar">
      <div class="toolbar-left">
        <span class="panel-title">
          <i class="el-icon-connection"></i>
          {{ $t('superPanel.config.translation.title') }}
        </span>
        <el-tag 
          :type="config.enabled ? 'success' : 'info'" 
          size="small"
          class="status-tag"
        >
          {{ config.enabled ? $t('superPanel.config.translation.enabled') : $t('superPanel.config.translation.disabled') }}
        </el-tag>
      </div>
      <div class="toolbar-right">
        <el-button 
          icon="el-icon-refresh" 
          @click="loadConfig"
        >
          {{ $t('common.refresh') }}
        </el-button>
        <el-button 
          type="primary" 
          icon="el-icon-check" 
          :loading="saving"
          @click="handleSave"
        >
          {{ $t('common.save') }}
        </el-button>
      </div>
    </div>

    <!-- 配置表单 -->
    <div class="config-form-wrapper">
      <el-form 
        :model="config" 
        :rules="rules" 
        ref="configForm"
        label-width="140px"
        class="config-form"
      >
        <!-- 基本设置 -->
        <div class="form-section">
          <div class="section-title">
            <i class="el-icon-setting"></i>
            {{ $t('superPanel.config.translation.basicSettings') }}
          </div>
          
          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.enableTranslation') }}
                <el-tooltip :content="$t('superPanel.config.translation.enableTranslationTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-switch 
              v-model="config.enabled"
              :active-text="$t('common.enabled')"
              :inactive-text="$t('common.disabled')"
            />
          </el-form-item>
          
          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.provider') }}
                <el-tooltip :content="$t('superPanel.config.translation.providerTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.provider" style="width: 300px">
              <el-option label="腾讯云翻译" value="tencent" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.masterLanguage') }}
                <el-tooltip :content="$t('superPanel.config.translation.masterLanguageTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.masterLanguage" style="width: 300px">
              <el-option
                v-for="lang in langList"
                :key="lang.langCode"
                :label="lang.autonym + ' (' + lang.langCode + ')'"
                :value="lang.langCode"
              />
            </el-select>
          </el-form-item>
        </div>

          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.languageDisplayField') }}
                <el-tooltip :content="$t('superPanel.config.translation.languageDisplayFieldTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.languageDisplayField" style="width: 300px">
              <el-option :label="$t('superPanel.config.translation.displayAutonym')" value="autonym" />
              <el-option :label="$t('superPanel.config.translation.displayName')" value="name" />
            </el-select>
          </el-form-item>

        <!-- 腾讯云配置 -->
        <div class="form-section" v-if="config.provider === 'tencent'">
          <div class="section-title">
            <i class="el-icon-cloudy"></i>
            {{ $t('superPanel.config.translation.tencentSettings') }}
          </div>
          
          <el-form-item prop="tencent.secretId">
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.secretId') }}
                <el-tooltip :content="$t('superPanel.config.translation.secretIdTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-input 
              v-model="config.tencent.secretId" 
              :placeholder="$t('superPanel.config.translation.secretIdPlaceholder')"
              show-password
              style="width: 400px"
            />
          </el-form-item>
          
          <el-form-item prop="tencent.secretKey">
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.secretKey') }}
                <el-tooltip :content="$t('superPanel.config.translation.secretKeyTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-input 
              v-model="config.tencent.secretKey" 
              :placeholder="$t('superPanel.config.translation.secretKeyPlaceholder')"
              show-password
              style="width: 400px"
            />
          </el-form-item>
          
          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.region') }}
                <el-tooltip :content="$t('superPanel.config.translation.regionTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.tencent.region" style="width: 300px">
              <el-option label="广州 (ap-guangzhou)" value="ap-guangzhou" />
              <el-option label="上海 (ap-shanghai)" value="ap-shanghai" />
              <el-option label="北京 (ap-beijing)" value="ap-beijing" />
              <el-option label="成都 (ap-chengdu)" value="ap-chengdu" />
              <el-option label="香港 (ap-hongkong)" value="ap-hongkong" />
              <el-option label="新加坡 (ap-singapore)" value="ap-singapore" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t('superPanel.config.translation.projectId') }}
                <el-tooltip :content="$t('superPanel.config.translation.projectIdTip')" placement="top">
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-input-number 
              v-model="config.tencent.projectId" 
              :min="0"
              :max="999999"
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="warning" 
              icon="el-icon-connection"
              :loading="testing"
              @click="handleTest"
            >
              {{ $t('superPanel.config.translation.testConfig') }}
            </el-button>
            <div class="test-result" v-if="testResult">
              <div class="test-result-main">
                <i :class="testResult.success ? 'el-icon-success' : 'el-icon-error'" :style="{ color: testResult.success ? '#67c23a' : '#f56c6c' }"></i>
                <span>{{ testResult.message }}</span>
              </div>
              <div class="test-result-detail" v-if="testResult.success && testResult.translation">
                <span class="translation-source">{{ testResult.translation.source }}</span>
                <i class="el-icon-arrow-right translation-arrow"></i>
                <span class="translation-target">{{ testResult.translation.target }}</span>
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- 已存在的语言 -->
        <div class="form-section">
          <div class="section-title">
            <i class="el-icon-collection"></i>
            {{ $t('superPanel.config.translation.existingLangs') }}
          </div>
          <div class="lang-list">
            <el-tag 
              v-for="lang in langList" 
              :key="lang.langCode"
              size="small"
              class="lang-tag"
            >
              <svg-icon :icon-file-name="lang.flag || 'global'" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" /> {{ lang.autonym }} ({{ lang.langCode }})
            </el-tag>
          </div>
        </div>

        <!-- 说明 -->
        <div class="form-section">
          <el-alert
            :title="$t('superPanel.config.translation.tipTitle')"
            :description="$t('superPanel.config.translation.tipContent')"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  requestGetTranslationConfigApi,
  requestSaveTranslationConfigApi,
  requestTestTranslationConfigApi,
  requestGetLanguagesApi
} from '@/api'

export default {
  name: 'TranslationConfig',
  data() {
    return {
      loading: false,
      saving: false,
      testing: false,
      testResult: null,
      langList: [], // 已存在的语言清单
      config: {
        enabled: false,
        provider: 'tencent',
        masterLanguage: 'zh-CN', // 母版语言，默认中文
        languageDisplayField: 'autonym', // 语言名称显示方式：autonym=母语, name=中文
        tencent: {
          secretId: '',
          secretKey: '',
          region: 'ap-guangzhou',
          projectId: 0
        }
      },
      rules: {
        'tencent.secretId': [
          { required: true, message: '请输入 SecretId', trigger: 'blur' }
        ],
        'tencent.secretKey': [
          { required: true, message: '请输入 SecretKey', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadConfig()
    this.loadLangList()
  },
  methods: {
    // 加载已存在的语言清单
    async loadLangList() {
      try {
        const res = await requestGetLanguagesApi()
        this.langList = res.data || []
      } catch (err) {
        console.error('[TranslationConfig] 加载语言清单失败:', err)
      }
    },

    async loadConfig() {
      this.loading = true
      try {
        const res = await requestGetTranslationConfigApi()
        if (res.data) {
          this.config = {
            enabled: res.data.enabled,
            provider: res.data.provider,
            masterLanguage: res.data.masterLanguage || 'zh-CN',
            languageDisplayField: res.data.languageDisplayField || 'autonym',
            tencent: {
              ...res.data.tencent
            }
          }
        }
      } catch (err) {
        this.$message.error('加载翻译配置失败')
      } finally {
        this.loading = false
      }
    },
    
    async handleSave() {
      this.$refs.configForm.validate(async (valid) => {
        if (!valid) return
        this.saving = true
        try {
          await requestSaveTranslationConfigApi(this.config)
          this.$message.success('翻译配置保存成功')
          this.testResult = null
        } catch (err) {
          this.$message.error(err.message || '翻译配置保存失败')
        } finally {
          this.saving = false
        }
      })
    },
    
    async handleTest() {
      this.testing = true
      this.testResult = null
      try {
        // 先保存配置再测试
        await requestSaveTranslationConfigApi(this.config)
        const res = await requestTestTranslationConfigApi()
        const data = res.data || {}
        // 提取翻译结果
        let translation = null
        if (data.success && data.result) {
          const targetText = data.result.target || data.result.TargetText || ''
          const sourceText = data.result.source || '你好'
          if (targetText) {
            translation = {
              source: sourceText,
              target: targetText
            }
          }
        }
        // 成功/失败提示均由前端按当前语言国际化，不使用后端返回文案、不兜底
        this.testResult = {
          success: data.success,
          message: data.success
            ? this.$t('superPanel.config.translation.testSuccess')
            : this.$t('superPanel.config.translation.testFailed'),
          translation
        }
      } catch (err) {
        this.testResult = {
          success: false,
          message: this.$t('superPanel.config.translation.testFailed'),
          translation: null
        }
      } finally {
        this.testing = false
      }
    }
  }
}
</script>

<style scoped>
.translation-config-panel {
  padding: 20px;
}

.translation-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title i {
  color: #409eff;
  font-size: 18px;
}

.status-tag {
  margin-left: 8px;
}

.config-form-wrapper {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 24px;
}

.config-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #409eff;
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}

/* 带问号提示的 label */
.label-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-tip-icon {
  color: #c0c4cc;
  cursor: help;
  font-size: 14px;
  transition: color 0.2s;
}

.label-tip-icon:hover {
  color: #409eff;
}

/* 测试结果 */
.test-result {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
  vertical-align: middle;
}

.test-result-main {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.test-result-detail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
  font-size: 13px;
}

.translation-source {
  color: #606266;
  font-weight: 500;
}

.translation-arrow {
  color: #67c23a;
  font-size: 12px;
}

.translation-target {
  color: #67c23a;
  font-weight: 500;
}

.lang-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lang-tag {
  margin: 0;
}
</style>


