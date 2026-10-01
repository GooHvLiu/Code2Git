import { createRouter, createWebHistory } from "vue-router";
// 导入路由常量管理文件
import { INDEX, HOME, HOSPITAL } from "@/const/index";

// createRouter方法，用于创建路由器实例，可以管理多个路由
export default createRouter({
  // 路由模式设置
  history: createWebHistory(),
  // 管理路由
  routes: [
    // Home页面路由
    {
      path: HOME.path,
      component: () => import("@/pages/home/index.vue")
    },
    // 医院详情 页面路由
    {
      path: HOSPITAL.path,
      component: () => import("@/pages/hospital/index.vue"),
      // 菜单对应子路由路径
      children: [
        // 预约挂号 子路由路径
        {
          path: HOSPITAL.CHILDREN.APPOINTMENT.path,
          component: () => import("@/pages/hospital/content/appointment/index.vue"),
          // 用户点击对应医院 + 已登录情况下，进入具体科室挂号页面
          children: [
            // 具体预约医生上午 / 下午 页面
            {
              path: HOSPITAL.CHILDREN.APPOINTMENT.CHILDREN.APPOINTMENT_DETAIL.path,
              component: () => import("@/pages/hospital/content/appointment/doctorDetail/index.vue")
            }
          ]
        },
        // 医院详情 子路由路径
        {
          path: HOSPITAL.CHILDREN.DETAL.path,
          component: () => import("@/pages/hospital/content/detail/index.vue")
        },
        // 预约须知 子路由路径
        {
          path: HOSPITAL.CHILDREN.NOTICE.path,
          component: () => import("@/pages/hospital/content/notice/index.vue")
        },
        // 停诊信息 子路由路径
        {
          path: HOSPITAL.CHILDREN.STOP_SERVICE.path,
          component: () => import("@/pages/hospital/content/stopService/index.vue")
        },
        // 查询与取消 子路由路径
        {
          path: HOSPITAL.CHILDREN.SEARCH_CANCEL.path,
          component: () => import("@/pages/hospital/content/searchCancel/index.vue")
        }
      ]
    },
    // 重定向 页面路由
    {
      path: INDEX.path,
      redirect: HOME.path
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
