/* 
1. 如何改变 promise的状态 的状态 ?

   (1) resolve(value): 如果当前是pending就会变为 resolved

   (2) reject(reason): 如果当前是pending就会变为rejected

   (3) 抛出异常: 如果当前是pending就会变为rejected

2. 一个 promise指定多个成功/失败回调函数 , 都会调用吗 ?

   当 promise改变为对应状态时都会调用

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
