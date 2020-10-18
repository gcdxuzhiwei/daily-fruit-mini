<template>
	<div>
		<div class="head">
			<div class="main">
				<i @click="goBack" class="iconfont iconicon_on_the_left"></i>
				<div @click="goSearch" class="search"><i class="iconfont iconsousuo"></i> 中秋送礼</div>
			</div>
		</div>
		<div class="nav">
			<div @click="change(item.name)" :class="item.name==nowClassify?'now navMain':'navMain'" v-for="(item,index) in classifyTree" :key="index">{{item.name}}</div>
		</div>
		<div class="goodsList">
			<div class="goodsItem" v-for="(item1,index1) in showList" :key="index1">
				<div class="goodItem" v-for="(item2,index2) in item1.rule" :key="index2" @click="goDetail(item1,item2)">
					<img :src="item1.swiperImg[0]" alt="">
					<span class="firstTitle">{{item1.firstTitle}}</span>
					<span class="secondTitle">{{item1.secondTitle}}</span>
					<span class="price">￥<span class="big">{{priceFix(item2[1],1)}}</span>.{{priceFix(item2[1],2)}}</span>
					<span class="rule">{{item2[0]}}</span>
					<span @click.stop="addShopcart(item1.goodsCode,item2[0],item1.swiperImg[0],item1.firstTitle,item2[1])" class="add">+</span>
				</div>
			</div>
		</div>
		<shopcart ref="shopcart"></shopcart>
	</div>
</template>

<script>
import shopcart from '../component/shopcartItem.vue'
export default {
	data(){
		return {
			classifyTree:[],
			nowClassify:'全部',
			showList:[]
		}
	},
	components:{
		shopcart
	},
	onShow() {
		this.$refs.shopcart.getSum()
	},
	onLoad(options){
		let cloud=[]
		JSON.parse(options.arr).forEach((val)=>{
			cloud=cloud.concat(val.children)
		})
		this.nowClassify=options.now
		uniCloud.callFunction({
			name: 'goods',
			data:{
				type:"getGoodsList",
				parentList:[...new Set(cloud)]
			}
		}).then((res)=>{
			let cloudRes=res.result
			this.classifyTree.push({
				name:'全部',
				list:cloudRes
			})
			JSON.parse(options.arr).forEach((val)=>{
				this.classifyTree.push({
					name:val.className,
					list:cloudRes.filter((v)=>{
						return val.children.indexOf(v.goodsCode)!==-1
					})
				})
			})
			this.changeList(this.nowClassify)
		})
	},
	methods:{
		changeList(name){
			this.classifyTree.forEach((val)=>{
				if(val.name==name){
					this.showList=val.list
				}
			})
		},
		goBack(){
			uni.navigateBack({})
		},
		goSearch(){
			uni.navigateTo({
				url:'../search/main'
			})
		},
		change(name){
			if(name==this.nowClassify){
				return
			}
			this.nowClassify=name
			this.changeList(name)
		},
		goDetail(item1,item2){
			uni.navigateTo({
				url:`../goodsDetail/main?goodCode=${item1.goodsCode}&rule=${item2[0]}`
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
		addShopcart(goodsCode,rule,img,title,price){
			if(!uni.getStorageSync('userPhone')){
				uni.navigateTo({
					url:'../login/main'
				})
			}else{
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
	.head{
		position: fixed;
		z-index: 99999;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100rpx;
		padding-top: 50rpx;
		background-color: #fff;
		.main{
			position: relative;
			width: 750rpx;
			height: 100rpx;
			.iconicon_on_the_left{
				position: absolute;
				left: 30rpx;
				top: 50%;
				transform: translateY(-50%);
			}
			.search{
				position: absolute;
				top: 50%;
				left: 100rpx;
				transform: translateY(-50%);
				width: 375rpx;
				height: 65rpx;
				border-radius: 25rpx;
				background-color: rgb(245,245,245);
				color: #ccc;
				font-weight: 600;
				text-align: center;
				line-height: 65rpx;
				font-size: 32rpx;
				.iconfont{
					display: inline-block;
				}
			}
		}
	}
	.nav{
		z-index: 9999;
		position: fixed;
		left: 0;
		top: 147rpx;
		width: 750rpx;
		height: 68rpx;
		background-color: #fff;
		overflow: scroll;
		white-space: nowrap;
		.navMain{
			display: inline-block;
			margin: 0 18rpx;
			font-size: 32rpx;
			font-weight: 600;
		}
		.now{
			position: relative;
			font-size: 40rpx;
			color: rgb(117,167,58);
		}
		.now::after{
			content: '';
			display: inline-block;
			position: absolute;
			width: 100%;
			height: 5rpx;
			background-color: rgb(117,167,58);
			bottom: -10rpx;
			left: 0;
		}
	}
	.goodsList{
		margin-top: 225rpx;
	}
	.goodItem{
		position: relative;
		width: 750rpx;
		height: 200rpx;
		margin: 40rpx 0;
		img{
			position: absolute;
			top: 0;
			left: 30rpx;
			width: 200rpx;
			height: 200rpx;
			border-radius: 18rpx;
			overflow: hidden;
		}
		.firstTitle{
			position: absolute;
			left: 250rpx;
			top: 0;
			font-size: 30rpx;
			font-weight: 600;
		}
		.secondTitle{
			position: absolute;
			left: 250rpx;
			top: 42rpx;
			color: rgb(175,175,175);
			font-size: 28rpx;
		}
		.rule{
			position: absolute;
			bottom: 0;
			left: 360rpx;
			color: rgb(175,175,175);
			font-size: 26rpx;
		}
		.price{
			position: absolute;
			bottom: 0;
			left: 250rpx;
			color: rgb(255,131,6);
			font-size: 23rpx;
			font-weight: 500;
			.big{
				font-size: 30rpx;
			}
		}
		.add{
			position: absolute;
			bottom: 0;
			right: 30rpx;
			width: 45rpx;
			height: 45rpx;
			border-radius: 22.5rpx;
			background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
			color: #fff;
			line-height: 45rpx;
			text-align: center;
			font-weight: 700;
		}
	}
</style>
