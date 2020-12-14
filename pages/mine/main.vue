<template>
	<div>
		<div class="top">
			<img src="https://www.yunboys.cn/sjtx/api.php" alt="" class="photo">
			<div v-if="!login" class="toLogin" @click="toLogin">请先登录</div>
			<div v-else>
				<div class="phone">{{login}}</div>
				<div class="tab">
					<div class="item">
						<div class="name">资产</div>
						<div class="sum">{{money}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="order" v-if="login">
			<div class="title">我的订单</div>
			<div class="all" @click="myOrder">全部订单<span class="iconfont iconxiangyou"></span></div>
			<div class="tip">
				<div class="item" @click="myOrder(1)">
					<div><span class="iconfont icondaifukuan"></span></div>
					<div>待付款</div>
				</div>
				<div class="item" @click="myOrder(2)">
					<div><span class="iconfont icondaifahuo"></span></div>
					<div>待发货</div>
				</div>
				<div class="item" @click="myOrder(3)">
					<div><span class="iconfont icondaishouhuo"></span></div>
					<div>待收货</div>
				</div>
				<div class="item" @click="myOrder(4)">
					<div><span class="iconfont iconyiwancheng"></span></div>
					<div>已完成</div>
				</div>
			</div>
		</div>
		<div v-if="isAdmin" class="adminBox">
			<div class="test" @click="manager">分类管理</div>
			<div class="test" @click="goodsManager">商品管理</div>
			<div class="test" @click="indexManager">首页管理</div>
			<div class="test" @click="adminManager">权限管理</div>
		</div>
		<nav-bar nowIndex='3'></nav-bar>
	</div>
</template>

<script>
	import navBar from '../component/navBar.vue'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				img: '',
				login: uni.getStorageSync('userPhone'),
				isAdmin: false,
				money: '--'
			}
		},
		onShow() {
			uni.hideHomeButton()
			this.getMoney()
		},
		mounted() {
			this.getAdmin()
		},
		methods: {
			manager() {
				uni.navigateTo({
					url: '../manage/classify/main'
				})
			},
			goodsManager() {
				uni.navigateTo({
					url: '../manage/goods/main'
				})
			},
			indexManager() {
				uni.navigateTo({
					url: '../manage/index/main'
				})
			},
			myOrder(index) {
				if(index>0){
					uni.navigateTo({
						url: `../orderList/main?show=${index}`
					})
					return
				}
				uni.navigateTo({
					url: '../orderList/main'
				})
			},
			adminManager() {
				uni.navigateTo({
					url: '../manage/admin/main'
				})
			},
			toLogin() {
				uni.navigateTo({
					url: '../login/main'
				})
			},
			getAdmin() {
				if (this.login) {
					uniCloud.callFunction({
						name: 'user',
						data: {
							type: "admin",
							phone: this.login,
						}
					}).then((res) => {
						if (res.result) {
							this.isAdmin = true
						}
					})
				}
			},
			getMoney() {
				if (this.login) {
					uniCloud.callFunction({
						name: 'order',
						data: {
							type: "getMoney",
							phone: this.login,
						}
					}).then((res) => {
						this.money=res.result.toFixed(2)
					})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.top {
		position: relative;
		width: 700rpx;
		height: 400rpx;
		border-radius: 18rpx;
		margin: 20rpx auto;
		background-image: url(data:image/jpg;base64,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);
		background-size: 100% 100%;

		.photo {
			position: absolute;
			top: 40rpx;
			left: 25rpx;
			width: 160rpx;
			height: 160rpx;
			border-radius: 80rpx;
		}

		.phone {
			position: absolute;
			left: 210rpx;
			top: 120rpx;
			transform: translateY(-50%);
			font-weight: 600;
			font-size: 50rpx;
		}

		.toLogin {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.tab {
			position: absolute;
			left: 0;
			bottom: 40rpx;
			width: 100%;
			display: flex;

			.item {
				flex: 1;
				text-align: center;

				.sum {
					font-weight: 600;
				}
			}
		}
	}
	.order{
		width: 700rpx;
		height: 300rpx;
		margin: 20rpx auto;
		box-shadow: 0 0 15rpx #eee;
		position: relative;
		.title{
			position: absolute;
			top: 35rpx;
			left: 20rpx;
			font-weight: 600;
			font-size: 40rpx;
		}
		.all{
			position: absolute;
			top: 37rpx;
			right: 20rpx;
			font-weight: 600;
			font-size: 32rpx;
			span{
				margin-left: 16rpx;
			}
		}
		.tip{
			position: absolute;
			left: 0;
			bottom: 40rpx;
			width: 100%;
			display: flex;
			.item{
				flex: 1;
				text-align: center;
				div:first-child>span{
					font-size: 65rpx;
				}
				div:last-child{
					font-size: 28rpx;
				}
			}
		}
	}

	.adminBox {
		display: flex;
		flex-wrap: wrap;

		div {
			width: 325rpx;
			margin: 10rpx 25rpx;
			text-align: center;
			border-radius: 20rpx;
			border: 1px solid #0084c9;
		}
	}
</style>
