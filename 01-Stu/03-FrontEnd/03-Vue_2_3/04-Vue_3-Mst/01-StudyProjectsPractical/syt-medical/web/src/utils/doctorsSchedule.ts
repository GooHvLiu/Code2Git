/**
 * ==========================================
 * 该工具是对后端数据进行排版的工具包 TS版
 * ==========================================
 */
// 引入数据类型
import type { DoctorScheduleContent, DoctorsScheduleItems, ScheduleArr } from "@/types/doctorSchedule/index";
// 排班类定义
class Schedule {
  /**
   * 按排班日期分组，生成日期卡片数组
   * @param data 后端返回排班分页对象
   * @returns 日期卡片数组[{workDate, dayOfWeek, tipText}]
   */
  scheduleByWorkDate = (data: DoctorsScheduleItems): ScheduleArr => {
    // 提取排班列表
    const doctorsScheduleData: DoctorScheduleContent[] = data.content;
    // 通过 ts 的 Record 定义一个映射结构：key日期字符串，value当日排班数组
    const groupMap: Record<string, DoctorScheduleContent[]> = {};
    // 第一步 遍历后端返回的医生们的排班数据
    doctorsScheduleData.forEach((item) => {
      // 如果以医生排班数据中的workDate为键值没有查询到，则保存
      if (!groupMap[item.workDate]) {
        // 先创建一个空字段
        groupMap[item.workDate] = [];
      }
      // 将去重，按照工作时间排序的数据保存起来
      groupMap[item.workDate].push(item);
    });
    // 第二步 将对象转为数组 日期按从小到大的顺序排列
    const dateCardList: ScheduleArr = Object.keys(groupMap)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((workDate) => {
        const dayList = groupMap[workDate];
        // 取该日期第一条的星期
        const dayOfWeek = dayList[0].dayOfWeek;
        // 判断当天有没有可挂号号源：status=1 并且 availableNumber>0
        const hasAvailable = dayList.some((sch) => sch.status === 1 && sch.availableNumber > 0);
        // 按上午(0)下午(1)分组
        const morningList = dayList.filter((sch) => sch.workTime === 0);
        const afternoonList = dayList.filter((sch) => sch.workTime === 1);
        return {
          workDate,
          dayOfWeek,
          tipText: hasAvailable ? "可挂号" : "停止挂号",
          // 【可选扩展】把当天排班也一并返回，页面不用二次查找分组
          scheduleList: dayList,
          morningList,
          afternoonList
        };
      });
    return dateCardList;
  };
}

export const doctorsScheduleMethods = new Schedule();
