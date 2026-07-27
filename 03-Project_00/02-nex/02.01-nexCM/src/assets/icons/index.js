import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
// 全局注册SvgIcon
Vue.component('svg-icon', SvgIcon);

const req = require.context('@/assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => {
  // requireContext.keys()数据：['./404.svg', './agency.svg', './det.svg', './user.svg']
  requireContext.keys().map(requireContext)
  // console.log(requireContext.keys());

}
requireAll(req)
