// 单条 医院部门 的数据类型
export interface HospitalDepartmentItem {
  id: string;
  hoscode: string;
  depcode: string;
  depname: string;
  title: string;
  children: HospitalDepartmentItem[];
}

// 多条 医院部门 的数据类型
export type HospitalDepartmentPageResponse = HospitalDepartmentItem[];
