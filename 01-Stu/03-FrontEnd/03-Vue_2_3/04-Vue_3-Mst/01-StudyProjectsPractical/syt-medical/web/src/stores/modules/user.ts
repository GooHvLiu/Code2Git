// 本文件是 用户 相关的 Pinia Store 存储相关
import { defineStore } from "pinia";
import { ref } from "vue";
// 引入 类型定义

// 引入网络请求标准API

// 创建 用户 状态存储
export const useUserStore = defineStore("UserStore", () => {
  // =============== State
  // 用于存储用户登录的 State 变量 userLoginVisible
  let userLoginVisible = ref(false);
  // 用于存储用户登录中输入手机号或扫码登录的 State 变量 userLoginMethods_Input=true 为输入手机号方式 userLoginMethods_Input=false 为微信扫码登录
  let userLoginMethods_Input = ref(true);
  // =============== Actions
  // 用于存储用户的 State 变量

  // =============== Getters
  return { userLoginVisible, userLoginMethods_Input };
});
