<template>
  <!--
    快捷设置入口（主题调色 + 语言切换）
    结构：加号按钮 → 下拉面板 → 各功能面板（当前调色板 / 语言）
    用法（挂在 Navbar 右侧）：<theme-picker />
  -->
  <div ref="rootRef" class="quick-menu">
    <!-- 加号触发按钮 -->
    <div class="quick-trigger" :class="{ active: visible }" @click="toggleMenu">
      <el-icon><Plus /></el-icon>
    </div>

    <!-- 下拉面板 -->
    <transition name="fade">
      <div v-show="visible" class="quick-panel" @click.stop>
        <!-- 第一层：菜单列表 -->
        <div v-if="!activePanel" class="menu-list">
          <div class="panel-title">{{ t('layout.quickMenu.title') }}</div>

          <div v-for="item in menuItems" :key="item.key" class="menu-item" @click="openPanel(item.key)">
            <span class="menu-icon" :style="{ color: item.color }">
              <svg-icon v-if="item.key === 'language'" :icon-class="currentLangFlag" class="menu-flag-icon" />
              <el-icon v-else><component :is="item.icon" /></el-icon>
            </span>
            <span class="menu-label">
              {{ item.key === 'language' ? currentLangAutonym : item.label }}
            </span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- 第二层：主题调色面板 -->
        <div v-else-if="activePanel === 'palette'" class="palette-panel">
          <div class="panel-header">
            <el-icon class="back-btn" @click="activePanel = null"><ArrowLeft /></el-icon>
            <span class="panel-title">{{ t('layout.quickMenu.theme.palette') }}</span>
            <el-icon class="reset-btn" :title="t('layout.quickMenu.theme.resetAll')" @click="handleResetAll">
              <Refresh />
            </el-icon>
          </div>

          <div class="palette-content">
            <div v-for="field in themeFields" :key="field.key" class="field-group">
              <div class="field-label">
                <span>{{ t('layout.quickMenu.theme.' + field.key) }}</span>
                <span class="field-actions">
                  <span class="color-preview" :style="{ background: currentColors[field.key] }"></span>
                  <el-icon
                    class="field-reset"
                    :title="t('layout.quickMenu.theme.reset')"
                    @click="handleResetField(field.key)"
                  >
                    <Refresh />
                  </el-icon>
                </span>
              </div>

              <!-- 预设颜色 -->
              <div class="color-list">
                <div
                  v-for="color in presetColors"
                  :key="color"
                  class="color-item"
                  :style="{ background: color }"
                  :class="{ active: currentColors[field.key] === color.toLowerCase() }"
                  @click="handlePick(field.key, color)"
                >
                  <el-icon v-if="currentColors[field.key] === color.toLowerCase()" class="active-check"
                    ><Check
                  /></el-icon>
                </div>
              </div>

              <!-- 自定义颜色 -->
              <div class="custom-color">
                <span>{{ t('layout.quickMenu.theme.custom') }}</span>
                <input
                  type="color"
                  class="color-input"
                  :value="currentColors[field.key]"
                  @input="handlePick(field.key, ($event.target as HTMLInputElement).value)"
                />
                <span class="color-hex">{{ currentColors[field.key] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 语言切换面板 -->
        <div v-else-if="activePanel === 'language'" class="language-panel">
          <div class="panel-header">
            <el-icon class="back-btn" @click="activePanel = null"><ArrowLeft /></el-icon>
            <span class="panel-title">{{ t('layout.quickMenu.language.title') }}</span>
          </div>
          <div class="language-list">
            <div
              v-for="lang in languages"
              :key="lang.value"
              class="language-item"
              :class="{ active: currentLang === lang.value }"
              @click="handleSwitchLang(lang.value)"
            >
              <svg-icon :icon-class="lang.flag || 'global'" class="lang-flag-icon" />
              <span class="lang-label">{{ lang.autonym }}</span>
              <el-icon v-if="currentLang === lang.value" class="lang-check"><Check /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * 快捷设置：主题调色 + 语言切换
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import { Plus, Brush, Tools, ArrowRight, ArrowLeft, Refresh, Check } from '@element-plus/icons-vue'
import { THEME_FIELDS, setThemeField, getThemeField, resetAllTheme, resetThemeField } from '@/utils/ui/theme'
import { dynamicLanguages, setLanguage, loadLanguageList } from '@/i18n'
import type { DynamicLanguage } from '@/i18n'
import { showSuccess, showError } from '@/utils/ui/feedback'

defineOptions({ name: 'ThemePicker' })

const emit = defineEmits<{
  (e: 'change', payload: { key: string; color: string }): void
  (e: 'reset'): void
  (e: 'reset-field', key: string): void
}>()

const { t, locale } = useI18n()

const rootRef = ref<HTMLElement>()
const visible = ref(false)
const activePanel = ref<string | null>(null)

const themeFields = THEME_FIELDS
const currentColors = reactive<Record<string, string>>(Object.fromEntries(themeFields.map(f => [f.key, ''])))
const languages = ref<DynamicLanguage[]>([...dynamicLanguages])

const presetColors = ['#faf7f2', '#ffffff', '#808080', '#49c3ce', '#67c23a', '#e6a23c', '#f56c6c', '#9c27b0']

const currentLang = computed(() => locale.value)

const currentLangAutonym = computed(() => {
  const lang = languages.value.find(l => l.value === locale.value)
  return lang ? lang.autonym : ''
})

const currentLangFlag = computed(() => {
  const lang = languages.value.find(l => l.value === locale.value)
  return lang ? lang.flag : 'global'
})

interface MenuItem {
  key: string
  label: string
  icon: Component
  color: string
}

const menuItems = computed<MenuItem[]>(() => [
  { key: 'palette', label: t('layout.quickMenu.theme.palette'), icon: Brush, color: '#409eff' },
  { key: 'language', label: t('layout.quickMenu.language.title'), icon: Tools, color: '#e6a23c' }
])

function toggleMenu(): void {
  visible.value = !visible.value
  if (!visible.value) activePanel.value = null
}

function openPanel(key: string): void {
  activePanel.value = key
}

function handlePick(key: string, color: string): void {
  setThemeField(key, color)
  currentColors[key] = color.toLowerCase()
  emit('change', { key, color })
}

function handleResetAll(): void {
  resetAllTheme()
  themeFields.forEach(field => {
    currentColors[field.key] = field.default.toLowerCase()
  })
  emit('reset')
}

function handleResetField(key: string): void {
  resetThemeField(key)
  const field = themeFields.find(f => f.key === key)
  if (field) currentColors[key] = field.default.toLowerCase()
  emit('reset-field', key)
}

function handleClickOutside(e: MouseEvent): void {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    visible.value = false
    activePanel.value = null
  }
}

async function handleSwitchLang(lang: string): Promise<void> {
  Object.keys(localStorage)
    .filter(key => key.startsWith('nex_menu_cache_') || key === 'nex_menu_version')
    .forEach(key => localStorage.removeItem(key))
  const success = await setLanguage(lang)
  if (success) {
    const langInfo = languages.value.find(l => l.value === lang)
    const langName = langInfo ? langInfo.autonym : lang
    showSuccess(t('layout.quickMenu.language.switched', { lang: langName }))
    setTimeout(() => {
      window.location.reload()
    }, 800)
  } else {
    showError(t('layout.quickMenu.language.switchFailed'))
  }
}

onMounted(async () => {
  themeFields.forEach(field => {
    currentColors[field.key] = (getThemeField(field.key) || '').toLowerCase()
  })
  document.addEventListener('click', handleClickOutside)
  try {
    const langList = await loadLanguageList()
    languages.value = [...langList]
  } catch (err) {
    console.error('[ThemePicker] 加载语言列表失败:', err)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="less">
.quick-menu {
  position: relative;
  display: inline-block;

  .quick-trigger {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: @text-secondary;
    font-size: 18px;
    font-weight: bold;
    transition: color @transition-duration;

    &:hover,
    &.active {
      color: var(--color-primary);
    }
  }

  .quick-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: @bg-white;
    border: 1px solid @border-light;
    border-radius: @border-radius-base;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    min-width: 200px;
    overflow: hidden;
  }

  .panel-title {
    font-size: @font-size-base;
    font-weight: 500;
    color: @text-primary;
  }

  .menu-list {
    padding: @spacing-sm 0;

    .panel-title {
      padding: 0 @spacing-md @spacing-sm;
      font-size: @font-size-sm;
      color: @text-placeholder;
      border-bottom: 1px solid @border-lighter;
      margin-bottom: @spacing-xs;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: @spacing-sm @spacing-md;
    cursor: pointer;
    transition: background-color @transition-duration;

    &:hover {
      background-color: @bg-gray;
    }

    .menu-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: @spacing-sm;
      font-size: 16px;

      .menu-flag-icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }

    .menu-label {
      flex: 1;
      font-size: @font-size-base;
      color: @text-primary;
    }

    .menu-arrow {
      color: @text-placeholder;
      font-size: 12px;
    }
  }

  .palette-panel {
    width: 280px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    padding: @spacing-sm @spacing-md;
    border-bottom: 1px solid @border-lighter;

    .back-btn {
      cursor: pointer;
      color: @text-secondary;
      font-size: 16px;
      margin-right: @spacing-sm;
      transition: color @transition-duration;

      &:hover {
        color: var(--color-primary);
      }
    }

    .panel-title {
      flex: 1;
    }

    .reset-btn {
      cursor: pointer;
      color: @text-placeholder;
      font-size: 14px;
      transition: color @transition-duration;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .palette-content {
    max-height: 60vh;
    overflow-y: auto;
    padding: 0 @spacing-md;
  }

  .field-group {
    padding: @spacing-md 0;
    border-bottom: 1px solid @border-lighter;

    &:last-child {
      border-bottom: none;
    }
  }

  .field-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: @font-size-sm;
    color: @text-secondary;
    margin-bottom: @spacing-xs;

    .field-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-preview {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      border: 1px solid @border-light;
    }

    .field-reset {
      font-size: 14px;
      color: @text-placeholder;
      cursor: pointer;
      transition: color @transition-duration;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .color-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: @spacing-xs;
  }

  .color-item {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid @border-lighter;
    transition: transform @transition-duration;

    &:hover {
      transform: scale(1.15);
    }

    &.active {
      box-shadow: 0 0 0 2px var(--color-primary);
    }

    .active-check {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      color: #303133;
      font-size: 10px;
      font-weight: bold;
    }
  }

  .custom-color {
    display: flex;
    align-items: center;
    gap: @spacing-xs;
    font-size: @font-size-xs;
    color: @text-placeholder;

    .color-input {
      width: 24px;
      height: 24px;
      border: none;
      cursor: pointer;
      background: none;
      padding: 0;
    }

    .color-hex {
      font-family: monospace;
      text-transform: uppercase;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.language-panel {
  width: 220px;
}

.language-list {
  padding: @spacing-xs 0;
}

.language-item {
  display: flex;
  align-items: center;
  padding: @spacing-sm @spacing-md;
  cursor: pointer;
  transition: background-color @transition-duration;

  &:hover {
    background-color: @bg-gray;
  }

  &.active {
    background-color: rgba(64, 158, 255, 0.08);
    color: var(--color-primary);
  }

  .lang-flag-icon {
    font-size: 20px;
    margin-right: 12px;
    line-height: 1;
    flex-shrink: 0;
  }

  .lang-label {
    flex: 1;
    font-size: @font-size-base;
  }

  .lang-check {
    color: var(--color-primary);
    font-size: 14px;
  }
}
</style>
