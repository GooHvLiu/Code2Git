// 单条 医生排班 的数据类型
export interface DoctorScheduleContent {
  id: string;
  hoscode: string;
  depcode: string;
  title: string;
  docname: string;
  skill: string;
  workDate: string;
  dayOfWeek: string;
  workTime: number;
  reservedNumber: number;
  availableNumber: number;
  amount: number;
  status: number;
}

// 所有 医生们排班 的数据类型
export interface DoctorsScheduleItems {
  totalElements: number;
  content: DoctorScheduleContent[];
  totalPages: number;
  size: number;
  number: number;
}

// 经过排班工具处理后的单日 单人 workDate 的排班数组
export interface Schedule {
  amount: number;
  availableNumber: number;
  dayOfWeek: string;
  depcode: string;
  docname: string;
  hoscode: string;
  id: string;
  reservedNumber: number;
  skill: string;
  status: number;
  title: string;
  workDate: string;
  workTime: number;
}

// 【单条日期卡片】一个日期对应的卡片对象
export interface ScheduleCard {
  dayOfWeek: string;
  scheduleList: Schedule[];
  morningList: Schedule[];
  afternoonList: Schedule[];
  tipText: string;
  workDate: string;
}

// scheduleArr：日期卡片组成的数组
export type ScheduleArr = ScheduleCard[];

// 医院 科室 专科 数据类型
export interface HspDptSpcItem {
  // 医院名称
  hopName: string;
  // 科室名称
  dptName: string;
  // 专科名称
  spcName: string;
}

// 确定 医生 的数据类型
export interface SelectedDoctor {
  amount: number;
  availableNumber: number;
  dayOfWeek: string;
  depcode: string;
  docname: string;
  hoscode: string;
  id: string;
  reservedNumber: number;
  skill: string;
  status: number;
  title: string;
  workDate: string;
  workTime: number;
}
