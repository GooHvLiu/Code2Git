//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false

//创建vm
new Vue({
	el: '#app',
	render: h => h(App),

	// 如下为创建全局数据总线,全局的VC和VM都能具有此方法$bus及对应的$on、$off、$emit
	beforeCreate() {
		Vue.prototype.$bus = this
	},
})