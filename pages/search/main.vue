<template>
	<div>
		<div class="search">
			<div class="go">
				<i class="iconfont iconsousuo"></i>
				<input type="text" placeholder="新鲜水果、生鲜" v-model="input">
				<i class="iconfont iconguanbi" v-if='input!==""' @click='guanbiInput'></i>
			</div>
			<div class="button" @click="goSearch">搜索</div>
		</div>
		<div class="sousuo" v-if="history.length>0&&!shouldShow">
			<div class="title">历史搜索</div>
			<i class="iconfont iconshanchu" @click='deleteHistory'></i>
			<div class="main">
				<span v-for="(item,index) in history" :key='index' @click='clickSearch(item)'>{{item}}</span>
			</div>
		</div>
		<div class="sousuo" v-if="!shouldShow">
			<div class="title">热门搜索</div>
			<div class="main">
				<span v-for='(item,index) in hotSearch' :key='index' @click='clickSearch(item.keyWord)'>{{item.keyWord}}</span>
			</div>
		</div>
		<div class="noGoods" v-if='goodsList.length==0&&shouldShow'>
			<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/e1eed940-fd71-11ea-b680-7980c8a877b8.png" alt="">
			<div>抱歉,</div>
			<div>没有搜索到相关的商品哦~</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				input:'',
				history:[],
				hotSearch:[],
				goodsList:[],
				shouldShow:false
			}
		},
		watch:{
			input(val,preval){
				if(val==''){
					this.goodsList=[]
					this.shouldShow=false
				}
			}
		},
		mounted() {
			if(uni.getStorageSync('searchHistory')){
				this.history=uni.getStorageSync('searchHistory')
			}
			uniCloud.callFunction({
				name: 'search',
				data:{
					type:"hotSearch"
				}
			}).then((res)=>{
				this.hotSearch=res.result.data
			})
		},
		methods:{
			goSearch(){
				if(!this.input){
					return
				}
				this.history=[...new Set([this.input].concat(this.history))]
				uni.setStorageSync('searchHistory', this.history);
				uniCloud.callFunction({
					name: 'search',
					data:{
						type:"search",
						keyWord:this.input
					}
				}).then((res)=>{
					this.shouldShow=true
					this.goodsList=res.result.data
				})
			},
			deleteHistory(){
				this.history=[]
				uni.removeStorageSync('searchHistory');
			},
			clickSearch(item){
				this.input=item
				this.goSearch()
			},
			guanbiInput(){
				this.input=''
				this.goodsList=[]
				this.shouldShow=false
			}
		}
	}
</script>

<style lang="less" scoped>
	.search{
		.go{
			position: relative;
			display: inline-block;
			width: 638rpx;
			height: 72rpx;
			border-radius: 20rpx;
			margin-left: 15rpx;
			background-color: #f5f5f5;
			color: #bfbfbf;
			padding-left: 15rpx;
			line-height: 72rpx;
			font-size: 28rpx;
			i{
				display: inline-block;
				margin-right: 15rpx;
			}
			input{
				position: relative;
				top: 12rpx;
				display: inline-block;
				width: 550rpx;
			}
			.iconguanbi{
				z-index: 9999;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
		.button{
			display: inline-block;
			color: #65a032;
			font-size: 30rpx;
			font-weight: 500;
			line-height: 30rpx;
			margin-left: 15rpx;
		}
	}
	.sousuo{
		position: relative;
		box-sizing: border-box;
		width: 720rpx;
		margin: 20rpx auto;
		border-radius: 15rpx;
		box-shadow: 0 0 15rpx #eee;
		padding: 40rpx 15rpx;
		.title{
			margin-bottom: 25rpx;
			font-size: 35rpx;
			font-weight: 600;
			color: #333;
		}
		i{
			position: absolute;
			top: 40rpx;
			right: 20rpx;
		}
		.main{
			display: flex;
			flex-wrap:wrap;
			span{
				background-color: #eee;
				margin: 12rpx 12rpx;
				padding: 12rpx;
				color: #555;
				font-weight: 500;
				border-radius: 10rpx;
				font-size: 27rpx;
			}
		}
	}
	.noGoods{
		margin-top: 200rpx;
		text-align: center;
		img{
			width: 200rpx;
			height: 200rpx;
		}
		div{
			font-size: 27rpx;
			color: #444;
		}
	}
</style>
