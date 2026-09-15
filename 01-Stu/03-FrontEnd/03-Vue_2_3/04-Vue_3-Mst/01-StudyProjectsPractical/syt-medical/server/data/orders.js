/**
 * 订单数据 - 对应 order_info 表
 * 结构：{ id, userId, outTradeNo, hoscode, depcode, scheduleId, title,
 *        reserveDate, reserveNumber, amount, patientId, patientName,
 *        patientCertificatesType, patientCertificatesNo, patientPhone,
 *        orderStatus, ... }
 * orderStatus: 0=已取消 1=待支付 2=已支付 3=已取号
 */

let orders = [
  {
    id: 1,
    userId: 1,
    outTradeNo: "ORD20240101001",
    hoscode: "1000_0",
    hosname: "北京协和医院",
    depcode: "dept_neike_xinxueguan",
    depname: "心血管内科",
    scheduleId: "sch_1",
    title: "主任医师",
    docname: "张磊",
    skill: "擅长各种疑难重症的诊治",
    reserveDate: "2024-01-15",
    dayOfWeek: "周一",
    reservedNumber: 30,
    amount: 600.0,
    patientId: 1,
    patientName: "张三",
    patientCertificatesType: "1",
    patientCertificatesNo: "110101199001011234",
    patientPhone: "13800000001",
    orderStatus: 2,
    createTime: "2024-01-08 10:00:00",
    paidTime: "2024-01-08 10:05:00",
    isDeleted: 0,
  },
  {
    id: 2,
    userId: 1,
    outTradeNo: "ORD20240102002",
    hoscode: "2000_0",
    hosname: "复旦大学附属华山医院",
    depcode: "dept_neike_xinnao",
    depname: "神经内科",
    scheduleId: "sch_100",
    title: "副主任医师",
    docname: "王芳",
    skill: "擅长常见病、多发病的诊疗",
    reserveDate: "2024-01-20",
    dayOfWeek: "周六",
    reservedNumber: 25,
    amount: 400.0,
    patientId: 2,
    patientName: "王梅",
    patientCertificatesType: "1",
    patientCertificatesNo: "110101199202021234",
    patientPhone: "13800000001",
    orderStatus: 1,
    createTime: "2024-01-09 14:00:00",
    paidTime: null,
    isDeleted: 0,
  },
];

let orderIdSeq = 3;

module.exports = { orders, orderIdSeq };
