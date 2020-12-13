<template>
	<div>
		<div class="swiperBox">
			<div class="count" v-if="good.swiperImg.length"><span class="swiperIndex">{{swiperIndex+1}}</span>{{`/${good.swiperImg.length}`}}</div>
			<swiper class="swiper" autoplay="true" circular="true" @change="swiperChange">
				<swiper-item class="swiperItem" v-for="(item,index) in good.swiperImg" :key="index">
					<img :src="item" alt="">
				</swiper-item>
			</swiper>
		</div>
		<div class="rule" v-if="good.rule">
			<div class="firstTitle">{{good.firstTitle}}</div>
			<div class="secondTitle">{{good.secondTitle}}</div>
			<div class="price">￥<span class="big">{{price.split('.')[0]}}</span>{{'.'+price.split('.')[1]}}</div>
			<div class="ruleList">
				<span @click="changeRule(index)" :class="index==ruleIndex?'ruleItem nowRule':'ruleItem'"
				    v-for="(item,index) in good.rule" :key="index"
				>
					<span class="big">{{item[0].split(' ')[0]}}</span>
					{{item[0].split(' ').length>1?item[0].slice(item[0].indexOf(' '),item[0].length):''}}
				</span>
			</div>
			<div class="time">最快明天08:00-18:00送达</div>
			<div class="safety" @click="goSafety">
				<span class="left"><i class="iconfont iconanquanbaozhang2"></i>保障</span>
				<span>48小时退换货·全程冷链·果园标准</span>
				<i class="iconfont iconxiangyou"></i>
			</div>
		</div>
		<div class="imgList" v-if="good.imgList">
			<image @click="preview(item)" class="imgItem" mode="widthFix" :src="item" alt="" v-for="(item,index) in good.imgList" :key="index">
		</div>
		<shopcart ref="shopcart"></shopcart>
		<div class="bottom">
			<div @click="addShopcart" class="add">加入购物车</div>
		</div>
	</div>
</template>

<script>
import shopcart from '../component/shopcartItem.vue'
export default {
	data(){
		return {
			good:{},
			ruleIndex:0,
			swiperIndex:0
		}
	},
	computed:{
		price(){
			return this.good.rule?this.good.rule[this.ruleIndex][1].toFixed(2)+'':0
		}
	},
	components:{
		shopcart
	},
	onLoad(options) {
		uniCloud.callFunction({
			name: 'goods',
			data:{
				type:"getByID",
				goodsCode:options.goodCode
			}
		}).then((res)=>{
			this.good=res.result.data[0]
			for(let i=0;i<res.result.data[0].rule.length;i++){
				if(res.result.data[0].rule[i][0]==options.rule){
					this.ruleIndex=i
					break
				}
			}
		})
	},
	methods:{
		swiperChange(e){
			this.swiperIndex=e.detail.current
		},
		changeRule(index){
			if(index==this.ruleIndex){
				return
			}
			this.ruleIndex=index
		},
		goSafety(){
			uni.navigateTo({
				url:"../rule/main"
			})
		},
		preview(item){
			wx.previewImage({
			  current: item, // 当前显示图片的http链接
			  urls: this.good.imgList // 需要预览的图片http链接列表
			})
		},
		addShopcart(){
			if(!uni.getStorageSync('userPhone')){
				uni.navigateTo({
					url:'../login/main'
				})
			}else{
				let goodsCode=this.good.goodsCode
				let rule=this.good.rule[this.ruleIndex][0]
				let img=this.good.swiperImg[0]
				let title=this.good.firstTitle
				let price=this.good.rule[this.ruleIndex][1]
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
					this.$refs.shopcart.getSum()
					uni.showToast({
						icon:"none",
						title:"添加购物车成功"
					})
				})
			}
		}
	}
}
</script>

<style lang="less" scoped>
	.swiperBox{
		width: 750rpx;
		width: 750rpx;
		position: relative;
		.count{
			position: absolute;
			top: 580rpx;
			right: 30rpx;
			z-index: 9999;
			background-color: rgba(0,0,0,0.3);
			color: #fff;
			font-weight: 600;
			border-radius: 25rpx;
			font-size: 30rpx;
			width: 100rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			.swiperIndex{
				font-size: 40rpx;
			}
		}
		.swiper{
			z-index: 0;
			width: 750rpx;
			height: 750rpx;
			.swiperItem{
				width: 750rpx;
				height: 750rpx;
				img{
					width: 750rpx;
					height: 750rpx;
				}
			}
		}
	}
	.rule{
		box-sizing: border-box;
		transform: translateY(-100rpx);
		width: 690rpx;
		text-align: center;
		margin: 0 auto;
		z-index: 99999;
		background-color: #fff;
		border-radius: 25rpx;
		box-shadow: 0 5rpx 5rpx #eee;
		padding: 40rpx;
		.firstTitle{
			font-size: 40rpx;
			font-weight: 600;
		}
		.secondTitle{
			font-size: 32rpx;
			color: #aaa;
			margin-top: 5rpx;
		}
		.price{
			font-size: 32rpx;
			color: rgb(255,128,0);
			.big{
				font-size: 40rpx;
				font-weight: 500;
			}
		}
		.ruleList{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			.ruleItem{
				margin: 10rpx;
				font-size: 24rpx;
				padding: 25rpx;
				box-shadow: 0 0 20rpx #eee;
				border-radius: 20rpx;
				.big{
					font-size: 32rpx;
					font-weight: 500;
				}
			}
			.nowRule{
				box-shadow: 0 0 0 #fff;
				background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
				color: #fff;
			}
		}
		.time{
			font-size: 23rpx;
			color: #ccc;
			margin-bottom: 20rpx;
		}
		.safety{
			position: relative;
			font-size: 28rpx;
			font-weight: 600;
			i{
				display: inline-block;
			}
			.iconxiangyou{
				position: absolute;
				font-size: 26rpx;
				right: 0;
				top: 50%;
				transform: translateY(-35%);
			}
			.left{
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				i{
					font-size: 26rpx;
				}
			}
		}
	}
	.imgList{
		font-size: 0rpx;
		.imgItem{
			width: 750rpx;
			margin: 0;
			padding: 0;
		}
	}
	.bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 100rpx;
		background-color: #fff;
		.add{
			position: absolute;
			bottom: 15rpx;
			right: 29rpx;
			width: 205rpx;
			height: 74rpx;
			border-radius: 37rpx;
			background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
			text-align: center;
			line-height: 74rpx;
			color: #fff;
			font-weight: 600;
			font-size: 30rpx;
		}
	}
</style>
