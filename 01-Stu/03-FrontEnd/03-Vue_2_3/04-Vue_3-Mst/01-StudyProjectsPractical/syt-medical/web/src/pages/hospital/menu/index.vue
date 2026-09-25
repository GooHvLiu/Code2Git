<template>
  <div class="page-wrap">
    <el-menu :default-active="route.path" @select="handleSelect">
      <div class="menu-topTitle">
        <el-icon color="#58317B"><HomeFilled /></el-icon>
        <el-icon size="0.9rem"><DArrowRight /></el-icon>
        <span>医院信息</span>
      </div>
      <!-- 索引使用完整的路由路径，这样最方便，不用拼串，也可以直接跳转 -->
      <el-menu-item :index="HOSPITAL.PATH + '/' + HOSPITAL.CHILDREN.APPOINTMENT_PATH">
        <el-icon><Service /></el-icon>
        <span>预约挂号</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.PATH + '/' + HOSPITAL.CHILDREN.DETAL_PATH">
        <el-icon><Finished /></el-icon>
        <span>医院详情</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.PATH + '/' + HOSPITAL.CHILDREN.NOTICE_PATH">
        <el-icon><Bell /></el-icon>
        <span>预约须知</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.PATH + '/' + HOSPITAL.CHILDREN.STOP_SERVICE_PATH">
        <el-icon><Timer /></el-icon>
        <span>停诊信息</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.PATH + '/' + HOSPITAL.CHILDREN.SEARCH_CANCEL_PATH">
        <el-icon><Switch /></el-icon>
        <span>查询取消</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Menu" });
// 引入路由 path 常量
import { HOSPITAL } from "@/const/router/index";

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// 导入路由组件
import { useRouter, useRoute } from "vue-router";
// 操作路由
const router = useRouter();
// 读取路由
const route = useRoute();

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
// 点击菜单触发函数
const handleSelect = (key: string) => {
  // console.log(key, keyPath);
  // 使用 router 进行跳转
  router.push({
    path: key,
    query: {
      hoscode: route.query.hoscode
    }
  });
};
</script>

<style scoped lang="less">
.page-wrap {
  .menu-topTitle {
    margin-bottom: 10px;
  }
  .el-menu {
    min-width: 150px;
    .el-menu-item {
      margin-bottom: 10px;
    }
  }
}
</style>
