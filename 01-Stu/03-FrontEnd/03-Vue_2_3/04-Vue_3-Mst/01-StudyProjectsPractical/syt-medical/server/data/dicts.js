/**
 * 字典数据 - 对应尚医通 service_cmn 的 dict 表
 * 结构：{ id, name, value, dictCode, parentId }
 * 覆盖：北京、上海、广东 三个地区完整省市区数据
 */

// ===== 医院等级 =====
const hostypes = [
  { id: 101, name: "三级甲等", value: "1", dictCode: "Hostype", parentId: 0 },
  { id: 102, name: "三级乙等", value: "2", dictCode: "Hostype", parentId: 0 },
  { id: 103, name: "二级甲等", value: "3", dictCode: "Hostype", parentId: 0 },
  { id: 104, name: "二级乙等", value: "4", dictCode: "Hostype", parentId: 0 },
  { id: 105, name: "一级甲等", value: "5", dictCode: "Hostype", parentId: 0 },
];

// ===== 省份（保留全部，重点覆盖北京/上海/广东） =====
const provinces = [
  { id: 110000, name: "北京市", value: "110000", dictCode: "Province", parentId: 0 },
  { id: 120000, name: "天津市", value: "120000", dictCode: "Province", parentId: 0 },
  { id: 130000, name: "河北省", value: "130000", dictCode: "Province", parentId: 0 },
  { id: 140000, name: "山西省", value: "140000", dictCode: "Province", parentId: 0 },
  { id: 150000, name: "内蒙古自治区", value: "150000", dictCode: "Province", parentId: 0 },
  { id: 210000, name: "辽宁省", value: "210000", dictCode: "Province", parentId: 0 },
  { id: 220000, name: "吉林省", value: "220000", dictCode: "Province", parentId: 0 },
  { id: 230000, name: "黑龙江省", value: "230000", dictCode: "Province", parentId: 0 },
  { id: 310000, name: "上海市", value: "310000", dictCode: "Province", parentId: 0 },
  { id: 320000, name: "江苏省", value: "320000", dictCode: "Province", parentId: 0 },
  { id: 330000, name: "浙江省", value: "330000", dictCode: "Province", parentId: 0 },
  { id: 340000, name: "安徽省", value: "340000", dictCode: "Province", parentId: 0 },
  { id: 350000, name: "福建省", value: "350000", dictCode: "Province", parentId: 0 },
  { id: 360000, name: "江西省", value: "360000", dictCode: "Province", parentId: 0 },
  { id: 370000, name: "山东省", value: "370000", dictCode: "Province", parentId: 0 },
  { id: 410000, name: "河南省", value: "410000", dictCode: "Province", parentId: 0 },
  { id: 420000, name: "湖北省", value: "420000", dictCode: "Province", parentId: 0 },
  { id: 430000, name: "湖南省", value: "430000", dictCode: "Province", parentId: 0 },
  { id: 440000, name: "广东省", value: "440000", dictCode: "Province", parentId: 0 },
  { id: 450000, name: "广西壮族自治区", value: "450000", dictCode: "Province", parentId: 0 },
  { id: 460000, name: "海南省", value: "460000", dictCode: "Province", parentId: 0 },
  { id: 500000, name: "重庆市", value: "500000", dictCode: "Province", parentId: 0 },
  { id: 510000, name: "四川省", value: "510000", dictCode: "Province", parentId: 0 },
  { id: 520000, name: "贵州省", value: "520000", dictCode: "Province", parentId: 0 },
  { id: 530000, name: "云南省", value: "530000", dictCode: "Province", parentId: 0 },
  { id: 610000, name: "陕西省", value: "610000", dictCode: "Province", parentId: 0 },
];

// ===== 城市 =====
const cities = [
  // 北京市
  { id: 110100, name: "北京市", value: "110100", dictCode: "City", parentId: 110000 },
  // 上海市
  { id: 310100, name: "上海市", value: "310100", dictCode: "City", parentId: 310000 },
  // 广东省
  { id: 440100, name: "广州市", value: "440100", dictCode: "City", parentId: 440000 },
  { id: 440300, name: "深圳市", value: "440300", dictCode: "City", parentId: 440000 },
  { id: 440600, name: "佛山市", value: "440600", dictCode: "City", parentId: 440000 },
  { id: 441900, name: "东莞市", value: "441900", dictCode: "City", parentId: 440000 },
  { id: 440400, name: "珠海市", value: "440400", dictCode: "City", parentId: 440000 },
  // 其他省（保留少量）
  { id: 120100, name: "天津市", value: "120100", dictCode: "City", parentId: 120000 },
  { id: 320100, name: "南京市", value: "320100", dictCode: "City", parentId: 320000 },
  { id: 320200, name: "无锡市", value: "320200", dictCode: "City", parentId: 320000 },
  { id: 320500, name: "苏州市", value: "320500", dictCode: "City", parentId: 320000 },
  { id: 330100, name: "杭州市", value: "330100", dictCode: "City", parentId: 330000 },
  { id: 510100, name: "成都市", value: "510100", dictCode: "City", parentId: 510000 },
  { id: 610100, name: "西安市", value: "610100", dictCode: "City", parentId: 610000 },
];

// ===== 区县 =====
const districts = [
  // ===== 北京市 16个区 =====
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

  // ===== 上海市 16个区 =====
  { id: 310101, name: "黄浦区", value: "310101", dictCode: "District", parentId: 310100 },
  { id: 310104, name: "徐汇区", value: "310104", dictCode: "District", parentId: 310100 },
  { id: 310105, name: "长宁区", value: "310105", dictCode: "District", parentId: 310100 },
  { id: 310106, name: "静安区", value: "310106", dictCode: "District", parentId: 310100 },
  { id: 310107, name: "普陀区", value: "310107", dictCode: "District", parentId: 310100 },
  { id: 310109, name: "虹口区", value: "310109", dictCode: "District", parentId: 310100 },
  { id: 310110, name: "杨浦区", value: "310110", dictCode: "District", parentId: 310100 },
  { id: 310112, name: "闵行区", value: "310112", dictCode: "District", parentId: 310100 },
  { id: 310113, name: "宝山区", value: "310113", dictCode: "District", parentId: 310100 },
  { id: 310114, name: "嘉定区", value: "310114", dictCode: "District", parentId: 310100 },
  { id: 310115, name: "浦东新区", value: "310115", dictCode: "District", parentId: 310100 },
  { id: 310116, name: "金山区", value: "310116", dictCode: "District", parentId: 310100 },
  { id: 310117, name: "松江区", value: "310117", dictCode: "District", parentId: 310100 },
  { id: 310118, name: "青浦区", value: "310118", dictCode: "District", parentId: 310100 },
  { id: 310120, name: "奉贤区", value: "310120", dictCode: "District", parentId: 310100 },
  { id: 310151, name: "崇明区", value: "310151", dictCode: "District", parentId: 310100 },

  // ===== 广东省 - 广州市 11个区 =====
  { id: 440103, name: "荔湾区", value: "440103", dictCode: "District", parentId: 440100 },
  { id: 440104, name: "越秀区", value: "440104", dictCode: "District", parentId: 440100 },
  { id: 440105, name: "海珠区", value: "440105", dictCode: "District", parentId: 440100 },
  { id: 440106, name: "天河区", value: "440106", dictCode: "District", parentId: 440100 },
  { id: 440111, name: "白云区", value: "440111", dictCode: "District", parentId: 440100 },
  { id: 440112, name: "黄埔区", value: "440112", dictCode: "District", parentId: 440100 },
  { id: 440113, name: "番禺区", value: "440113", dictCode: "District", parentId: 440100 },
  { id: 440114, name: "花都区", value: "440114", dictCode: "District", parentId: 440100 },
  { id: 440115, name: "南沙区", value: "440115", dictCode: "District", parentId: 440100 },
  { id: 440117, name: "从化区", value: "440117", dictCode: "District", parentId: 440100 },
  { id: 440118, name: "增城区", value: "440118", dictCode: "District", parentId: 440100 },

  // ===== 广东省 - 深圳市 9个区 =====
  { id: 440303, name: "罗湖区", value: "440303", dictCode: "District", parentId: 440300 },
  { id: 440304, name: "福田区", value: "440304", dictCode: "District", parentId: 440300 },
  { id: 440305, name: "南山区", value: "440305", dictCode: "District", parentId: 440300 },
  { id: 440306, name: "宝安区", value: "440306", dictCode: "District", parentId: 440300 },
  { id: 440307, name: "龙岗区", value: "440307", dictCode: "District", parentId: 440300 },
  { id: 440308, name: "盐田区", value: "440308", dictCode: "District", parentId: 440300 },
  { id: 440309, name: "龙华区", value: "440309", dictCode: "District", parentId: 440300 },
  { id: 440310, name: "坪山区", value: "440310", dictCode: "District", parentId: 440300 },
  { id: 440311, name: "光明区", value: "440311", dictCode: "District", parentId: 440300 },

  // ===== 广东省 - 佛山市 5个区 =====
  { id: 440604, name: "禅城区", value: "440604", dictCode: "District", parentId: 440600 },
  { id: 440605, name: "南海区", value: "440605", dictCode: "District", parentId: 440600 },
  { id: 440606, name: "顺德区", value: "440606", dictCode: "District", parentId: 440600 },
  { id: 440607, name: "三水区", value: "440607", dictCode: "District", parentId: 440600 },
  { id: 440608, name: "高明区", value: "440608", dictCode: "District", parentId: 440600 },

  // ===== 广东省 - 东莞市（不设区，用街道代） =====
  { id: 441901, name: "莞城街道", value: "441901", dictCode: "District", parentId: 441900 },
  { id: 441902, name: "南城街道", value: "441902", dictCode: "District", parentId: 441900 },
  { id: 441903, name: "东城街道", value: "441903", dictCode: "District", parentId: 441900 },

  // ===== 广东省 - 珠海市 3个区 =====
  { id: 440402, name: "香洲区", value: "440402", dictCode: "District", parentId: 440400 },
  { id: 440403, name: "斗门区", value: "440403", dictCode: "District", parentId: 440400 },
  { id: 440404, name: "金湾区", value: "440404", dictCode: "District", parentId: 440400 },

  // ===== 其他城市少量区县 =====
  { id: 120101, name: "和平区", value: "120101", dictCode: "District", parentId: 120100 },
  { id: 120104, name: "南开区", value: "120104", dictCode: "District", parentId: 120100 },
  { id: 320102, name: "玄武区", value: "320102", dictCode: "District", parentId: 320100 },
  { id: 320106, name: "鼓楼区", value: "320106", dictCode: "District", parentId: 320100 },
  { id: 320201, name: "梁溪区", value: "320201", dictCode: "District", parentId: 320200 },
  { id: 320205, name: "锡山区", value: "320205", dictCode: "District", parentId: 320200 },
  { id: 320505, name: "虎丘区", value: "320505", dictCode: "District", parentId: 320500 },
  { id: 320506, name: "姑苏区", value: "320506", dictCode: "District", parentId: 320500 },
  { id: 330102, name: "上城区", value: "330102", dictCode: "District", parentId: 330100 },
  { id: 330106, name: "西湖区", value: "330106", dictCode: "District", parentId: 330100 },
  { id: 510104, name: "锦江区", value: "510104", dictCode: "District", parentId: 510100 },
  { id: 510107, name: "武侯区", value: "510107", dictCode: "District", parentId: 510100 },
  { id: 610104, name: "新城区", value: "610104", dictCode: "District", parentId: 610100 },
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

module.exports = { allDicts, hostypes, provinces, cities, districts };
