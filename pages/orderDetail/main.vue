<template>
	<div></div>
</template>

<script>
export default{
	data(){
		return{
			order:null
		}
	},
	onLoad(options) {
		this.order=JSON.parse(options.order)
	}
}
</script>

<style>
</style>
