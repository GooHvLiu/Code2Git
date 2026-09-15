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

<script setup>
import PermissionConfig from "@/views/permission-core/index.vue";
</script>
