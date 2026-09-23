import { createRouter, createWebHistory } from "vue-router";
// 导入路由常量管理文件
import { INDEX_PATH, HOME_PATH, HOSPITAL_PATH } from "@/const/index";

// createRouter方法，用于创建路由器实例，可以管理多个路由
export default createRouter({
  // 路由模式设置
  history: createWebHistory(),
  // 管理路由
  routes: [
    {
      path: HOME_PATH,
      component: () => import("@/pages/home/index.vue")
    },
    {
      path: HOSPITAL_PATH,
      component: () => import("@/pages/hospital/index.vue")
    },
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
