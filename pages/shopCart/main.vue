<template>
	<div>
		<nav-bar nowIndex='2'></nav-bar>
	</div>
</template>

<script>
	import navBar from '../component/navBar.vue'
	export default {
		components:{
			navBar
		},
		onShow() {
			uni.hideHomeButton()
		},
	}
</script>

<style>
</style>
