<template>
  <div class="page-home-level">
    <h1 class="hospital">医院</h1>
    <div class="level">
      <h1>等级：</h1>
      <ul class="level-list">
        <li :class="{ active: activeString == '0' }" @click="activeString = '0'">全部</li>
        <li
          v-for="hospitalLevel in hospitalLevelArr"
          key="hospitalLevel.name"
          :class="{ active: activeString == hospitalLevel.value }"
          @click="changeActive(hospitalLevel.value)"
        >
          {{ hospitalLevel.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Level" });
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref, onMounted } from "vue";
// 导入网络请求 API
import { reqHospitalLevelList } from "@/api/home";
// 导入类型定义
import type { ResponseData } from "@/types/api";
import type { HospitalLevelPageResponse } from "@/types/index";
// 引入网络请求后台网址参数常量
import { hospitalLevelDictCode } from "@/const/index";

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// 创建 医院等级 存储变量数组
let hospitalLevelArr = ref<HospitalLevelPageResponse>([]);
// 创建动态类名字符串变量
let activeString = ref<string>("0");
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
onMounted(() => {
  // 通过网络请求获取医院等级数据
  getHospitalLevel();
});
// 获取医院等级 的函数
const getHospitalLevel = async () => {
  // 通过网络请求获取医院等级数据
  const result = (await reqHospitalLevelList(hospitalLevelDictCode)) as ResponseData<HospitalLevelPageResponse>;
  // 当获取的数据code为200时
  if (result.code === 200) {
    // 将后端获取到的数据给到hospitalLevel
    hospitalLevelArr.value = result.data;
    // console.log("当前获取的医院等级@@:", hospitalLevelArr.value);
  }
};
// 点击后 更改 动态类名存储字符串内容
const changeActive = (selectedItem: string) => {
  // 将当前选中的 item 中的 value 存储在动态类名字符串变量，item.value 是唯一的
  activeString.value = selectedItem;
  // console.log("当前点击等级value@@:", activeString.value);
};
</script>

<style scoped lang="less">
.page-home-level {
  color: #a9a9a9;
  font-weight: 900;
  .hospital {
    margin: 10px 0;
  }
  .level {
    display: flex;
    margin-top: 15px;
    h1 {
      width: 60px;
    }
    .level-list {
      display: flex;
      li {
        margin-right: 15px;
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
