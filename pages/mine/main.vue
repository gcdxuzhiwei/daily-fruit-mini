<template>
	<div>
		<div class="test" @click="manager">分类管理</div>
		<div class="test" @click="goodsManager">商品管理</div>
		<div class="test" @click="indexManager">首页管理</div>
		<div class="test" @click="myOrder">我的订单</div>
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
			},
			indexManager(){
				uni.navigateTo({
					url:'../manage/index/main'
				})
			},
			myOrder(){
				uni.navigateTo({
					url:'../orderList/main'
				})
			}
		}
	}
</script>

<style>
</style>
