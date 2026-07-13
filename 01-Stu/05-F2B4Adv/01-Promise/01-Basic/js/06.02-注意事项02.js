/* 
3. 改变 promise状态和指定回调函数谁先后 ?

   (1) 都有可能, 正常情况下是先指定回调再改变状态, 但也可以先改状态再指定回调

   (2) 如何先改状态再指定回调?

   ① 在执行器中直接调用resolve()/reject()

   ② 延迟更长时间才调用then()

   (3) 什么时候才能得到数据?

   ① 如果先指定的回调,那当状态发生改变时,回调函数就会用, 得到数据

   ② 如果先改变的状态,那当指定回调时时,回调函数就会用,得到数据

*/
//先指定回调函数，保存当前指定的回调函数，后改变的状态（同时指定数据），异步执行回调函数
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
}).then(
  (value) => {},
  (reason) => {
    console.log("reason", reason);
  },
);

//a.先改变的状态（同时指定数据），后指定回调函数，异步执行回调函数
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
}).then(
  (value) => {},
  (reason) => {
    console.log("reason", reason);
  },
);

//b.将then做一个延时启动，这样就可以实现先改变的状态（同时指定数据），后指定回调函数，异步执行回调函数
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

setTimeout(() => {
  p4.then(
    (value) => {},
    (reason) => {
      console.log("reason", reason);
    },
  );
}, 1100);
