<template>
  <!--
    蹇嵎璁剧疆鍏ュ彛锛堝師 ThemePicker 鎵╁睍锛?
    缁撴瀯锛氬姞鍙锋寜閽?鈫?涓嬫媺鑿滃崟 鈫?鍚勫姛鑳介潰鏉匡紙褰撳墠鍙湁璋冭壊鏉匡紝鍚庣画鍙墿灞曪級

    鐢ㄦ硶锛堟寕鍒?Navbar 鍙充晶锛夛細
    <theme-picker />

    鎵╁睍鏂板姛鑳斤細鍦?menuItems 鏁扮粍涓鍔犻厤缃紝
    骞跺湪妯℃澘涓鍔犲搴旂殑 activePanel 鍒嗘敮鍗冲彲銆?
  -->
  <div class="quick-menu">
    <!-- 鍔犲彿瑙﹀彂鎸夐挳 -->
    <div class="quick-trigger" @click="toggleMenu" :class="{ active: visible }">
      <i class="el-icon-plus"></i>
    </div>

    <!-- 涓嬫媺闈㈡澘 -->
    <transition name="fade">
      <div v-show="visible" class="quick-panel" @click.stop>
        <!-- ========== 绗竴灞傦細鑿滃崟鍒楄〃 ========== -->
        <div v-if="!activePanel" class="menu-list">
          <div class="panel-title">{{ $t("layout.quickMenu.title") }}</div>

          <div
            v-for="item in menuItems"
            :key="item.key"
            class="menu-item"
            @click="openPanel(item.key)"
          >
            <span class="menu-icon" :style="{ color: item.color }">
              <svg-icon v-if="item.key === 'language'" :icon-class="currentLangFlag" class="menu-flag-icon" />
              <i v-else :class="item.icon"></i>
            </span>
            <span class="menu-label">
              {{ item.key === "language" ? currentLangAutonym : item.label }}
            </span>
            <i class="el-icon-arrow-right menu-arrow"></i>
          </div>

          <!-- 鍚庣画鍔熻兘鍦ㄨ繖閲屽姞 menu-item -->
        </div>

        <!-- ========== 绗簩灞傦細涓婚璋冭壊闈㈡澘 ========== -->
        <div v-else-if="activePanel === 'palette'" class="palette-panel">
          <div class="panel-header">
            <i
              class="el-icon-arrow-left back-btn"
              @click="activePanel = null"
            ></i>
            <span class="panel-title">{{ $t("layout.quickMenu.theme.palette") }}</span>
            <i
              class="el-icon-refresh reset-btn"
              @click="handleResetAll"
              :title="$t('layout.quickMenu.theme.resetAll')"
            ></i>
          </div>

          <div class="palette-content">
            <!-- 閬嶅巻鎵€鏈夊彲閰嶇疆瀛楁 -->
            <div
              v-for="field in themeFields"
              :key="field.key"
              class="field-group"
            >
              <div class="field-label">
                <span>{{ $t("layout.quickMenu.theme." + field.key) }}</span>
                <span class="field-actions">
                  <span
                    class="color-preview"
                    :style="{ background: currentColors[field.key] }"
                  ></span>
                  <i
                    class="el-icon-refresh field-reset"
                    @click="handleResetField(field.key)"
                    :title="$t('layout.quickMenu.theme.reset')"
                  ></i>
                </span>
              </div>

              <!-- 棰勮棰滆壊 -->
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

              <!-- 鑷畾涔夐鑹?-->
              <div class="custom-color">
                <span>{{ $t("layout.quickMenu.theme.custom") }}</span>
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

        <!-- ========== 璇█鍒囨崲闈㈡澘 ========== -->
        <div v-else-if="activePanel === 'language'" class="language-panel">
          <div class="panel-header">
            <i
              class="el-icon-arrow-left back-btn"
              @click="activePanel = null"
            ></i>
            <span class="panel-title">{{
              $t("layout.quickMenu.language.title")
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
              <svg-icon :icon-class="lang.flag || 'global'" class="lang-flag-icon" />
              <span class="lang-label">{{ lang.autonym }}</span>
              <i
                v-if="currentLang === lang.value"
                class="el-icon-check lang-check"
              ></i>
            </div>
          </div>
        </div>

        <!-- ========== 鍚庣画鍔熻兘闈㈡澘鍦ㄨ繖閲屽姞 v-else-if ========== -->
        <!-- 渚嬪锛?
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
} from "@/utils/ui/theme";
import { dynamicLanguages, setLanguage, loadLanguageList } from "@/i18n";
import { useI18n } from "@/composables/useI18n";

const { t: $t, i18n } = useI18n();
const { proxy } = getCurrentInstance();
const emit = defineEmits(["change", "reset", "reset-field"]);

// ===== 鍝嶅簲寮忔暟鎹?=====
const visible = ref(false);
const activePanel = ref(null);
const themeFields = THEME_FIELDS;
const currentColors = reactive(
  Object.fromEntries(themeFields.map((f) => [f.key, ""]))
);
const languages = ref([...dynamicLanguages]);
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

// ===== 璁＄畻灞炴€?=====
const currentLang = computed(() => i18n.locale);
const currentLangAutonym = computed(() => {
  const lang = languages.value.find((l) => l.value === i18n.locale);
  return lang ? lang.autonym : "";
});
const currentLangFlag = computed(() => {
  const lang = languages.value.find((l) => l.value === i18n.locale);
  return lang ? lang.flag : "global";
});
const menuItems = computed(() => [
  {
    key: "palette",
    label: $t("layout.quickMenu.theme.palette"),
    icon: "el-icon-brush",
    color: "#409eff",
  },
  {
    key: "language",
    label: $t("layout.quickMenu.language.title"),
    icon: "el-icon-service",
    color: "#e6a23c",
  },
]);

// ===== 鏂规硶 =====
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

async function handleSwitchLang(lang) {
  Object.keys(localStorage)
    .filter(
      (key) => key.startsWith("nex_menu_cache_") || key === "nex_menu_version"
    )
    .forEach((key) => localStorage.removeItem(key));
  const success = await setLanguage(lang);
  if (success) {
    const langInfo = languages.value.find((l) => l.value === lang);
    const langName = langInfo ? langInfo.autonym : lang;
    Message.success($t("layout.quickMenu.language.switched", { lang: langName }));
    setTimeout(() => {
      window.location.reload();
    }, 800);
  } else {
    Message.error($t("layout.quickMenu.language.switchFailed"));
  }
}

// ===== 鐢熷懡鍛ㄦ湡 =====
onMounted(async () => {
  themeFields.forEach((field) => {
    currentColors[field.key] = (getThemeField(field.key) || "").toLowerCase();
  });
  document.addEventListener("click", handleClickOutside);
  // 加载动态语言列表（包含后端管理的语言）
  try {
    const langList = await loadLanguageList();
    languages.value = [...langList];
  } catch (err) {
    console.error("[ThemePicker] 加载语言列表失败:", err);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="less">
.quick-menu {
  position: relative;
  display: inline-block;

  // ---------- 鍔犲彿瑙﹀彂鎸夐挳锛堟棤鍦嗗湀锛?----------
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

  // ---------- 涓嬫媺闈㈡澘 ----------
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

  // ---------- 閫氱敤闈㈡澘鏍囬 ----------
  .panel-title {
    font-size: @font-size-base;
    font-weight: 500;
    color: @text-primary;
  }

  // ---------- 绗竴灞傦細鑿滃崟鍒楄〃 ----------
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

  // ---------- 绗簩灞傦細璋冭壊鏉块潰鏉?----------
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

// ---------- 杩囨浮鍔ㄧ敾 ----------
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// ---------- 璇█鍒囨崲闈㈡澘 ----------
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





