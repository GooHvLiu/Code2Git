/* 
6. promise异常传透 ?

(1) 当使用promise的then链式调用时, 可以在最后指定失败的回调

(2) 前面任何操作出了异常，都会传到最后失败的回调中处理

7. 中断 promise链?

(1) 当使用promise的then链式调用时,在中间中断,不再调用后面的回调函数

(2) 办法 : 在回调函数中返一个pendding状态的promise

*/

//当then后没有写reason()=>{},相当于写了reason=>{throw reason}或者可以写为reason =>Promise.rejected(reason)
new Promise((resolve, reject) => {
  resolve(1);
  reject(1);
})
  .then((value) => {
    console.log("onResolved1()", value);
    return 2;
  })
  .then((value) => {
    console.log("onResolved2()", value);
    return 3;
  })
  .then((value) => {
    console.log("onResolved3()", value);
  })
  .catch((reason) => {
    console.log("onRejected()1", reason);

    //返回一个一直在pending的promise，导致后面的一直在等待结果，但是一直没有结果，所以，通过这种方式结束后面的链式反应
    return new Promise(() => {});
  })
  .then(
    (value) => {
      console.log("onResolved3()", value);
    },
    (reason) => {
      console.log("onRejected2()", reason); //catch成功了，所以调用此方法
    },
  );
