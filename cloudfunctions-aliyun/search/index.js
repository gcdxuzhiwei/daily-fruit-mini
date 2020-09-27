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
		let s=100
		while(true){
			let step=await goods.skip(s).get()
			if(step.data.length==0){
				break
			}else{
				res.data=res.data.concat(step.data)
				s=s+100
			}
		}
		return res.data.filter((v)=>{
			return v.firstTitle.indexOf(event.keyWord)!==-1
		})
	}
	if(event.type=='hotSearch'){
		const hot = await hotSearch.orderBy("sum", "desc").limit(15).get()
		return hot
	}
	if(event.type=='searchKeyWorld'){
		const res=await goods.get()
		let s=100
		while(true){
			let step=await goods.skip(s).get()
			if(step.data.length==0){
				break
			}else{
				res.data=res.data.concat(step.data)
				s=s+100
			}
		}
		let list=res.data.filter((v)=>{
			return v.firstTitle.indexOf(event.keyWord)!==-1
		})
		const rr=[]
		for(let i=0;i<list.length;i++){
			rr.push(list[i].firstTitle)
		}
		return rr
	}
	//返回数据给客户端
	return event
};
