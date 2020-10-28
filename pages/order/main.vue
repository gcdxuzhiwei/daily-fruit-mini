<template>
	<div class="order">
		<div class="address">
			<div :class="address.type!==''?'haveIcon haveAddress':'haveAddress'">
				<i v-if="address.type!==''" :class="address.type=='家'?'iconfont iconwujieshejishigongju-':'iconfont icongongsi'"></i>
				<div class="first">{{address.detailAddress}}</div>
				<div class="second">{{address.name}} {{address.phone}}</div>
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
		</div>
		<div class="bag">
			<div class="title">
				<i class="iconfont iconbaoguo02"></i>
				包裹
				<span>{{sum}}件商品</span>
			</div>
			<div class="arrive">
				<div class="left">送达时间</div>
				<div class="right" @click="()=>this.show=true">
					<span class="time">{{arriveTime?arriveTime:'请选择'}}</span>
					<i class="iconfont iconxiangyou"></i>
				</div>
			</div>
			<div class="goods">
				<div class="item" v-for="(item,index) in goods" :key="index">
					<img :src="item.img" alt="">
					<div class="firstTitle">{{item.title}}</div>
					<div class="rule">{{item.rule.split(' ')[0]}}</div>
					<div class="sum">×{{item.sum}}</div>
					<div class="price">￥{{(item.sum*item.price).toFixed(2)}}</div>
				</div>
			</div>
		</div>
		<div class="bottom">
			<span class="price">待支付:<span class="detail">￥{{priceStr}}</span></span>
			<div class="sure" @click="sureOrder">提交订单</div>
		</div>
		<u-popup v-model="show" zIndex="99" mode="bottom" border-radius="50" closeable="true">
			<div class="popup">
				<div class="title">配送时间</div>
				<div class="left">
					<div @click="leftClick(index)" :class="index==arriveIndex?'item':''" v-for="(item,index) in arriveArr" :key="index">
						{{item}}
					</div>
				</div>
				<div class="right">
					<div :class="arriveDetailIndex==0?'item':''" @click="rightClick('08:00-18:00',0)">白天08:00-18:00<span v-if="arriveDetailIndex==0">√</span></div>
					<div :class="arriveDetailIndex==1?'item':''" @click="rightClick('18:00-22:00',1)">晚上18:00-22:00<span v-if="arriveDetailIndex==1">√</span></div>
				</div>
			</div>
		</u-popup>
		<div class="others">
			<div class="otherPrice">
				<div class="left">配送费</div>
				<div class="right">￥{{otherPrice}}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return {
			address:null,
			shopcart:null,
			goods:[],
			priceStr:'',
			sum:0,
			arriveTime:'',
			arriveArr:null,
			arriveIndex:0,
			arriveDetailIndex:-1,
			show:false,
			otherPrice:'0.00'
		}
	},
	onLoad(options) {
		this.address=JSON.parse(options.address)
		this.shopcart=JSON.parse(options.shopcart)
		for(let i=0;i<this.shopcart.length;i++){
			if(this.shopcart[i].select){
				this.goods=this.goods.concat(this.shopcart.splice(i,1))
				i--
			}
		}
		this.priceStr=this.goods.reduce((pre,val)=>{
			return pre+val.price*val.sum
		},0).toFixed(2)
		if(this.priceStr-0<100){
			this.otherPrice='10.00'
			this.priceStr=(this.priceStr-0+10).toFixed(2)
		}
		this.sum=this.goods.reduce((pre,val)=>{
			return pre+val.sum
		},0)
		const time1=new Date((new Date).getTime()+1000*60*60*24)
		const time2=new Date((new Date).getTime()+2*1000*60*60*24)
		this.arriveArr=[time1.getMonth()+1+'月'+time1.getDate()+'日|周'+this.week(time1.getDay()),time2.getMonth()+1+'月'+time2.getDate()+'日|周'+this.week(time2.getDay())]
	},
	methods:{
		week(num){
			if(num==1)return '一'
			if(num==2)return '二'
			if(num==3)return '三'
			if(num==4)return '四'
			if(num==5)return '五'
			if(num==6)return '六'
			if(num==0)return '日'
		},
		leftClick(index){
			if(index!==this.arriveIndex){
				this.arriveIndex=index
				this.arriveTime=''
				this.arriveDetailIndex=-1
			}
		},
		rightClick(str,index){
			this.arriveDetailIndex=index
			this.arriveTime=this.arriveArr[this.arriveIndex]+str
			this.show=false
		},
		sureOrder(){
			if(!this.arriveTime){
				this.show=true
				return
			}
			uni.showLoading({
				title:'生成订单中',
				mask:true
			})
			uniCloud.callFunction({
				name: 'order',
				data:{
					type:"set",
					user:uni.getStorageSync('userPhone'),
					orderId:(Math.random()+'').slice(2,8)+new Date().getTime(),
					arriveTime:this.arriveTime,
					shopcart:this.shopcart,
					address:this.address,
					goods:this.goods,
					price:this.priceStr-0
				}
			}).then((res)=>{
				uni.hideLoading()
				uni.redirectTo({
					url:`../orderDetail/main?order=${JSON.stringify(res.result.data[0])}`
				})
			})
		}
	}
}
</script>

<style lang="less" scoped>
.order{
	padding-bottom: 120rpx;
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
.bottom{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 750rpx;
	height: 100rpx;
	background-color: #fff;
	.sure{
		position: absolute;
		top: 50%;
		right: 30rpx;
		transform: translateY(-50%);
		background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
		width: 250rpx;
		height: 80rpx;
		border-radius: 40rpx;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		font-weight: 600;
	}
	.price{
		position: absolute;
		top: 50%;
		left: 30rpx;
		transform: translateY(-50%);
		.detail{
			font-size: 43rpx;
			font-weight: 600;
			color: rgb(255,128,0);
		}
	}
}
.bag{
	position: relative;
	width: 690rpx;
	box-shadow: 0 0 15rpx #eee;
	margin: 25rpx auto 35rpx;
	.title{
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 140rpx;
		line-height: 140rpx;
		padding-left: 80rpx;
		font-size: 45rpx;
		font-weight: 600;
		i{
			position: absolute;
			top: 50%;
			left: 30rpx;
			transform: translateY(-50%);
			font-size: 42rpx;
			font-weight: 400;
		}
		span{
			position: absolute;
			top: 50%;
			right: 30rpx;
			transform: translateY(-50%);
			font-weight: 400;
			font-size: 32rpx;
			color: #666;
		}
	}
	.arrive{
		position: relative;
		width: 630rpx;
		margin: 0 auto;
		font-weight: 600;
		font-size: 36rpx;
		.right{
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			i{
				display: inline;
			}
			.time{
				color: rgb(255,128,0);
				margin-right: 15rpx;
				font-size: 32rpx;
				position: relative;
				top: -3rpx;
			}
		}
	}
	.goods{
		width: 630rpx;
		margin: 0 auto;
		padding: 50rpx 0;
		.item{
			position: relative;
			width: 100%;
			height: 100rpx;
			margin-bottom: 25rpx;
			font-size: 30rpx;
			img{
				width: 100rpx;
				height: 100rpx;
				border-radius: 25rpx;
			}
			.firstTitle{
				position: absolute;
				top: 0;
				left: 115rpx;
				width: 320rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: #333;
			}
			.rule{
				position: absolute;
				bottom: 0;
				left: 115rpx;
				color: #666;
			}
			.sum{
				position: absolute;
				right: 150rpx;
				top: 0;
				color: #999;
			}
			.price{
				position: absolute;
				right: 0;
				top: 0;
				font-weight: 600;
			}
		}
		.item:last-child{
			margin-bottom: 0;
		}
	}
}
.popup{
	position: relative;
	width: 750rpx;
	height: 750rpx;
	.title{
		padding-left: 30rpx;
		height: 120rpx;
		line-height: 120rpx;
		font-weight: 600;
	}
	.left{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 300rpx;
		height: 630rpx;
		background-color: rgb(245,245,245);
		div{
			box-sizing: border-box;
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			padding-left: 30rpx;
			color: rgb(153,153,153);
			font-weight: 600;
			font-size: 30rpx;
		}
		.item{
			background-color: #fff;
			color: rgb(255,128,0);
		}
	}
	.right{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 450rpx;
		height: 630rpx;
		div{
			box-sizing: border-box;
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			padding-left: 30rpx;
			font-weight: 600;
			font-size: 30rpx;
			color: #333;
		}
		.item{
			color: rgb(255,128,0);
			span{
				display: inline-block;
				margin-left: 30rpx;
				width: 36rpx;
				height: 36rpx;
				border-radius: 18rpx;
				background-color: rgb(255,128,0);
				color: #fff;
				font-weight: 600;
				font-size: 32rpx;
				line-height: 36rpx;
				text-align: center;
			}
		}
	}
}
.others{
	width: 690rpx;
	box-shadow: 0 0 15rpx #eee;
	margin: 0 auto;
	box-sizing: border-box;
	padding: 50rpx 30rpx;
	.otherPrice{
		position: relative;
		font-weight: 600;
		font-size: 32rpx;
		.right{
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
		}
	}
}
</style>
