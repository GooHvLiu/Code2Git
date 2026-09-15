/**
 * 医院数据 - 对应尚医通 hosp_hospital_set 表
 * bookingRule 结构与官方一致
 */

const hospitals = [
  {
    id: "h001",
    hosname: "北京协和医院",
    hoscode: "1000_0",
    hostype: "1",
    provinceCode: "110000",
    cityCode: "110100",
    districtCode: "110101",
    address: "北京市东城区帅府园一号",
    logoData: "",
    intro: "北京协和医院是一所位于北京市东城区，集医疗、科研、教学为一体的大型综合医院。它隶属于中国协和医科大学(北京协和医学院)，是其临床医学院，同时也是中国医学科学院的临床医学研究所，是国家卫生健康委指定的全国疑难重症诊治指导中心。",
    route: "乘1路、37路、20路、52路、122路、728路、802路东单路口西站下车，向东步行约100米路北；乘106路、111路、108路、110路、684路东单路口北下车，向南步行约200米路西。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:30",
      stopTime: "11:30",
      quitDay: 1,
      quitTime: "10:30",
      rule: [
        "可预约后7天内的专家号",
        "预约周期：7天",
        "放号时间：08:30",
        "停挂时间：就诊前一日11:30",
        "退号时间：就诊前一日10:30前",
        "取号地点：门诊楼一层大厅"
      ]
    }
  },
  {
    id: "h002",
    hosname: "北京大学第一医院",
    hoscode: "1001_0",
    hostype: "1",
    provinceCode: "110000",
    cityCode: "110100",
    districtCode: "110034",
    address: "北京市西城区西什库大街8号",
    logoData: "",
    intro: "北京大学第一医院（简称“北大医院”）创建于1915年2月，是一所融医疗、教学、科研、预防为一体的大型综合性三级甲等医院，是国内创办最早的国立医院之一。",
    route: "乘坐55路、68路、38路、107路、118路、701路、734路、850路、808路、823路公交车，在厂桥站下车。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "11:00",
      rule: [
        "可预约后7天内的号源",
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00",
        "退号时间：就诊前一日11:00前"
      ]
    }
  },
  {
    id: "h003",
    hosname: "北京大学人民医院",
    hoscode: "1002_0",
    hostype: "1",
    provinceCode: "110000",
    cityCode: "110100",
    districtCode: "110044",
    address: "北京市西城区西直门南大街11号",
    logoData: "",
    intro: "北京大学人民医院创建于1918年，是中国人自行集资创办的第一所综合性医院。是集医疗、教学、科研为一体的大型三级甲等医院。",
    route: "乘坐地铁2号线、6号线在车公庄站下车，步行约500米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:30",
      stopTime: "11:00",
      quitDay: 1,
      quitTime: "10:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:30",
        "停挂时间：就诊前一日11:00",
        "退号时间：就诊前一日10:00前"
      ]
    }
  },
  {
    id: "h004",
    hosname: "首都医科大学附属北京天坛医院",
    hoscode: "1003_0",
    hostype: "1",
    provinceCode: "110000",
    cityCode: "110100",
    districtCode: "110000",
    address: "北京市丰台区南四环西路119号",
    logoData: "",
    intro: "首都医科大学附属北京天坛医院座落在北京市南三环，以神经外科为先导，以神经科学为特色，集医教研防为一体的三级甲等综合性医院。",
    route: "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "10:30",
      rule: [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00"
      ]
    }
  },
  {
    id: "h005",
    hosname: "复旦大学附属华山医院",
    hoscode: "2000_0",
    hostype: "1",
    provinceCode: "310000",
    cityCode: "310100",
    districtCode: "310104",
    address: "上海市徐汇区乌鲁木齐中路12号",
    logoData: "",
    intro: "复旦大学附属华山医院创建于1907年，是国家卫生计生委委属医院、复旦大学附属教学医院和中国红十字会冠名的医院，为三级甲等医院。",
    route: "乘坐地铁1号线、7号线常熟路站下车，步行约600米。",
    status: 1,
    bookingRule: {
      cycle: 14,
      releaseTime: "08:00",
      stopTime: "15:00",
      quitDay: 1,
      quitTime: "12:00",
      rule: [
        "预约周期：14天",
        "放号时间：08:00",
        "停挂时间：就诊前一日15:00"
      ]
    }
  },
  {
    id: "h006",
    hosname: "复旦大学附属中山医院",
    hoscode: "2001_0",
    hostype: "1",
    provinceCode: "310000",
    cityCode: "310100",
    districtCode: "310101",
    address: "上海市徐汇区枫林路180号",
    logoData: "",
    intro: "复旦大学附属中山医院是卫生部部属综合性教学医院，创建于1936年，是三级甲等医院，以心、肝、乳腺、肺肿瘤等疾病的诊治为特色。",
    route: "乘坐地铁4号线、7号线东安路站下车，步行约400米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "07:30",
      stopTime: "16:00",
      quitDay: 1,
      quitTime: "14:00",
      rule: [
        "预约周期：7天",
        "放号时间：07:30",
        "停挂时间：就诊前一日16:00"
      ]
    }
  },
  {
    id: "h007",
    hosname: "上海交通大学医学院附属瑞金医院",
    hoscode: "2002_0",
    hostype: "1",
    provinceCode: "310000",
    cityCode: "310100",
    districtCode: "310101",
    address: "上海市黄浦区瑞金二路197号",
    logoData: "",
    intro: "上海交通大学医学院附属瑞金医院建于1907年，是一家三级甲等大型综合性教学医院，全军的疑难重症诊治指导中心之一。",
    route: "乘坐地铁1号线陕西南路站下车，步行约800米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "17:00",
      quitDay: 1,
      quitTime: "15:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日17:00"
      ]
    }
  },
  {
    id: "h008",
    hosname: "江苏省人民医院",
    hoscode: "3000_0",
    hostype: "1",
    provinceCode: "320000",
    cityCode: "320100",
    districtCode: "320102",
    address: "南京市鼓楼区广州路300号",
    logoData: "",
    intro: "江苏省人民医院、南京医科大学第一附属医院，是江苏省规模最大的三级甲等综合性医院，集医疗、教学、科研、医疗保健、康复于一体。",
    route: "乘坐地铁1号线珠江路站下车，步行约1000米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "11:00",
      quitDay: 1,
      quitTime: "10:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日11:00"
      ]
    }
  },
  {
    id: "h009",
    hosname: "无锡市人民医院",
    hoscode: "3001_0",
    hostype: "1",
    provinceCode: "320000",
    cityCode: "320200",
    districtCode: "320205",
    address: "无锡市梁溪区清扬路299号",
    logoData: "",
    intro: "无锡市人民医院是由原无锡市第一人民医院、儿童医院整合建立的三级甲等综合性医院，是南京医科大学附属医院。",
    route: "乘坐地铁1号线人民医院站下车即到。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "11:30",
      quitDay: 1,
      quitTime: "10:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日11:30"
      ]
    }
  },
  {
    id: "h010",
    hosname: "苏州大学附属第一医院",
    hoscode: "3002_0",
    hostype: "1",
    provinceCode: "320000",
    cityCode: "320500",
    districtCode: "320505",
    address: "苏州市姑苏区平海路899号",
    logoData: "",
    intro: "苏州大学附属第一医院始创于1883年，是卫生部首批三级甲等医院，为江苏省卫健委直属的省级重点医院。",
    route: "乘坐地铁4号线苏锦站下车，步行约500米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "10:30",
      rule: [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00"
      ]
    }
  },
  {
    id: "h011",
    hosname: "浙江大学医学院附属第一医院",
    hoscode: "4000_0",
    hostype: "1",
    provinceCode: "330000",
    cityCode: "330100",
    districtCode: "330106",
    address: "杭州市上城区庆春路79号",
    logoData: "",
    intro: "浙江大学医学院附属第一医院建院于1947年，是浙江大学创建的首家附属医院，集医疗、教学、科研、预防、保健为一体的三级甲等医院。",
    route: "乘坐地铁1号线、2号线凤起路站下车，步行约800米。",
    status: 1,
    bookingRule: {
      cycle: 10,
      releaseTime: "07:00",
      stopTime: "17:00",
      quitDay: 1,
      quitTime: "15:00",
      rule: [
        "预约周期：10天",
        "放号时间：07:00",
        "停挂时间：就诊前一日17:00"
      ]
    }
  },
  {
    id: "h012",
    hosname: "浙江大学医学院附属第二医院",
    hoscode: "4001_0",
    hostype: "1",
    provinceCode: "330000",
    cityCode: "330100",
    districtCode: "330103",
    address: "杭州市上城区解放路88号",
    logoData: "",
    intro: "浙江大学医学院附属第二医院创建于1869年，是一所集医疗、教学、科研于一体的大型综合性三级甲等医院。",
    route: "乘坐地铁1号线、4号线近江站下车，步行约600米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "10:30",
      rule: [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    id: "h013",
    hosname: "广东省人民医院",
    hoscode: "5000_0",
    hostype: "1",
    provinceCode: "440000",
    cityCode: "440100",
    districtCode: "440103",
    address: "广州市越秀区中山二路106号",
    logoData: "",
    intro: "广东省人民医院始建于1946年，是一家集医教研及预防保健为一体的大型综合性三级甲等医院。",
    route: "乘坐地铁1号线烈士陵园站下车，步行约300米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "11:30",
      quitDay: 1,
      quitTime: "10:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    id: "h014",
    hosname: "深圳北京大学香港科技大学医学中心",
    hoscode: "5001_0",
    hostype: "1",
    provinceCode: "440000",
    cityCode: "440300",
    districtCode: "440304",
    address: "深圳市福田区莲花路1120号",
    logoData: "",
    intro: "北京大学深圳医院是深圳市政府投资兴建的集医疗、教学、科研、康复、预防保健为一体的现代化综合性三级甲等医院。",
    route: "乘坐地铁10号线冬瓜岭站下车，步行约500米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "10:30",
      rule: [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    id: "h015",
    hosname: "四川大学华西医院",
    hoscode: "6000_0",
    hostype: "1",
    provinceCode: "510000",
    cityCode: "510100",
    districtCode: "510104",
    address: "成都市武侯区国学巷37号",
    logoData: "",
    intro: "四川大学华西医院始建于1892年，是中国西部最大的综合性三级甲等医院，学科门类齐全，技术力量雄厚。",
    route: "乘坐地铁1号线华西坝站下车，步行约500米。",
    status: 1,
    bookingRule: {
      cycle: 14,
      releaseTime: "08:00",
      stopTime: "17:00",
      quitDay: 1,
      quitTime: "15:00",
      rule: [
        "预约周期：14天",
        "放号时间：08:00"
      ]
    }
  },
  {
    id: "h016",
    hosname: "西安交通大学第一附属医院",
    hoscode: "7000_0",
    hostype: "1",
    provinceCode: "610000",
    cityCode: "610100",
    districtCode: "610113",
    address: "西安市雁塔区雁塔西路277号",
    logoData: "",
    intro: "西安交通大学第一附属医院建院于1956年，是西北地区最大的综合性三级甲等医院。",
    route: "乘坐地铁2号线小寨站下车，步行约800米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "10:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    id: "h017",
    hosname: "天津市第一中心医院",
    hoscode: "8000_0",
    hostype: "1",
    provinceCode: "120000",
    cityCode: "120100",
    districtCode: "120100",
    address: "天津市南开区复康路24号",
    logoData: "",
    intro: "天津市第一中心医院是一所以器官移植、急救医学、耳鼻喉科为特色的综合性三级甲等医院。",
    route: "乘坐地铁3号线周邓纪念馆站下车，步行约500米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "11:30",
      quitDay: 1,
      quitTime: "10:00",
      rule: [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    id: "h018",
    hosname: "河北医科大学第二医院",
    hoscode: "9000_0",
    hostype: "1",
    provinceCode: "130000",
    cityCode: "130100",
    districtCode: "130100",
    address: "石家庄市新华区和平西路215号",
    logoData: "",
    intro: "河北医科大学第二医院是河北省最大的一所集医疗、教学、科研、保健、康复、急救为一体的综合性三级甲等医院。",
    route: "乘坐地铁3号线市二中站下车，步行约600米。",
    status: 1,
    bookingRule: {
      cycle: 7,
      releaseTime: "08:00",
      stopTime: "12:00",
      quitDay: 1,
      quitTime: "10:30",
      rule: [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  }
];

module.exports = { hospitals };
