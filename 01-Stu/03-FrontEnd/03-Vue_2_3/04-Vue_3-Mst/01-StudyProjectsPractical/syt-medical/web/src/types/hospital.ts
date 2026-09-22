// 单条医院数据类型
export interface HospitalItem {
  id: string;
  hosname: string;
  hoscode: string;
  hostype: string;
  provinceCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
  logoData: string; // base64字符串
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
}

// 后端分页返回整体结构
export interface HospitalPageResponse {
  code: number;
  data: {
    content: HospitalItem[];
    totalElements: number;
  };
}
