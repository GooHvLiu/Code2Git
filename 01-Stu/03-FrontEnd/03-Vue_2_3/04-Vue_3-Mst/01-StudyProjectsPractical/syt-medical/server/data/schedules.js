/**
 * 医生排班数据 - 对应 hosp_schedule 表
 * 结构：{ id, hoscode, depcode, title, docname, skill, workDate, dayOfWeek,
 *        reservedNumber, availableNumber, amount, status }
 * status: 1=有号 0=无号
 * 使用确定性伪随机，保证每次启动 schedule id 一致，orders 可稳定关联
 */

const { departments } = require("./departments");

// ===== 确定性伪随机（mulberry32）=====
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20240915);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function randInt(min, max) { return min + Math.floor(rand() * (max - min + 1)); }

// ===== 医生姓名池（按专科分组，更真实）=====
const doctorPool = {
  "神经内科": ["王拥军", "赵性泉", "缪中荣", "李慎茂", "张星虎", "董可辉", "马宁", "高鹏", "徐俊", "宋海庆"],
  "心血管内科": ["张抒扬", "吴永健", "杨跃进", "乔树宾", "高润霖", "陈纪林", "袁晋青", "赵雪燕", "唐熠达", "钱杰"],
  "呼吸内科": ["王辰", "曹彬", "童朝晖", "詹庆元", "黄克武", "孙永昌", "贺蓓", "王广发", "林英翔", "逯勇"],
  "消化内科": ["张澍田", "李鹏", "吕富靖", "王拥军", "宗晔", "吴咏冬", "张沛怡", "于中麟", "冀明", "牛应林"],
  "内分泌科": ["赵家军", "高政南", "陈丽", "王新军", "李启富", "杨涛", "施秉银", "刘超", "陈兵", "徐焱成"],
  "普通外科": ["刘玉村", "万远廉", "潘义生", "吴问汉", "杨尹默", "田孝东", "庄岩", "王维民", "李澍", "王鹏远"],
  "骨科": ["田伟", "刘波", "李勤", "胡临", "李志宇", "袁强", "张贵林", "公茂琪", "蒋协远", "吴新宝"],
  "胸心外科": ["胡盛寿", "孙立忠", "王水云", "郑哲", "潘湘斌", "李守军", "沈向东", "花中东", "闫军", "王强"],
  "神经外科": ["张俊廷", "张力伟", "吴震", "贾桂军", "林松", "江涛", "谢坚", "刘巍", "王集生", "孙彦辉"],
  "泌尿外科": ["那彦群", "李宁忱", "潘铁军", "宋刚", "张凯", "何志嵩", "周利群", "姚林", "张争", "蔡林"],
  "妇科": ["郎景和", "冷金花", "朱兰", "孙大为", "樊庆泊", "黄惠芳", "潘凌亚", "吴鸣", "杨佳欣", "曹冬焱"],
  "产科": ["边旭明", "刘俊涛", "杨剑秋", "高劲松", "马良坤", "戚红", "蒋宇林", "宋英娜", "翁霞云", "王含必"],
  "小儿内科": ["申昆玲", "钱素云", "曾健生", "李峥", "陈晖", "赵成松", "徐樨巍", "王国丽", "周锦", "刘翠英"],
  "儿童保健科": ["王惠珊", "金春华", "张峰", "王琳", "刘莉", "李时莲", "闫琦", "赵冬梅", "张丽晋", "陈欣欣"],
  "眼科综合": ["王宁利", "魏文斌", "朱思泉", "卢海", "刘武", "王军", "张风", "孟淑敏", "李根林", "王开杰"],
  "耳科": ["韩东一", "戴朴", "杨仕明", "刘军", "韩维举", "申卫东", "赵辉", "王秋菊", "吴子明", "王洪田"],
  "鼻科": ["张罗", "周兵", "李云川", "崔顺九", "黄谦", "王成硕", "王先忠", "臧洪瑞", "娄鸿飞", "张盛忠"],
  "咽喉科": ["叶京英", "肖水芳", "李进让", "王军", "王琪", "孙宇", "马丽晶", "肖洋", "田莉", "郭伟"],
  "牙周科": ["栾庆先", "欧阳翔英", "和璐", "曹采方", "孟焕新", "张立", "释栋", "陈智滨", "韩劼", "罗冬青"],
  "牙体牙髓科": ["岳林", "王晓燕", "董艳梅", "高学军", "王嘉德", "张成飞", "梁宇红", "郑树国", "王祖华", "李静"],
  "皮肤科综合": ["王宝玺", "孙秋宁", "李红春", "方凯", "舒畅", "刘洁", "姜国调", "谢勇", "陈金波", "曾跃平"],
  "肿瘤内科": ["石远凯", "孙燕", "王金万", "徐兵河", "王绿化", "李晔雄", "张湘茹", "王燕", "胡兴胜", "黄镜"],
  "肿瘤外科": ["赫捷", "王绿化", "高树庚", "薛奇", "牟巨伟", "毛友生", "孙克林", "方德康", "程贵余", "苏凯"],
  "精神科综合": ["于欣", "王向群", "唐宏宇", "孙新宇", "刘靖", "郭延庆", "贾美香", "李雪荣", "陈致宇", "许又新"],
};

const defaultDoctors = ["张伟", "王芳", "李娜", "赵敏", "陈静", "刘磊", "杨军", "黄洋", "周勇", "吴艳", "徐杰", "孙涛", "马明", "朱超", "胡秀英", "郭霞", "何平", "林刚", "罗桂英", "郑志强"];

const titles = ["主任医师", "副主任医师", "主治医师"];

// 各专科的擅长描述
const skillMap = {
  "神经内科": "擅长脑血管病、头痛、癫痫、帕金森病等神经系统疾病的诊治",
  "心血管内科": "擅长冠心病、高血压、心律失常、心力衰竭等心血管疾病的诊治",
  "呼吸内科": "擅长慢性阻塞性肺疾病、哮喘、肺炎、肺癌等呼吸系统疾病诊治",
  "消化内科": "擅长胃炎、胃溃疡、肝硬化、消化道肿瘤等消化系统疾病诊治",
  "内分泌科": "擅长糖尿病、甲状腺疾病、肥胖症等内分泌代谢疾病诊治",
  "普通外科": "擅长甲状腺、乳腺、胃肠、肝胆胰脾等普外科疾病的手术治疗",
  "骨科": "擅长骨折、关节置换、脊柱疾病、运动损伤的诊治与手术",
  "胸心外科": "擅长肺癌、食管癌、先天性心脏病、冠心病的外科治疗",
  "神经外科": "擅长脑肿瘤、脑血管病、颅脑外伤的显微外科手术治疗",
  "泌尿外科": "擅长泌尿系结石、肿瘤、前列腺疾病及男性生殖系统疾病诊治",
  "妇科": "擅长妇科肿瘤、子宫内膜异位症、盆底功能障碍等妇科疾病诊治",
  "产科": "擅长高危妊娠管理、难产处理、产科急危重症抢救",
  "小儿内科": "擅长儿童呼吸道感染、消化系统疾病、过敏性疾病诊治",
  "儿童保健科": "擅长儿童生长发育评估、营养指导、早期发展促进",
  "眼科综合": "擅长白内障、青光眼、眼底病、屈光不正等眼科疾病诊治",
  "耳科": "擅长中耳炎、耳聋、眩晕、人工耳蜗植入等耳科疾病诊治",
  "鼻科": "擅长鼻炎、鼻窦炎、鼻息肉、鼻腔肿瘤等鼻科疾病诊治",
  "咽喉科": "擅长咽喉炎、声带疾病、睡眠呼吸暂停综合征等咽喉疾病诊治",
  "牙周科": "擅长牙龈炎、牙周炎、牙周组织再生等牙周疾病治疗",
  "牙体牙髓科": "擅长龋病、牙髓病、根尖周病的诊治及牙齿美容修复",
  "皮肤科综合": "擅长湿疹、痤疮、银屑病、皮肤肿瘤等皮肤病诊治",
  "肿瘤内科": "擅长肺癌、乳腺癌、消化道肿瘤的化疗、靶向及免疫治疗",
  "肿瘤外科": "擅长各类实体肿瘤的根治性手术及综合治疗",
  "精神科综合": "擅长抑郁症、焦虑症、精神分裂症等精神心理疾病诊治",
};

/**
 * 生成未来 14 天的日期（确定性）
 */
function genWorkDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDayOfWeek(d) {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[d.getDay()];
}

/**
 * 为每个医院的每个子科室生成医生排班（确定性）
 */
function buildSchedules() {
  const schedules = [];
  let scheduleId = 1;
  const workDates = genWorkDates();

  departments.forEach((dept) => {
    dept.children.forEach((subDept) => {
      const docNames = doctorPool[subDept.depname] || defaultDoctors;
      // 每个子科室固定 4 个医生
      const doctorCount = 4;
      for (let d = 0; d < doctorCount; d++) {
        const title = titles[d % 3]; // 主任、副主任、主治轮换
        const docname = docNames[d % docNames.length];
        const skill = skillMap[subDept.depname] || "擅长各种疑难重症的诊治";

        // 每个医生排 6-9 个工作日（确定性）
        const workCount = 6 + (d % 4);
        const shuffledDates = [...workDates].sort(() => rand() - 0.5).slice(0, workCount);

        shuffledDates.forEach((date) => {
          const reservedNumber = 20 + randInt(0, 20);
          const availableNumber = rand() > 0.25
            ? randInt(1, reservedNumber)
            : 0;
          const amount = title === "主任医师"
            ? 500 + randInt(0, 300)
            : title === "副主任医师"
              ? 300 + randInt(0, 200)
              : 100 + randInt(0, 100);

          schedules.push({
            id: `sch_${scheduleId++}`,
            hoscode: subDept.hoscode,
            depcode: subDept.depcode,
            title,
            docname,
            skill,
            workDate: formatDate(date),
            dayOfWeek: getDayOfWeek(date),
            reservedNumber,
            availableNumber,
            amount,
            status: availableNumber > 0 ? 1 : 0,
          });
        });
      }
    });
  });

  return schedules;
}

const schedules = buildSchedules();

module.exports = { schedules };
