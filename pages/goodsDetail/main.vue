<template>
	<div>
		<div class="swiperBox">
			<div class="count"><span class="swiperIndex">{{swiperIndex+1}}</span>{{`/${good.swiperImg.length?good.swiperImg.length:0}`}}</div>
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
					{{item[0].slice(item[0].indexOf(' '),item[0].length)}}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
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
		z-index: 999;
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
	}
</style>
