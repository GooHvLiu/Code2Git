/* 
4. promise.then()返回的新promise的结果状态由什么决定的?

   (1) 简单表达: 由then()指定的回调函数执行结果决指定

   (2) 详细表达:

   ① 如果抛出异常,新promise变为rejected,reason为抛出的异常

   ② 如果返回的是非,promise的任意值, 新promise变为resolved,value为返回的值

   ③ 如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果

*/
//输出：
// onRejected1() 1
// undifined
new Promise((resolve, reject) => {
  resolve(1);
})
  .then(
    (value) => {
      //因为下面这样成功被执行，所以在第二个then中需要看的就是这面这行的返回值决定，但是这行的返回值是undefined
      console.log("onResolved1()", value);
      //如果增加return 2,则最终输出的数据就是：onRejected1() 1 和2
      // return 2;
      //如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果
      // return Promise.resolve(3);
      // return Promise.reject(4);

      //但是如果抛出异常,则就是失败，失败返回值为5
      throw 5;
    },
    (reason) => {
      console.log("onRejected1()", reason);
    },
  )
  .then(
    (value) => {
      console.log("onResolved2()", value);
    },
    (reason) => {
      console.log("onRejected2()", reason);
    },
  );
