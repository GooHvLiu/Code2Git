// 引入网络请求接口
import request from "@/utils/request";
// 通过 type 引入类型接口
import type {
  ResponseData,
  HospitalPageResponse,
  HospitalLevelPageResponse,
  HospitalRegionPageResponse
} from "@/types/index";

// 通过枚举管理首页 home 模块的接口地址
enum API {
  // 获取已有的医院数据接口地址
  HOSPITAL_URL = "/hosp/hospital/findHospitalPage/",
  HOSPITAL_Level_URL = "/cmn/dict/findByDictCode/",
  HOSPITAL_Region_URL = "/cmn/dict/findChildData/"
}
// 医院名称清单 数据
export const reqHospitalNameList = async (page: number, limit: number) => {
  const result = await request.get(API.HOSPITAL_URL + `${page}/${limit}`);
  return result.data as ResponseData<HospitalPageResponse>;
};

// 医院等级 数据
export const reqHospitalLevelList = async (dictCode: string) => {
  const result = await request.get(API.HOSPITAL_Level_URL + `${dictCode}`);
  return result.data as ResponseData<HospitalLevelPageResponse>;
};

// 医院区域数据
export const reqHospitalRegionList = async (dictCode: number) => {
  const result = await request.get(API.HOSPITAL_Region_URL + `${dictCode}`);
  return result.data as ResponseData<HospitalRegionPageResponse>;
};
