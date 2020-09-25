<template>
	<div class="manager">
		<div class="goodItem" v-for="(item,index) in goodsList" :key="index">
			<div>标题：{{item.firstTitle}}</div>
			<div>副标题：{{item.secondTitle}}</div>
			<div class="detail" @click='modifyClick(item)'>编辑</div>
		</div>
		<div class="add" @click="overlayOpen">添加商品</div>
		<div class="overlay" v-if="overlay">
			<div class="form">
				<div class="title">
					<span class="name">标题:</span>
					<input type="text" v-model="firstTitle">
				</div>
				<div class="title">
					<span class="name">副标题:</span>
					<input type="text" v-model="secondTitle">
				</div>
				<div class="title">
					<span class="name">选择图片:</span>
					<span class="chooseImg" @click="chooseImg">点击上传</span>
				</div>
				<img class="swiperImg" :src="item" alt="" v-for="(item,index) in swiperList" :key="index" @click="cancelSwiper(index)">
				<div class="title">
					<span class="name">规格/价格：</span>
					<span class="chooseImg" @click="openAdd">点击新增</span>
				</div>
				<div class="ruleBox" v-if="rule.length>0">
					<span class="rule" v-for="(item,index) in rule" :key="index" @click="cancelRule(index)">{{item[0]+' / '+item[1]}}</span>
				</div>
				<div class="title">
					<span class="name">选择详情图片:</span>
					<span class="chooseImg" @click="chooseDetailImg">点击上传</span>
				</div>
				<img class="swiperImg" :src="item" alt="" v-for="(item,index) in imgList" :key="index" @click="cancelImg(index)">
				<div class="finish">
					<span @click="cancel">取消</span>
					<span @click="finish">确定</span>
					<span @click="deleteItem" v-if="modify">删除</span>
				</div>
			</div>
			<div class="addRule" v-if="addRule">
				<div class="title">
					<div class="title">
						<span class="name">规格:</span>
						<input type="text" v-model="rule1">
					</div>
					<div class="title">
						<span class="name">价格:</span>
						<input type="text" v-model="rule2">
					</div>
					<div class="sure" @click="addRuleFn">添加</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				overlay:false,
				firstTitle:'',
				secondTitle:'',
				swiperList:[],
				imgList:[],
				rule:[],
				goodsList:[],
				rule1:'',
				rule2:'',
				addRule:false,
				modify:false
			}
		},
		mounted() {
			this.getDoods()
		},
		methods:{
			getDoods(){
				uniCloud.callFunction({
					name: 'goods',
					data:{
						type:"get"
					}
				}).then((res)=>{
					this.goodsList=res.result.data
				})
			},
			overlayOpen(){
				this.overlay=true
			},
			chooseImg(){
				let that=this
				uni.chooseImage({
				    count: 1, //默认9
				    sourceType: ['album'], //从相册选择
				    success: (res) => {
						let filePath=res.tempFilePaths[0]
						uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: (Math.random()+'').slice(2,8)+new Date().getTime()+'.jpg',
							success(s){
								that.swiperList=that.swiperList.concat(s.fileID)
							},
							fail(e){
								uni.showToast({
									title:JSON.stringify(e),
									icon:"none"
								})
							}
						});
				    }
				});
			},
			chooseDetailImg(){
				let that=this
				uni.chooseImage({
				    count: 1, //默认9
				    sourceType: ['album'], //从相册选择
				    success: (res) => {
						let filePath=res.tempFilePaths[0]
						uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: (Math.random()+'').slice(2,8)+new Date().getTime()+'.jpg',
							success(s){
								that.imgList=that.imgList.concat(s.fileID)
							},
							fail(e){
								uni.showToast({
									title:JSON.stringify(e),
									icon:"none"
								})
							}
						});
				    }
				});
			},
			cancelSwiper(index){
				this.swiperList=this.swiperList.slice(0,index).concat(this.swiperList.slice(index+1,this.swiperList.length))
			},
			cancelImg(index){
				this.imgList=this.imgList.slice(0,index).concat(this.imgList.slice(index+1,this.imgList.length))
			},
			cancelRule(index){
				this.rule=this.rule.slice(0,index).concat(this.rule.slice(index+1,this.rule.length))
			},
			openAdd(){
				this.addRule=true
			},
			addRuleFn(){
				if(this.rule1&&this.rule2){
					this.rule.push([this.rule1,this.rule2-0])
					this.rule1=''
					this.rule2=''
					this.addRule=false
				}
			},
			finish(){
				if(this.firstTitle&&this.secondTitle&&this.swiperList&&this.rule&&this.imgList){
					uniCloud.callFunction({
						name: 'goods',
						data:{
							type:this.modify?'modify':'add',
							goodsCode:this.modify,
							firstTitle:this.firstTitle,
							secondTitle:this.secondTitle,
							swiperList:this.swiperList,
							rule:this.rule,
							imgList:this.imgList
						}
					}).then((res)=>{
						this.firstTitle=''
						this.secondTitle=''
						this.swiperList=[]
						this.rule=[]
						this.imgList=[]
						this.overlay=false
						this.modify=false
						this.getDoods()
					})
				}
			},
			cancel(){
				this.firstTitle=''
				this.secondTitle=''
				this.swiperList=[]
				this.rule=[]
				this.imgList=[]
				this.overlay=false
				this.modify=false
			},
			modifyClick(item){
				this.firstTitle=item.firstTitle
				this.secondTitle=item.secondTitle
				this.swiperList=item.swiperImg
				this.rule=item.rule
				this.imgList=item.imgList
				this.overlay=true,
				this.modify=item.goodsCode
			},
			deleteItem(){
				uniCloud.callFunction({
					name: 'goods',
					data:{
						type:'delete',
						goodsCode:this.modify
					}
				}).then((res)=>{
					this.firstTitle=''
					this.secondTitle=''
					this.swiperList=[]
					this.rule=[]
					this.imgList=[]
					this.overlay=false
					this.modify=false
					this.getDoods()
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.manager{
		padding-bottom: 100rpx;
		.goodItem{
			position: relative;
			.detail{
				position: absolute;
				right: 15rpx;
				top: 50%;
				transform: translateY(-50%);
				background-color: #0084c9;
				color: #fff;
			}
		}
		.add{
			position: fixed;
			bottom: 10rpx;
			left: 15rpx;
			width: 720rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			background-color: #0084c9;
			border-radius: 35rpx;
		}
		.overlay{
			position: fixed;
			z-index: 99999;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0,0,0,0.5);
			.form{
				padding: 10rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				width: 680rpx;
				height: 950rpx;
				background-color: #fff;
				border-radius: 35rpx;
				overflow-x: hidden;
				overflow-y: scroll;
				.title{
					width: 100%;
					display: flex;
					justify-content: space-between;
					margin: 8rpx 0;
					input{
						width: 530rpx;
						background-color: #eee;
						border-radius: 10rpx;
					}
					.chooseImg{
						background-color: #ccc;
					}
				}
				.swiperImg{
					width: 220rpx;
					height: 220rpx;
					margin-left: 6rpx;
				}
				.ruleBox{
					display: flex;
					width: 100%;
					flex-wrap: wrap;
					.rule{
						padding: 5rpx;
						margin-left: 15rpx;
						margin-top: 5rpx;
						background-color: #eee;
						border-radius: 8rpx;
					}
				}
				.finish{
					margin-top: 15rpx;
					display: flex;
					width: 100%;
					height: 50rpx;
					background-color: #0084c9;
					color: #fff;
					border-radius: 25rpx;
					span{
						flex: 1;
						text-align: center;
					}
				}
			}
			.addRule{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				width: 690rpx;
				height: 960rpx;
				background-color: #fff;
				border-radius: 20rpx;
				input{
					background-color: #ddd;
				}
				.sure{
					position: absolute;
					bottom: 15rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 400rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: #0084c9;
					color: #fff;
				}
			}
		}
	}
</style>
