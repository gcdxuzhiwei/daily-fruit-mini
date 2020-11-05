<template>
	<div v-if="order!==null">
		<div class="top">
			<div class="title">
				<i :class="'iconfont '+getState(order.state,0)"></i>
				<span>{{getState(order.state,1)}}</span>
			</div>
			<div class="tip">你的订单{{getState(order.state,1)}}，感谢您选择天天果园，欢迎再来呦</div>
			<div class="time">{{getTime(order.orderTime)}}</div>
		</div>
		<div class="address">
			<div class="first">
				<span class="left">订单编号</span>
				<span class="right">
					{{order.orderId}}
					<span class="copy">复制</span>
				</span>
			</div>
			<div class="second">
				<span class="left">收货地址</span>
				<div class="right">{{order.address.detailAddress}}</div>
			</div>
			<div class="third">{{order.address.name+order.address.phone}}</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			order:null
		}
	},
	onLoad(options) {
		this.order=JSON.parse(options.order)
	},
	methods:{
		getState(state,index){
			if(index===0){
				if(state==-1){return 'iconyiquxiao'}
				if(state==0){return 'icondaifukuan'}
				if(state==1){return 'icondaifahuo'}
				if(state==2){return 'icondaishouhuo'}
				if(state==3){return 'icondaipingjia'}
				if(state==4){return 'iconyiwancheng'}
			}
			if(state==-1){return '已取消'}
			if(state==0){return '待付款'}
			if(state==1){return '待发货'}
			if(state==2){return '待收货'}
			if(state==3){return '待评价'}
			if(state==4){return '已完成'}
		},
		getTime(time){
			function fix(t){
				t=t+''
				if(t.length==1){
					t='0'+t
				}
				return t
			}
			const str=new Date(time)
			return str.getFullYear()+'-'+fix(str.getMonth()+1)+'-'+fix(str.getDate())+' '+fix(str.getHours())+':'+fix(str.getMinutes())+':'+fix(str.getSeconds())
		}
	}
}
</script>

<style lang="less" scoped>
.top{
	box-sizing: border-box;
	width: 700rpx;
	height: 200rpx;
	margin: 30rpx auto;
	padding: 30rpx 20rpx;
	box-shadow: 0 0 15rpx #eee;
	border-radius: 25rpx;
	font-weight: 600;
	font-size: 38rpx;
	i{
		display: inline;
	}
	span{
		margin-left: 10rpx;
	}
	.time{
		color: #999;
		font-size: 28rpx;
	}
	.tip{
		margin: 15rpx 0 5rpx;
		color: #333;
		font-size: 30rpx;
	}
}
.address{
	
}
</style>
