<template>
  <div class="page-home-pagination">
    <el-pagination
      :current-page="pageNo"
      :page-size="pageSize"
      :size="size"
      :disabled="disabled"
      :background="background"
      :page-sizes="[6, 8, 10]"
      layout="prev, pager, next, sizes,->,total"
      :total="pageTotal"
      :hide-on-single-page="singlepage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
// 通过 type 引入类型接口
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";
import type { ComponentSize } from "element-plus";
const size = ref<ComponentSize>("large");
const background = ref(true);
const singlepage = ref(true);
const disabled = ref(false);
// 每页条数切换
const handleSizeChange = (val: number) => {
  // 通知父组件修改pageSize
  emit("sizeChange", val);
};
// 页码切换
const handleCurrentChange = (val: number) => {
  // 通知父组件修改pageNo
  emit("change", val);
};

// Props定义示例 设定默认值
const props = withDefaults(
  defineProps<{
    pageNo: number;
    pageSize: number;
    pageTotal: number;
  }>(),
  {
    pageNo: 1,
    pageSize: 10,
    pageTotal: 0
  }
);
// 定义要抛出的事件
const emit = defineEmits(["change", "sizeChange"]);

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
  margin-top: 15px;
  .el-pagination {
    margin-bottom: 15px;
  }
}
</style>
