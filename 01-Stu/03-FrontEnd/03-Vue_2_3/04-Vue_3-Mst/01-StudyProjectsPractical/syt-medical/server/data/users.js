/**
 * 用户数据 - 对应 user_info 表
 * 测试账号：
 *  - 手机号 13800000001，验证码任意（教程中常用 111111）
 *  - 已实名认证
 */

let users = [
  {
    id: 1,
    username: "testuser",
    name: "张三",
    phone: "13800000001",
    certificatesType: "1",
    certificatesNo: "110101199001011234",
    sex: 1,
    age: 35,
    authStatus: 2, // 已认证
    status: 1,
    openid: null,
    nickName: "测试用户",
    avatar: "",
    createTime: "2024-01-01 10:00:00",
    updateTime: "2024-01-01 10:00:00",
    isDeleted: 0,
  },
  {
    id: 2,
    username: "student",
    name: "李四",
    phone: "13800000002",
    certificatesType: "1",
    certificatesNo: "320205199505051234",
    sex: 1,
    age: 30,
    authStatus: 2,
    status: 1,
    openid: null,
    nickName: "学习用户",
    avatar: "",
    createTime: "2024-01-02 10:00:00",
    updateTime: "2024-01-02 10:00:00",
    isDeleted: 0,
  },
];

module.exports = { users };
