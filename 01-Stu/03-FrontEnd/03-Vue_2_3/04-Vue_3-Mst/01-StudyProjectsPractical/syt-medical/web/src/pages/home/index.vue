<template>
  <div class="page-wrap">
    <!-- 轮播图 组件 -->
    <Carousel />
    <!-- 搜索框+搜索按钮 组件 -->
    <Search />
    <!-- 医院等级 + 医院地区 + 医院卡片 + 分页器 组件 -->
    <el-row>
      <el-col :span="20">
        <!-- 医院等级 组件 -->
        <Level />
        <!-- 医院地区 组件 -->
        <Regin />
        <!-- 医院卡片 组件 -->
        <Card />
        <!-- 分页器 组件 -->
        <Pagination />
      </el-col>
      <el-col :span="4"> 第2列 </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入轮播图组件
import Carousel from "@/pages/home/carousel/index.vue";
// 导入搜索框+按钮组件
import Search from "@/pages/home/search/index.vue";
// 导入等级组件
import Level from "@/pages/home/level/index.vue";
// 导入地区组件
import Regin from "@/pages/home/region/index.vue";
// 导入医院卡片组件
import Card from "@/pages/home/card/index.vue";
// 导入分页器组件
import Pagination from "@/pages/home/pagination/index.vue";
// import { ref, reactive, computed, watch, onMounted } from 'vue'

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

<style scoped lang="less"></style>
