<template>
  <el-config-provider :locale="elementLocale" :size="globalComponentSize">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
/**
 * 根组件：
 * 1. 绑定 Element Plus 语言包（随 vue-i18n 语言切换）；
 * 2. 全局统一组件尺寸。Element UI(Vue2) 表单控件默认高约 40px，
 *    而 Element Plus(Vue3) default 尺寸仅 32px，直接迁移会导致全站输入框/按钮偏矮，
 *    故在根处统一注入 large（40px），与旧版观感保持一致；紧凑场景（导航栏、表格内）由各组件局部指定 size。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import type { Language } from 'element-plus/es/locale'

const { locale } = useI18n()
const elementLocale = computed<Language>(() => (locale.value === 'en-US' ? en : zhCn))

/** 全局组件尺寸：large = 40px，对齐迁移前 Element UI 默认观感 */
const globalComponentSize = 'large' as const
</script>
