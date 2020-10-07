<template>
	<div class="classify">
		<div class="search" @click="goSearch">
			<i class="iconfont iconsousuo"></i>
			<span>中秋送礼</span>
		</div>
		<div class="all">
			<div class="left">
				<div :class="chooseIndex==index?'item choose':'item'"
					v-for="(item,index) in classTree" :key="index"
					@click="choose(index)"
					>
					{{item.className}}
				</div>
			</div>
			<div class="right">
				<div class="rightScroll">
					<div class="item" v-for="(item1,index1) in classTree[chooseIndex].children" :key="index1">
						<div>{{item1.className}}</div>
						<div class="detail">
							<div class="detailItem" v-for="(item2,index2) in item1.children" :key="index2" @click="goList(item1.children,item2.className)">
								<img :src="item2.classImg" alt="" class="detailImg">
								{{item2.className}}
							</div>
							<div class="detailItem" @click="goList(item1.children,'全部')">
								<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-gcdxuzhiwei/be58a380-fcbd-11ea-b680-7980c8a877b8.png" alt="" class="detailImg">
								全部
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<nav-bar nowIndex='1'></nav-bar>
	</div>
</template>

<script>
	import navBar from '../component/navBar.vue'
	export default {
		components:{
			navBar
		},
		data(){
			return {
				chooseIndex:0,
				classTree:[]
			}
		},
		mounted() {
			this.get()
		},
		methods:{
			get(){
				uniCloud.callFunction({
					name: 'manage',
					data:{
						type:"get"
					}
				}).then((res)=>{
					this.classTree=res.result
				})
			},
			choose(index){
				this.chooseIndex=index
			},
			goSearch(){
				uni.navigateTo({
					url:"../search/main"
				})
			},
			goList(item1,item2){
				uni.navigateTo({
					url:`../goodsList/main?arr=${JSON.stringify(item1)}&now=${item2}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.classify{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		.search{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 99999;
			width: 497rpx;
			height: 62rpx;
			margin: 65rpx 235rpx 0 18rpx;
			background-color: #f5f5f5;
			color: #bfbfbf;
			border-radius: 30rpx;
			text-align: center;
			line-height: 62rpx;
			font-size: 30rpx;
			font-weight: 500;
			i{
				display: inline-block;
			}
		}
		.all{
			position: relative;
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			padding: 127rpx 0 100rpx 0;
			overflow: hidden;
			.left{
				height: 100%;
				width: 208rpx;
				overflow-y: scroll;
				.item{
					height: 80rpx;
					line-height: 80rpx;
					font-size: 27rpx;
					text-align: center;
				}
				.choose{
					font-size: 30rpx;
					color: #65a032;
					font-weight: 500;
				}
			}
			.right{
				position: absolute;
				top: 0;
				right: 0;
				box-sizing: border-box;
				width: 542rpx;
				height: 100%;
				padding: 127rpx 0 100rpx 0;
				overflow-y: hidden;
				.rightScroll{
					width: 100%;
					height: 100%;
					overflow-y: scroll;
					.item{
						font-size: 33rpx;
						font-weight: 600;
						box-sizing: border-box;
						width: 510rpx;
						margin: 15rpx auto 30rpx;
						padding: 30rpx 20rpx;
						border-radius: 15rpx;
						box-shadow: 0 0 15rpx #eee;
						.detail{
							margin-top: 20rpx;
							.detailItem{
								font-size: 26rpx;
								font-weight: 400;
								display: inline-block;
								width: 33%;
								height: 200rpx;
								overflow: hidden;
								text-align: center;
								margin-bottom: 15rpx;
								img{
									width: 150rpx;
									height: 150rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
