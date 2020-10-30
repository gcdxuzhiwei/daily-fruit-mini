'use strict';
//-1已取消 0待付款 1待发货 2待收货 3待评价 4已完成
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const order = db.collection('order')
	const shopcart = db.collection('shopcart')
	console.log('event : ', event)
	if(event.type=='set'){
		const set=await order.add({
			user:event.user,
			orderId:event.orderId,
			orderTime:(new Date()).getTime(),
			arriveTime:event.arriveTime,
			address:event.address,
			goods:event.goods,
			price:event.price,
			state:0
		})
		const shop=await shopcart.where({
			user:event.user
		}).update({
			shopcart:event.shopcart
		})
		const res=await order.where({
			orderId:event.orderId
		}).get()
		return res
	}
	if(event.type=='get'){
		const res=await order.where({
			user:event.user
		}).orderBy("orderTime", "desc").get()
		return res
	}
	//返回数据给客户端
	return event
};
