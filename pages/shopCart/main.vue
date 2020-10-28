<template>
	<div>
		<div class="noLogin" v-if="login">
			<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/42c518e0-0229-11eb-8ff1-d5dcf8779628.png" alt="">
			<div class="top" @click="goLogin">登录</div>
			<div class="bottom" @click="goIndex">去首页逛逛</div>
		</div>
		<div class="address" v-if="!login&&address!==null" @click="showMask">
			<div class="noAddress" v-if="address.length==0">
				<i class="iconfont icontianjiadizhi"></i>添加地址
			</div>
			<div :class="showAddress.type!==''?'haveIcon haveAddress':'haveAddress'" v-else>
				<i v-if="showAddress.type!==''" :class="showAddress.type=='家'?'iconfont iconwujieshejishigongju-':'iconfont icongongsi'"></i>
				<div class="first">{{showAddress.detailAddress}}</div>
				<div class="second">{{showAddress.name}} {{showAddress.phone}}</div>
			</div>
			<div class="down">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<i class="iconfont iconxiangyou"></i>
		</div>
		<div class="main" v-if="!login&&flag">
			<img class="noShopcart" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/8fdf5ad0-0aff-11eb-b997-9918a5dda011.png" v-if="shopcart.length==0" alt="">
			<div class="shopcart" v-else>
				<div class="goodsList">
					<div class="type">购物列表</div>
					<div class="goodsItem" v-for="(item,index) in shopcart" :key="index" @click="goDetail(item.goodsCode,item.rule)">
						<div :class="item.select?'select selected':'select'" @click.stop="select(index)">√</div>
						<img :src="item.img" alt="">
						<div class="title">{{item.title}}</div>
						<div class="rule">{{item.rule.split(' ')[0]}}</div>
						<div class="price">￥<span class="big">{{priceFix(item.price,1)}}</span>.{{priceFix(item.price,2)}}</div>
						<div class="sum">
							<span class="item" @click.stop="sum(index,'-')">-</span>
							<span class="detail">{{item.sum}}</span>
							<span class="item" @click.stop="sum(index,'+')">+</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div :class="bottom?'total':'total down'" v-if="flag">
			<div class="all" @click="changeAll(all)">
				<span :class="all?'yes item':'item'">√</span>
				全选
			</div>
			<div class="price-b">
				<div class="main-b">￥<span class="big">{{priceTotal.split('.')[0]}}</span>.{{priceTotal.split('.')[1]}}</div>
				<div class="ex" v-if="(priceTotal-0)>=100">已包邮</div>
				<div class="tip" v-if="(priceTotal-0)<100&&(priceTotal-0)>0">还差{{(100-priceTotal).toFixed(2)}}元可包邮</div>
			</div>
			<div :class="sumTotal>0?'button':'button noSum'" @click="setOrder">结算{{sumTotal>0?`(${sumTotal})`:''}}</div>
		</div>
		<u-popup v-model="show" zIndex="99" mode="bottom" border-radius="50" closeable="true">
			<div class="popup">
				<h1>收货地址</h1>
				<div class="address-main">
					<div class="address-item" @click="changeAddressIndex(item,index)" v-for="(item,index) in address" :key="index">
						<div :class="item.type!==''?'haveIcon haveAddress':'haveAddress'" >
							<i v-if="item.type!==''" :class="item.type=='家'?'iconfont iconwujieshejishigongju-':'iconfont icongongsi'"></i>
							<div class="first">{{item.detailAddress}}</div>
							<div class="second">{{item.name}} {{item.phone}}</div>
						</div>
						<div class="now" v-if="index==addressIndex">√</div>
						<i class="iconfont iconxiugai" @click.stop="modifyAddress(index)"></i>
					</div>
				</div>
				<div class="add" @click="modifyAddress(-1)">新增地址</div>
			</div>
		</u-popup>
		<nav-bar ref="nav" v-if="bottom" nowIndex='2'></nav-bar>
	</div>
</template>

<script>
	import navBar from '../component/navBar.vue'
	export default {
		data(){
			return{
				login:false,
				shopcart:null,
				flag:false,
				bottom:false,
				address:null,
				show:false,
				showAddress:null,
				addressIndex:-1
			}
		},
		onLoad(options) {
			if(!options.item){
				this.bottom=true
			}
		},
		beforeMount() {
			if(!uni.getStorageSync('userPhone')){
				this.login=true
			}
		},
		computed:{
			priceTotal(){
				if(this.shopcart==null){
					return 0
				}
				return this.shopcart.reduce((pre,val)=>{
					return val.select?(pre+(val.price)*val.sum):pre
				},0).toFixed(2)
			},
			sumTotal(){
				if(this.shopcart==null){
					return 0
				}
				return this.shopcart.reduce((pre,val)=>{
					return val.select?(pre+val.sum):pre
				},0)
			},
			all(){
				if(this.shopcart==null){
					return 0
				}
				return this.shopcart.reduce((pre,val)=>{
					return pre?val.select?true:false:false
				},true)
			}
		},
		components:{
			navBar
		},
		onShow() {
			uni.hideHomeButton()
			this.show=false
			if(!this.login){
				uni.showLoading({
					title:"加载中",
					mask:true
				})
				uniCloud.callFunction({
					name: 'shopcart',
					data:{
						type:"get",
						user:uni.getStorageSync('userPhone')
					}
				}).then((res)=>{
					uni.setStorageSync('shopcart',res.result.data[0].shopcart)
					this.shopcart=res.result.data[0].shopcart
					this.flag=true
					this.$refs.nav.getSum()
					if(this.address!==null){
						uni.hideLoading()
					}
				})
				this.getAddress()
			}
		},
		methods:{
			getAddress(){
				uniCloud.callFunction({
					name: 'address',
					data:{
						type:"get",
						user:uni.getStorageSync('userPhone')
					}
				}).then((res)=>{
					this.address=res.result.data[0].address
					for(let i=0;i<this.address.length;i++){
						if(this.address[i].isDefault){
							this.showAddress=this.address[i]
							this.addressIndex=i
							break
						}
						if(i==this.address.length-1){
							this.showAddress=this.address[0]
							this.addressIndex=0
						}
					}
					if(this.shopcart!==null){
						uni.hideLoading()
					}
				})
			},
			goIndex(){
				uni.redirectTo({
					url:'../index/main'
				})
			},
			goLogin(){
				uni.navigateTo({
					url:'../login/main'
				})
			},
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
			update(){
				uni.showLoading({
					title:"修改中",
					mask:true
				})
				uniCloud.callFunction({
					name: 'shopcart',
					data:{
						type:"update",
						shopcart:this.shopcart,
						user:uni.getStorageSync('userPhone')
					}
				}).then((res)=>{
					uni.hideLoading()
					uni.setStorageSync('shopcart',this.shopcart)
					uni.showToast({
						icon:"none",
						title:"修改成功"
					})
					this.$refs.nav.getSum()
				})
			},
			select(index){
				this.shopcart[index].select=!this.shopcart[index].select
				this.update()
			},
			sum(index,type){
				if(type=='+'){
					this.shopcart[index].sum=this.shopcart[index].sum+1
					this.update()
				}else{
					if(this.shopcart[index].sum==1){
						this.shopcart.splice(index,1)
					}else{
						this.shopcart[index].sum=this.shopcart[index].sum-1
					}
					this.update()
				}
			},
			goDetail(goodsCode,rule){
				uni.navigateTo({
					url:`../goodsDetail/main?goodCode=${goodsCode}&rule=${rule}`
				})
			},
			changeAll(i){
				this.shopcart=this.shopcart.map((v)=>{
					v.select=!i
					return v
				})
				this.update()
			},
			showMask(){
				this.show=true
			},
			modifyAddress(index){
				uni.navigateTo({
					url:`../address/main?address=${JSON.stringify(this.address)}&index=${index}`
				})
			},
			changeAddressIndex(item,index){
				this.addressIndex=index
				this.showAddress=item
				this.show=false
			},
			setOrder(){
				if(this.sumTotal==0){
					return
				}
				if(!this.showAddress){
					uni.showToast({
						icon:"none",
						title:"请先选择收货地址"
					})
					return
				}
				uni.navigateTo({
					url:`../order/main?address=${JSON.stringify(this.showAddress)}&shopcart=${JSON.stringify(this.shopcart)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "uview-ui/index.scss";
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
	.main{
		width: 750rpx;
		margin-bottom: 200rpx;
		.noShopcart{
			width: 650rpx;
			height: 540rpx;
			margin: 100rpx 50rpx;
		}
		.shopcart{
			width: 700rpx;
			margin: 0 auto;
			.goodsList{
				box-sizing: border-box;
				box-shadow: 0 0 15rpx #eee;
				width: 100%;
				padding: 40rpx 25rpx 40rpx;
				border-radius: 20rpx;
				.type{
					font-weight: 600;
					color: #555;
				}
				.goodsItem{
					position: relative;
					margin-top: 40rpx;
					height: 170rpx;
					width: 100%;
					overflow: hidden;
					img{
						position: absolute;
						top: 0;
						left: 46rpx;
						width: 170rpx;
						height: 170rpx;
						border-radius: 15rpx;
					}
					.select{
						position: absolute;
						top: 50%;
						left: 0;
						box-sizing: content-box;
						transform: translateY(-50%);
						width: 36rpx;
						height: 36rpx;
						line-height: 36rpx;
						text-align: center;
						border: 2rpx solid #999;
						border-radius: 18rpx;
						color: #fff;
						font-size: 28rpx;
					}
					.selected{
						background-color: rgb(255,128,0);
						border-color: rgb(255,128,0);
					}
					.title{
						position: absolute;
						top: 0;
						left: 225rpx;
						font-size: 32rpx;
						color: #333;
					}
					.rule{
						position: absolute;
						top: 90rpx;
						left: 225rpx;
						font-size: 25rpx;
						color: #999;
					}
					.price{
						position: absolute;
						bottom: 0;
						left: 225rpx;
						color: rgb(255,128,0);
						font-size: 28rpx;
						font-weight: 600;
						.big{
							font-size: 36rpx;
						}
					}
					.sum{
						position: absolute;
						bottom: 0;
						right: 0;
						.item{
							display: inline-block;
							width: 36rpx;
							height: 36rpx;
							color: #fff;
							font-weight: 600;
							background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
							border-radius: 18rpx;
							text-align: center;
							line-height: 36rpx;
						}
						.detail{
							margin: 0 15rpx;
						}
					}
				}
			}
		}
	}
	.total{
		position: fixed;
		bottom: 100rpx;
		left: 0;
		width: 750rpx;
		height: 100rpx;
		border-top: 3rpx solid #ccc;
		.button{
			position: absolute;
			right: 25rpx;
			top: 50%;
			transform: translateY(-50%);
			width: 218rpx;
			height: 72rpx;
			border-radius: 36rpx;
			background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
			color: #fff;
			font-weight: 600;
			line-height: 72rpx;
			text-align: center;
			font-size: 32rpx;
		}
		.noSum{
			color: #666;
			background-image: none;
			background-color: #eee;
		}
		.all{
			width: 140rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: right;
			font-weight: 600;
			color: #666;
			font-size: 28rpx;
			.item{
				position: absolute;
				top: 50%;
				left: 40rpx;
				box-sizing: content-box;
				transform: translateY(-50%);
				width: 36rpx;
				height: 36rpx;
				line-height: 36rpx;
				text-align: center;
				border: 2rpx solid #999;
				border-radius: 18rpx;
				color: #fff;
			}
			.yes{
				background-color: rgb(255,128,0);
				border-color: rgb(255,128,0);
			}
		}
		.price-b{
			position: absolute;
			right: 270rpx;
			top: 50%;
			transform: translateY(-50%);
			text-align: center;
			.main-b{
				color: rgb(255,128,0);
				font-size: 28rpx;
				font-weight: 600;
				.big{
					font-size: 36rpx;
				}
			}
			.ex{
				font-size: 28rpx;
				font-weight: 600;
				color: rgb(145,187,109);
			}
			.tip{
				position: absolute;
				top: -90rpx;
				left: 0;
				transform: translateX(-50%);
				width: 650rpx;
				height: 50rpx;
				border-radius: 25rpx;
				line-height: 50rpx;
				text-align: center;
				color: #fff;
				font-size: 30rpx;
				font-weight: 600;
				background-color: rgb(255,173,147);
			}
		}
	}
	.down{
		bottom:0
	}
	.address{
		position: relative;
		width: 700rpx;
		height: 180rpx;
		border-radius: 20rpx;
		box-shadow: 0 0 15rpx #eee;
		margin: 20rpx auto;
		overflow: hidden;
		.down{
			position: absolute;
			bottom: 4rpx;
			left: 0;
			display: flex;
			span{
				display: inline-block;
				width: 20rpx;
				height: 6rpx;
				margin-right: 15rpx;
				background-color: rgb(255,153,51);
				transform: skewX(45deg);
			}
			span:nth-child(even){
				background-color: rgb(101,160,50);
			}
		}
		.iconxiangyou{
			position: absolute;
			top: 50%;
			right: 30rpx;
			transform: translateY(-50%);
			font-weight: 600;
		}
		.noAddress{
			position: absolute;
			top: 50%;
			left: 30rpx;
			transform: translateY(-50%);
			font-weight: 700;
			font-size: 40rpx;
			i{
				font-weight: 500;
				display: inline;
				font-size: 60rpx;
				position: relative;
				top: 8rpx;
			}
		}
		.haveAddress{
			width: 600rpx;
			margin-top: 40rpx;
			margin-left: 25rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			.first{
				font-weight: 600;
			}
			.second{
				color: #999;
			}
			.iconfont{
				position: absolute;
				top: 25rpx;
				left: 15rpx;
				font-size: 66rpx;
			}
		}
		.haveIcon{
			width: 525rpx;
			margin-left: 90rpx;
		}
	}
	.popup{
		padding: 35rpx 30rpx 100rpx;
		h1{
			font-weight: 600;
		}
		.address-main{
			width: 690rpx;
			height: 550rpx;
			overflow-y: scroll;
			margin: 30rpx 0;
			.address-item{
				position: relative;
				height: 125rpx;
				width: 95%;
				margin: 15rpx auto;
				overflow: hidden;
				border-radius: 20rpx;
				box-shadow: 0 0 15rpx #eee;
				.haveAddress{
					width: 510rpx;
					margin-top: 20rpx;
					margin-left:90rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					.first{
						font-weight: 600;
					}
					.second{
						color: #999;
					}
					.iconfont{
						position: absolute;
						top: 10rpx;
						left: 75rpx;
						font-size: 66rpx;
					}
				}
				.haveIcon{
					.first{
						box-sizing: border-box;
						padding-left: 50rpx;
					}
				}
				.now{
					background-color: rgb(255,153,51);
					position: absolute;
					top: 40rpx;
					left: 25rpx;
					width: 36rpx;
					height: 36rpx;
					border-radius: 36rpx;
					color: #fff;
					text-align: center;
					line-height: 36rpx;
					font-weight: 600;
				}
				.iconxiugai{
					position: absolute;
					top: 40rpx;
					right: 20rpx;
					color: #666;
				}
			}
		}
		.add{
			background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
			width: 690rpx;
			height: 90rpx;
			border-radius: 45rpx;
			text-align: center;
			line-height: 90rpx;
			font-weight: 600;
			color: #fff;
		}
	}
</style>
