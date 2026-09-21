<template>
  <PermissionConfig
    mode="system"
    :show-super-admin="false"
    :show-super-permissions="false"
    title-key="system.permission.page.title"
    desc-key="system.permission.page.desc"
    save-success-key="system.permission.page.saveSuccess"
  />
</template>

<script setup lang="ts">
/**
 * 系统设置 - 权限配置入口（复用 permission-core）
 * 作者：GooHv
 */
import PermissionConfig from '@/views/permission-core/index.vue'
</script>
