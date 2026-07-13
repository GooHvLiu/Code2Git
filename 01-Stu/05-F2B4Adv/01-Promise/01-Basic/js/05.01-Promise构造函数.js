/**API方法
 * 主要讲解如下内容：
 * 1. Promise构造函数 : Promise (excutor) {}
        (1) executor函数 : 执行器 (resolve, reject) => {}
        (2) resolve函数 : 内部定义成功时我们调用的函数value => {}
        (3) reject函数 : 内部定义失败时我们调用的函数 reason => {}
        说明 : executor会在 Promise内部立即同步调用，异步操作在执行

    2. Promise.prototype.then方法 : (onResolved, onRejected) => {}
        (1) onResolved函数 : 成功的回调函数(value) => {}
        (2) onRejected函数 : 失败的回调函数(reason) => {}
        说明 : 指定用于得到成功value的成功回调和用于得到失败reason的失败回调返回一个新的 promise对象

    3. Promise.prototype.catch方法 : (onRejected) => {}
        (1) onRejected函数 : 失败的回调函数(reason) => {}
        说明 : then()的语法糖 的语法糖 的语法糖 , 相当于 相当于 : then(undefined, onRejected)

    4. Promise.resolve方法 : (value) => {}
        (1) value: 成功的数据或romise对象
        说明 : 返回一个成功/失败的 promise对象

    5. Promise.reject方法 : (reason) => {}
        reason: 失败的原因
        说明 : 返回一个失败的 返回一个失败的 返回一个失败的 返回一个失败的 promise对象

    6. Promise.all方法 : (promises) => {}
    promises: 包含 n个 promise的数组 的数组
    说明 : 返回一个新的promise，只有所有的 promise都成功才都成功，只要有一个失败了就直接失败

    7. Promise.race方法 : (promises) => {}
        promises: 包含 n个 promise的数组 的数组
        说明 : 返回一个新的promise, 第一个完成的promise的结果状态就是最终的结果状态
 */

new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve("成功的数据");
    reject("失败的数据");
  }, 1000);
})
  .then((value) => {
    console.log("onResolved()1", value);
  })
  .catch((reason) => {
    console.log("onRejected()1", reason);
  });

const p1 = new Promise((resolve, reject) => {
  resolve(1);
});
const p2 = Promise.resolve(2);

const p3 = Promise.reject(3);

p1.then((value) => {
  console.log(value);
});

p2.then((value) => {
  console.log(value);
});

p3.catch((reason) => {
  console.log(reason);
});

//因为p3失败，所以pAll1为失败
const pAll1 = Promise.all([p1, p2, p3]);

//因为p1/p2成功，所以pAll2为成功
const pAll2 = Promise.all([p1, p2]);

//All：数组内，全部pass即为pass，一个fail，即为fail
//结果：all onRejected()3 3
pAll1.then(
  (value) => {
    console.log("all onResolve())3", value);
  },
  (reason) => {
    console.log("all onRejected()3", reason);
  },
);

//All：数组内，全部pass即为pass，一个fail，即为fail
//结果：all onResolve())4 (2) [1, 2]
pAll2.then(
  (value) => {
    console.log("all onResolve())4", value);
  },
  (reason) => {
    console.log("all onRejected()4", reason);
  },
);

//race:数组内第一个完成的结果就是pRace1的结果
//结果，all onResolve())5 1
const pRace1 = Promise.race([p1, p2, p3]);
pRace1.then(
  (value) => {
    console.log("all onResolve())5", value);
  },
  (reason) => {
    console.log("all onRejected()5", reason);
  },
);

//race:数组内第一个完成的结果就是pRace1的结果
//结果，all onResolve())5 1
const pRace2 = Promise.race([p3, p2, p1]);
pRace2.then(
  (value) => {
    console.log("all onResolve())6", value);
  },
  (reason) => {
    console.log("all onRejected()6", reason);
  },
);
