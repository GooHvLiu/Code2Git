// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import UserAbout from '../pages/UserAbout'
import UserHome from '../pages/UserHome'

//创建并暴露一个路由器
export default new VueRouter({
	routes: [
		{
			path: '/about',
			component: UserAbout
		},
		{
			path: '/home',
			component: UserHome
		}
	]
})
