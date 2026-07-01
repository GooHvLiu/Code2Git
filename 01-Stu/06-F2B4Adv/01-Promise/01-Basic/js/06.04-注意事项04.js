/* 
5. promise如何串连多个操作任务 如何串连多个操作任务 ?

   (1) promise的 then()返回一个新的promise, 可以看成 then()的链式调用

   (2) 通过 then的链式调用串连多个同步的链式调用串连多个同步 /异步任务

*/

//以下代码想实现如下打印效果：
/* 
执行异步任务1
任务1的结果：1
执行同步任务2
任务2的结果：2
执行异步任务3
任务3的结果：3
 */
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("执行异步任务1");
    resolve(1);
  }, 1000);
})
  .then((value) => {
    console.log("任务1的结果：", value);
    console.log("执行同步任务2");
    return 2;
  })
  .then((value) => {
    console.log("任务2的结果：", value);

    //此处通过new一个promise的目的是为了后面.then，因为.then需要一个promise对象
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("执行异步任务3");
        resolve(3);
      }, 1000);
    });
  })
  .then((value) => {
    console.log("任务3的结果：", value);
  });
