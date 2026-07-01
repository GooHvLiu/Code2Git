/**
 * Project Name(js):04-promise优势及回调地狱展示.js
 * Project Type:伪代码
 */

//以下是伪代码，为了展示Promise的优势及回调函数地狱的含义
// 成功的回调函数
function successCallback(result) {
  console.log("声音文件创建成功: " + result);
}
// 失败的回调函数
function failureCallback(error) {
  console.log("声音文件创建失败: " + error);
}
/* 1.1 使用纯回调函数 */
createAudioFileAsync(audioSettings, successCallback, failureCallback);

/* 1.2. 使用Promise */
const promise = createAudioFileAsync(audioSettings);

setTimeout(() => {
  promise.then(successCallback, failureCallback);
}, 3000);
/* 2.1. 回调地狱 */
doSomething(function (result) {
  doSomethingElse(
    result,
    function (newResult) {
      doThirdThing(
        newResult,
        function (finalResult) {
          console.log("Got the final result: " + finalResult);
        },
        failureCallback,
      );
    },
    failureCallback,
  );
}, failureCallback);
/* 2.2. 使用promise的链式调用解决回调地狱 */
doSomething()
  .then(function (result) {
    return doSomethingElse(result);
  })
  .then(function (newResult) {
    return doThirdThing(newResult);
  })
  .then(function (finalResult) {
    console.log("Got the final result: " + finalResult);
  })
  .catch(failureCallback);
/* 2.3. async/await: 回调地狱的终极解决方案 */
async function request() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log("Got the final result: " + finalResult);
  } catch (error) {
    failureCallback(error);
  }
}
