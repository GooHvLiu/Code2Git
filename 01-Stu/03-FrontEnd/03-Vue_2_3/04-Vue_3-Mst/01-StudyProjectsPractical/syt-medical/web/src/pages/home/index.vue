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
        <Level @change-level="handleChangeLevel" />
        <!-- 医院地区 组件 -->
        <Regin @change-region="handleChangeRegion" />
        <!-- 医院卡片 组件 -->
        <div class="hospital-card">
          <Card class="card-item" v-for="item in hasHospitalArr" :key="item.id" :hospital-item="item" />
        </div>
        <!-- 分页器 组件 -->
        <Pagination
          :page-no="pageNo"
          :page-size="pageSize"
          :page-total="pageTotalData"
          @change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </el-col>
      <el-col :span="4"> 第2列 </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Home" });
// 通过 type 引入类型接口
import type { ResponseData } from "@/types/api";
import type { HospitalItem, HospitalPageResponse } from "@/types/index";
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
// 导入 网络请求 API
import { reqHospitalNameList } from "@/api/home";
// 导入 onmounted()生命周期钩子
import { ref, onMounted } from "vue";
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 已有医院数组存储 通过使用自定义的接口定义，可以在 v-for 中使用内部的id变量
const hasHospitalArr = ref<HospitalItem[]>([]);
// 分页器当前页码
const pageNo = ref<number>(1);
// 分页器 1 页展示数量
const pageSize = ref<number>(10);
// 分页器 数据 总数量
const pageTotalData = ref<number>(0);
// 医院 等级 字符串代码
const hospitalLevel = ref<string>("");
// 医院 地区 字符串代码
const hospitalRegion = ref<string>("");

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
onMounted(() => {
  // 通过调用网络请求 API 接口获取已存在的医院数据
  getHospitalInfo();
  // console.log("获取到的医院数据：", hospHavedData);
});
// 获取已有医院的数据函数
const getHospitalInfo = async () => {
  const result = (await reqHospitalNameList(
    pageNo.value,
    pageSize.value,
    hospitalLevel.value,
    hospitalRegion.value
  )) as ResponseData<HospitalPageResponse>;
  // 当从后台获取数据成功之后
  if (result.code === 200) {
    // 将获取到的医院数据给到 hasHospitalArr
    hasHospitalArr.value = result.data.content;
    // console.log("当前获取到的医院数据：", hasHospitalArr.value);

    // 将获取到的医院数据中的医院总数给到 pageTotalData
    pageTotalData.value = result.data.totalElements;
    // console.log("当前获取到的医院数据：", pageTotalData.value);
  }
};
// 页码变更之后，子组件通过 emit 触发页码变更函数
const handlePageChange = (newPage: number) => {
  pageNo.value = newPage;
  // 重新网络请求数据更新
  getHospitalInfo();
};
// 每页显示数量变更之后，子组件通过 emit 触发每页显示数量变更函数
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  // 切换每页条数，重置为第一页
  pageNo.value = 1;
  // 重新网络请求数据更新
  getHospitalInfo();
};
// 当用户点击医院等级后进行数据重新加载
const handleChangeLevel = (newLevel: string) => {
  // 如果用户点击的还是全部
  if (newLevel == "0") {
    // 判断当前显示是否是全部，如果不是全部，则显示全部
    if (hospitalLevel.value != "") {
      hospitalLevel.value = "";
      getHospitalInfo();
    }
  }
  // 如果用户点击的不是全部
  else {
    // 判断当前点击的与目前选中的是不是同一个，如果不是，则赋值并获取数据
    if (newLevel != hospitalLevel.value) {
      hospitalLevel.value = newLevel;
      getHospitalInfo();
    }
  }
};
// 当用户点击医院地区后进行数据重新加载
const handleChangeRegion = (newRegion: string) => {
  // 如果用户点击的还是全部
  if (newRegion == "0") {
    // 判断当前显示是否是全部，如果不是全部，则显示全部
    if (hospitalRegion.value != "") {
      hospitalRegion.value = "";
      getHospitalInfo();
    }
  }
  // 如果用户点击的不是全部
  else {
    // 判断当前点击的与目前选中的是不是同一个，如果不是，则赋值并获取数据
    if (newRegion != hospitalRegion.value) {
      hospitalRegion.value = newRegion;
      getHospitalInfo();
    }
  }
};
</script>

<style scoped lang="less">
.hospital-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
</style>
