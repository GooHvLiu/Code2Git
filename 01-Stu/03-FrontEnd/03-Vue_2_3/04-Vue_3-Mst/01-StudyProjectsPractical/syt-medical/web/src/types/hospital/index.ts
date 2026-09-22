// 单条医院名称清单 数据类型
export interface HospitalItem {
  id: string;
  hosname: string;
  hoscode: string;
  hostype: string;
  provinceCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
  logoData: string;
  intro: string;
  route: string;
  status: number;
  bookingRule: {
    cycle: number;
    releaseTime: string;
    stopTime: string;
    quitDay: number;
    quitTime: string;
    rule: string[];
  };
  hostypeString: string;
  provinceString: string;
  cityString: string;
  districtString: string;
}

// 医院名称清单分页接口里 data 的结构
export interface HospitalPageResponse {
  totalElements: number;
  content: HospitalItem[];
  totalPages: number;
  size: number;
  number: number;
}

// 单条医院等级 数据类型
export interface HospitalLevelItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  parentId: number;
}

// 医院等级 分页接口里 data 的结构
export type HospitalLevelPageResponse = HospitalLevelItem[];

// 医院区域 数据类型
export interface HospitalRegionItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  parentId: number;
}

// 医院区域 分页接口里 data 的结构
export type HospitalRegionPageResponse = HospitalRegionItem[];
