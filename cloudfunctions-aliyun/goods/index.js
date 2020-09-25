'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection('goods')
	console.log('event : ', event)
	if(event.type=='get'){
		let res=await collection.get()
		res.data.reverse()
		return res
	}
	if(event.type=="add"){
		let res=await collection.add({
			goodsCode:(Math.random()+'').slice(2,8)+new Date().getTime(),
			firstTitle:event.firstTitle,
			secondTitle:event.secondTitle,
			swiperImg:event.swiperList,
			rule:event.rule,
			imgList:event.imgList
		})
		return res
	}
	if(event.type=="modify"){
		let res=await collection.where({
			goodsCode:event.goodsCode
		}).update({
			firstTitle:event.firstTitle,
			secondTitle:event.secondTitle,
			swiperImg:event.swiperList,
			rule:event.rule,
			imgList:event.imgList
		})
		return res
	}
	if(event.type=="delete"){
		let res=await collection.where({
			goodsCode:event.goodsCode
		}).remove()
		return res
	}
	//返回数据给客户端
	return event
};
