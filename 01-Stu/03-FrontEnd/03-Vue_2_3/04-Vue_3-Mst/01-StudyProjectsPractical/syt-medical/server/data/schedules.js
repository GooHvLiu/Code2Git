/**
 * 医生排班数据 - 对应 hosp_schedule 表
 * 结构：{ id, hoscode, depcode, title, docname, skill, workDate, dayOfWeek,
 *        reservedNumber, availableNumber, amount, status }
 * status: 1=有号 0=无号
 */

const surnames = ["张", "王", "李", "赵", "陈", "刘", "杨", "黄", "周", "吴", "徐", "孙", "马", "朱", "胡", "郭", "何", "林", "罗", "郑"];
const givenNames = ["伟", "芳", "娜", "敏", "静", "磊", "军", "洋", "勇", "艳", "杰", "涛", "明", "超", "秀英", "霞", "平", "刚", "桂英", "志强", "雅静", "子轩", "雨泽", "浩然", "欣怡"];
const titles = ["主任医师", "副主任医师", "主治医师"];
const skills = [
  "擅长各种疑难重症的诊治",
  "擅长常见病、多发病的诊疗",
  "擅长微创手术治疗",
  "擅长慢性病管理与健康指导",
  "擅长急危重症的抢救与治疗",
  "擅长老年病综合管理",
  "擅长儿童常见病多发病诊治",
  "擅长复杂病例的诊断与治疗",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function genName() {
  return pick(surnames) + pick(givenNames);
}

/**
 * 生成未来 14 天的日期
 */
function genWorkDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDayOfWeek(d) {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[d.getDay()];
}

/**
 * 为每个医院的每个子科室生成医生排班
 */
const { departments } = require("./departments");

function buildSchedules() {
  const schedules = [];
  let scheduleId = 1;
  const workDates = genWorkDates();

  departments.forEach((dept) => {
    dept.children.forEach((subDept) => {
      // 每个子科室生成 3-6 个医生
      const doctorCount = 3 + Math.floor(Math.random() * 4);
      for (let d = 0; d < doctorCount; d++) {
        const title = pick(titles);
        const docname = genName();
        const skill = pick(skills);

        // 每个医生排 5-10 个工作日
        const workCount = 5 + Math.floor(Math.random() * 6);
        const shuffledDates = [...workDates].sort(() => Math.random() - 0.5).slice(0, workCount);

        shuffledDates.forEach((date) => {
          const reservedNumber = 20 + Math.floor(Math.random() * 20);
          const availableNumber = Math.random() > 0.3
            ? Math.floor(Math.random() * reservedNumber)
            : 0;
          const amount = title === "主任医师"
            ? 500 + Math.floor(Math.random() * 300)
            : title === "副主任医师"
              ? 300 + Math.floor(Math.random() * 200)
              : 100 + Math.floor(Math.random() * 100);

          schedules.push({
            id: `sch_${scheduleId++}`,
            hoscode: subDept.hoscode,
            depcode: subDept.depcode,
            title,
            docname,
            skill,
            workDate: formatDate(date),
            dayOfWeek: getDayOfWeek(date),
            reservedNumber,
            availableNumber,
            amount,
            status: availableNumber > 0 ? 1 : 0,
          });
        });
      }
    });
  });

  return schedules;
}

const schedules = buildSchedules();

module.exports = { schedules };
