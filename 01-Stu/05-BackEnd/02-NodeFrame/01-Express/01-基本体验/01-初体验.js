/* 
 * 项目：01-初体验.js
 * 
 */

// 1. 引入express
const express=require('express')

// 2. 创建应用对象
const app=express();

// 3. 创建路由
app.get('/home',(req,res)=>{
    res.end('I am listening...')
});

// 3. 创建路由
app.get('/',(req,res)=>{
    res.end('I am listening:'+'/ rounting'+'...')
});

// 4. 监视端口，启动服务
app.listen(8080,()=>{
    console.log("Let's Go Fishing...");
    
})