<template>
	<div>
		<MyAnimation/>
		<TransitionSingle/>
		<TransitionMultiple/>
		<ThirdPartyAnimationLibrary/>
	</div>
</template>

<script>
	import MyAnimation from './components/MyAnimation'
	import TransitionSingle from './components/TransitionSingle'
	import TransitionMultiple from './components/TransitionMultiple'
	import ThirdPartyAnimationLibrary from './components/ThirdPartyAnimationLibrary'

	export default {
		name:'App', 
		components:{MyAnimation,TransitionSingle,TransitionMultiple,ThirdPartyAnimationLibrary},
	}
</script>

