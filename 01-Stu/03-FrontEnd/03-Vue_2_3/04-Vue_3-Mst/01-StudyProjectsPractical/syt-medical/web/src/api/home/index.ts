// 引入网络请求接口
import request from "@/utils/request";
// 通过 type 引入类型接口
import type { ResponseData, HospitalPageResponse } from "@/types/index";

// 通过枚举管理首页 home 模块的接口地址
enum API {
  // 获取已有的医院数据接口地址
  HOSPITAL_URL = "/hosp/hospital/findHospitalPage/"
}
// 通过网络请求获取已有医院数据 : Promise<HospitalPageResponse>
export const reqHospital = async (page: number, limit: number) => {
  const result = await request.get(API.HOSPITAL_URL + `${page}/${limit}`);
  return result.data as ResponseData<HospitalPageResponse>;
};
