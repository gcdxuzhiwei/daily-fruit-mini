<template>
	<div class="main">
		<div :class="nowIndex=='0'?'item nowIndex':'item'" @click="leave(0)">
			<i class="iconfont iconfengche"></i>
			<p>首页</p>
		</div>
		<div :class="nowIndex=='1'?'item nowIndex':'item'" @click="leave(1)">
			<i class="iconfont iconfenlei"></i>
			<p>分类</p>
		</div>
		<div :class="nowIndex=='2'?'item nowIndex':'item'" @click="leave(2)">
			<i class="iconfont icongouwuchekong"></i>
			<p>购物车</p>
		</div>
		<div :class="nowIndex=='3'?'item nowIndex':'item'" @click="leave(3)">
			<i class="iconfont iconwode"></i>
			<p>我的果园</p>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			nowIndex:String
		},
		methods:{
			leave(index){
				if(this.nowIndex-0===index){
					return
				}
				if(index==0){
					uni.redirectTo({
						url:'../index/main'
					})
				}
				if(index==1){
					uni.redirectTo({
						url:'../classify/main'
					})
				}
				if(index==2){
					uni.redirectTo({
						url:'../shopCart/main'
					})
				}
				if(index==3){
					uni.redirectTo({
						url:'../mine/main'
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.main{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		height: 100rpx;
		background-color: #fff;
	}
	.item{
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		color: #666;
		.iconfont::before{
			font-size: 55rpx;
		}
	}
	.nowIndex{
		color: #65a032;
	}
</style>
