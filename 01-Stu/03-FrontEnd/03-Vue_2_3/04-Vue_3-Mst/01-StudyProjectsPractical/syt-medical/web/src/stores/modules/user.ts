// 本文件是 用户 相关的 Pinia Store 存储相关
import { defineStore } from "pinia";
import { ref, computed } from "vue";
// 引入用户数据 类型
import type { ResUserInfo, ResLoginItem } from "@/types/userLogin/index";

// 引入网络请求标准API

// 引入本地持久化存储工具
import { userInfoMethods } from "@/utils/index";

// 创建 用户 状态存储
export const useUserStore = defineStore("UserStore", () => {
  // =============== State
  // 用于存储用户登录的 State 变量 userLoginVisible
  const userLoginVisible = ref(false);
  // 用于存储用户登录中输入手机号或扫码登录的 State 变量 userLoginMethods_Input=true 为输入手机号方式 userLoginMethods_Input=false 为微信扫码登录
  const userLoginMethods_Input = ref(true);
  // 用于存储 用户Token信息 的 State 变量
  const useTokenInfo = ref<ResLoginItem | null>(userInfoMethods.getLocalStorage());
  // 用户存储 用户信息
  const userInfo = ref<ResUserInfo | null>();

  // =============== Actions
  /**
   * 设置用户信息：存入pinia + 持久化到localStorage
   * @param info 登录接口返回用户信息对象
   */
  const setUserInfo = (info: ResLoginItem) => {
    // 将传入的用户信息保存在 Pinia Store 变量内
    useTokenInfo.value = info;
    // 将用户信息做本地化存储
    userInfoMethods.setLocalStorage(info);
    // 测试使用
    // console.log("当前 Pinia 存储的userInfo:", userInfo.value);
    // 返回code =200代码用于前端确认用户信息是否保存成功
  };
  /**
   * 清空用户信息（退出登录使用）
   */
  const clearUserInfo = () => {
    useTokenInfo.value = null;
    userInfo.value = null;
    userInfoMethods.clearLocalStorage();
  };

  // =============== Getters
  /** 是否登录，判断token是否存在 */
  const isLogin = computed(() => useTokenInfo.value?.token);
  return { userLoginVisible, userLoginMethods_Input, useTokenInfo, userInfo, setUserInfo, clearUserInfo, isLogin };
});
