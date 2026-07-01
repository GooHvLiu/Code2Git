<template>
	<div class="student">
		<h2>学生姓名：{{name}}</h2>
		<h2>学生性别：{{sex}}</h2>
		<button @click="sendStudentName" style="height: 30px; ">把学生名给MyStudent组件</button>
	</div>
</template>

<script>
//需要订阅和发布的话，需要使用npm i pubsub-js安装，并使用import pubsub from'pubsub-js'引入
import pubsub from'pubsub-js'
	export default {
		name:'MyStudent',
		data() {
			return {
				name:'张三',
				sex:'男'
			}
		},
		methods: {
			//引入后使用pubsub.publish(msgName,data)
			sendStudentName(){
				pubsub.publish('publishMsg',666)
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


