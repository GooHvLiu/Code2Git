import { requestGetUserInfoApi } from '@/common/request/index.js'
import { LOCALSTORAGE_KEYS } from "@/common/constants/storageKey.js";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/common/utils/index.js";
export default {
  namespaced: true,
  state: {
    userInfo: getLocalStorage(LOCALSTORAGE_KEYS.USER_INFO) || {
      id: null,
      username: null,
      role: null,
      avatar: null,
      realName: null,
      sex: null,
      remark: null
    }
  },
  mutations: {
    CHANGEUSERINFO(state, payload) {
      state.userInfo = payload;
      // 将获取到的用户信息存储到浏览器
      removeLocalStorage(LOCALSTORAGE_KEYS.USER_INFO);
      setLocalStorage(LOCALSTORAGE_KEYS.USER_INFO, state.userInfo);
    }
  },
  actions: {
    // 网络请求拦截器已经将!=200的全部数据进行了拦截
    async asyncChangeUserInfo(context) {
      const getUserInfoRes = await requestGetUserInfoApi();
      console.log("getUserInfoRes", getUserInfoRes);

      // 如果获取到的数据为空，则不再执行下面的代码
      if (!getUserInfoRes) return;
      context.commit('CHANGEUSERINFO', {
        id: getUserInfoRes.data.id,
        username: getUserInfoRes.data.username,
        role: getUserInfoRes.data.role,
        avatar: getUserInfoRes.data.avatar,
        realName: getUserInfoRes.data.real_name,
        sex: getUserInfoRes.data.sex,
        remark: getUserInfoRes.data.remark
      })

    }
  },
  getters: {}
};
