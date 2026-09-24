// 单条医院详情 / bookingRule 的数据类型
export interface BookingRule {
  cycle: number;
  releaseTime: string;
  stopTime: string;
  quitDay: number;
  quitTime: string;
  rule: string[];
}
// 单条医院详情 的数据类型
export interface HospitalDetailItem {
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
  bookingRule: BookingRule;
  hostypeString: string;
  provinceString: string;
  cityString: string;
  districtString: string;
}
