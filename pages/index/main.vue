<template>
	<div>
		<div class="location">
			<div class="box">
				<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/8b3498b0-0091-11eb-8ff1-d5dcf8779628.png" alt="">
				<div class="local" @click="chooseLocal">{{location}}</div>
				<i @click="goSearch" class="iconfont iconsousuo"></i>
			</div>
		</div>
		<swiper class="swiper" indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ff8000">
			<swiper-item class="swiperItem" v-for="(item,index) in swiper" :key="index">
				<img :src="item.img" alt="" @click="goDetail(item.goodCode,item.rule)">
			</swiper-item>
		</swiper>
		<div class="goodsList">
			<div class="goodItem" v-for="(item,index) in goodsList" :key="index" @click="goGoodDetail(item,item.rule[0])">
				<img :src="item.swiperImg[0]" alt="">
				<span class="firstTitle">{{item.firstTitle}}</span>
				<span class="secondTitle">{{item.secondTitle}}</span>
				<span class="price">￥<span class="big">{{priceFix(item.rule[0][1],1)}}</span>.{{priceFix(item.rule[0][1],2)}}</span>
				<span class="rule">{{item.rule[0][0]}}</span>
				<span @click.stop="addShopcart(item.goodsCode,item.rule[0][0],item.swiperImg[0],item.firstTitle,item.rule[0][1])" class="add">+</span>
			</div>
		</div>
		<nav-bar ref="nav" nowIndex='0'></nav-bar>
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
				location: '',
				swiper: [],
				goodsList: []
			}
		},
		onShow() {
			this.$refs.nav.getSum()
		},
		mounted() {
			if (uni.getStorageSync('location')) {
				this.location = uni.getStorageSync('location')
			} else {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						this.location = res.longitude.toFixed(2) + ',' + res.latitude.toFixed(2)
					}
				});
			}
			uniCloud.callFunction({
				name: 'indexManager',
				data: {
					type: "getSwiper"
				}
			}).then((res) => {
				this.swiper = res.result.data
			})
			uniCloud.callFunction({
				name: 'goods',
				data: {
					type: "shuffle"
				}
			}).then((res) => {
				this.goodsList = res.result
			})
		},
		methods: {
			priceFix(price,index){
				price=price.toFixed(2)+''
				let res=price.split('.')
				if(index==1){
					return res[0]
				}
				if(index==2){
					return res[1]
				}
			},
			chooseLocal() {
				uni.chooseLocation({
					success: (res) => {
						let name = res.name
						if (name.length >= 8) {
							name = name.slice(0, 8) + '...'
						}
						this.location = name
						uni.setStorageSync('location', name);
					}
				});
			},
			goDetail(goodCode, rule) {
				if (!goodCode || !rule) {
					return
				}
				uni.navigateTo({
					url: `../goodsDetail/main?goodCode=${goodCode}&rule=${rule}`
				})
			},
			goSearch() {
				uni.navigateTo({
					url: "../search/main"
				})
			},
			goGoodDetail(item1,item2){
				uni.navigateTo({
					url:`../goodsDetail/main?goodCode=${item1.goodsCode}&rule=${item2[0]}`
				})
			},
			addShopcart(goodsCode,rule,img,title,price){
				if(!uni.getStorageSync('userPhone')){
					uni.navigateTo({
						url:'../login/main'
					})
				}else{
					const arr=uni.getStorageSync('shopcart')||[]
					if(arr.length==0){
						arr.push({
							goodsCode,
							img,
							title,
							price,
							rule,
							sum:1,
							select:true
						})
					}else{
						let flag=true
						for(let i=0;i<arr.length;i++){
							if(arr[i].goodsCode==goodsCode&&arr[i].rule==rule){
								arr[i].sum=arr[i].sum+1,
								arr[i].select=true
								flag=false
							}
						}
						if(flag){
							arr.push({
								goodsCode,
								img,
								title,
								price,
								rule,
								sum:1,
								select:true
							})
						}
					}
					uniCloud.callFunction({
						name: 'shopcart',
						data:{
							type:"update",
							shopcart:arr,
							user:uni.getStorageSync('userPhone')
						}
					}).then((res)=>{
						uni.setStorageSync('shopcart',arr)
						this.$refs.nav.getSum()
						uni.showToast({
							icon:"none",
							title:"添加购物车成功"
						})
					})
				}
			}
		},
		onShareAppMessage() {

		}
	}
</script>

<style lang="less" scoped>
	.location {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		padding-top: 50rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		z-index: 99999;

		.box {
			position: relative;
			width: 100%;
			height: 100rpx;

			img {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				height: 70rpx;
				width: 140rpx;
			}

			.local {
				position: absolute;
				left: 142rpx;
				top: 50%;
				transform: translateY(-50%);
				color: #65a032;
				font-size: 33rpx;
				font-weight: 600;
			}

			.local::after {
				content: '';
				display: inline-block;
				position: absolute;
				right: -22rpx;
				top: 50%;
				transform: translateY(-5rpx);
				border: 11rpx solid transparent;
				border-top: 11rpx solid #65a032;
			}

			.iconsousuo {
				position: absolute;
				top: 50%;
				left: 480rpx;
				font-size: 43rpx;
				color: #888;
				font-weight: 500;
				transform: translateY(-50%);
			}
		}
	}

	.swiper {
		margin-top: 150rpx;

		.swiperItem {
			box-sizing: border-box;
			padding: 0 15rpx;

			img {
				width: 100%;
				height: 100%;
				border-radius: 15rpx;
				overflow: hidden;
			}
		}
	}

	.goodsList {
		padding-bottom: 100rpx;
		.goodItem{
			position: relative;
			width: 750rpx;
			height: 200rpx;
			margin: 40rpx 0;
			img{
				position: absolute;
				top: 0;
				left: 30rpx;
				width: 200rpx;
				height: 200rpx;
				border-radius: 18rpx;
				overflow: hidden;
			}
			.firstTitle{
				position: absolute;
				left: 250rpx;
				top: 0;
				font-size: 30rpx;
				font-weight: 600;
			}
			.secondTitle{
				position: absolute;
				left: 250rpx;
				top: 42rpx;
				color: rgb(175,175,175);
				font-size: 28rpx;
			}
			.rule{
				position: absolute;
				bottom: 0;
				left: 360rpx;
				color: rgb(175,175,175);
				font-size: 26rpx;
			}
			.price{
				position: absolute;
				bottom: 0;
				left: 250rpx;
				color: rgb(255,131,6);
				font-size: 23rpx;
				font-weight: 500;
				.big{
					font-size: 30rpx;
				}
			}
			.add{
				position: absolute;
				bottom: 0;
				right: 30rpx;
				width: 45rpx;
				height: 45rpx;
				border-radius: 22.5rpx;
				background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
				color: #fff;
				line-height: 45rpx;
				text-align: center;
				font-weight: 700;
			}
		}
	}
</style>
