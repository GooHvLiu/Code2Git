/**
 * store/index.js - Vuex Store 入口
 * 
 * 使用 require.context 自动导入 modules 目录下的所有模块
 * 不需要手动 import 每个模块
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// require.context：webpack API，自动导入文件
// 参数：目录、是否递归、匹配正则
const modulesFiles = require.context('./modules', true, /\.js$/)

// 自动加载所有模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// 创建 Store
const store = new Vuex.Store({
  modules,
  getters
})

export default store
