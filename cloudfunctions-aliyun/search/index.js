'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const hotSearch = db.collection('hotSearch')
	const goods = db.collection('goods')
	if(event.type=='search'){
		const count = await hotSearch.where({keyWord:event.keyWord}).get()
		if(count.data.length==0){
			const add = await hotSearch.add({
				keyWord:event.keyWord,
				sum:1
			})
		}else{
			const modify=await hotSearch.where({keyWord:event.keyWord}).update({
				sum:count.data[0].sum+1
			})
		}
		const res=await goods.get()
		return res
	}
	if(event.type=='hotSearch'){
		const hot = await hotSearch.orderBy("sum", "desc").limit(15).get()
		return hot
	}
	//返回数据给客户端
	return event
};
