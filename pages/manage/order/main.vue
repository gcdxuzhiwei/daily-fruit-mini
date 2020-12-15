<template>
	<div>
		<div class="item" v-for="(item,index) in list" :key="index">
			<div>到达时间:{{item.arriveTime}}</div>
			<div>地区:{{item.address.region.join('-')}}</div>
			<div>详细地址:{{item.address.detailAddress}}</div>
			<div>用户:{{item.address.name}} {{item.address.phone}}</div>
			商品:
			<ul>
				<li v-for="(item1,index1) in item.goods" :key="index1">{{item1.sum}}件 {{item1.title}}-{{item1.rule}}</li>
			</ul>
			<div class="click" @click="handle(item)">点击发货</div>
		</div>
		<div class="mask" v-if="willOrder">
			<div class="box">
				<div>
					<input placeholder="输入物流号" v-model="sendNumber"></input>
				</div>
				<div class="click">
					<span @click="goOrder">确定</span>
					<span @click="cancel">取消</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				list:[],
				willOrder:'',
				sendNumber:''
			}
		},
		mounted() {
			this.getList()
		},
		methods:{
			getList(){
				uniCloud.callFunction({
					name: 'order',
					data: {
						type: "order1",
					}
				}).then((res) => {
					this.list=res.result
				})
			},
			handle(item){
				this.willOrder=item._id
			},
			cancel(){
				this.willOrder=''
			},
			goOrder(){
				if(!this.sendNumber){
					uni.showToast({
						title:'请输入物流单号',
						icon:'none'
					})
				}else{
					uniCloud.callFunction({
						name: 'order',
						data: {
							type: "changeOrder1",
							id:this.willOrder,
							sendNumber:this.sendNumber
						}
					}).then((res) => {
						this.list=[]
						this.getList()
						this.willOrder=''
					})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.item{
		font-size: 30rpx;
		padding: 30rpx 15rpx;
		border-bottom: 1rpx solid #666;
		&:last-child{
			border-bottom: none;
		}
		.click{
			border-radius: 20rpx;
			padding: 5rpx 20rpx;
			border: 1rpx solid #0084c9;
			display: inline;
		}
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.2);
		.box{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			background-color: #fff;
			width: 550rpx;
			height: 300rpx;
			padding-top: 20rpx;
			text-align: center;
			border-radius: 20rpx;
			input{
				width: 475rpx;
				border: 1rpx solid #0084c9;
				margin: 0 auto;
			}
			div{
				margin-top: 80rpx;
				display: flex;
				span{
					flex: 1;
					color: #0084c9;
				}
			}
		}
	}
</style>
