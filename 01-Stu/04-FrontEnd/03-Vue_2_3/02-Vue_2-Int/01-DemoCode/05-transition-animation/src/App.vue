<template>
	<div>
		<MyAnimation/>
		<TransitionSingle/>
		<TransitionMultiple/>
	</div>
</template>

<script>
	import MyAnimation from './components/MyAnimation'
	import TransitionSingle from './components/TransitionSingle'
	import TransitionMultiple from './components/TransitionMultiple'

	export default {
		name:'App', 
		components:{MyAnimation,TransitionSingle,TransitionMultiple},
	}
</script>

