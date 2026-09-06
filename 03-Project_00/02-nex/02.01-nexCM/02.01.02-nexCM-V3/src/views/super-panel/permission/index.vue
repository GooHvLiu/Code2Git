<template>
  <PermissionConfig
    mode="super"
    :show-super-admin="true"
    :show-super-permissions="true"
    title-key="menu.superPanel.permission.page.title"
    desc-key="menu.superPanel.permission.page.desc"
    save-success-key="menu.superPanel.permission.page.saveSuccess"
  />
</template>

<script setup>
import PermissionConfig from "@/views/permission-core/PermissionConfig.vue";
</script>
