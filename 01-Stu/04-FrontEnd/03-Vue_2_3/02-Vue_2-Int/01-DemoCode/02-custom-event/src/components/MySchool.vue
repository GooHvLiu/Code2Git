<template>
	<div class="school">
		<h2>学校名称：{{name}}</h2>
		<h2>学校地址：{{address}}</h2>
		<button @click="getSchoolName(name)">把学校名给App</button>
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
		props:['getSchoolName']
	}
</script>

<style scoped>
	.school{
		background-color: skyblue;
		padding: 5px;
	}
</style>