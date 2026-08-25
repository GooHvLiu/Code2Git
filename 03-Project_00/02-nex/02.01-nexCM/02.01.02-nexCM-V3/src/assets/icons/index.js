import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
// 全局注册SvgIcon
Vue.component('svg-icon', SvgIcon)

// 第二个参数 `false` 表示**不递归子目录**，所以当前只加载 `svg` 目录下的直接文件。
const req = require.context('@/assets/icons/svg', true, /\.svg$/)
const requireAll = requireContext => {
  // requireContext.keys()数据：['./404.svg', './agency.svg', './det.svg', './user.svg']
  requireContext.keys().map(requireContext)
}
requireAll(req)
