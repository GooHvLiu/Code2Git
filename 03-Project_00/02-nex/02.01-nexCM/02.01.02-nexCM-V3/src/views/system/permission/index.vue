<template>
  <PermissionConfig
    mode="system"
    :show-super-admin="false"
    :show-super-permissions="false"
    title-key="menu.system.permission.page.title"
    desc-key="menu.system.permission.page.desc"
    save-success-key="menu.system.permission.page.saveSuccess"
  />
</template>

<script setup>
import PermissionConfig from "@/views/permission-core/PermissionConfig.vue";
</script>
