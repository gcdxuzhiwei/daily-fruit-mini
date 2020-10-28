'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const order = db.collection('order')
	
	const oldTime=(new Date()).getTime()-1000*60*15
	const changeOrder=await order.where({
		state:0,
		orderTime:dbCmd.lt(oldTime)
	}).update({
		state:-1
	})
	
	//返回数据给客户端
	return event
};
