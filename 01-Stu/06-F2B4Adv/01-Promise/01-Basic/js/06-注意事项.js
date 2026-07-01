/* 
1. 如何改变 promise的状态 的状态 ?

   (1) resolve(value): 如果当前是pending就会变为 resolved

   (2) reject(reason): 如果当前是pending就会变为rejected

   (3) 抛出异常: 如果当前是pending就会变为rejected

2. 一个 promise指定多个成功/失败回调函数 , 都会调用吗 ?

   当 promise改变为对应状态时都会调用

3. 改变 promise状态和指定回调函数谁先后 ?

   (1) 都有可能, 正常情况下是先指定回调再改变状态, 但也可以先改状态再指定回调

   (2) 如何先改状态再指定回调?

   ① 在执行器中直接调用resolve()/reject()

   ② 延迟更长时间才调用then()

   (3) 什么时候才能得到数据?

   ① 如果先指定的回调,那当状态发生改变时,回调函数就会用, 得到数据

   ② 如果先改变的状态,那当指定回调时时,回调函数就会用,得到数据

4. promise.then()返回的新promise的结果状态由什么决定的?

   (1) 简单表达: 由then()指定的回调函数执行结果决指定

   (2) 详细表达:

   ① 如果抛出异常,新promise变为rejected,reason为抛出的异常

   ② 如果返回的是非,promise的任意值, 新promise变为resolved,value为返回的值

   ③ 如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果

5. promise如何串连多个操作任务 如何串连多个操作任务 ?

   (1) promise的 then()返回一个新的promise, 可以看成 then()的链式调用

   (2) 通过 then的链式调用串连多个同步的链式调用串连多个同步 /异步任务

6. promise异常传透 ?

(1) 当使用promise的then链式调用时, 可以在最后指定失败的回调

(2) 前面任何操作出了异常，都会传到最后失败的回调中处理

7. 中断 promise链?

(1) 当使用promise的then链式调用时,在中间中断,不再调用后面的回调函数

(2) 办法 : 在回调函数中返一个pendding状态的promise

*/

const p1 = new Promise((resolve, reject) => {
  //Promise变为resolved成功状态
  //   resolve(1);

  //Promise变为rejected成功状态
  reject(2);

  //抛出异常，Promise变为rejected失败状态，异常err信息就是抛出的error
  throw new Error("出错了");

  /* //以下也是对的，可以抛出任何
  throw 3; */
});

p1.then(
  (value) => {
    console.log("value", value);
  },
  (reason) => {
    console.log("reason", reason);
  },
);

p1.then(
  (value) => {
    console.log("value2", value);
  },
  (reason) => {
    console.log("reason2", reason);
  },
);
