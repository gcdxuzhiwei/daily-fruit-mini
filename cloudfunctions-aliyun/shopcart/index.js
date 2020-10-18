'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	
	const shopcart = db.collection('shopcart')
	console.log('event : ', event)
	let flag=await shopcart.where({user:event.user}).get()
	if(flag.affectedDocs==0){
		let add=await shopcart.add({user:event.user,shopcart:[]})
	}
	
	if(event.type=='get'){
		let res=await shopcart.where({user:event.user}).get()
		return res
	}
	if(event.type=='update'){
		let res=await shopcart.where({
			user:event.user
		}).update({
			shopcart:event.shopcart
		})
		return 
	}
	//返回数据给客户端
	return event
};
