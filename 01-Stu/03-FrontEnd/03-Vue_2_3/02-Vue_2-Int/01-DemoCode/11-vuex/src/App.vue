<template>
	<div>
		<UsersCount/>
		<hr>
		<UsersPerson/>
	</div>
</template>

<script>
	import UsersCount from './components/UsersCount'
	import UsersPerson from './components/UsersPerson'

	export default {
		name:'App',
		components:{UsersCount,UsersPerson},
		mounted() {
			// console.log('App',this)
		},
	}
</script>
