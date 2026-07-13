<template>
	<div class="school">
		<h2>学校名称：{{name}}</h2>
		<h2>学校地址：{{address}}</h2>
	</div>
</template>

<script>
	export default {
		name:'MySchool',
		data() {
			return {
				name:'尚硅谷',
				address:'北京',
			}
		},
		mounted() {
			// 通过在main.js中创建的bus总线方法实现各个Vue组件中的通讯
			//首先，先在接收端创建一个接收后处理的方法和自定义事件
			this.$bus.$on('communicateByBus',
				(data)=>{
					console.log('我是School组件，我接收到了这个数据：',data);
					
				}
			)
		},
		//在接收端Vue即将摧毁前，将总线通讯进行摧毁
		beforeDestroy() {
			this.$bus.$off('communicateByBus')
		},
	}
</script>

<style scoped>
	.school{
		background-color: skyblue;
		padding: 5px;
	}
</style>