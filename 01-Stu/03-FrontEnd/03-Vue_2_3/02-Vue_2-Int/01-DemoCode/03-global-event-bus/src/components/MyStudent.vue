<template>
	<div class="student">
		<h2>学生姓名：{{name}}</h2>
		<h2>学生性别：{{sex}}</h2>
		<button @click="sendStudentName" style="height: 30px; ">把学生名给MyStudent组件</button>
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
		methods: {
			sendStudentName(){
				//其次，在触发或者发送的Vue中，现将触发事件与接收事件通过this.$bus.$emit()进行绑定，()内可传入参数
				this.$bus.$emit('communicateByBus',this.name)
			}
		},
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


