<template>
	<div class="school">
		<h2>学校名称：{{name}}</h2>
		<h2>学校地址：{{address}}</h2>
	</div>
</template>

<script>
//需要订阅和发布的话，需要使用npm i pubsub-js安装，并使用import pubsub from'pubsub-js'引入
import pubsub from'pubsub-js'
	export default {
		name:'MySchool',
		data() {
			return {
				name:'尚硅谷',
				address:'北京',
			}
		},
	//引入后使用pubsub.subscribe('xxx',function(msgName,data){})
	//pubId用于销毁时使用，其原理类似于定时器，每个订阅程序都有一个属于自己的ID号
		mounted() {
			this.pubId=pubsub.subscribe('publishMsg',(msgName,data)=>{
				console.log('订阅发布的消息已经接收到了，数据是：',data);
				
			})
		},
		//使用完成后需要进行销毁，方法为：pubsub.unsubscribe(this.pubId)
		beforeDestroy() {
			pubsub.unsubscribe(this.pubId)
		},
	}
</script>

<style scoped>
	.school{
		background-color: skyblue;
		padding: 5px;
	}
</style>