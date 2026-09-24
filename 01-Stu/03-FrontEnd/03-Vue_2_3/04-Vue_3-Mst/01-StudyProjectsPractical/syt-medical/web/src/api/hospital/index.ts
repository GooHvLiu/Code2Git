// 引入网络请求接口
import request from "@/utils/request";

// 通过 type 引入类型接口定义
import type { ResponseData } from "@/types/api";
import type { HospitalDetailItem } from "@/types/index";

// 通过枚举管理医院详情 HospitalDetail 模块的接口地址
enum API {
  // 获取 医院详情 的接口地址
  HOSPITAL_DETAIL_URL = "hosp/hospital/findHospitalDetail/"
}

// 医院详情 网络请求函数
export const reqHospitalDetailInfo = async (hoscode: string) => {
  const result = await request.get(API.HOSPITAL_DETAIL_URL + hoscode);
  return result.data as ResponseData<HospitalDetailItem>;
};
