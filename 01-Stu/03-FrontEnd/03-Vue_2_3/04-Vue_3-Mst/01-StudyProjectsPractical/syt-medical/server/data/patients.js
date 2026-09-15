/**
 * 就诊人数据 - 对应 patient 表
 * 结构：{ id, userId, name, certificatesType, certificatesNo, sex, birthDate, phone,
 *        isInsure, cardNo, address, ... }
 */

let patients = [
  {
    id: 1,
    userId: 1,
    name: "张三",
    certificatesType: "1",
    certificatesNo: "110101199001011234",
    sex: 1,
    birthDate: "1990-01-01",
    phone: "13800000001",
    isInsure: 1,
    cardNo: "110101199001011234",
    address: "北京市东城区",
    createTime: "2024-01-01 10:00:00",
    updateTime: "2024-01-01 10:00:00",
    isDeleted: 0,
  },
  {
    id: 2,
    userId: 1,
    name: "王梅",
    certificatesType: "1",
    certificatesNo: "110101199202021234",
    sex: 2,
    birthDate: "1992-02-02",
    phone: "13800000001",
    isInsure: 1,
    cardNo: "110101199202021234",
    address: "北京市东城区",
    createTime: "2024-01-03 10:00:00",
    updateTime: "2024-01-03 10:00:00",
    isDeleted: 0,
  },
  {
    id: 3,
    userId: 2,
    name: "李四",
    certificatesType: "1",
    certificatesNo: "320205199505051234",
    sex: 1,
    birthDate: "1995-05-05",
    phone: "13800000002",
    isInsure: 1,
    cardNo: "320205199505051234",
    address: "无锡市",
    createTime: "2024-01-02 10:00:00",
    updateTime: "2024-01-02 10:00:00",
    isDeleted: 0,
  },
];

let patientIdSeq = 4;

module.exports = { patients, patientIdSeq };
