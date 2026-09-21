<template>
  <div class="translation-config-panel">
    <!-- 操作栏 -->
    <div class="translation-toolbar">
      <div class="toolbar-left">
        <span class="panel-title">
          <el-icon><Connection /></el-icon>
          {{ t('superPanel.config.translation.title') }}
        </span>
        <el-tag :type="config.enabled ? 'success' : 'info'" size="small" class="status-tag">
          {{ config.enabled ? t('superPanel.config.translation.enabled') : t('superPanel.config.translation.disabled') }}
        </el-tag>
      </div>
      <div class="toolbar-right">
        <el-button @click="loadConfig">
          <el-icon><Refresh /></el-icon>&nbsp;{{ t('common.refresh') }}
        </el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          <el-icon><Check /></el-icon>&nbsp;{{ t('common.save') }}
        </el-button>
      </div>
    </div>

    <!-- 配置表单 -->
    <div class="config-form-wrapper">
      <el-form ref="configFormRef" :model="config" :rules="rules" label-width="140px" class="config-form">
        <!-- 基本设置 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Setting /></el-icon>
            {{ t('superPanel.config.translation.basicSettings') }}
          </div>

          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.enableTranslation') }}
                <el-tooltip :content="t('superPanel.config.translation.enableTranslationTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-switch v-model="config.enabled" :active-text="t('common.enabled')" :inactive-text="t('common.disabled')" />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.provider') }}
                <el-tooltip :content="t('superPanel.config.translation.providerTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.provider" style="width: 300px">
              <el-option :label="t('superPanel.config.translation.providerTencent')" value="tencent" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.masterLanguage') }}
                <el-tooltip :content="t('superPanel.config.translation.masterLanguageTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
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

          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.languageDisplayField') }}
                <el-tooltip :content="t('superPanel.config.translation.languageDisplayFieldTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.languageDisplayField" style="width: 300px">
              <el-option :label="t('superPanel.config.translation.displayAutonym')" value="autonym" />
              <el-option :label="t('superPanel.config.translation.displayName')" value="name" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 腾讯云配置 -->
        <div v-if="config.provider === 'tencent'" class="form-section">
          <div class="section-title">
            <el-icon><Cloudy /></el-icon>
            {{ t('superPanel.config.translation.tencentSettings') }}
          </div>

          <el-form-item prop="tencent.secretId">
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.secretId') }}
                <el-tooltip :content="t('superPanel.config.translation.secretIdTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model="config.tencent.secretId" :placeholder="t('superPanel.config.translation.secretIdPlaceholder')" show-password style="width: 400px" />
          </el-form-item>

          <el-form-item prop="tencent.secretKey">
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.secretKey') }}
                <el-tooltip :content="t('superPanel.config.translation.secretKeyTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model="config.tencent.secretKey" :placeholder="t('superPanel.config.translation.secretKeyPlaceholder')" show-password style="width: 400px" />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.region') }}
                <el-tooltip :content="t('superPanel.config.translation.regionTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="config.tencent.region" style="width: 300px">
              <el-option :label="t('superPanel.config.translation.regionGuangzhou') + ' (ap-guangzhou)'" value="ap-guangzhou" />
              <el-option :label="t('superPanel.config.translation.regionShanghai') + ' (ap-shanghai)'" value="ap-shanghai" />
              <el-option :label="t('superPanel.config.translation.regionBeijing') + ' (ap-beijing)'" value="ap-beijing" />
              <el-option :label="t('superPanel.config.translation.regionChengdu') + ' (ap-chengdu)'" value="ap-chengdu" />
              <el-option :label="t('superPanel.config.translation.regionHongkong') + ' (ap-hongkong)'" value="ap-hongkong" />
              <el-option :label="t('superPanel.config.translation.regionSingapore') + ' (ap-singapore)'" value="ap-singapore" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.config.translation.projectId') }}
                <el-tooltip :content="t('superPanel.config.translation.projectIdTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-input-number v-model="config.tencent.projectId" :min="0" :max="999999" style="width: 200px" />
          </el-form-item>

          <el-form-item>
            <el-button type="warning" :loading="testing" @click="handleTest">
              <el-icon><Connection /></el-icon>&nbsp;{{ t('superPanel.config.translation.testConfig') }}
            </el-button>
            <div v-if="testResult" class="test-result">
              <div class="test-result-main">
                <el-icon :style="{ color: testResult.success ? '#67c23a' : '#f56c6c' }">
                  <component :is="testResult.success ? SuccessFilled : CircleCloseFilled" />
                </el-icon>
                <span>{{ testResult.message }}</span>
              </div>
              <div v-if="testResult.success && testResult.translation" class="test-result-detail">
                <span class="translation-source">{{ testResult.translation.source }}</span>
                <el-icon class="translation-arrow"><ArrowRight /></el-icon>
                <span class="translation-target">{{ testResult.translation.target }}</span>
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- 已存在的语言 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Collection /></el-icon>
            {{ t('superPanel.config.translation.existingLangs') }}
          </div>
          <div class="lang-list">
            <el-tag v-for="lang in langList" :key="lang.langCode" size="small" class="lang-tag">
              <SvgIcon :icon-class="lang.flag || 'global'" class-name="lang-flag-tag" /> {{ lang.autonym }} ({{ lang.langCode }})
            </el-tag>
          </div>
        </div>

        <!-- 说明 -->
        <div class="form-section">
          <el-alert :title="t('superPanel.config.translation.tipTitle')" :description="t('superPanel.config.translation.tipContent')" type="info" :closable="false" show-icon />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 翻译服务配置：启用开关 + 腾讯云密钥 + 连通性测试
 * @author GooHv
 */
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from '@/composables/useI18n'
import { showError, showSuccess } from '@/utils/ui/feedback'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {
  requestGetTranslationConfigApi,
  requestSaveTranslationConfigApi,
  requestTestTranslationConfigApi,
  requestGetLanguagesApi
} from '@/api'
import {
  Connection,
  Refresh,
  Check,
  Setting,
  Cloudy,
  QuestionFilled,
  SuccessFilled,
  CircleCloseFilled,
  ArrowRight,
  Collection
} from '@element-plus/icons-vue'

const { t } = useI18n()

interface LangItem {
  langCode: string
  autonym: string
  flag?: string
}
interface TranslationResult {
  source: string
  target: string
}
interface TestResult {
  success: boolean
  message: string
  translation: TranslationResult | null
}

interface TencentConfig {
  secretId: string
  secretKey: string
  region: string
  projectId: number
}
interface TranslationConfig {
  enabled: boolean
  provider: string
  masterLanguage: string
  languageDisplayField: string
  tencent: TencentConfig
}

const configFormRef = ref<FormInstance>()
const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const testResult = ref<TestResult | null>(null)
const langList = ref<LangItem[]>([])

const config = reactive<TranslationConfig>({
  enabled: false,
  provider: 'tencent',
  masterLanguage: 'zh-CN',
  languageDisplayField: 'autonym',
  tencent: { secretId: '', secretKey: '', region: 'ap-guangzhou', projectId: 0 }
})

const rules = reactive<FormRules>({
  'tencent.secretId': [{ required: true, message: t('superPanel.config.translation.secretIdRequired'), trigger: 'blur' }],
  'tencent.secretKey': [{ required: true, message: t('superPanel.config.translation.secretKeyRequired'), trigger: 'blur' }]
})

function loadLangList(): void {
  requestGetLanguagesApi().then((res: any) => {
    langList.value = (res.data as LangItem[]) || []
  }).catch((err: unknown) => {
    console.error('[TranslationConfig] 加载语言清单失败:', err)
  })
}

async function loadConfig(): Promise<void> {
  loading.value = true
  try {
    const res: any = await requestGetTranslationConfigApi()
    if (res.data) {
      config.enabled = res.data.enabled
      config.provider = res.data.provider
      config.masterLanguage = res.data.masterLanguage || 'zh-CN'
      config.languageDisplayField = res.data.languageDisplayField || 'autonym'
      config.tencent = { ...res.data.tencent }
    }
  } catch (err) {
    console.error('[TranslationConfig] 加载翻译配置失败:', err)
    showError(t('superPanel.config.translation.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function handleSave(): Promise<void> {
  if (!configFormRef.value) return
  const valid = await configFormRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    await requestSaveTranslationConfigApi(config)
    showSuccess(t('superPanel.config.translation.saveSuccess'))
    testResult.value = null
  } catch (err: any) {
    showError(err.message || t('superPanel.config.translation.saveFailed'))
  } finally {
    saving.value = false
  }
}

async function handleTest(): Promise<void> {
  testing.value = true
  testResult.value = null
  try {
    await requestSaveTranslationConfigApi(config)
    const res: any = await requestTestTranslationConfigApi()
    const data = res.data || {}
    let translation: TranslationResult | null = null
    if (data.success && data.result) {
      const targetText = data.result.target || data.result.TargetText || ''
      const sourceText = data.result.source || t('superPanel.config.translation.testDefaultSource')
      if (targetText) translation = { source: sourceText, target: targetText }
    }
    testResult.value = {
      success: data.success,
      message: data.success ? t('superPanel.config.translation.testSuccess') : t('superPanel.config.translation.testFailed'),
      translation
    }
  } catch (err) {
    console.error('[TranslationConfig] 测试翻译失败:', err)
    testResult.value = {
      success: false,
      message: t('superPanel.config.translation.testFailed'),
      translation: null
    }
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  loadConfig()
  loadLangList()
})
</script>

<style scoped>
.translation-config-panel { padding: 20px; }
.translation-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #ebeef5; }
.toolbar-left { display: flex; align-items: center; gap: 12px; }
.panel-title { font-size: 16px; font-weight: 600; color: #303133; display: flex; align-items: center; gap: 8px; }
.panel-title .el-icon { color: #409eff; font-size: 18px; }
.status-tag { margin-left: 8px; }
.config-form-wrapper { background: #fff; border: 1px solid #ebeef5; border-radius: 4px; padding: 24px; }
.config-form { max-width: 800px; }
.form-section { margin-bottom: 32px; }
.form-section:last-child { margin-bottom: 0; }
.section-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #f0f2f5; display: flex; align-items: center; gap: 8px; }
.section-title .el-icon { color: #409eff; }
.label-with-tip { display: inline-flex; align-items: center; gap: 4px; }
.label-tip-icon { color: #c0c4cc; cursor: help; font-size: 14px; transition: color 0.2s; }
.label-tip-icon:hover { color: #409eff; }
.test-result { display: inline-flex; flex-direction: column; gap: 8px; margin-left: 12px; vertical-align: middle; }
.test-result-main { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.test-result-detail { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: #f0f9eb; border: 1px solid #e1f3d8; border-radius: 4px; font-size: 13px; }
.translation-source { color: #606266; font-weight: 500; }
.translation-arrow { color: #67c23a; font-size: 12px; }
.translation-target { color: #67c23a; font-weight: 500; }
.lang-list { display: flex; flex-wrap: wrap; gap: 8px; }
.lang-tag { margin: 0; }
.lang-flag-tag { width: 16px; height: 16px; margin-right: 4px; vertical-align: middle; }
</style>
