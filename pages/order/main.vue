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
		</div>
		<div class="bottom">
			<span class="price">待支付:<span class="detail">￥{{priceStr}}</span></span>
			<div class="sure">提交订单</div>
		</div>
		<u-popup v-model="show" zIndex="99" mode="bottom" border-radius="50" closeable="true">
			<div class="popup">
				<div class="title">配送时间</div>
			</div>
		</u-popup>
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
			show:false
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
		this.sum=this.goods.reduce((pre,val)=>{
			return pre+val.sum
		},0)
		const time1=new Date((new Date).getTime()+1000*60*60*24)
		const time2=new Date((new Date).getTime()+2*1000*60*60*24)
		this.arriveArr=[{
			time:time1.getMonth()+1+'月'+time1.getDate()+'日|周'+this.week(time1.getDay())
		},{
			time:time2.getMonth()+1+'月'+time2.getDate()+'日|周'+this.week(time2.getDay())
		}]
	},
	methods:{
		week(num){
			if(num==1)return '一'
			if(num==2)return '二'
			if(num==3)return '三'
			if(num==4)return '四'
			if(num==5)return '五'
			if(num==6)return '六'
			if(num==7)return '日'
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
			}
		}
	}
}
</style>
