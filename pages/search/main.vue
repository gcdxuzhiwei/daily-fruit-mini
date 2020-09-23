<template>
	<div>
		<div class="search">
			<div class="go">
				<i class="iconfont iconsousuo"></i>
				<input type="text" placeholder="新鲜水果、生鲜">
			</div>
			<div class="button">搜索</div>
		</div>
		<div class="sousuo">
			<div class="title">历史搜索</div>
			<i class="iconfont iconshanchu"></i>
			<div class="main">
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
			</div>
		</div>
		<div class="sousuo">
			<div class="title">热门搜索</div>
			<div class="main">
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
				<span>苹果</span>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="less" scoped>
	.search{
		.go{
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
</style>
