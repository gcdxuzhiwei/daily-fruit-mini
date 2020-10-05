<template>
	<div>
		<div class="first">轮播图(点击图片删除)<span @click="addSwiper">新增</span></div>
		<div class="flrstList" v-for="(item,index) in swiper" :key="index">
			<img :src="item.img" alt="" class="img" @click="deleteSwiper(item._id)">
			<span v-if="item.goodCode==''" @click="swiperGood(index)">绑定商品</span>
			<span v-else @click="swiperGood(index)">{{item.goodName+'/'+item.rule}}</span>
		</div>
		<div class="overlay" v-if="overlay">
			<div class="goods">
				<h2>点击绑定商品</h2>
				<div class="goodsList" v-for="(item,index) in goods" :key="index">
					{{item.firstTitle}}
					<div class="rule">
						<span class="select" @click="modifySwiper(item,item1[0])" v-for="(item1,index1) in item.rule" :key="index1">{{item1[0]}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return{
			swiper:[],
			goods:[],
			overlay:false,
			swiperIndex:0
		}
	},
	mounted() {
		this.getIndex()
	},
	methods:{
		getIndex(){
			uniCloud.callFunction({
				name: 'indexManager',
				data:{
					type:"getSwiper"
				}
			}).then((res)=>{
				this.swiper=res.result.data
			})
		},
		addSwiper(){
			let that=this
			uni.chooseImage({
			    count: 1, 
			    sourceType: ['album'], //从相册选择
			    success: function (res) {
					let filePath=res.tempFilePaths[0]
					uniCloud.uploadFile({
						filePath: filePath,
						cloudPath: (Math.random()+'').slice(2,8)+new Date().getTime()+'.jpg',
						success(s){
							that.classImg=s.fileID
							uniCloud.callFunction({
								name: 'indexManager',
								data:{
									type:"addSwiper",
									img:s.fileID
								}
							}).then((res)=>{
								that.getIndex()
							})
						}
					});
			    }
			});
		},
		swiperGood(index){
			this.overlay=true
			this.swiperIndex=index
			uniCloud.callFunction({
				name: 'goods',
				data:{
					type:"get"
				}
			}).then((res)=>{
				this.goods=res.result.data
			})
		},
		modifySwiper(item,rule){
			uniCloud.callFunction({
				name: 'indexManager',
				data:{
					type:"modifySwiper",
					_id:this.swiper[this.swiperIndex]._id,
					goodCode:item.goodsCode,
					goodName:item.firstTitle,
					rule:rule
				}
			}).then((res)=>{
				this.overlay=false
				this.getIndex()
			})
		},
		deleteSwiper(_id){
			uniCloud.callFunction({
				name: 'indexManager',
				data:{
					type:"deleteSwiper",
					_id:_id
				}
			}).then((res)=>{
				this.getIndex()
			})
		}
	}
}
</script>

<style lang="less" scoped>
	.first{
		span{
			color: #fff;
			background-color: #0084c9;
			border-radius: 10rpx;
			padding: 5rpx;
			margin-left: 20rpx;
		}
	}
	.flrstList{
		width: 100%;
		position: relative;
		.img{
			width: 500rpx;
			height: 250rpx;
		}
		span{
			position: absolute;
			top: 50%;
			right: 20rpx;
			max-width: 200rpx;
			transform: translateY(-50%);
			background-color: #0084c9;
			color: #fff;
			padding: 10rpx;
			border-radius: 10rpx;
			font-size: 22rpx;
		}
	}
	.overlay{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0,0,0,0.5);
		.goods{
			padding: 15rpx;
			border-radius: 20rpx;
			background-color: #fff;
			width: 550rpx;
			height: 750rpx;
			overflow-y: scroll;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			.goodsList{
				text-align: center;
				margin: 10rpx 0;
				.rule{
					display: flex;
					flex-wrap:wrap;
					.select{
						background-color: #0084c9;
						color: #fff;
						border-radius: 10rpx;
						padding: 8rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>
