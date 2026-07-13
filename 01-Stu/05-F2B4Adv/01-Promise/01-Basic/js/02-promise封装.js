/**
 * Project Name(js):02-promise封装.js
 * Project Name(html):01-基本使用之准备.html
 */
//使用 promise封装基于定时器的异步
function doDelay(time) {
  // 1. 创建promise对象
  return new Promise((resolve, reject) => {
    // 2. 启动异步任务
    console.log("02启动异步任务");
    setTimeout(() => {
      console.log("02延迟任务开始执行...");
      // 假设: 时间为奇数代表成功, 为偶数代表失败
      const time = Date.now();
      if (time % 2 === 1) {
        // 成功了
        // 3. 1. 如果成功了, 调用resolve()并传入成功的value
        resolve("02成功的数据 " + time);
      } else {
        // 失败了
        // 3.2. 如果失败了, 调用reject()并传入失败的reason
        reject("02失败的数据 " + time);
      }
    }, time);
  });
}
const promise = doDelay(2000);
promise.then(
  (value) => {
    console.log("02成功的value: ", value);
  },
  (reason) => {
    console.log("02失败的reason: ", reason);
  },
);
