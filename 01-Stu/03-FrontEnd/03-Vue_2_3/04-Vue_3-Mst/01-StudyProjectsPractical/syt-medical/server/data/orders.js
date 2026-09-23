/**
 * 订单数据 - 对应 order_info 表
 * 结构：{ id, userId, outTradeNo, hoscode, hosname, depcode, depname, scheduleId, title,
 *        docname, skill, reserveDate, dayOfWeek, reservedNumber, amount, patientId, patientName,
 *        patientCertificatesType, patientCertificatesNo, patientPhone, orderStatus, createTime, paidTime, isDeleted }
 * orderStatus: 0=已取消 1=待支付 2=已支付 3=已取号
 * 所有订单的 scheduleId 均来自 schedules 中真实存在的排班，确保关联完整
 */

const { schedules } = require("./schedules");
const { hospitals } = require("./hospitals");
const { patients } = require("./patients");
const { departments } = require("./departments");

// 医院名称映射
const hosNameMap = {};
hospitals.forEach((h) => { hosNameMap[h.hoscode] = h.hosname; });

// 科室名称映射（从departments中提取 depcode -> depname）
const depNameMap = {};
departments.forEach((dept) => {
  depNameMap[dept.depcode] = dept.depname;
  dept.children.forEach((sd) => { depNameMap[sd.depcode] = sd.depname; });
});

// 从schedules中按条件查找
function findSchedule(hoscode, depcode, docname) {
  return schedules.find((s) => s.hoscode === hoscode && s.depcode === depcode && (!docname || s.docname === docname));
}

// 订单定义：[userId, patientId, hoscode, depcode, docname(可选), orderStatus, createTime]
const orderDefs = [
  // 用户1 张伟 - 北京协和
  [1, 1, "1000_0", "dept_neike_xinxueguan", null, 2, "2024-09-10 10:00:00"],
  [1, 2, "1000_0", "dept_neike_xinnao", null, 2, "2024-09-11 14:30:00"],
  [1, 3, "1000_0", "dept_waike_guke", null, 1, "2024-09-12 09:15:00"],
  [1, 1, "1003_0", "dept_neike_xinxueguan", null, 3, "2024-09-05 11:00:00"],
  [1, 2, "1005_0", "dept_neike_xinxueguan", null, 0, "2024-09-08 16:00:00"],
  // 用户2 李华 - 北京
  [2, 4, "1006_0", "dept_neixihu", null, 2, "2024-09-09 10:30:00"],
  [2, 5, "1010_0", "dept_erk_neike", null, 2, "2024-09-10 13:00:00"],
  [2, 4, "1007_0", "dept_neike_xinnao", null, 1, "2024-09-12 08:45:00"],
  // 用户3 王芳 - 北京
  [3, 6, "1004_0", "dept_waike_shenjing", null, 2, "2024-09-07 15:00:00"],
  [3, 6, "1009_0", "dept_waike_guke", null, 3, "2024-09-03 10:00:00"],
  // 用户4 陈强 - 上海
  [4, 7, "2000_0", "dept_neike_xinxueguan", null, 2, "2024-09-08 09:00:00"],
  [4, 8, "2000_0", "dept_neike_xiaohua", null, 2, "2024-09-09 11:30:00"],
  [4, 7, "2002_0", "dept_neike_neifenmi", null, 1, "2024-09-11 14:00:00"],
  [4, 8, "2006_0", "dept_waike_guke", null, 0, "2024-09-06 10:00:00"],
  // 用户5 刘洋 - 上海
  [5, 9, "2001_0", "dept_pifu_zonghe", null, 2, "2024-09-10 16:00:00"],
  [5, 9, "2003_0", "dept_neike_xiaohua", null, 1, "2024-09-12 11:00:00"],
  // 用户6 赵敏 - 上海
  [6, 10, "2010_0", "dept_fuchan_fuke", null, 2, "2024-09-08 13:30:00"],
  [6, 11, "2004_0", "dept_neike_xinxueguan", null, 3, "2024-09-04 09:00:00"],
  [6, 10, "2011_0", "dept_erk_neike", null, 2, "2024-09-11 10:00:00"],
  // 用户7 黄伟 - 广州
  [7, 12, "3000_0", "dept_neike_xinxueguan", null, 2, "2024-09-09 10:00:00"],
  [7, 13, "3004_0", "dept_neike_xinxueguan", null, 2, "2024-09-10 15:00:00"],
  [7, 14, "3000_0", "dept_erk_neike", null, 1, "2024-09-12 09:30:00"],
  [7, 12, "3005_0", "dept_neixihu", null, 3, "2024-09-02 11:00:00"],
  [7, 13, "3007_0", "dept_zhongliu_neike", null, 0, "2024-09-07 14:00:00"],
  // 用户8 李娟 - 深圳
  [8, 15, "3008_0", "dept_neike_xiaohua", null, 2, "2024-09-08 10:30:00"],
  [8, 16, "3009_0", "dept_neike_xinxueguan", null, 2, "2024-09-10 13:00:00"],
  [8, 15, "3010_0", "dept_waike_guke", null, 1, "2024-09-11 16:00:00"],
  // 用户9 张磊 - 深圳
  [9, 17, "3012_0", "dept_neixihu", null, 2, "2024-09-09 11:00:00"],
  [9, 17, "3008_0", "dept_neike_xinnao", null, 1, "2024-09-12 10:00:00"],
  // 用户10 孙丽 - 广州
  [10, 18, "3002_0", "dept_neike_neifenmi", null, 2, "2024-09-10 14:30:00"],
  [10, 19, "3001_0", "dept_fuchan_fuke", null, 3, "2024-09-03 10:00:00"],
  [10, 20, "3003_0", "dept_neike_xiaohua", null, 2, "2024-09-11 09:00:00"],
];

function buildOrders() {
  const result = [];
  let orderId = 1;

  orderDefs.forEach(([userId, patientId, hoscode, depcode, docname, orderStatus, createTime]) => {
    const sch = findSchedule(hoscode, depcode, docname);
    if (!sch) return; // 找不到排班则跳过（理论上不会发生）

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const outTradeNo = `ORD${createTime.replace(/[-: ]/g, "").slice(0, 8)}${String(orderId).padStart(4, "0")}`;

    result.push({
      id: orderId,
      userId,
      outTradeNo,
      hoscode,
      hosname: hosNameMap[hoscode] || "",
      depcode,
      depname: depNameMap[depcode] || depcode,
      scheduleId: sch.id,
      title: sch.title,
      docname: sch.docname,
      skill: sch.skill,
      reserveDate: sch.workDate,
      dayOfWeek: sch.dayOfWeek,
      reservedNumber: sch.reservedNumber,
      amount: sch.amount,
      patientId,
      patientName: patient.name,
      patientCertificatesType: patient.certificatesType,
      patientCertificatesNo: patient.certificatesNo,
      patientPhone: patient.phone,
      orderStatus,
      createTime,
      paidTime: orderStatus >= 2 ? createTime : null,
      isDeleted: 0,
    });
    orderId++;
  });

  return result;
}

let orders = buildOrders();
let orderIdSeq = orders.length + 1;

module.exports = { orders, orderIdSeq };
