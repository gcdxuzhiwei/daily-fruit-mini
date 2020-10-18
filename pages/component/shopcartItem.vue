<template>
	<div class="main" @click="goShopCart">
		<i class="iconfont icongouwuchekong"></i>
		<div class="sum" v-if="sum>0">{{sum}}</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			sum:0
		}
	},
	mounted() {
		if(!uni.getStorageSync('shopcart')){
			if(uni.getStorageSync('userPhone')){
				uniCloud.callFunction({
					name: 'shopcart',
					data:{
						type:"get",
						user:uni.getStorageSync('userPhone')
					}
				}).then((res)=>{
					uni.setStorageSync('shopcart',res.result.data[0].shopcart)
					this.getSum()
				})
			}
		}else{
			this.getSum()
		}
	},
	methods:{
		getSum(){
			this.sum=uni.getStorageSync('shopcart').reduce((pre,val)=>{
				return pre+(val.select?val.sum:0)
			},0)
		},
		goShopCart(){
			uni.navigateTo({
				url:"../shopCart/main?item=true"
			})
		}
	}
}
</script>

<style lang="less" scoped>
.main{
	z-index: 99999;
	position: fixed;
	bottom: 15rpx;
	left: 0;
	height: 74rpx;
	width: 104rpx;
	border-top-right-radius: 37rpx;
	border-bottom-right-radius: 37rpx;
	background-image:linear-gradient(to right, rgb(144,199,71) , rgb(109,168,54));
	.iconfont{
		color: #fff;
		font-size: 43rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.sum{
		background-color: rgb(255,128,0);
		width: 44rpx;
		height: 29rpx;
		border-radius: 14.5rpx;
		position: absolute;
		top: 5rpx;
		right: -3rpx;
		font-size: 24rpx;
		color: #fff;
		font-size: 500;
		text-align: center;
		line-height: 29rpx;
	}
}
</style>
