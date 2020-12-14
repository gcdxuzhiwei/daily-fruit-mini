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
			<div class="sum" v-if="sum>0">{{sum}}</div>
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
		data(){
			return {
				sum:0
			}
		},
		mounted() {
			this.getSum()
		},
		methods:{
			getSum(){
				this.sum=(uni.getStorageSync('shopcart')||[]).reduce((pre,val)=>{
					return pre+(val.select?val.sum:0)
				},0)
			},
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
		z-index: 999;
	}
	.item{
		position: relative;
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		color: #666;
		.iconfont::before{
			font-size: 55rpx;
		}
		.sum{
			position: absolute;
			top: 5rpx;
			right: 40rpx;
			width: 36rpx;
			height: 36rpx;
			border-radius: 18rpx;
			color: #fff;
			font-weight: 600;
			background-color: red;
			font-size: 24rpx;
			text-align: center;
			line-height: 36rpx;
		}
	}
	.nowIndex{
		color: #65a032;
	}
</style>
