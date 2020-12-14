<template>
	<div>
		<div class="tab">
			<div :class="showIndex==index?'item now':'item'" v-for="(item,index) in tab" :key="index" @click='changeIndex(index)'>{{item}}</div>
		</div>
		<div class="main" v-if="flag">
			<div class="pic" v-if="showList.length==0">
				<img v-if="showIndex==0" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/8fdf5ad0-0aff-11eb-b997-9918a5dda011.png" alt="">
				<img v-if="showIndex==1" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/4cafa960-19f3-11eb-b997-9918a5dda011.png" alt="">
				<img v-if="showIndex==2" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/4d4cd3c0-19f3-11eb-899d-733ae62bed2f.png" alt="">
				<img v-if="showIndex==3" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/4df4faa0-19f3-11eb-899d-733ae62bed2f.png" alt="">
				<img v-if="showIndex==4" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/4e7acc70-19f3-11eb-899d-733ae62bed2f.png" alt="">
			</div>
			<div class="order" v-for="(item1,index1) in showList" :key='index1' @click="goDetail(item1)">
				<div class="state">{{getState(item1.state)}}</div>
				<div class="time">{{getTime(item1.orderTime)}}</div>
				<div class="photo" :scroll-x="true">
					<img v-for="(item2,index2) in item1.goods" :key="index2" :src="item2.img" alt="">
				</div>
				<div class="bottom">共{{getdetail(item1.goods,0)}}个商品 合计:<span>￥{{item1.price.toFixed(2)}}</span>(含运费￥{{getdetail(item1.goods,1)}})</div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return {
			tab:['全部','待付款','待发货','待收货','已完成'],
			showList:[],
			allList:[],
			showIndex:0,
			flag:false
		}
	},
	onShow() {
		this.getList()
	},
	onLoad(option) {
		if(option.show){
			this.showIndex=option.show
		}
	},
	methods:{
		changeIndex(index){
			this.showIndex=index
			this.changeShow()
		},
		getList(){
			uniCloud.callFunction({
				name: 'order',
				data:{
					type:"get",
					user:uni.getStorageSync('userPhone')
				}
			}).then((res)=>{
				this.allList=res.result.data
				this.flag=true
				this.changeShow()
			})
		},
		changeShow(){
			if(this.showIndex==0){
				this.showList=this.allList
				return
			}
			this.showList=this.allList.filter((item)=>{
				return item.state==this.showIndex-1
			})
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
		},
		getState(state){
			if(state==-1){return '已取消'}
			if(state==0){return '待付款'}
			if(state==1){return '待发货'}
			if(state==2){return '待收货'}
			if(state==3){return '已完成'}
		},
		getdetail(goods,type){
			const obj=goods.reduce((pre,now)=>{
				return {
					price:pre.price+now.price*now.sum,
					sum:pre.sum+now.sum
				}
			},{price:0,sum:0})
			if(type==1){
				return obj.price<100?'10.00':'0.00'
			}
			if(type==0){
				return obj.sum
			}
		},
		goDetail(item){
			uni.navigateTo({
				url:`../orderDetail/main?order=${JSON.stringify(item)}`
			})
		}
	}
}
</script>

<style lang="less" scoped>
.tab{
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	height: 75rpx;
	background-color: #fff;
	display: flex;
	.item{
		flex: 1;
		font-weight: 600;
		font-size: 32rpx;
		text-align: center;
		line-height: 75rpx;
	}
	.now{
		position: relative;
		color: rgb(118,167,58);
		font-size: 40rpx;
	}
	.now::after{
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgb(118,167,58);
		height: 6rpx;
		content: '';
		display: inline-block;
	}
}
.main{
	padding-top: 75rpx;
	.pic{
		text-align: center;
		img{
			width: 400rpx;
			height: 450rpx;
			margin: 200rpx;
		}
	}
	.order{
		box-sizing: border-box;
		width: 700rpx;
		margin: 25rpx;
		box-shadow: 0 0 15rpx #eee;
		border-radius: 30rpx 25rpx;
		height: 380rpx;
		padding: 65rpx 25rpx 0;
		font-size: 30rpx;
		font-weight: 600;
		.state{
			float: right;
			color: #999;
		}
		.photo{
			width: 100%;
			padding: 30rpx 0;
			height: 130rpx;
			overflow-x: scroll;
			white-space: nowrap;
			overflow-y: hidden;
			img{
				width: 130rpx;
				height: 130rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
			}
			img:last-child{
				margin-right: 0;
			}
		}
		.bottom{
			text-align: right;
			font-weight: 400;
			font-size: 32rpx;
			span{
				font-size: 38rpx;
				font-weight: 500;
				color: rgb(255,128,0);
			}
		}
	}
}
</style>
