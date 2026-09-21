<template>
  <div class="page-home-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :size="size"
      :disabled="disabled"
      :background="background"
      :page-sizes="[5, 10, 15]"
      layout="prev, pager, next, sizes,->,total"
      :total="total"
      :hide-on-single-page="singlepage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";
import type { ComponentSize } from "element-plus";
const currentPage = ref(1);
const pageSize = ref(10);
const size = ref<ComponentSize>("large");
const background = ref(true);
const total = ref(200);
const singlepage = ref(true);
const disabled = ref(false);
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-home-pagination {
  .el-pagination {
    margin-bottom: 15px;
  }
}
</style>
