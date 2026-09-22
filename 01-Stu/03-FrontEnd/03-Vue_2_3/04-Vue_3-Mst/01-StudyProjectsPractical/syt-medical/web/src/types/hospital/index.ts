// 单条医院 数据类型
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

// 医院分页接口里 data 的结构
export interface HospitalPageResponse {
  totalElements: number;
  content: HospitalItem[];
  totalPages: number;
  size: number;
  number: number;
}
