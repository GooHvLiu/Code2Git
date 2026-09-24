import { createRouter, createWebHistory } from "vue-router";
// 导入路由常量管理文件
import { INDEX_PATH, HOME_PATH, HOSPITAL } from "@/const/index";

// createRouter方法，用于创建路由器实例，可以管理多个路由
export default createRouter({
  // 路由模式设置
  history: createWebHistory(),
  // 管理路由
  routes: [
    // Home页面路由
    {
      path: HOME_PATH,
      component: () => import("@/pages/home/index.vue")
    },
    // 医院详情 页面路由
    {
      path: HOSPITAL.PATH,
      component: () => import("@/pages/hospital/index.vue"),
      // 菜单对应子路由路径
      children: [
        // 预约挂号 子路由路径
        {
          path: HOSPITAL.CHILDREN.APPOINTMENT_PATH,
          component: () => import("@/pages/hospital/content/appointment/index.vue")
        },
        // 医院详情 子路由路径
        {
          path: HOSPITAL.CHILDREN.DETAL_PATH,
          component: () => import("@/pages/hospital/content/detail/index.vue")
        },
        // 预约须知 子路由路径
        {
          path: HOSPITAL.CHILDREN.NOTICE_PATH,
          component: () => import("@/pages/hospital/content/notice/index.vue")
        },
        // 停诊信息 子路由路径
        {
          path: HOSPITAL.CHILDREN.STOP_SERVICE_PATH,
          component: () => import("@/pages/hospital/content/stopService/index.vue")
        },
        // 查询与取消 子路由路径
        {
          path: HOSPITAL.CHILDREN.SEARCH_CANCEL_PATH,
          component: () => import("@/pages/hospital/content/searchCancel/index.vue")
        }
      ]
    },
    // 重定向 页面路由
    {
      path: INDEX_PATH,
      redirect: HOME_PATH
    }
  ],
  // 管理滚动行为 保证每次跳转，滚动条都回到最初的上面位置
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    };
  }
});
