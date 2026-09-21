<template>
  <PermissionConfig
    mode="super"
    :show-super-admin="true"
    :show-super-permissions="true"
    title-key="layout.menu.superPanel.permission.page.title"
    desc-key="layout.menu.superPanel.permission.page.desc"
    save-success-key="layout.menu.superPanel.permission.page.saveSuccess"
  />
</template>

<script setup lang="ts">
/**
 * 超级管理员权限配置页（薄封装）
 * 实际逻辑位于 permission-core，本页仅按 super 模式传入配置。
 * @author GooHv
 */
import PermissionConfig from '@/views/permission-core/index.vue'
</script>
