<template>
	<div class="app">
		<h1>{{msg}}</h1>
		<!-- 通过父组件给子组件传递函数类型的props实现：子父传递数据 -->
		<MySchool :getSchoolName="getSchoolName"/>
		<!-- 通过父组件给子组件绑定一个自定义事件实现：子给父传递数据，此为第1种方法，可以使用v-on:或者@ -->
		<MyStudent v-on:testOne="getStudentName" @demo="ceshi"/>
		<!-- 此方法为了说明，增加once是为了表示此自定义方法只可以使用一次
		<MyStudent v-on:testOne.once="getStudentName"/> -->

		<!-- 如下方法和上面的一行是一个意思，就是在此处用ref指定，相当于student是app的一个实例对象，通过this.$ref.student可以选中，此为第2种方法 -->
		<MyStudent ref="student"/>
	</div>
</template>

<script>
	import MyStudent from './components/MyStudent'
	import MySchool from './components/MySchool'

	export default {
		name:'App', 
		data(){
			return{
				msg:'你好啊'
			}
		},
		components:{MySchool,MyStudent},
		methods:{
			getSchoolName(name){
				console.log('App收到了学校名为：',name)
			},
			// 第1种实现：此方法配合<Student ref="student"/>一起使用，不灵活
			//...a是使用了ES6的语法，意思是将剩余的数据全部整合到a的数组当中
			getStudentName(name,...params){
				console.log('App收到了学生名为：',name,params)
			},
			ceshi(){
				console.log('多个绑定事件解绑使用测试')
			}
		},
		// 第2种实现：此方法配合<Student ref="student"/>一起使用，灵活性好
		mounted(){
			// 增加定时器只是为了阐明，此种方法的灵活性
			setTimeout(() => {
				this.$refs.student.$on('testOne',this.getStudentName)
				/* // 如下方法代表此自定义事件只支持一次
				this.$refs.student.$once('testOne',this.getStudentName) */
			}, 3000);
		}
	}
</script>

<style scoped>
	.app{
		background-color: gray;
		padding: 5px;
	}
</style>
