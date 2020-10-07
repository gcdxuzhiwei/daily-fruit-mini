<template>
</template>

<script>
export default {
	data(){
		return {
			classifyTree:[],
			nowClassify:'全部'
		}
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
		})
	}
}
</script>

<style>
</style>
