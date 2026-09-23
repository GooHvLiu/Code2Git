// 引入网络请求接口
import request from "@/utils/request";
// 通过 type 引入类型接口
import type {
  ResponseData,
  HospitalPageResponse,
  HospitalLevelPageResponse,
  HospitalRegionPageResponse,
  SearchHospitalKeyWordPageResponse
} from "@/types/index";

// 通过枚举管理首页 home 模块的接口地址
enum API {
  // 获取已有 医院数据 的接口地址
  HOSPITAL_URL = "/hosp/hospital/findHospitalPage/",
  // 获取已有医院 等级 的接口地址
  HOSPITAL_Level_URL = "/cmn/dict/findByDictCode/",
  // 获取已有医院 地区 的接口地址
  HOSPITAL_Region_URL = "/cmn/dict/findChildData/",
  // 获取搜索框关键字 医院名查询 的接口地址
  SEARCH_HOSPITAL_KEYWORD_URL = "/hosp/hospital/findByHosname/"
}
// 医院名称清单 数据 hostype / districtCode 不传参默认为空
export const reqHospitalNameList = async (
  page: number,
  limit: number,
  hostype: string = "",
  districtCode: string = ""
) => {
  const result = await request.get(
    API.HOSPITAL_URL + `${page}/${limit}` + "?hostype=" + `${hostype}` + "&districtCode=" + `${districtCode}`
  );
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

// 搜索医院名称关键字
export const reqSearchHospitalKeyWord = async (hosname: string) => {
  const result = await request.get(API.SEARCH_HOSPITAL_KEYWORD_URL + `${hosname}`);
  return result.data as ResponseData<SearchHospitalKeyWordPageResponse>;
};
