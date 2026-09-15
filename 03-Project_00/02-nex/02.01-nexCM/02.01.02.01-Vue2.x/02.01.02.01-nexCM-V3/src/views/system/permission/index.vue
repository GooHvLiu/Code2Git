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

<script setup>
import PermissionConfig from "@/views/permission-core/index.vue";
</script>
