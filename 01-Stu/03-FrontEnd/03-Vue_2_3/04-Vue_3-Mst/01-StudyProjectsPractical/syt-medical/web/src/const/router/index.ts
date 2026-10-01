// INDEX path 统一放在这里保存和管理
export const INDEX = {
  path: "/"
};

// HOME path 统一放在这里保存和管理
export const HOME = {
  path: "/home"
};

// HOSPITAL path 统一放在这里保存和管理
export const HOSPITAL = {
  // 首页路径
  path: "/hospital",
  // 菜单对应子路由路径
  CHILDREN: {
    // 预约挂号 子路由路径
    APPOINTMENT: {
      path: "appointment",
      CHILDREN: {
        APPOINTMENT_DETAIL: {
          path: "appointmentDetail"
        }
      }
    },
    // 医院详情 子路由路径
    DETAL: {
      path: "detail"
    },
    // 预约须知 子路由路径
    NOTICE: {
      path: "notice"
    },
    // 停诊信息 子路由路径
    STOP_SERVICE: {
      path: "stopService"
    },
    // 查询与取消 子路由路径
    SEARCH_CANCEL: {
      path: "searchCancel"
    }
  }
};
