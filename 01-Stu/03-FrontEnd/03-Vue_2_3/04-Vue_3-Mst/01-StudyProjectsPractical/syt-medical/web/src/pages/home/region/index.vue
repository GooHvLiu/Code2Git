<template>
  <div class="page-home-region">
    <div class="region">
      <h1>地区：</h1>
      <ul class="region-list">
        <li :class="{ active: activeString === '0' }" @click="activeString = '0'">全部</li>
        <li
          v-for="hospitalRegion in hospitalRegionArr"
          key="hospitalRegion.id"
          :class="{ active: activeString == hospitalRegion.value }"
          @click="changeActive(hospitalRegion.value)"
        >
          {{ hospitalRegion.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Region" });
// import { ref, reactive, computed, watch, onMounted } from 'vue'
// 引入生命周期函数onMounted
import { ref, onMounted } from "vue";
// 引入类型变量定义
import type { ResponseData } from "@/types/api";
import type { HospitalRegionPageResponse } from "@/types/hospital";
// 引入 网络请求 网址参数
import { provinceCode } from "@/const/index";
// 引入网络请求函数
import { reqHospitalRegionList } from "@/api/home/index";

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// 创建 医院地区 存储变量数组
const hospitalRegionArr = ref<HospitalRegionPageResponse>([]);
// 创建动态类名字符串变量
let activeString = ref<string>("0");
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
onMounted(() => {
  getHospitalRegion();
});
// 获取医院区域数据的函数
const getHospitalRegion = async () => {
  const result = (await reqHospitalRegionList(provinceCode)) as ResponseData<HospitalRegionPageResponse>;
  // 当获取的数据code为200时
  if (result.code === 200) {
    // 将数据存入hospitalRegionArr
    hospitalRegionArr.value = result.data;
    // console.log("获取到的医院地区数据@@：", hospitalRegionArr.value);
  }
};
// 点击后 更改 动态类名存储字符串内容
const changeActive = (selectedItem: string) => {
  // 将当前选中的 item 中的 value 存储在动态类名字符串变量，item.value 是唯一的
  activeString.value = selectedItem;
  // console.log("当前点击地区value@@:", activeString.value);
};
</script>

<style scoped lang="less">
.page-home-region {
  color: #a9a9a9;
  font-weight: 900;
  .region {
    display: flex;
    margin-top: 15px;
    h1 {
      margin-top: 10px;
      width: 69px;
    }
    .region-list {
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 15px;
        margin-top: 10px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
