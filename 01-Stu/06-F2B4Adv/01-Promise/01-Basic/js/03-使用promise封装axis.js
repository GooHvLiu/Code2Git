/**
 * Project Name(js):03-使用promise封装axis.js
 * Project Name(html):01-基本使用之准备.html
 */
//使用 promise封装 ajax异步请求
/* 可复用的发ajax请求的函数: xhr + promise */
function promiseAjax(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        const { status, response } = xhr;
        // 请求成功, 调用resolve(value)
        if (status >= 200 && status < 300) {
          resolve(JSON.parse(response));
        } else {
          // 请求失败, 调用reject(reason)
          reject(new Error("请求失败: status: " + status));
        }
      };
      xhr.open("GET", url);
      xhr.send();
    }, 5000);
  });
}
promiseAjax("https://api.apiopen.top2/getJoke?page=1&count=2&type=video").then(
  (value) => {
    console.log("显示成功数据", value);
  },
  (reason) => {
    alert(reason.message);
  },
);
