<template>
  <!--
    快捷设置入口（原 ThemePicker 扩展）
    结构：加号按钮 → 下拉菜单 → 各功能面板（当前只有调色板，后续可扩展）

    用法（挂到 Navbar 右侧）：
    <theme-picker />

    扩展新功能：在 menuItems 数组中增加配置，
    并在模板中增加对应的 activePanel 分支即可。
  -->
  <div class="quick-menu">
    <!-- 加号触发按钮 -->
    <div class="quick-trigger" @click="toggleMenu" :class="{ active: visible }">
      <i class="el-icon-plus"></i>
    </div>

    <!-- 下拉面板 -->
    <transition name="fade">
      <div v-show="visible" class="quick-panel" @click.stop>
        <!-- ========== 第一层：菜单列表 ========== -->
        <div v-if="!activePanel" class="menu-list">
          <div class="panel-title">{{ $t("quickMenu.title") }}</div>

          <div
            v-for="item in menuItems"
            :key="item.key"
            class="menu-item"
            @click="openPanel(item.key)"
          >
            <span class="menu-icon" :style="{ color: item.color }">
              <span v-if="item.key === 'language'" class="menu-emoji">🌐</span>
              <i v-else :class="item.icon"></i>
            </span>
            <span class="menu-label">
              {{ item.key === "language" ? currentLangAutonym : item.label }}
            </span>
            <i class="el-icon-arrow-right menu-arrow"></i>
          </div>

          <!-- 后续功能在这里加 menu-item -->
        </div>

        <!-- ========== 第二层：主题调色面板 ========== -->
        <div v-else-if="activePanel === 'palette'" class="palette-panel">
          <div class="panel-header">
            <i
              class="el-icon-arrow-left back-btn"
              @click="activePanel = null"
            ></i>
            <span class="panel-title">{{ $t("quickMenu.theme.palette") }}</span>
            <i
              class="el-icon-refresh reset-btn"
              @click="handleResetAll"
              :title="$t('quickMenu.theme.resetAll')"
            ></i>
          </div>

          <div class="palette-content">
            <!-- 遍历所有可配置字段 -->
            <div
              v-for="field in themeFields"
              :key="field.key"
              class="field-group"
            >
              <div class="field-label">
                <span>{{ $t("quickMenu.theme." + field.key) }}</span>
                <span class="field-actions">
                  <span
                    class="color-preview"
                    :style="{ background: currentColors[field.key] }"
                  ></span>
                  <i
                    class="el-icon-refresh field-reset"
                    @click="handleResetField(field.key)"
                    :title="$t('quickMenu.theme.reset')"
                  ></i>
                </span>
              </div>

              <!-- 预设颜色 -->
              <div class="color-list">
                <div
                  v-for="color in presetColors"
                  :key="color"
                  class="color-item"
                  :style="{ background: color }"
                  :class="{
                    active: currentColors[field.key] === color.toLowerCase(),
                  }"
                  @click="handlePick(field.key, color)"
                >
                  <i
                    v-if="currentColors[field.key] === color.toLowerCase()"
                    class="el-icon-check"
                  ></i>
                </div>
              </div>

              <!-- 自定义颜色 -->
              <div class="custom-color">
                <span>{{ $t("quickMenu.theme.custom") }}</span>
                <input
                  type="color"
                  class="color-input"
                  :value="currentColors[field.key]"
                  @input="handlePick(field.key, $event.target.value)"
                />
                <span class="color-hex">{{ currentColors[field.key] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== 语言切换面板 ========== -->
        <div v-else-if="activePanel === 'language'" class="language-panel">
          <div class="panel-header">
            <i
              class="el-icon-arrow-left back-btn"
              @click="activePanel = null"
            ></i>
            <span class="panel-title">{{
              $t("quickMenu.language.title")
            }}</span>
          </div>
          <div class="language-list">
            <div
              v-for="lang in languages"
              :key="lang.value"
              class="language-item"
              :class="{ active: currentLang === lang.value }"
              @click="handleSwitchLang(lang.value)"
            >
              <span class="lang-flag">{{ lang.flag }}</span>
              <span class="lang-label">{{ lang.autonym }}</span>
              <i
                v-if="currentLang === lang.value"
                class="el-icon-check lang-check"
              ></i>
            </div>
          </div>
        </div>

        <!-- ========== 后续功能面板在这里加 v-else-if ========== -->
        <!-- 例如：
        <div v-else-if="activePanel === 'layout'" class="layout-panel">
          ...
        </div>
        -->
      </div>
    </transition>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { Message } from "element-ui";
import {
  THEME_FIELDS,
  setThemeField,
  getThemeField,
  resetAllTheme,
  resetThemeField,
} from "@/utils/theme";
import { LANGUAGES, setLanguage } from "@/i18n";
import { useI18n } from "@/composables/useI18n";

const { t: $t, i18n } = useI18n();
const { proxy } = getCurrentInstance();
const emit = defineEmits(["change", "reset", "reset-field"]);

// ===== 响应式数据 =====
const visible = ref(false);
const activePanel = ref(null);
const themeFields = THEME_FIELDS;
const currentColors = reactive(
  Object.fromEntries(themeFields.map((f) => [f.key, ""]))
);
const languages = LANGUAGES.map((l) => ({
  ...l,
  flag: l.value === "zh-CN" ? "🇨🇳" : "🇺🇸",
}));
const presetColors = [
  "#faf7f2",
  "#ffffff",
  "#808080",
  "#49c3ce",
  "#67c23a",
  "#e6a23c",
  "#f56c6c",
  "#9c27b0",
];

// ===== 计算属性 =====
const currentLang = computed(() => i18n.locale);
const currentLangAutonym = computed(() => {
  const lang = languages.find((l) => l.value === i18n.locale);
  return lang ? lang.autonym : "";
});
const menuItems = computed(() => [
  {
    key: "palette",
    label: $t("quickMenu.theme.palette"),
    icon: "el-icon-brush",
    color: "#409eff",
  },
  {
    key: "language",
    label: $t("quickMenu.language.title"),
    icon: "el-icon-service",
    color: "#e6a23c",
  },
]);

// ===== 方法 =====
function toggleMenu() {
  visible.value = !visible.value;
  if (!visible.value) {
    activePanel.value = null;
  }
}

function openPanel(key) {
  activePanel.value = key;
}

function handlePick(key, color) {
  setThemeField(key, color);
  currentColors[key] = color.toLowerCase();
  emit("change", { key, color });
}

function handleResetAll() {
  resetAllTheme();
  themeFields.forEach((field) => {
    currentColors[field.key] = field.default.toLowerCase();
  });
  emit("reset");
}

function handleResetField(key) {
  resetThemeField(key);
  const field = themeFields.find((f) => f.key === key);
  if (field) {
    currentColors[key] = field.default.toLowerCase();
  }
  emit("reset-field", key);
}

function handleClickOutside(e) {
  if (!proxy.$el.contains(e.target)) {
    visible.value = false;
    activePanel.value = null;
  }
}

function handleSwitchLang(lang) {
  Object.keys(localStorage)
    .filter(
      (key) => key.startsWith("nex_menu_cache_") || key === "nex_menu_version"
    )
    .forEach((key) => localStorage.removeItem(key));
  setLanguage(lang);
  const msg =
    lang === "zh-CN"
      ? $t("quickMenu.language.switchedToZh")
      : $t("quickMenu.language.switchedToEn");
  Message.success(msg);
  setTimeout(() => {
    window.location.reload();
  }, 800);
}

// ===== 生命周期 =====
onMounted(() => {
  themeFields.forEach((field) => {
    currentColors[field.key] = (getThemeField(field.key) || "").toLowerCase();
  });
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="less">
.quick-menu {
  position: relative;
  display: inline-block;

  // ---------- 加号触发按钮（无圆圈） ----------
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

  // ---------- 下拉面板 ----------
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

  // ---------- 通用面板标题 ----------
  .panel-title {
    font-size: @font-size-base;
    font-weight: 500;
    color: @text-primary;
  }

  // ---------- 第一层：菜单列表 ----------
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

      .menu-emoji {
        font-size: 16px;
        line-height: 1;
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

  // ---------- 第二层：调色板面板 ----------
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

    i {
      display: flex;
      align-items: center;
      justify-content: center;
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

// ---------- 过渡动画 ----------
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// ---------- 语言切换面板 ----------
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

  .lang-flag {
    font-size: 20px;
    margin-right: @spacing-sm;
    line-height: 1;
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
