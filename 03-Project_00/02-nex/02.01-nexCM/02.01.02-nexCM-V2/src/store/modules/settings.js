/**
 * store/modules/settings.js - 系统设置模块
 * 
 * 从 @/settings 读取默认配置
 */
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings, // 是否显示设置面板
  tagsView: tagsView, // 是否显示标签页
  fixedHeader: fixedHeader, // 是否固定头部
  sidebarLogo: sidebarLogo // 是否显示侧边栏 Logo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
