<template>
	<div>
		<h1>{{msg}}</h1>
		<h2>学生姓名：{{name}}</h2>
		<h2>学生性别：{{sex}}</h2>
		<!-- <h2>学生年龄：{{age+2}}</h2> -->
		<h2>学生年龄：{{myAge+2}}</h2>
		<button @click="updateAge">尝试修改收到的年龄</button>
	</div>
</template>

<script>
	export default {
		name:'Student',
		data() {
			console.log(this)
			return {
				msg:'我是一个尚硅谷的学生',
				myAge:this.age
			}
		},
		methods: {
			// 系统内部的props数据是不可修改的，如果需要修改，必须在data中声明一个新的数据属性来接收props传递过来的数据，然后修改这个新的数据属性
			updateAge(){
				this.myAge++
			}
		},
		/* //第1种方式：简单声明接收,该方式在实际使用中应用最广泛的
		props:['name','age','sex']  */

		/* //第2种方式：接收的同时对数据进行类型限制
		props:{
			name:String,
			age:Number,
			sex:String
		}  */

		//第3种方式：接收的同时对数据进行类型限制+默认值的指定+必要性的限制
		props:{
			name:{
				type:String, //name的类型是字符串
				required:true, //name是必要的
			},
			sex:{
				type:String,
				required:true
			},
			age:{
				type:Number,
				default:20 //默认值
			}
		}
	}
</script>