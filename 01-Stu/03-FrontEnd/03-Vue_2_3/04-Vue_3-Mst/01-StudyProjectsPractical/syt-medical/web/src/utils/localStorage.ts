/**
 * ==========================================
 * 持久化存储、读取与清除工具 TS版
 * ==========================================
 */
// 引入用户数据
import type { ResLoginItem } from "@/types/userLogin/index";
// 引入本地存储用户数据 常量
import { USERINFO_LOCALSTORAGE } from "@/const/index";

// 用户信息的类
class UserInfoClass {
  /**
   * 本地化 存储用户信息
   * @param userInfo 登录返回的用户对象
   */
  setLocalStorage = (userInfo: ResLoginItem) => {
    // 将用户信息做本地持久化
    localStorage.setItem(USERINFO_LOCALSTORAGE, JSON.stringify(userInfo));
  };

  /**
   * 本地化 读取用户信息
   * @returns 存在则返回用户对象，不存在/解析失败返回 null
   */
  getLocalStorage = (): ResLoginItem | null => {
    const storageStr = localStorage.getItem(USERINFO_LOCALSTORAGE);
    // 没有数据直接返回 null
    if (!storageStr) return null;
    try {
      return JSON.parse(storageStr) as ResLoginItem;
    } catch (err) {
      // JSON损坏，清除脏数据，返回null，防止页面崩溃
      this.clearLocalStorage();
      return null;
    }
  };

  /**
   * 本地化 清除用户信息
   */
  clearLocalStorage = () => {
    // 将用户信息做本地持久化
    localStorage.removeItem(USERINFO_LOCALSTORAGE);
  };
}
export const userInfoMethods = new UserInfoClass();
