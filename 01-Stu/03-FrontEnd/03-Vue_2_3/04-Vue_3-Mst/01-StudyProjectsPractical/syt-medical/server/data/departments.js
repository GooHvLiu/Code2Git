/**
 * 科室数据 - 对应 hosp_department 表
 * 结构：{ id, hoscode, depcode, depname, title, children: [] }
 * 每家医院都有完整的10个大科室 + 子科室
 */

const { hospitals } = require("./hospitals");

// 大科室模板
const depTemplates = [
  { depcode: "dept_neike", depname: "内科", title: "内科是临床医学的一个专科，是临床医学的基础，与外科相对。" },
  { depcode: "dept_waike", depname: "外科", title: "外科是研究外科疾病的发生、发展规律及其临床表现，诊断、预防和治疗的科学。" },
  { depcode: "dept_fuchan", depname: "妇产科", title: "妇产科是临床医学四大主要学科之一，主要研究女性生殖器官疾病的病因、病理、诊断及防治。" },
  { depcode: "dept_erk", depname: "儿科", title: "儿科是全面研究小儿时期身心发育、保健以及疾病防治的综合医学科学。" },
  { depcode: "dept_yanke", depname: "眼科", title: "眼科是研究发生在视觉系统，包括眼球及与其相关联的组织有关疾病的学科。" },
  { depcode: "dept_erkbi", depname: "耳鼻喉科", title: "耳鼻喉科主要诊疗耳、鼻、咽喉及其相关头颈区域的外科学科。" },
  { depcode: "dept_kouqiang", depname: "口腔科", title: "口腔科主要治疗牙齿、牙周、口腔黏膜、颌面部等疾病。" },
  { depcode: "dept_pifu", depname: "皮肤科", title: "皮肤科属于外科，主要治疗各种皮肤病。" },
  { depcode: "dept_zhongliu", depname: "肿瘤科", title: "肿瘤科主要开展肿瘤的内科治疗，包括化疗、靶向治疗、免疫治疗等。" },
  { depcode: "dept_jingshen", depname: "精神科", title: "精神科涉及的疾病是一系列表现为行为、情绪、认知等方面异常的精神障碍。" },
];

// 子科室
const subDeps = {
  dept_neike: [
    { depcode: "dept_neike_xinnao", depname: "神经内科", title: "神经内科常见疾病包括脑血管疾病、偏头痛、脑部炎症性疾病等。" },
    { depcode: "dept_neike_xinxueguan", depname: "心血管内科", title: "心血管内科诊治心脏和血管相关疾病，包括冠心病、高血压、心律失常等。" },
    { depcode: "dept_neixihu", depname: "呼吸内科", title: "呼吸内科诊治气管、支气管、肺部及胸腔疾病。" },
    { depcode: "dept_neike_xiaohua", depname: "消化内科", title: "消化内科诊治食管、胃、肠、肝、胆、胰等器官疾病。" },
    { depcode: "dept_neike_neifenmi", depname: "内分泌科", title: "内分泌科诊治糖尿病、甲状腺疾病、肥胖症等代谢性疾病。" },
  ],
  dept_waike: [
    { depcode: "dept_waike_zonghe", depname: "普通外科", title: "普通外科诊治甲状腺、乳腺、肝胆胰脾、胃肠等疾病。" },
    { depcode: "dept_waike_guke", depname: "骨科", title: "骨科诊治骨折、关节疾病、脊柱疾病、运动损伤等。" },
    { depcode: "dept_waike_xiongxin", depname: "胸心外科", title: "胸心外科诊治肺、食管、纵隔、心脏等疾病。" },
    { depcode: "dept_waike_shenjing", depname: "神经外科", title: "神经外科诊治脑、脊髓、周围神经系统疾病。" },
    { depcode: "dept_waike_urine", depname: "泌尿外科", title: "泌尿外科诊治泌尿系统及男性生殖系统疾病。" },
  ],
  dept_fuchan: [
    { depcode: "dept_fuchan_fuke", depname: "妇科", title: "妇科诊治女性生殖系统疾病。" },
    { depcode: "dept_fuchan_chan", depname: "产科", title: "产科负责孕期保健、分娩及产后康复。" },
  ],
  dept_erk: [
    { depcode: "dept_erk_neike", depname: "小儿内科", title: "小儿内科诊治儿童常见内科疾病。" },
    { depcode: "dept_erk_chuanshou", depname: "儿童保健科", title: "儿童保健科负责儿童生长发育监测、营养指导等。" },
  ],
  dept_yanke: [
    { depcode: "dept_yanke_zonghe", depname: "眼科综合", title: "眼科综合诊治各类眼部疾病。" },
  ],
  dept_erkbi: [
    { depcode: "dept_erkbi_er", depname: "耳科", title: "耳科诊治耳部疾病。" },
    { depcode: "dept_erkbi_bi", depname: "鼻科", title: "鼻科诊治鼻部疾病。" },
    { depcode: "dept_erkbi_yan", depname: "咽喉科", title: "咽喉科诊治咽喉部疾病。" },
  ],
  dept_kouqiang: [
    { depcode: "dept_kouqiang_yazhou", depname: "牙周科", title: "牙周科诊治牙周组织疾病。" },
    { depcode: "dept_kouqiang_quchen", depname: "牙体牙髓科", title: "牙体牙髓科诊治龋病、牙髓病、根尖周病等。" },
  ],
  dept_pifu: [
    { depcode: "dept_pifu_zonghe", depname: "皮肤科综合", title: "皮肤科综合诊治各类皮肤疾病。" },
  ],
  dept_zhongliu: [
    { depcode: "dept_zhongliu_neike", depname: "肿瘤内科", title: "肿瘤内科以药物治疗为主。" },
    { depcode: "dept_zhongliu_waike", depname: "肿瘤外科", title: "肿瘤以外科手术治疗为主。" },
  ],
  dept_jingshen: [
    { depcode: "dept_jingshen_zonghe", depname: "精神科综合", title: "精神科综合诊治各类精神心理疾病。" },
  ],
};

/**
 * 为每家医院生成完整科室树
 */
function buildDepartments() {
  const result = [];
  hospitals.forEach((hospital) => {
    depTemplates.forEach((tpl) => {
      const children = (subDeps[tpl.depcode] || []).map((sd) => ({
        id: `${hospital.hoscode}_${sd.depcode}`,
        hoscode: hospital.hoscode,
        depcode: sd.depcode,
        depname: sd.depname,
        title: sd.title,
        children: [],
      }));
      result.push({
        id: `${hospital.hoscode}_${tpl.depcode}`,
        hoscode: hospital.hoscode,
        depcode: tpl.depcode,
        depname: tpl.depname,
        title: tpl.title,
        children,
      });
    });
  });
  return result;
}

const departments = buildDepartments();

module.exports = { departments };
