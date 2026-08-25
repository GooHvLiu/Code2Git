/**
 * ==========================================
 * Vuex Store
 * ==========================================
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// 新模块
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import errorLog from './modules/errorLog'
import websocket from './modules/websocket'
import device from './modules/device'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
    errorLog,
    websocket,
    device
  },
  getters
})
