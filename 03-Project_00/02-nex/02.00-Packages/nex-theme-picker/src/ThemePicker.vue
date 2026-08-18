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
          <div class="panel-title">蹇嵎鑿滃崟</div>

          <div
            v-for="item in menuItems"
            :key="item.key"
            class="menu-item"
            @click="openPanel(item.key)"
          >
            <span class="menu-icon" :style="{ color: item.color }">
              <i :class="item.icon"></i>
            </span>
            <span class="menu-label">{{ item.label }}</span>
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
            <span class="panel-title">涓婚璋冭壊</span>
            <i
              class="el-icon-refresh reset-btn"
              @click="handleResetAll"
              title="鎭㈠鍏ㄩ儴榛樿"
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
                <span>{{ field.label }}</span>
                <span class="field-actions">
                  <span
                    class="color-preview"
                    :style="{ background: getFieldValue(field.key) }"
                  ></span>
                  <i
                    class="el-icon-refresh field-reset"
                    @click="handleResetField(field.key)"
                    title="鎭㈠榛樿"
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
                  :class="{ active: getFieldValue(field.key) === color }"
                  @click="handlePick(field.key, color)"
                >
                  <i
                    v-if="getFieldValue(field.key) === color"
                    class="el-icon-check"
                  ></i>
                </div>
              </div>

              <!-- 鑷畾涔夐鑹?-->
              <div class="custom-color">
                <span>鑷畾涔?/span>
                <input
                  type="color"
                  class="color-input"
                  :value="getFieldValue(field.key)"
                  @input="handlePick(field.key, $event.target.value)"
                />
                <span class="color-hex">{{ getFieldValue(field.key) }}</span>
              </div>
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

<script>
/* eslint-disable vue/multi-word-component-names */
import {
  THEME_FIELDS,
  setThemeField,
  getThemeField,
  resetAllTheme,
  resetThemeField,
} from "./theme";

export default {
  name: "ThemePicker",
  data() {
    return {
      /** 闈㈡澘鏄剧ず鐘舵€?*/
      visible: false,
      /** 褰撳墠婵€娲荤殑瀛愰潰鏉匡紙null 琛ㄧず鑿滃崟鍒楄〃锛?*/
      activePanel: null,
      /** 鍙厤缃殑涓婚瀛楁锛堜粠 theme.js 缁熶竴瀵煎叆锛?*/
      themeFields: THEME_FIELDS,
      /** 鍝嶅簲寮忓瓨鍌ㄥ綋鍓嶉鑹诧紙瑙ｅ喅 localStorage 鍙樺寲涓嶈Е鍙戞覆鏌撶殑闂锛?*/
      currentColors: {},
      /**
       * 蹇嵎鑿滃崟閰嶇疆
       * key: 闈㈡澘鏍囪瘑锛屽搴?activePanel
       * label: 鑿滃崟鏄剧ず鏂囧瓧
       * icon: 鍥炬爣绫诲悕
       * color: 鍥炬爣棰滆壊
       * 鍚庣画澧炲姞鍔熻兘鍙渶鍦ㄦ鏁扮粍涓姞椤癸紝骞跺湪妯℃澘涓鍔犲搴旈潰鏉?
       */
      menuItems: [
        {
          key: "palette",
          label: "涓婚璋冭壊",
          icon: "el-icon-brush",
          color: "#409eff",
        },
        // 鍚庣画鍔熻兘绀轰緥锛?
        // { key: 'layout', label: '甯冨眬璁剧疆', icon: 'el-icon-setting', color: '#67c23a' },
        // { key: 'language', label: '璇█鍒囨崲', icon: 'el-icon-language', color: '#e6a23c' }
      ],
      /** 棰勮棰滆壊鍒楄〃锛堢粺涓€灏忓啓渚夸簬姣旇緝锛?*/
      presetColors: [
        "#faf7f2",
        "#ffffff",
        "#808080",
        "#49c3ce",
        "#67c23a",
        "#e6a23c",
        "#f56c6c",
        "#9c27b0",
      ],
    };
  },
  mounted() {
    // 鍒濆鍖栧搷搴斿紡棰滆壊鐘舵€?
    this.themeFields.forEach((field) => {
      this.$set(this.currentColors, field.key, getThemeField(field.key));
    });
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    /** 鍒囨崲鑿滃崟鏄剧ず */
    toggleMenu() {
      this.visible = !this.visible;
      // 鍏抽棴鏃堕噸缃埌鑿滃崟鍒楄〃
      if (!this.visible) {
        this.activePanel = null;
      }
    },
    /** 鎵撳紑瀛愰潰鏉?*/
    openPanel(key) {
      this.activePanel = key;
    },
    /** 鑾峰彇瀛楁褰撳墠棰滆壊鍊?*/
    /** 鑾峰彇瀛楁褰撳墠棰滆壊鍊硷紙浠庡搷搴斿紡鐘舵€佽鍙栵級 */
    getFieldValue(key) {
      return this.currentColors[key] || "";
    },
    /** 閫夋嫨棰滆壊 */
    /** 閫夋嫨棰滆壊 */
    handlePick(key, color) {
      setThemeField(key, color);
      this.$set(this.currentColors, key, color.toLowerCase());
      this.$emit("change", { key, color });
    },
    /** 鎭㈠鍏ㄩ儴榛樿 */
    /** 鎭㈠鍏ㄩ儴榛樿 */
    handleResetAll() {
      resetAllTheme();
      this.themeFields.forEach((field) => {
        this.$set(this.currentColors, field.key, field.default.toLowerCase());
      });
      this.$emit("reset");
    },
    /** 鎭㈠鍗曚釜瀛楁榛樿 */
    handleResetField(key) {
      resetThemeField(key);
      const field = this.themeFields.find((f) => f.key === key);
      if (field) {
        this.$set(this.currentColors, key, field.default.toLowerCase());
      }
      this.$emit("reset-field", key);
    },
    /** 鐐瑰嚮澶栭儴鍏抽棴 */
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.visible = false;
        this.activePanel = null;
      }
    },
  },
};
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
</style>
