<template>
	<div>
		<div class="top">
			添加或删除管理员
			<input v-model="phone"></input>
			<div @click="change">确定</div>
		</div>
		<div>
			<div v-for="(item,index) in list" :key="index">{{item.phone}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				phone: ''
			}
		},
		mounted() {
			this.getAdmin()
		},
		methods:{
			getAdmin(){
				uniCloud.callFunction({
					name: 'user',
					data:{
						type:"adminList",
						phone:uni.getStorageSync("userPhone")
					}
				}).then((res)=>{
					this.list=res.result
				})
			},
			change(){
				if(this.phone.length!==11){
					uni.showToast({
						title:'请输入正确的手机号',
						icon:'none'
					})
					return
				}
				uniCloud.callFunction({
					name: 'user',
					data:{
						type:"adminChange",
						phone:this.phone
					}
				}).then((res)=>{
					this.getAdmin()
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.top {
		display: flex;

		input {
			width: 100rpx;
			border: 1px solid #0084c9;
			width: 250rpx;
		}

		div {
			padding: 0 20px;
			background-color: #0084c9;
			border-radius: 20rpx;
		}
	}
</style>
