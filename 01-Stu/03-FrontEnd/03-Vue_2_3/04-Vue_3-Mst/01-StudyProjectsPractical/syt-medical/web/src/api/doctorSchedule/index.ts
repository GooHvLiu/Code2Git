// 引入网络请求接口
import { request } from "@/utils";
// 通过 type 引入类型接口
import type { ResponseData } from "@/types/index";
import type { DoctorsScheduleItems } from "@/types/index";

// 通过枚举管理获取 doctor 排版的接口地址
enum API {
  // 获取 doctor 排版 的接口地址
  DOCTOR_URL = "/hosp/hospital/doctor/"
}
// 网络请求，获取 doctor 排版的数据信息
export const reqDoctorSchedule = async (hoscode: string, spccode: string, page: number, limit: number) => {
  const result = await request.get(API.DOCTOR_URL + `${hoscode}/${spccode}/${page}/${limit}`);
  return result.data as ResponseData<DoctorsScheduleItems>;
};
