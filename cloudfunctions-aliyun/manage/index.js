'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('goodsClassify')

	if (event.type === 'get') {
		let first = await collection.where({
			classify: 1
		}).orderBy("sortNum", "asc").get()
		let second = await collection.where({
			classify: 2
		}).orderBy("sortNum", "asc").get()
		let third = await collection.where({
			classify: 3
		}).orderBy("sortNum", "asc").get()
		let thirdStep = await collection.where({
			classify: 3
		}).orderBy("sortNum", "asc").skip(100).get()
		first = first.data
		second = second.data
		third = third.data.concat(thirdStep.data)
		for (let i = 0; i < third.length; i++) {
			let code = third[i].classParentCode
			for (let j = 0; j < second.length; j++) {
				if (code == second[j].classTreeCode) {
					second[j].children.push(third[i])
				}
			}
		}
		for (let i = 0; i < second.length; i++) {
			let code = second[i].classParentCode
			for (let j = 0; j < first.length; j++) {
				if (code == first[j].classTreeCode) {
					first[j].children.push(second[i])
				}
			}
		}
		return first
	}

	if (event.type == 'add') {
		const collection = db.collection('goodsClassify')
		let addDetail = JSON.parse(event.addDetail)
		const res = await collection.add({
			classParentCode: addDetail[0],
			classTreeCode: (Math.random() + '').slice(2, 8) + new Date().getTime(),
			classify: addDetail[1],
			className: event.input,
			classImg: event.classImg,
			sortNum: event.sortNum,
			children: []
		})
		return res
	}

	if (event.type == 'modify') {
		const collection = db.collection('goodsClassify')
		const res = await collection.where({
			classTreeCode: event.classTreeCode
		}).update({
			className: event.input,
			classImg: event.classImg,
			sortNum: event.sortNum
		})
		return res
	}

	if (event.type == 'delete') {
		const collection = db.collection('goodsClassify')
		let task = JSON.parse(event.classTreeCode)
		let res = []
		for (let i = 0; i < task.length; i++) {
			let x = await collection.where({
				classTreeCode: task[i]
			}).remove()
			res.push(x)
		}
		return res
	}
	if (event.type == 'modifyChildren') {
		const collection = db.collection('goodsClassify')
		const res = await collection.where({
			classTreeCode: event.classTreeCode
		}).update({
			children: event.children
		})
		return res
	}
	return event
};
