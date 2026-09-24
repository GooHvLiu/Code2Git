// 本文件是 医院详情 / hospitalDetail 用于状态管理的文件
import { defineStore } from "pinia";
import { ref } from "vue";
// 引入 类型定义
import type { ResponseData } from "@/types/api";
import type { HospitalDetailItem } from "@/types/index";
// 引入网络请求标准API
import { reqHospitalDetailInfo } from "@/api/hospital/index";

// 创建医院详情状态存储
export const useHospitalDetailStore = defineStore("HospitalDetail", () => {
  // =============== State
  // 用于存储医院详细数据的 State 变量 hospitalDetailInfo
  let hospitalDetailInfo = ref<HospitalDetailItem | null>(null);

  // =============== Actions
  // 通过网络请求获取医院详细数据的 Actions 方法 getHospitalDetailInfo
  const getHospitalDetailInfo = async (hoscode: string) => {
    // 将获取的结果保存
    const result = (await reqHospitalDetailInfo(hoscode)) as ResponseData<HospitalDetailItem>;
    // 获取的结果数据 code 代码 ==200时再处理
    if (result.code == 200) {
      // 将实际获取数据保存到 State 变量中
      hospitalDetailInfo.value = result.data;
      console.log("Pinia获取到的医院详情数据：", hospitalDetailInfo.value);
    }
  };
  // =============== Getters
  return { hospitalDetailInfo, getHospitalDetailInfo };
});
