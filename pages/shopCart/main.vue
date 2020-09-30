<template>
	<div>
		<div class="noLogin" v-if="login">
			<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/42c518e0-0229-11eb-8ff1-d5dcf8779628.png" alt="">
			<div class="top" @click="goLogin">登录</div>
			<div class="bottom" @click="goIndex">去首页逛逛</div>
		</div>
		<nav-bar nowIndex='2'></nav-bar>
	</div>
</template>

<script>
	import navBar from '../component/navBar.vue'
	export default {
		data(){
			return{
				login:false
			}
		},
		beforeMount() {
			if(!uni.getStorageSync('userPhone')){
				this.login=true
			}else{
			}
		},
		components:{
			navBar
		},
		onShow() {
			uni.hideHomeButton()
		},
		methods:{
			goIndex(){
				uni.redirectTo({
					url:'../index/main'
				})
			},
			goLogin(){
				uni.navigateTo({
					url:'../login/main'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.noLogin{
		text-align: center;
		img{
			margin-top: 100rpx;
			width: 600rpx;
			height: 600rpx;
		}
		.top{
			margin: 0 auto 40rpx;
			width: 550rpx;
			height: 90rpx;
			background-color: rgb(255,126,1);
			line-height: 90rpx;
			border-radius: 45rpx;
			color: #fff;
			font-weight: 500;
		}
		.bottom{
			box-sizing: border-box;
			margin: 0 auto;
			width: 550rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			color: #888;
			font-weight: 500;
			border: 1rpx solid #888;
		}
	}
</style>
