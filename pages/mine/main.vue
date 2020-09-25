<template>
	<div>
		<div class="test" @click="manager">分类管理</div>
		<div class="test" @click="goodsManager">商品管理</div>
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
			},
			goodsManager(){
				uni.navigateTo({
					url:'../manage/goods/main'
				})
			}
		}
	}
</script>

<style>
</style>
