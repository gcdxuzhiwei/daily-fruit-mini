'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const collection = db.collection('indexManager')
	if(event.type=='addSwiper'){
		const res=await collection.add({
			type:"swiper",
			img:event.img,
			goodName:'',
			goodCode:'',
			rule:''
		})
		return res
	}
	if(event.type=='getSwiper'){
		const res=await collection.where({
			type:"swiper"
		}).get()
		return res
	}
	if(event.type=='modifySwiper'){
		const res=await collection.where({
			_id:event._id
		}).update({
			goodCode:event.goodCode,
			goodName:event.goodName,
			rule:event.rule
		})
		return res
	}
	if(event.type=='deleteSwiper'){
		const res=await collection.where({
			_id:event._id
		}).remove()
		return res
	}
	//返回数据给客户端
	return event
};
