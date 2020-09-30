<template>
	<div class="main">
		<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/421517e0-022b-11eb-8ff1-d5dcf8779628.png" alt="">
		<div>精选全球水果生鲜，把新鲜和美味送到家!</div>
		<div>质优、健康、便利、快速、放心!</div>
		<div class="login" @click="login">登录/注册</div>
		<div class="overlay" v-if="overlay">
			<div class="form">
				<div>
					请输入手机号：<input type="number" v-model="phone">
				</div>
				<div>
					请输入密码：<input type="password" v-model="password1">
				</div>
				<div>
					确认密码：<input type="password" v-model="password2">
				</div>
				<div class="sure" @click="sure">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				overlay:false,
				phone:'',
				password1:'',
				password2:''
			}
		},
		methods:{
			login(){
				this.overlay=true
			},
			sure(){
				if(this.phone.length!==11){
					uni.showToast({
						title:'请输入正确的手机号',
						icon:'none'
					})
					return
				}
				if(this.password1!==this.password2){
					uni.showToast({
						title:'两次密码不一致',
						icon:'none'
					})
					return
				}
				if(this.password1.length<6){
					uni.showToast({
						title:'密码强度不够',
						icon:'none'
					})
					return
				}
				uniCloud.callFunction({
					name: 'user',
					data:{
						type:"login",
						phone:this.phone,
						password:this.password1
					}
				}).then((res)=>{
					if(res.result=='error'){
						uni.showToast({
							title:'登录/注册失败',
							icon:'none'
						})
					}else{
						uni.showToast({
							title:res.result,
							icon:'none'
						})
						uni.setStorageSync('userPhone',this.phone)
						uni.reLaunch({
						    url: '../index/main'
						});
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.main{
		text-align: center;
		img{
			margin-top: 200rpx;
			margin-bottom: 85rpx;
			width: 600rpx;
			height: 400rpx;
		}
		div{
			font-weight: 500;
			color: #666;
			font-size: 30rpx;
		}
		.login{
			margin: 40rpx auto;
			width: 600rpx;
			height: 90rpx;
			color: #fff;
			font-weight: 500;
			line-height: 90rpx;
			border-radius: 45rpx;
			background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
		}
		.overlay{
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0,0,0,0.5);
			.form{
				padding: 50rpx 15rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-75%);
				width: 450rpx;
				height: 350rpx;
				background-color: #fff;
				border-radius: 25rpx;
				div{
					margin-bottom: 20rpx;
					position: relative;
					text-align: left;
					input{
						font-size: 24rpx;
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						display: inline-block;
						width: 200rpx;
						background-color: #eee;
						height: 10rpx;
					}
				}
				.sure{
					width: 300rpx;
					height: 100rpx;
					line-height: 100rpx;
					border-radius: 50rpx;
					background-color: rgb(255,126,1);
					color: #fff;
					text-align: center;
					margin: 100rpx auto 0;
				}
			}
		}
	}
</style>
