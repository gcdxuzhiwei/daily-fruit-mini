<template>
	<div>
		<div class="main">
			<div class="item">
				<div class="left">收货人</div>
				<input v-model="name" type="text" class="right" placeholder="收货人姓名">
			</div>
			<div class="item">
				<div class="left">收货人手机</div>
				<input v-model="phone" type="number" class="right" placeholder="手机号码">
			</div>
			<div class="item">
				<div class="left">收货地区</div>
					<picker class="right" mode="region" @change="bindRegionChange" :value="region">
						<view class="picker">
							{{region[0]}}{{region[1]}}{{region[2]}}
						</view>
					</picker>
			</div>
			<div class="item">
				<div class="left">详细地址</div>
				<input v-model="detailAddress" type="text" class="right">
			</div>
			<div class="item">
				<div class="left">类型</div>
				<u-radio-group class="right" v-model="type" @change="typeClick" active-color="#FF8000">
					<u-radio 
						v-for="(item, index) in typeList" :key="index" 
						:name="item.name"
						:disabled="item.disabled"
					>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</div>
			<div class="item">
				<div class="left">默认地址</div>
				<u-radio-group class="right" v-model="isDefault" active-color="#FF8000">
					<u-radio 
						v-for="(item, index) in list" :key="index" 
						:name="item.name"
						:disabled="item.disabled"
					>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</div>
		</div>
		<div :class="ready?'save ready':'save'" @click="save">保存并使用</div>
		<div class="save delete" v-if="index>-1" @click="deleteAddress">删除地址</div>
	</div>
</template>

<script>
export default {
	data(){
		return {
			name:'',
			phone:'',
			detailAddress:'',
			region: ['省、', '市、', '区'],
			typeList: [
				{
					name: '家',
					disabled: false
				},
				{
					name: '公司',
					disabled: false
				}
			],
			type: '',
			currentType:'',
			isDefault:'否',
			list: [
				{
					name: '是',
					disabled: false
				},
				{
					name: '否',
					disabled: false
				}
			],
			address:[],
			index:-1
		}
	},
	computed:{
		ready(){
			return this.name&&this.phone.length==11&&this.detailAddress&&JSON.stringify(this.region)!==JSON.stringify(['省、', '市、', '区'])
		}
	},
	onLoad(options) {
		this.address=JSON.parse(options.address)
		this.index=options.index-0
		if(this.index>-1){
			const now=this.address[this.index]
			this.name=now.name
			this.phone=now.phone
			this.region=now.region,
			this.detailAddress=now.detailAddress
			this.type=now.type
			this.isDefault=now.isDefault?'是':'否'
		}
	},
	methods:{
		bindRegionChange(e){
			this.region=e.detail.value
		},
		typeClick(e){
			if(e==this.currentType){
				this.type=''
				this.currentType=''
			}else{
				this.currentType=e
			}
		},
		save(){
			if(!this.ready){
				return
			}
			if(this.isDefault=='是'){
				for(let i=0;i<this.address.length;i++){
					if(this.address[i].isDefault){
						this.address[i].isDefault=false
					}
				}
			}
			if(this.index==-1){
				this.address.unshift({
					name:this.name,
					phone:this.phone,
					region:this.region,
					detailAddress:this.detailAddress,
					type:this.currentType,
					isDefault:this.isDefault=='否'?false:true
				})
			}else{
				this.address[this.index]={
					name:this.name,
					phone:this.phone,
					region:this.region,
					detailAddress:this.detailAddress,
					type:this.currentType,
					isDefault:this.isDefault=='否'?false:true
				}
			}
			uniCloud.callFunction({
				name: 'address',
				data:{
					type:"update",
					user:uni.getStorageSync('userPhone'),
					address:this.address
				}
			}).then((res)=>{
				uni.navigateBack()
			})
		},
		deleteAddress(){
			this.address.splice(this.index,1)
			uniCloud.callFunction({
				name: 'address',
				data:{
					type:"update",
					user:uni.getStorageSync('userPhone'),
					address:this.address
				}
			}).then((res)=>{
				uni.navigateBack()
			})
		}
	}
}
</script>

<style lang="less" scoped>
.main{
	margin: 20rpx;
	padding: 20rpx;
	box-shadow: 0 0 15rpx #eee;
	border-radius: 25rpx;
	.item{
		font-weight: 600;
		height: 100rpx;
		width: 100%;
		position: relative;
		.left{
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
		}
		.right{
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			text-align: right;
		}
	}
}
.save{
	margin: 100rpx auto 30rpx;
	width: 650rpx;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	border-radius: 40rpx;
	color: #666;
	font-weight: 600;
	background-color: #eee;
}
.ready{
	color: #fff;
	background-image:linear-gradient(to right, rgb(254,184,0) , rgb(254,130,1));
}
.delete{
	box-shadow: 0 0 15rpx #eee;
	background-color: #fff;
	color: #000;
	border: 1rpx solid #ddd;
	margin: 0 auto;
}
</style>
