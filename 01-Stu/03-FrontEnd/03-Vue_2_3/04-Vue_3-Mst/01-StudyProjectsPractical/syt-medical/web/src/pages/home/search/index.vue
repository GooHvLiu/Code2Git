<template>
  <div class="page-home-search">
    <div class="search-bar">
      <el-autocomplete
        v-model="searchKeyWord"
        :fetch-suggestions="keyWordSearch"
        :trigger-on-focus="false"
        clearable
        class="search-form"
        placeholder="请输入医院名称"
        @select="handleSelect"
        size="large"
      />
      <el-button type="primary" :icon="Search" size="large">搜索</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Search" });
import { Search } from "@element-plus/icons-vue";
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";
// 导入类型定义
import type { ResponseData } from "@/types/api";
import type { SearchHospitalKeyWordPageResponse } from "@/types/index";
// 导入网络请求函数
import { reqSearchHospitalKeyWord } from "@/api/home/index";
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOSPITAL_PATH } from "@/const/index";

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 用户输入的关键词
const searchKeyWord = ref<string>("");

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})

// 用户输入关键字后进行后台数据获取
const keyWordSearch = async (keyWord: string, cb: any) => {
  // console.log("keyWord", keyWord);
  // 通过用户输入关键字后进行后台数据获取
  const result = (await reqSearchHospitalKeyWord(keyWord)) as ResponseData<SearchHospitalKeyWordPageResponse>;
  // 当返回数据的 code 为200时
  if (result.code == 200) {
    let showData = result.data.map((item) => {
      return {
        value: item.hosname,
        hoscode: item.hoscode
      };
    });
    // 搜索框下选内容的回调函数
    cb(showData);
  }
};
// 当用户选中搜索框下选项内容时被触发
const handleSelect = (hoscode: string) => {
  // 通过路由跳转到医院详情页面 query: { hoscode }
  router.push({ path: HOSPITAL_PATH });
};
</script>

<style scoped lang="less">
.page-home-search {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .search-bar {
    width: 600px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
</style>
