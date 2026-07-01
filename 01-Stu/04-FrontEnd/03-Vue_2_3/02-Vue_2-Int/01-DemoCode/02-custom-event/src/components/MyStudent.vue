<template>
	<div class="student">
		<h2>学生姓名：{{name}}</h2>
		<h2>学生性别：{{sex}}</h2>
		<button @click="sendStudentName">把学生名给App</button>
		<button @click="unbind">解绑testOne事件</button>
	</div>
</template>

<script>
	export default {
		name:'MyStudent',
		data() {
			return {
				name:'张三',
				sex:'男'
			}
		},
		props:['testOne'],
		methods:{
			sendStudentName(){
				//触发Student组件实力的对象身上的testOne事件,666,888,999是为了测试多个参数，配合...params使用的
				this.$emit('testOne',this.name,666,888,999)
				// 如下demo只是为了测试多个自定义事件的解绑逻辑和方法使用
				this.$emit('demo')
			},
			unbind(){
				//解绑一个事件，使用$off实现
				this.$off('testOne')

				//多个绑定事件的解绑方法
				this.$off(['testOne','demo'])

				//所有的绑定事件的解绑方法
				this.$off()
			}
		}
	}
</script>
<!-- 此处需要安装npm less less-loader -->
<style lang="less" scoped>
	.student{
		background-color: pink;
		padding: 5px;
		margin-top: 30px;
	}
</style>


