'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection('goods')
	console.log('event : ', event)
	if(event.type=='get'){
		let res=await collection.get()
		let s=100
		while(true){
			let step=await collection.skip(s).get()
			if(step.data.length==0){
				break
			}else{
				res.data=res.data.concat(step.data)
				s=s+100
			}
		}
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
			imgList:event.imgList,
			goodsNum:0
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
	if(event.type=="modifyNum"){
		let res=await collection.where({
			goodsCode:event.goodsCode
		}).update({
			goodsNum:event.goodsNum
		})
		return res
	}
	if(event.type=="getByID"){
		let res=await collection.where({
			goodsCode:event.goodsCode
		}).get()
		return res
	}
	if (event.type == 'getGoodsList') {
		let res=[]
		for(let i=0;i<event.parentList.length;i++){
			let search=await collection.where({
				goodsCode:event.parentList[i]
			}).get()
			res.push(search.data[0])
		}
		return res
	}
	//返回数据给客户端
	return event
};
