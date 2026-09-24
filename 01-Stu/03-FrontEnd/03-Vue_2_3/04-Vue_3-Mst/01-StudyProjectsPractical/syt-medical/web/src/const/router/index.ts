// INDEX path 统一放在这里保存和管理
export const INDEX_PATH = "/";

// HOME path 统一放在这里保存和管理
export const HOME_PATH = "/home";

// HOSPITAL path 统一放在这里保存和管理
export const HOSPITAL = {
  // 首页路径
  PATH: "/hospital",
  // 菜单对应子路由路径
  CHILDREN: {
    // 预约挂号 子路由路径
    APPOINTMENT_PATH: "appointment",
    // 医院详情 子路由路径
    DETAL_PATH: "detail",
    // 预约须知 子路由路径
    NOTICE_PATH: "notice",
    // 停诊信息 子路由路径
    STOP_SERVICE_PATH: "stopService",
    // 查询与取消 子路由路径
    SEARCH_CANCEL_PATH: "searchCancel"
  }
};
