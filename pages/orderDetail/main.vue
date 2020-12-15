<template>
	<div v-if="order!==null" style="padding-bottom: 100rpx;">
		<div class="top">
			<div class="title">
				<i :class="'iconfont '+getState(order.state,0)" style="color: rgb(255,153,51);"></i>
				<span>{{getState(order.state,1)}}</span>
			</div>
			<div class="tip" v-if="order.state!==2">你的订单{{getState(order.state,1)}}，感谢您选择天天果园。</div>
			<div class="tip" v-else>物流号:{{order.sendNumber}}</div>
			<div class="time">{{getTime(order.orderTime)}}</div>
		</div>
		<div class="address">
			<div class="first">
				<span class="left">订单编号</span>
				<span class="right">
					{{order.orderId}}
					<span class="copy" @click="copy">复制</span>
				</span>
			</div>
			<div class="second">
				<span class="left">收货地址</span>
				<div class="right">
					<div>{{order.address.detailAddress}}</div>
					<div class='gray'>{{order.address.name+order.address.phone}}</div>
				</div>
			</div>
		</div>
		<div class="bag">
			<div class="title">
				<i class="iconfont iconbaoguo02"></i>
				包裹
				<span>{{order.goods.reduce((pre,val)=>{return pre+val.sum},0)}}件商品<button open-type="contact" class="kefu">在线客服</button></span>
			</div>
			<div class="arrive">
				<div class="left">送达时间</div>
				<div class="right">
					<span class="time">{{order.arriveTime}}</span>
				</div>
			</div>
			<div class="baggoods">
				<div class="item" v-for="(item,index) in order.goods" :key="index">
					<img :src="item.img" alt="">
					<div class="firstTitle">{{item.title}}</div>
					<div class="rule">{{item.rule.split(' ')[0]}}</div>
					<div class="sum">×{{item.sum}}</div>
					<div class="bagprice" style="color: #555;">￥{{(item.sum*item.price).toFixed(2)}}</div>
				</div>
			</div>
		</div>
		<div class="price">
			<div class="left">商品总价<div class="right">￥{{price}}</div>
			</div>
			<div class="left">配送费<div class="right">￥{{(order.price-price).toFixed(2)}}</div>
			</div>
			<div class="right">实付金额:<span style="color: rgb(255,153,51);font-size: 44rpx;">￥{{order.price.toFixed(2)}}</span></div>
		</div>
		<div class="payDetail">
			<div>发票信息：未开发票</div>
			<div>支付方式：钱包</div>
			<div>支付状态：{{order.state<=0?'还未支付':'已支付'}}</div>
			<div>下单时间：{{getTime(order.orderTime)}}</div>
		</div>
		<div v-if="order.state==2" class="again" @click="sureSend">确认收货</div>
		<div v-else-if="order.state!==0" class="again" @click="again">再来一单</div>
		<div v-else class="again" @click="pay">确认付款</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				order: null,
				price: ''
			}
		},
		onLoad(options) {
			this.order = JSON.parse(options.order)
			this.price = this.order.goods.reduce((pre, val) => {
				return pre + val.price * val.sum
			}, 0).toFixed(2)
		},
		methods: {
			getState(state, index) {
				if (index === 0) {
					if (state == -1) {
						return 'iconyiquxiao'
					}
					if (state == 0) {
						return 'icondaifukuan'
					}
					if (state == 1) {
						return 'icondaifahuo'
					}
					if (state == 2) {
						return 'icondaishouhuo'
					}
					if (state == 3) {
						return 'iconyiwancheng'
					}
				}
				if (state == -1) {
					return '已取消'
				}
				if (state == 0) {
					return '待付款'
				}
				if (state == 1) {
					return '待发货'
				}
				if (state == 2) {
					return '待收货'
				}
				if (state == 3) {
					return '已完成'
				}
			},
			getTime(time) {
				function fix(t) {
					t = t + ''
					if (t.length == 1) {
						t = '0' + t
					}
					return t
				}
				const str = new Date(time)
				return str.getFullYear() + '-' + fix(str.getMonth() + 1) + '-' + fix(str.getDate()) + ' ' + fix(str.getHours()) +
					':' + fix(str.getMinutes()) + ':' + fix(str.getSeconds())
			},
			copy() {
				uni.setClipboardData({
					data: this.order.orderId,
					success: function() {
						uni.showToast({
							icon: 'none',
							title: '复制成功'
						})
					}
				});
			},
			again() {
				const arr = uni.getStorageSync('shopcart')
				let {
					goods
				} = this.order
				goods = JSON.parse(JSON.stringify(goods))
				while (goods.length) {
					const {
						goodsCode,
						rule
					} = goods[0]
					let i = -1
					arr.forEach((v, index) => {
						if (v.goodsCode === goodsCode && v.rule === rule) {
							i = index
						}
					})
					if (i === -1) {
						arr.push(goods.shift())
					} else {
						arr[i].sum += goods[0].sum
						goods.shift()
					}
				}
				uni.showLoading({
					title: "跳转中"
				})
				uniCloud.callFunction({
					name: 'shopcart',
					data: {
						type: "update",
						shopcart: arr,
						user: uni.getStorageSync('userPhone')
					}
				}).then((res) => {
					uni.setStorageSync('shopcart', this.shopcart)
					uni.hideLoading()
					uni.navigateTo({
						url: "../shopCart/main?item=true"
					})
				})
			},
			async pay() {
				const {
					result: money
				} = await uniCloud.callFunction({
					name: 'order',
					data: {
						type: "getMoney",
						phone: uni.getStorageSync('userPhone')
					}
				})
				if (money < this.order.price) {
					uni.showToast({
						title: '余额不足',
						icon: 'none'
					})
					return
				} else {
					uniCloud.callFunction({
						name: 'order',
						data: {
							type: "canpay",
							id: this.order._id,
							money: money-this.order.price,
							phone:uni.getStorageSync('userPhone')
						}
					}).then(res => {
						uni.navigateBack()
					})
				}
			},
			sureSend(){
				uniCloud.callFunction({
					name: 'order',
					data: {
						type: "sureSend",
						id: this.order._id,
					}
				}).then(res => {
					uni.navigateBack()
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.top {
		box-sizing: border-box;
		width: 700rpx;
		height: 200rpx;
		margin: 30rpx auto;
		padding: 30rpx 20rpx;
		box-shadow: 0 0 15rpx #eee;
		border-radius: 25rpx;
		font-weight: 600;
		font-size: 38rpx;

		i {
			display: inline;
		}

		span {
			margin-left: 10rpx;
		}

		.time {
			color: #999;
			font-size: 28rpx;
		}

		.tip {
			margin: 15rpx 0 5rpx;
			color: #333;
			font-size: 30rpx;
		}
	}

	.address {
		width: 700rpx;
		height: 260rpx;
		margin: 30rpx auto;
		box-shadow: 0 0 15rpx #eee;
		border-radius: 25rpx;
		font-weight: 600;
		font-size: 32rpx;
		padding: 35rpx 20rpx;
		box-sizing: border-box;

		.first {
			margin-bottom: 40rpx;
		}

		.copy {
			margin: 0 20rpx;
			box-shadow: 0 0 15rpx #aaa;
			box-sizing: border-box;
			padding: 0 20rpx;
			border-radius: 16rpx;
		}

		.right {
			float: right;
			text-align: right;

			.gray {
				color: #888;
			}
		}
	}

	.payDetail {
		color: #999;
		font-size: 30rpx;
		padding-left: 50rpx;

		div {
			margin-bottom: 15rpx;
		}
	}

	.price {
		box-shadow: 0 0 15rpx #eee;
		box-sizing: border-box;
		width: 700rpx;
		margin: 30rpx auto;
		height: 310rpx;
		padding: 45rpx 20rpx;
		font-weight: 600;
		font-size: 32rpx;

		.left {
			margin-bottom: 40rpx;
		}

		.right {
			float: right;
		}
	}

	.again {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 700rpx;
		height: 90rpx;
		font-size: 36rpx;
		text-align: center;
		line-height: 90rpx;
		border-radius: 45rpx;
		box-shadow: 0 0 15rpx #eee;
		font-weight: 600;
		background-color: #fff;
	}

	.bag {
		position: relative;
		width: 690rpx;
		box-shadow: 0 0 15rpx #eee;
		margin: 25rpx auto 35rpx;

		.title {
			position: relative;
			box-sizing: border-box;
			width: 100%;
			height: 140rpx;
			line-height: 140rpx;
			padding-left: 80rpx;
			font-size: 45rpx;
			font-weight: 600;

			i {
				position: absolute;
				top: 50%;
				left: 30rpx;
				transform: translateY(-50%);
				font-size: 42rpx;
				font-weight: 400;
			}

			span {
				position: absolute;
				top: 50%;
				right: 30rpx;
				transform: translateY(-50%);
				font-weight: 400;
				font-size: 32rpx;
				color: #666;
			}
		}

		.arrive {
			position: relative;
			width: 630rpx;
			margin: 0 auto;
			font-weight: 600;
			font-size: 36rpx;

			.right {
				position: absolute;
				top: 50%;
				right: 0;
				transform: translateY(-50%);

				i {
					display: inline;
				}

				.time {
					color: rgb(255, 128, 0);
					font-size: 32rpx;
					position: relative;
					top: -3rpx;
				}
			}
		}

		.baggoods {
			width: 630rpx;
			margin: 0 auto;
			padding: 50rpx 0;

			.item {
				position: relative;
				width: 100%;
				height: 100rpx;
				margin-bottom: 25rpx;
				font-size: 30rpx;

				img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 25rpx;
				}

				.firstTitle {
					position: absolute;
					top: 0;
					left: 115rpx;
					width: 320rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #333;
				}

				.rule {
					position: absolute;
					bottom: 0;
					left: 115rpx;
					color: #666;
				}

				.sum {
					position: absolute;
					right: 150rpx;
					top: 0;
					color: #999;
				}

				.bagprice {
					position: absolute;
					right: 0;
					top: 0;
					font-weight: 600;
				}
			}

			.item:last-child {
				margin-bottom: 0;
			}
		}
	}

	.kefu {
		display: inline-block;
		margin: 0 20rpx;
		box-shadow: 0 0 15rpx #aaa;
		box-sizing: border-box;
		padding: 0 20rpx;
		border-radius: 16rpx;
		height: 40rpx;
		line-height: 40rpx;
		position: relative;
		top: 10rpx;
	}
</style>
