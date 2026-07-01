/**
 * Project Name(js):01-基本编码流程.js
 * Project Name(html):01-基本使用之准备.html
 */
// 1) 创建promise对象(pending状态), 指定执行器函数
const p = new Promise((resolve, reject) => {
  // 2) 在执行器函数中启动异步任务
  setTimeout(() => {
    const time = Date.now();
    // 3) 根据结果做不同处理
    // 3.1) 如果成功了, 调用resolve(), 指定成功的value, 变为resolved状态
    if (time % 2 === 1) {
      resolve("成功的值 " + time);
    } else {
      // 3.2) 如果失败了, 调用reject(), 指定失败的reason, 变为rejected状态
      reject("失败的值" + time);
    }
  }, 2000);
});
// 4) 能promise指定成功或失败的回调函数来获取成功的vlaue或失败的reason
p.then(
  (value) => {
    // 成功的回调函数onResolved, 得到成功的vlaue
    console.log("成功的value: ", value);
  },
  (reason) => {
    // 失败的回调函数onRejected, 得到失败的reason
    console.log("失败的reason: ", reason);
  },
);
