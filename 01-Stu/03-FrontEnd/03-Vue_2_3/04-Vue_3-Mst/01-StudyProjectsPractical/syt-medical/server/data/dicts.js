/**
 * 字典数据 - 对应尚医通 service_cmn 的 dict 表
 * 结构：{ id, name, value, dictCode, parentId }
 * dictCode 说明：
 *  - Hostype: 医院等级（三级甲等、三级乙等...）
 *  - Province: 省份
 *  - City: 城市（parentId 指向省）
 *  - District: 区县（parentId 指向市）
 *  - Units: 医生职称单位
 *  - CertificateType: 证件类型
 *  - CountryType: 民族
 *  - UserType: 用户类型
 *  - AuthStatus: 认证状态
 *  - OrderStatus: 订单状态
 */

// ===== 医院等级 =====
const hostypes = [
  { id: 101, name: "三级甲等", value: "1", dictCode: "Hostype", parentId: 0 },
  { id: 102, name: "三级乙等", value: "2", dictCode: "Hostype", parentId: 0 },
  { id: 103, name: "二级甲等", value: "3", dictCode: "Hostype", parentId: 0 },
  { id: 104, name: "二级乙等", value: "4", dictCode: "Hostype", parentId: 0 },
  { id: 105, name: "一级甲等", value: "5", dictCode: "Hostype", parentId: 0 },
];

// ===== 省份 =====
const provinces = [
  { id: 110000, name: "北京市", value: "110000", dictCode: "Province", parentId: 0 },
  { id: 120000, name: "天津市", value: "120000", dictCode: "Province", parentId: 0 },
  { id: 130000, name: "河北省", value: "130000", dictCode: "Province", parentId: 0 },
  { id: 140000, name: "山西省", value: "140000", dictCode: "Province", parentId: 0 },
  { id: 310000, name: "上海市", value: "310000", dictCode: "Province", parentId: 0 },
  { id: 320000, name: "江苏省", value: "320000", dictCode: "Province", parentId: 0 },
  { id: 330000, name: "浙江省", value: "330000", dictCode: "Province", parentId: 0 },
  { id: 440000, name: "广东省", value: "440000", dictCode: "Province", parentId: 0 },
  { id: 510000, name: "四川省", value: "510000", dictCode: "Province", parentId: 0 },
  { id: 610000, name: "陕西省", value: "610000", dictCode: "Province", parentId: 0 },
];

// ===== 城市 =====
const cities = [
  // 北京市
  { id: 110100, name: "北京市", value: "110100", dictCode: "City", parentId: 110000 },
  // 天津市
  { id: 120100, name: "天津市", value: "120100", dictCode: "City", parentId: 120000 },
  // 河北省
  { id: 130100, name: "石家庄市", value: "130100", dictCode: "City", parentId: 130000 },
  { id: 130200, name: "唐山市", value: "130200", dictCode: "City", parentId: 130000 },
  // 山西省
  { id: 140100, name: "太原市", value: "140100", dictCode: "City", parentId: 140000 },
  // 上海市
  { id: 310100, name: "上海市", value: "310100", dictCode: "City", parentId: 310000 },
  // 江苏省
  { id: 320100, name: "南京市", value: "320100", dictCode: "City", parentId: 320000 },
  { id: 320200, name: "无锡市", value: "320200", dictCode: "City", parentId: 320000 },
  { id: 320500, name: "苏州市", value: "320500", dictCode: "City", parentId: 320000 },
  // 浙江省
  { id: 330100, name: "杭州市", value: "330100", dictCode: "City", parentId: 330000 },
  { id: 330200, name: "宁波市", value: "330200", dictCode: "City", parentId: 330000 },
  // 广东省
  { id: 440100, name: "广州市", value: "440100", dictCode: "City", parentId: 440000 },
  { id: 440300, name: "深圳市", value: "440300", dictCode: "City", parentId: 440000 },
  // 四川省
  { id: 510100, name: "成都市", value: "510100", dictCode: "City", parentId: 510000 },
  // 陕西省
  { id: 610100, name: "西安市", value: "610100", dictCode: "City", parentId: 610000 },
];

// ===== 区县 =====
const districts = [
  { id: 110101, name: "东城区", value: "110101", dictCode: "District", parentId: 110100 },
  { id: 110102, name: "西城区", value: "110102", dictCode: "District", parentId: 110100 },
  { id: 110105, name: "朝阳区", value: "110105", dictCode: "District", parentId: 110100 },
  { id: 110106, name: "丰台区", value: "110106", dictCode: "District", parentId: 110100 },
  { id: 110107, name: "石景山区", value: "110107", dictCode: "District", parentId: 110100 },
  { id: 110108, name: "海淀区", value: "110108", dictCode: "District", parentId: 110100 },
  { id: 110109, name: "门头沟区", value: "110109", dictCode: "District", parentId: 110100 },
  { id: 110111, name: "房山区", value: "110111", dictCode: "District", parentId: 110100 },
  { id: 110112, name: "通州区", value: "110112", dictCode: "District", parentId: 110100 },
  { id: 110113, name: "顺义区", value: "110113", dictCode: "District", parentId: 110100 },
  { id: 110114, name: "昌平区", value: "110114", dictCode: "District", parentId: 110100 },
  { id: 110115, name: "大兴区", value: "110115", dictCode: "District", parentId: 110100 },
  { id: 110116, name: "怀柔区", value: "110116", dictCode: "District", parentId: 110100 },
  { id: 110117, name: "平谷区", value: "110117", dictCode: "District", parentId: 110100 },
  { id: 110118, name: "密云区", value: "110118", dictCode: "District", parentId: 110100 },
  { id: 110119, name: "延庆区", value: "110119", dictCode: "District", parentId: 110100 },
  { id: 310101, name: "黄浦区", value: "310101", dictCode: "District", parentId: 310100 },
  { id: 310104, name: "徐汇区", value: "310104", dictCode: "District", parentId: 310100 },
  { id: 310115, name: "浦东新区", value: "310115", dictCode: "District", parentId: 310100 },
  { id: 320102, name: "玄武区", value: "320102", dictCode: "District", parentId: 320100 },
  { id: 320205, name: "锡山区", value: "320205", dictCode: "District", parentId: 320200 },
  { id: 320505, name: "虎丘区", value: "320505", dictCode: "District", parentId: 320500 },
  { id: 330103, name: "拱墅区", value: "330103", dictCode: "District", parentId: 330100 },
  { id: 330106, name: "西湖区", value: "330106", dictCode: "District", parentId: 330100 },
  { id: 440103, name: "荔湾区", value: "440103", dictCode: "District", parentId: 440100 },
  { id: 440304, name: "福田区", value: "440304", dictCode: "District", parentId: 440300 },
  { id: 510104, name: "锦江区", value: "510104", dictCode: "District", parentId: 510100 },
  { id: 610113, name: "雁塔区", value: "610113", dictCode: "District", parentId: 610100 },
];

// ===== 证件类型 =====
const certTypes = [
  { id: 1, name: "身份证", value: "1", dictCode: "CertificateType", parentId: 0 },
  { id: 2, name: "护照", value: "2", dictCode: "CertificateType", parentId: 0 },
  { id: 3, name: "军官证", value: "3", dictCode: "CertificateType", parentId: 0 },
];

// ===== 民族 =====
const nations = [
  { id: 1, name: "汉族", value: "1", dictCode: "CountryType", parentId: 0 },
  { id: 2, name: "回族", value: "2", dictCode: "CountryType", parentId: 0 },
  { id: 3, name: "满族", value: "3", dictCode: "CountryType", parentId: 0 },
  { id: 4, name: "蒙古族", value: "4", dictCode: "CountryType", parentId: 0 },
  { id: 5, name: "壮族", value: "5", dictCode: "CountryType", parentId: 0 },
];

// ===== 订单状态 =====
const orderStatus = [
  { id: 0, name: "已取消", value: "0", dictCode: "OrderStatus", parentId: 0 },
  { id: 1, name: "待支付", value: "1", dictCode: "OrderStatus", parentId: 0 },
  { id: 2, name: "已支付", value: "2", dictCode: "OrderStatus", parentId: 0 },
  { id: 3, name: "已取号", value: "3", dictCode: "OrderStatus", parentId: 0 },
];

// ===== 用户认证状态 =====
const authStatus = [
  { id: 0, name: "未认证", value: "0", dictCode: "AuthStatus", parentId: 0 },
  { id: 1, name: "审核中", value: "1", dictCode: "AuthStatus", parentId: 0 },
  { id: 2, name: "已认证", value: "2", dictCode: "AuthStatus", parentId: 0 },
];

const allDicts = [
  ...hostypes, ...provinces, ...cities, ...districts,
  ...certTypes, ...nations, ...orderStatus, ...authStatus
];

module.exports = { allDicts };
//, hostypes, provinces, cities, districts 