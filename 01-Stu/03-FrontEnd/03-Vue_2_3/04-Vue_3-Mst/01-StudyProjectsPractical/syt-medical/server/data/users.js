/**
 * 用户数据 - 对应 user_info 表
 * 测试账号：手机号 13800000001，验证码 111111
 * 覆盖北京、上海、广东三地用户
 */

let users = [
  { id: 1, username: "testuser", name: "张伟", phone: "13800000001", certificatesType: "1", certificatesNo: "110101199003152345", sex: 1, age: 35, authStatus: 2, status: 1, openid: null, nickName: "测试用户", avatar: "", createTime: "2024-01-01 10:00:00", updateTime: "2024-01-01 10:00:00", isDeleted: 0 },
  { id: 2, username: "lihua", name: "李华", phone: "13800000002", certificatesType: "1", certificatesNo: "110105198807203456", sex: 2, age: 37, authStatus: 2, status: 1, openid: null, nickName: "李华", avatar: "", createTime: "2024-01-05 09:30:00", updateTime: "2024-01-05 09:30:00", isDeleted: 0 },
  { id: 3, username: "wangfang", name: "王芳", phone: "13800000003", certificatesType: "1", certificatesNo: "110108199211084567", sex: 2, age: 33, authStatus: 2, status: 1, openid: null, nickName: "芳芳", avatar: "", createTime: "2024-01-10 14:20:00", updateTime: "2024-01-10 14:20:00", isDeleted: 0 },
  { id: 4, username: "chenqiang", name: "陈强", phone: "13800000004", certificatesType: "1", certificatesNo: "310104198506125678", sex: 1, age: 40, authStatus: 2, status: 1, openid: null, nickName: "强哥", avatar: "", createTime: "2024-02-01 11:00:00", updateTime: "2024-02-01 11:00:00", isDeleted: 0 },
  { id: 5, username: "liuyang", name: "刘洋", phone: "13800000005", certificatesType: "1", certificatesNo: "310115199009256789", sex: 1, age: 35, authStatus: 1, status: 1, openid: null, nickName: "刘洋", avatar: "", createTime: "2024-02-10 16:45:00", updateTime: "2024-02-10 16:45:00", isDeleted: 0 },
  { id: 6, username: "zhaomin", name: "赵敏", phone: "13800000006", certificatesType: "1", certificatesNo: "310101199503187890", sex: 2, age: 30, authStatus: 2, status: 1, openid: null, nickName: "敏敏", avatar: "", createTime: "2024-02-15 08:15:00", updateTime: "2024-02-15 08:15:00", isDeleted: 0 },
  { id: 7, username: "huangwei", name: "黄伟", phone: "13800000007", certificatesType: "1", certificatesNo: "440104198712038901", sex: 1, age: 38, authStatus: 2, status: 1, openid: null, nickName: "阿伟", avatar: "", createTime: "2024-03-01 10:30:00", updateTime: "2024-03-01 10:30:00", isDeleted: 0 },
  { id: 8, username: "lijuan", name: "李娟", phone: "13800000008", certificatesType: "1", certificatesNo: "440304199308179012", sex: 2, age: 32, authStatus: 2, status: 1, openid: null, nickName: "娟子", avatar: "", createTime: "2024-03-05 13:00:00", updateTime: "2024-03-05 13:00:00", isDeleted: 0 },
  { id: 9, username: "zhanglei", name: "张磊", phone: "13800000009", certificatesType: "1", certificatesNo: "440303198904220123", sex: 1, age: 36, authStatus: 1, status: 1, openid: null, nickName: "磊子", avatar: "", createTime: "2024-03-10 09:00:00", updateTime: "2024-03-10 09:00:00", isDeleted: 0 },
  { id: 10, username: "sunli", name: "孙丽", phone: "13800000010", certificatesType: "1", certificatesNo: "440106199611301234", sex: 2, age: 29, authStatus: 2, status: 1, openid: null, nickName: "丽丽", avatar: "", createTime: "2024-03-15 15:20:00", updateTime: "2024-03-15 15:20:00", isDeleted: 0 },
];

module.exports = { users };
