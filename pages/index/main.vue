<template>
	<div>
		<div class="location">
			<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/8b3498b0-0091-11eb-8ff1-d5dcf8779628.png" alt="">
			<div class="local" @click="chooseLocal">{{location}}</div>
		</div>
		<nav-bar nowIndex='0'></nav-bar>
	</div>
</template>

<script>
	import navBar from '../component/navBar.vue'
	export default {
		components:{
			navBar
		},
		data(){
			return {
				location:''
			}
		},
		mounted() {
			if(uni.getStorageSync('location')){
				this.location=uni.getStorageSync('location')
			}else{
				uni.getLocation({
				    type: 'wgs84',
				    success: (res)=> {
						this.location=res.longitude.toFixed(2)+','+res.latitude.toFixed(2)
				    }
				});
			}
		},
		methods:{
			chooseLocal(){
				uni.chooseLocation({
				    success: (res)=> {
						let name=res.name
						if(name.length>=8){
							name=name.slice(0,8)+'...'
						}
				        this.location=name
						uni.setStorageSync('location', name);
				    }
				});
			}
		},
		onShareAppMessage(){
			
		}
	}
</script>

<style lang="less" scoped>
	.location{
		position: relative;
		width: 100%;
		margin-top: 50rpx;
		height: 100rpx;
		line-height: 100rpx;
		img{
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			height: 70rpx;
			width: 140rpx;
		}
		.local{
			position: absolute;
			left: 142rpx;
			top: 50%;
			transform: translateY(-50%);
			color: #65a032;
			font-size: 33rpx;
			font-weight: 600;
		}
		.local::after{
			content: '';
			display: inline-block;
			position: absolute;
			right: -22rpx;
			top: 50%;
			transform: translateY(-5rpx);
			border: 11rpx solid transparent;
			border-top: 11rpx solid #65a032;
		}
	}
</style>
