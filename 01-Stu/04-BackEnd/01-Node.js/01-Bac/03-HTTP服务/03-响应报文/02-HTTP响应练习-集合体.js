// ========================================
// =项目名称：02-HTTP响应练习-结合体.js
// =需求：
//    1）搭建 HTTP 服务
//    2）响应一个 4 行 3 列的表格
//    3) 表格有隔行换色效果，且点击单元格能高亮显示
// ========================================
// 1. 引入http模块
const http = require('http');

// 2. 创建服务对象 
const server = http.createServer((request, response) => {
  // 响应结果
  response.end(`
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    td {
      padding: 20px 40px;
      border: 1px orange solid;
    }

    tr:nth-child(even) {
      background-color: yellowgreen;
    }

    tr:nth-child(odd) {
      background-color: lightblue;
    }
  </style>
</head>

<body>
  <table>
    <tr>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>
</body>
<script>
  //获取所有的td
  let tds = document.querySelectorAll('td');

  //遍历
  tds.forEach(item => {
    item.onclick = function () {
      this.style.background = 'black';
    }
  })
</script>

</html>
    `);
})

// 3. 监听端口，启动服务器
server.listen(9000, () => {
  console.log('I am listening.');

})