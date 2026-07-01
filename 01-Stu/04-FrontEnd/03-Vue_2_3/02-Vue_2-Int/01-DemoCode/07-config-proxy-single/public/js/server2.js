// 开启服务器方法：
// 1）通过cmd进入到该文件路径下；
// 2）使用node server2.js即可开启
const express = require('express')
const app = express()

app.use((request, response, next) => {
	console.log('哇偶，有人请求服务器2了');
	next()
})

app.get('/cars', (request, response) => {
	const cars = [
		{ id: '001', name: '奔驰', price: 199 },
		{ id: '002', name: '马自达', price: 109 },
		{ id: '003', name: '捷达', price: 120 },
	]
	response.send(cars)
})

app.listen(5001, (err) => {
	if (!err) console.log('服务器2启动成功了,请求汽车信息地址为：http://localhost:5001/cars');
})
