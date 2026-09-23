/**
 * 医院路由 - /api/hosp/hospital/...
 * 对应尚医通 service_hosp
 */

const express = require("express");
const router = express.Router();
const { hospitals } = require("../data/hospitals");
const { departments } = require("../data/departments");
const { schedules } = require("../data/schedules");
const { success, fail } = require("../utils/response");
const { auth } = require("../middlewares/auth");
const { patients } = require("../data/patients");
const { orders, orderIdSeq } = require("../data/orders");

/**
 * GET /api/hosp/hospital/findHospitalPage/{page}/{limit}
 * 分页查询医院列表
 */
router.get("/findHospitalPage/:page/:limit", (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;

  // 查询条件（前端 hospitalList 组件可能传 hosname、hostype、provinceCode 等）
  const { hosname, hostype, provinceCode, cityCode, districtCode } = req.query;

  let list = hospitals.filter((h) => h.status === 1);
  if (hosname) list = list.filter((h) => h.hosname.includes(hosname));
  if (hostype) list = list.filter((h) => h.hostype === hostype);
  if (provinceCode) list = list.filter((h) => h.provinceCode === provinceCode);
  if (cityCode) list = list.filter((h) => h.cityCode === cityCode);
  if (districtCode) list = list.filter((h) => h.districtCode === districtCode);

  // 分页
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / limit);
  const start = (page - 1) * limit;
  const content = list.slice(start, start + limit);

  // 附加 hostypeString, provinceString 等展示字段
  const result = content.map((h) => ({
    ...h,
    hostypeString: getHostypeString(h.hostype),
    provinceString: h.provinceCode,
    cityString: h.cityCode,
    districtString: h.districtCode,
  }));

  return success(res, {
    totalElements,
    content: result,
    totalPages,
    size: limit,
    number: page,
  });
});

/**
 * GET /api/hosp/hospital/findByHosname/{hosname}
 * 根据医院名称模糊搜索医院列表（用于搜索框自动补全）
 */
router.get("/findByHosname/:hosname", (req, res) => {
  const { hosname } = req.params;
  if (!hosname || hosname.trim() === "") {
    return success(res, []);
  }
  const list = hospitals
    .filter((h) => h.status === 1 && h.hosname.includes(hosname))
    .map((h) => ({
      id: h.id,
      hosname: h.hosname,
      hoscode: h.hoscode,
    }));
  return success(res, list);
});

/**
 * GET /api/hosp/hospital/findHospitalDetail/{hoscode}
 * 医院详情
 */
router.get("/findHospitalDetail/:hoscode", (req, res) => {
  const { hoscode } = req.params;
  const hospital = hospitals.find((h) => h.hoscode === hoscode);
  if (!hospital) {
    return fail(res, "医院不存在");
  }
  return success(res, {
    ...hospital,
    hostypeString: getHostypeString(hospital.hostype),
    provinceString: hospital.provinceCode,
    cityString: hospital.cityCode,
    districtString: hospital.districtCode,
  });
});

/**
 * GET /api/hosp/hospital/department/{hoscode}
 * 查询医院科室列表（树形）
 */
router.get("/department/:hoscode", (req, res) => {
  const { hoscode } = req.params;
  const list = departments.filter((d) => d.hoscode === hoscode);
  return success(res, list);
});

/**
 * GET /api/hosp/hospital/doctor/{hoscode}/{depcode}/{page}/{limit}
 * 分页查询某科室某医院的医生排班
 */
router.get("/doctor/:hoscode/:depcode/:page/:limit", (req, res) => {
  const { hoscode, depcode, page, limit } = req.params;
  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 10;

  let list = schedules.filter(
    (s) => s.hoscode === hoscode && s.depcode === depcode
  );

  // 按日期排序
  list.sort((a, b) => a.workDate.localeCompare(b.workDate));

  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / l);
  const start = (p - 1) * l;
  const content = list.slice(start, start + l);

  return success(res, {
    totalElements,
    content,
    totalPages,
    size: l,
    number: p,
  });
});

/**
 * GET /api/hosp/hospital/doctorInfo/{hoscode}/{depcode}/{scheduleId}
 * 查询医生排班详情（医生信息）
 */
router.get("/doctorInfo/:hoscode/:depcode/:scheduleId", (req, res) => {
  const { hoscode, depcode, scheduleId } = req.params;
  const schedule = schedules.find(
    (s) => s.id === scheduleId && s.hoscode === hoscode && s.depcode === depcode
  );
  if (!schedule) {
    return fail(res, "排班不存在");
  }
  return success(res, schedule);
});

/**
 * GET /api/hosp/hospital/show/{hoscode}/{depcode}/{scheduleId}
 * 预约挂号页面的详细信息（排班+医院+科室+医生）
 */
router.get("/show/:hoscode/:depcode/:scheduleId", (req, res) => {
  const { hoscode, depcode, scheduleId } = req.params;
  const hospital = hospitals.find((h) => h.hoscode === hoscode);
  const dep = findDepartment(depcode);
  const schedule = schedules.find(
    (s) => s.id === scheduleId && s.hoscode === hoscode && s.depcode === depcode
  );
  if (!schedule) {
    return fail(res, "排班不存在");
  }
  return success(res, {
    hospital: {
      ...hospital,
      hostypeString: getHostypeString(hospital.hostype),
    },
    depcode: depcode,
    depname: dep ? dep.depname : depcode,
    schedule,
  });
});

/**
 * POST /api/hosp/hospital/auth/userAuth
 * 提交预约挂号
 * body: { scheduleId, patientId }
 */
router.post("/auth/userAuth", auth, (req, res) => {
  const { scheduleId, patientId } = req.body;
  const userId = req.userId;

  const schedule = schedules.find((s) => s.id === scheduleId);
  if (!schedule) {
    return fail(res, "排班不存在");
  }
  if (schedule.availableNumber <= 0) {
    return fail(res, "号源已约满");
  }

  const patient = patients.find((p) => p.id == patientId && p.userId === userId);
  if (!patient) {
    return fail(res, "就诊人不存在");
  }

  // 扣减号源
  schedule.availableNumber -= 1;
  if (schedule.availableNumber <= 0) schedule.status = 0;

  // 创建订单
  const dep = findDepartment(schedule.depcode);
  const hospital = hospitals.find((h) => h.hoscode === schedule.hoscode);
  const order = {
    id: orderIdSeq,
    userId,
    outTradeNo: "ORD" + Date.now(),
    hoscode: schedule.hoscode,
    hosname: hospital ? hospital.hosname : "",
    depcode: schedule.depcode,
    depname: dep ? dep.depname : schedule.depcode,
    scheduleId: schedule.id,
    title: schedule.title,
    docname: schedule.docname,
    skill: schedule.skill,
    reserveDate: schedule.workDate,
    dayOfWeek: schedule.dayOfWeek,
    reservedNumber: schedule.reservedNumber,
    amount: schedule.amount,
    patientId: patient.id,
    patientName: patient.name,
    patientCertificatesType: patient.certificatesType,
    patientCertificatesNo: patient.certificatesNo,
    patientPhone: patient.phone,
    orderStatus: 1, // 待支付
    createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
    paidTime: null,
    isDeleted: 0,
  };
  orders.unshift(order);

  return success(res, order.id, "预约成功");
});

// ===== 工具函数 =====
function getHostypeString(hostype) {
  const map = { "1": "三级甲等", "2": "三级乙等", "3": "二级甲等", "4": "二级乙等", "5": "一级甲等" };
  return map[hostype] || hostype;
}

function findDepartment(depcode) {
  for (const dept of departments) {
    if (dept.depcode === depcode) return dept;
    const sub = dept.children.find((c) => c.depcode === depcode);
    if (sub) return sub;
  }
  return null;
}

module.exports = router;
