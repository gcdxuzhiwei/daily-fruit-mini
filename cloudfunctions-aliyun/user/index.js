'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const user = db.collection('user')
	const admin = db.collection('admin')
	console.log('event : ', event)
	if(event.type=='login'){
		const count = await user.where({phone:event.phone}).get()
		if(count.data.length>0){
			if(count.data[0].password===event.password){
				return '登录成功'
			}
		}else{
			const res=await user.add({
				phone:event.phone,
				password:event.password
			})
			if(res.id){
				return '注册成功'
			}
		}
		return 'error'
	}
	if(event.type=='admin'){
		const count = await admin.where({phone:event.phone}).get()
		if(count.data.length>0){
			return true
		}else{
			return false
		}
	}
	if(event.type=='adminList'){
		const count = await admin.get()
		return count.data
	}
	if(event.type=='adminChange'){
		let res
		const count = await admin.where({phone:event.phone}).get()
		if(count.data.length==0){
			res=await admin.add({phone:event.phone})
		}else{
			res=await admin.where({phone:event.phone}).remove()
		}
		return res
	}
	//返回数据给客户端
	return event
};
