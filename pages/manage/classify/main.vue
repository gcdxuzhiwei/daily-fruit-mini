<template>
	<div class="all">
		<div class="left">
			<div :class="chooseIndex==index?'item choose':'item'"
				v-for="(item,index) in classTree" :key="index"
				@click="choose(index)"
				@longpress="modify(item)"
				>
				{{item.className}}
			</div>
			<div class="item add" @click="add(-1,1)">添加分类...</div>
		</div>
		<div class="right">
			<div class="item" v-for="(item1,index1) in classTree[chooseIndex].children" :key="index1">
				<div @longpress="modify(item1)">{{item1.className}}</div>
				<div class="detail">
					<div class="detailItem" v-for="(item2,index2) in item1.children" @longpress="modify(item2)" :key="index2">
						<img :src="item2.classImg" alt="" class="detailImg">
						{{item2.className}}
					</div>
					<div class="addDetail" @click="add(item1.classTreeCode,3)">
						添加子分类..
					</div>
				</div>
			</div>
			<div class="add" @click="add(classTree[chooseIndex].classTreeCode,2)" v-if="classTree.length>0">
				添加分类...
			</div>
		</div>
		<div class="addClass" v-if="showAdd">
			<div class="main">
				<div class="add">新增分类</div>
				<div class="name">
					请输入分类名:<input type="text" class="input" v-model="input">
				</div>
				<div class="sort">
					请输入排序: <input type="text"class="input" v-model="sortNum">
				</div>
				<div class="name img" v-if="addDetail[1]==3">
					<div>请上传分类图片</div>
					<div class="noImg" v-if="classImg==''" @click="chooseImg">点击上传</div>
					<img :src="classImg" alt="" class="haveImg" @click="chooseImg">
				</div>
				<div class="sure" @click="sure">确定</div>
				<div class="cancel" @click="cancel">关闭</div>
			</div>
		</div>
		<div class="addClass" v-if="modifyDetail.length==1">
			<div class="main">
				<div class="add">修改分类</div>
				<div class="name">
					请输入分类名:<input type="text" class="input" v-model="input">
				</div>
				<div class="sort">
					请输入排序: <input type="text"class="input" v-model="sortNum">
				</div>
				<div class="name img" v-if="modifyDetail[0].classify==3">
					<div>请上传分类图片</div>
					<div class="noImg" v-if="classImg==''" @click="chooseImg">点击上传</div>
					<img :src="classImg" alt="" class="haveImg" @click="chooseImg">
				</div>
				<div class="sure" @click="sure">确定</div>
				<div class="cancel" @click="cancel">关闭</div>
				<div class="delete" @click='deleteClass'>删除</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				showAdd:false,
				chooseIndex:0,
				classTree:[],
				addDetail:[],
				input:'',
				classImg:'',
				sortNum:'',
				modifyDetail:[]
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
			add(classParentCode,level){
				this.showAdd=true
				this.addDetail=this.addDetail.concat([classParentCode,level])
			},
			cancel(){
				this.showAdd=false
				this.addDetail=[]
				this.modifyDetail=[]
				this.input=''
				this.classImg=''
				this.sortNum=''
			},
			sure(){
				if(this.input==''){
					uni.showToast({
						title:'请输入分类名',
						icon:"none"
					})
					return
				}
				if(this.sortNum==''){
					uni.showToast({
						title:'请输入排序',
						icon:"none"
					})
					return
				}
				if(this.addDetail[1]==3&&this.classImg==''){
					uni.showToast({
						title:'请上传分类图片',
						icon:"none"
					})
					return
				}
				if(this.modifyDetail.length==1){
					uniCloud.callFunction({
						name: 'manage',
						data:{
							type:"modify",
							classTreeCode:this.modifyDetail[0].classTreeCode,
							classImg:this.classImg,
							input:this.input,
							sortNum:this.sortNum-0
						}
					}).then((res)=>{
						this.modifyDetail=[]
						this.addDetail=[]
						this.input=''
						this.classImg=''
						this.sortNum=''
						this.get()
					})
				}else{
					uniCloud.callFunction({
						name: 'manage',
						data:{
							type:"add",
							addDetail:JSON.stringify(this.addDetail),
							classImg:this.classImg,
							input:this.input,
							sortNum:this.sortNum-0
						}
					}).then((res)=>{
						this.showAdd=false
						this.addDetail=[]
						this.input=''
						this.classImg=''
						this.sortNum=''
						this.get()
					})
				}
			},
			choose(index){
				this.chooseIndex=index
			},
			chooseImg(){
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
			modify(item){
				this.modifyDetail=[item]
				this.input=item.className
				this.sortNum=item.sortNum
				this.classImg=item.classImg
			},
			deleteClass(){
				let arr=[]
				function searchCode(obj){
					arr.push(obj.classTreeCode)
					obj.children.forEach((val,index)=>{
						searchCode(val)
					})
				}
				searchCode(this.modifyDetail[0])
				uniCloud.callFunction({
					name: 'manage',
					data:{
						type:"delete",
						classTreeCode:JSON.stringify(arr)
					}
				}).then((res)=>{
					this.modifyDetail=[]
					this.addDetail=[]
					this.input=''
					this.classImg=''
					this.sortNum=''
					this.get()
				})
			}
		},
		onShareAppMessage(){
			
		}
	}
</script>

<style lang="less" scoped>
	.all{
		position: relative;
		width: 100%;
		height: 100vh;
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
			.add{
				color: #65A032;
			}
		}
		.right{
			position: absolute;
			top: 0;
			right: 0;
			width: 542rpx;
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
					.addDetail{
						margin-top: 15rpx;
						font-weight: 400;
						text-align: center;
						color: #65A032;
						font-size: 28rpx;
					}
				}
			}
			.add{
				font-size: 30rpx;
				text-align: center;
				color: #65A032;
			}
		}
		.addClass{
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: rgba(0,0,0,0.5);
			.main{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				border-radius: 30rpx;
				width: 500rpx;
				height: 700rpx;
				background-color: #fff;
				.add{
					position: absolute;
					top: 30rpx;
					left: 15rpx;
					font-size: 40rpx;
					font-weight: 500;
				}
				.sure{
					position: absolute;
					bottom: 30rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 350rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: #0084c9;
					color: #fff;
					border-radius: 12rpx;
				}
				.cancel{
					font-size: 25rpx;
					color: #aaa;
					position: absolute;
					top: 38rpx;
					right: 15rpx;
				}
				.name{
					position: absolute;
					top: 130rpx;
					left: 15rpx;
					.input{
						width: 470rpx;
						background-color: #eee;
					}
				}
				.sort{
					position: absolute;
					top: 236rpx;
					left: 15rpx;
					width: 100%;
					.input{
						position: absolute;
						top: 0;
						right: 32rpx;
						width: 220rpx;
						background-color: #eee;
					}
				}
				.img{
					top: 270rpx;
					.noImg{
						line-height: 230rpx;
						text-align: center;
						width: 230rpx;
						height: 230rpx;
						background-color: #eee;
					}
					.haveImg{
						width: 230rpx;
						height: 230rpx;
					}
				}
				.delete{
					position: absolute;
					height: 80rpx;
					width: 60rpx;
					bottom: 26rpx;
					left: 10rpx;
					background-color: #DD524D;
					color: #fff;
					font-size: 25rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
