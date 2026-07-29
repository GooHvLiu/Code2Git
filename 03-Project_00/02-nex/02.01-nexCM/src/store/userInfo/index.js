import { requestGetUserInfoApi } from '@/common/request/index.js'
export default {
  namespaced: true,
  state: {
    userInfo: JSON.parse(localStorage.getItem("nexCM-user-information")) || {
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
      localStorage.removeItem('nexCM-user-information');
      localStorage.setItem('nexCM-user-information', JSON.stringify(state.userInfo));
    }
  },
  actions: {
    // 网络请求拦截器已经将!=200的全部数据进行了拦截
    async asyncChangeUserInfo(context) {
      const getUserInfoRes = await requestGetUserInfoApi();

      // 如果获取到的数据为空，则不再执行下面的代码
      if (!getUserInfoRes) return;
      context.commit('CHANGEUSERINFO', {
        id: getUserInfoRes.user.id,
        username: getUserInfoRes.user.username,
        role: getUserInfoRes.user.role,
        avatar: getUserInfoRes.user.avatar,
        realName: getUserInfoRes.user.real_name,
        sex: getUserInfoRes.user.sex,
        remark: getUserInfoRes.user.remark
      })

    }
  },
  getters: {}
};
