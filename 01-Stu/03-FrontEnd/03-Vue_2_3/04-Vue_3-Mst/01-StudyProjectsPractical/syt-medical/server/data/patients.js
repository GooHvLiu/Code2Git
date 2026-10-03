/**
 * 就诊人数据 - 对应 patient 表
 * 结构：{ id, userId, name, certificatesType, certificatesNo, sex, birthDate, phone,
 *        isInsure, cardNo, maritalStatus, address, detailAddress, createTime, updateTime, isDeleted }
 * 每个用户关联1-3个就诊人
 */

let patients = [
  // 用户1 张伟（北京）
  { id: 1, userId: 1, name: "张伟", certificatesType: "1", certificatesNo: "110101199003152345", sex: 1, birthDate: "1990-03-15", phone: "13800000001", isInsure: 1, cardNo: "110101199003152345", maritalStatus: "已婚", address: "北京市东城区", detailAddress: "东单大街1号3单元502室", createTime: "2024-01-01 10:00:00", updateTime: "2024-01-01 10:00:00", isDeleted: 0 },
  { id: 2, userId: 1, name: "张母", certificatesType: "1", certificatesNo: "110101196505203456", sex: 2, birthDate: "1965-05-20", phone: "13800000001", isInsure: 1, cardNo: "110101196505203456", maritalStatus: "已婚", address: "北京市东城区", detailAddress: "东单大街1号3单元502室", createTime: "2024-01-02 10:00:00", updateTime: "2024-01-02 10:00:00", isDeleted: 0 },
  { id: 3, userId: 1, name: "张父", certificatesType: "1", certificatesNo: "110101196208104567", sex: 1, birthDate: "1962-08-10", phone: "13800000001", isInsure: 1, cardNo: "110101196208104567", maritalStatus: "已婚", address: "北京市东城区", detailAddress: "东单大街1号3单元502室", createTime: "2024-01-03 10:00:00", updateTime: "2024-01-03 10:00:00", isDeleted: 0 },
  // 用户2 李华（北京）
  { id: 4, userId: 2, name: "李华", certificatesType: "1", certificatesNo: "110105198807203456", sex: 2, birthDate: "1988-07-20", phone: "13800000002", isInsure: 1, cardNo: "110105198807203456", maritalStatus: "已婚", address: "北京市朝阳区", detailAddress: "建国路88号SOHO现代城B座1201室", createTime: "2024-01-05 09:30:00", updateTime: "2024-01-05 09:30:00", isDeleted: 0 },
  { id: 5, userId: 2, name: "李子轩", certificatesType: "1", certificatesNo: "110105201803155678", sex: 1, birthDate: "2018-03-15", phone: "13800000002", isInsure: 1, cardNo: "110105201803155678", maritalStatus: "未婚", address: "北京市朝阳区", detailAddress: "建国路88号SOHO现代城B座1201室", createTime: "2024-01-06 09:30:00", updateTime: "2024-01-06 09:30:00", isDeleted: 0 },
  // 用户3 王芳（北京）
  { id: 6, userId: 3, name: "王芳", certificatesType: "1", certificatesNo: "110108199211084567", sex: 2, birthDate: "1992-11-08", phone: "13800000003", isInsure: 1, cardNo: "110108199211084567", maritalStatus: "未婚", address: "北京市海淀区", detailAddress: "中关村大街1号海龙大厦15层", createTime: "2024-01-10 14:20:00", updateTime: "2024-01-10 14:20:00", isDeleted: 0 },
  // 用户4 陈强（上海）
  { id: 7, userId: 4, name: "陈强", certificatesType: "1", certificatesNo: "310104198506125678", sex: 1, birthDate: "1985-06-12", phone: "13800000004", isInsure: 1, cardNo: "310104198506125678", maritalStatus: "已婚", address: "上海市徐汇区", detailAddress: "漕溪北路100号宏汇大厦1801室", createTime: "2024-02-01 11:00:00", updateTime: "2024-02-01 11:00:00", isDeleted: 0 },
  { id: 8, userId: 4, name: "陈母", certificatesType: "1", certificatesNo: "310104195809156789", sex: 2, birthDate: "1958-09-15", phone: "13800000004", isInsure: 1, cardNo: "310104195809156789", maritalStatus: "已婚", address: "上海市徐汇区", detailAddress: "漕溪北路100号宏汇大厦1801室", createTime: "2024-02-02 11:00:00", updateTime: "2024-02-02 11:00:00", isDeleted: 0 },
  // 用户5 刘洋（上海，未认证）
  { id: 9, userId: 5, name: "刘洋", certificatesType: "1", certificatesNo: "310115199009256789", sex: 1, birthDate: "1990-09-25", phone: "13800000005", isInsure: 0, cardNo: "", maritalStatus: "未婚", address: "上海市浦东新区", detailAddress: "张江高科技园区博云路2号608室", createTime: "2024-02-10 16:45:00", updateTime: "2024-02-10 16:45:00", isDeleted: 0 },
  // 用户6 赵敏（上海）
  { id: 10, userId: 6, name: "赵敏", certificatesType: "1", certificatesNo: "310101199503187890", sex: 2, birthDate: "1995-03-18", phone: "13800000006", isInsure: 1, cardNo: "310101199503187890", maritalStatus: "未婚", address: "上海市黄浦区", detailAddress: "南京东路200号宏伊国际广场23层", createTime: "2024-02-15 08:15:00", updateTime: "2024-02-15 08:15:00", isDeleted: 0 },
  { id: 11, userId: 6, name: "赵父", certificatesType: "1", certificatesNo: "310101196012058901", sex: 1, birthDate: "1960-12-05", phone: "13800000006", isInsure: 1, cardNo: "310101196012058901", maritalStatus: "已婚", address: "上海市黄浦区", detailAddress: "南京东路200号宏伊国际广场23层", createTime: "2024-02-16 08:15:00", updateTime: "2024-02-16 08:15:00", isDeleted: 0 },
  // 用户7 黄伟（广州）
  { id: 12, userId: 7, name: "黄伟", certificatesType: "1", certificatesNo: "440104198712038901", sex: 1, birthDate: "1987-12-03", phone: "13800000007", isInsure: 1, cardNo: "440104198712038901", maritalStatus: "已婚", address: "广州市越秀区", detailAddress: "中山二路50号粤运大厦12楼", createTime: "2024-03-01 10:30:00", updateTime: "2024-03-01 10:30:00", isDeleted: 0 },
  { id: 13, userId: 7, name: "黄母", certificatesType: "1", certificatesNo: "440104196004189012", sex: 2, birthDate: "1960-04-18", phone: "13800000007", isInsure: 1, cardNo: "440104196004189012", maritalStatus: "已婚", address: "广州市越秀区", detailAddress: "中山二路50号粤运大厦12楼", createTime: "2024-03-02 10:30:00", updateTime: "2024-03-02 10:30:00", isDeleted: 0 },
  { id: 14, userId: 7, name: "黄小雨", certificatesType: "1", certificatesNo: "440104202006150123", sex: 2, birthDate: "2020-06-15", phone: "13800000007", isInsure: 1, cardNo: "440104202006150123", maritalStatus: "未婚", address: "广州市越秀区", detailAddress: "中山二路50号粤运大厦12楼", createTime: "2024-03-03 10:30:00", updateTime: "2024-03-03 10:30:00", isDeleted: 0 },
  // 用户8 李娟（深圳）
  { id: 15, userId: 8, name: "李娟", certificatesType: "1", certificatesNo: "440304199308179012", sex: 2, birthDate: "1993-08-17", phone: "13800000008", isInsure: 1, cardNo: "440304199308179012", maritalStatus: "已婚", address: "深圳市福田区", detailAddress: "深南大道6000号特区报业大厦28层", createTime: "2024-03-05 13:00:00", updateTime: "2024-03-05 13:00:00", isDeleted: 0 },
  { id: 16, userId: 8, name: "李父", certificatesType: "1", certificatesNo: "440304196211201234", sex: 1, birthDate: "1962-11-20", phone: "13800000008", isInsure: 1, cardNo: "440304196211201234", maritalStatus: "已婚", address: "深圳市福田区", detailAddress: "深南大道6000号特区报业大厦28层", createTime: "2024-03-06 13:00:00", updateTime: "2024-03-06 13:00:00", isDeleted: 0 },
  // 用户9 张磊（深圳，未认证）
  { id: 17, userId: 9, name: "张磊", certificatesType: "1", certificatesNo: "440303198904220123", sex: 1, birthDate: "1989-04-22", phone: "13800000009", isInsure: 0, cardNo: "", maritalStatus: "未婚", address: "深圳市罗湖区", detailAddress: "东门北路50号翠拥华庭3栋1508室", createTime: "2024-03-10 09:00:00", updateTime: "2024-03-10 09:00:00", isDeleted: 0 },
  // 用户10 孙丽（广州）
  { id: 18, userId: 10, name: "孙丽", certificatesType: "1", certificatesNo: "440106199611301234", sex: 2, birthDate: "1996-11-30", phone: "13800000010", isInsure: 1, cardNo: "440106199611301234", maritalStatus: "未婚", address: "广州市天河区", detailAddress: "天河路300号天河体育中心东门", createTime: "2024-03-15 15:20:00", updateTime: "2024-03-15 15:20:00", isDeleted: 0 },
  { id: 19, userId: 10, name: "孙母", certificatesType: "1", certificatesNo: "440106196807122345", sex: 2, birthDate: "1968-07-12", phone: "13800000010", isInsure: 1, cardNo: "440106196807122345", maritalStatus: "已婚", address: "广州市天河区", detailAddress: "天河路300号天河体育中心东门", createTime: "2024-03-16 15:20:00", updateTime: "2024-03-16 15:20:00", isDeleted: 0 },
  { id: 20, userId: 10, name: "孙父", certificatesType: "1", certificatesNo: "440106196503083456", sex: 1, birthDate: "1965-03-08", phone: "13800000010", isInsure: 1, cardNo: "440106196503083456", maritalStatus: "已婚", address: "广州市天河区", detailAddress: "天河路300号天河体育中心东门", createTime: "2024-03-17 15:20:00", updateTime: "2024-03-17 15:20:00", isDeleted: 0 },
];

let patientIdSeq = 21;

module.exports = { patients, patientIdSeq };
