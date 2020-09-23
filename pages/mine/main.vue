<template>
	<div>
		<div class="test" @click="manager">管理</div>
		<nav-bar nowIndex='3'></nav-bar>
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
		methods:{
			manager(){
				uni.navigateTo({
					url:'../manage/classify/main'
				})
			}
		}
	}
</script>

<style>
</style>
