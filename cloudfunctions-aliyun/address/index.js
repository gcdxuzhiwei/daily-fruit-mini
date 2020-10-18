'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const address = db.collection('address')
	console.log('event : ', event)
	let flag=await address.where({user:event.user}).get()
	if(flag.affectedDocs==0){
		let add=await address.add({user:event.user,address:[]})
	}
	if(event.type=='get'){
		const res=await address.where({user:event.user}).get()
		return res
	}
	if(event.type=='update'){
		const res=await address.where({user:event.user}).update({
			address:event.address
		})
		return res
	}
	//返回数据给客户端
	return event
};
