/* 
自定义Promi函数模块：class版本
  1) 创建class Promise
  2）将原型对象定义为then(...){}
  3) 将类内对象定义为static resolve = function (...){}
*/

(function (window) {
  //将常用的字符串定义为常量
  const PENDING = "pending";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";

  class Promise {
    /* 
    executor:执行器函数（）
    */
    constructor(executor) {
      //将当前promise对象保存起来
      const _this = this;
      //给Promie对象指定status属性，初始值为pending
      _this.status = PENDING;

      //给Promise对象指定一个用于存储结果数据的属性
      _this.data = undefined;

      //每个元素的结构:{onResolved(){},onRejected(){}}
      _this.callbacks = [];

      function resolve(value) {
        //如果当前状态不是pending，直接结束
        if (_this.status !== PENDING) {
          return;
        }
        // 1. 将状态修改为resolved
        _this.status = RESOLVED;
        // 2. 将数据保存到_this.data
        _this.data = value;
        //如果有待执行的callback函数，立即异步执行回调函数onResolved
        if (_this.callbacks.length > 0) {
          //采用定时器模拟队列执行方式
          setTimeout(() => {
            _this.callbacks.forEach((callbacksObj) => {
              callbacksObj.onResolved(value);
            });
          });
        }
      }
      function reject(reason) {
        //如果当前状态不是pending，直接结束
        if (_this.status !== PENDING) {
          return;
        }
        // 1. 将状态修改为rejected
        _this.status = REJECTED;
        // 2. 将数据保存到_this.data
        _this.data = value;
        //如果有待执行的callback函数，立即异步执行回调函数onrejected
        if (_this.callbacks.length > 0) {
          //采用定时器模拟队列执行方式
          setTimeout(() => {
            _this.callbacks.forEach((callbacksObj) => {
              callbacksObj.onRejected(reason);
            });
          });
        }
      }

      //执行器函数定义
      try {
        executor(resolve, reject);
      } catch (error) {
        //如果执行器抛出异常，将Promise的状态更改为rejected
        reject(error);
      }
    }

    /* 
  Promise原型对象的then()方法
  指定成功与失败的回调函数
  返回值为新的Promise对象
  */
    then(onResolved, onRejected) {
      const _this = this;
      // 如果onResolved/onRejected不是函数, 可给它指定一个默认的函数(实现错误/异常穿透的关键点)

      // 指定返回的promise为一个成功状态, 结果值为 value
      onResolved =
        typeof onResolved === "function" ? onResolved : (value) => value;

      // 指定返回的promise为一个失败状态, 结果值为reason
      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (reason) => {
              throw reason;
            };
      // 返回一个新的promise对象
      return new Promise((resolve, reject) => {
        /* 
        专门抽取的用来处理promise成功/失败结果的函数 
        callback: 成功/失败的回调函数 
        */
        function handle(callback) {
          // 1. 抛出异常 ===> 返回的promise变为rejected
          try {
            const x = callback(_this.data);
            // 2. 返回一个新的promise ===> 得到新的promise的结果值作为返回的promise的结果值
            if (x instanceof Promise) {
              x.then(resolve, reject); // 一旦x成功了, resolve(value), 一旦x失败了: reject(reason)
            } else {
              // 3. 返回一个一般值(undefined) ===> 将这个值作为返回的promise的成功值
              resolve(x);
            }
          } catch (error) {
            reject(error);
          }
        }
        // 当前promise已经成功了
        if (_this.status === RESOLVED) {
          setTimeout(() => {
            handle(onResolved);
          });
        }
        // 当前promise已经失败了
        else if (_this.status === REJECTED) {
          setTimeout(() => {
            handle(onRejected);
          });
          // 当前promise还未确定 pending,将onResolved和onRejected保存起来
        } else {
          _this.callbacks.push({
            onResolved(value) {
              handle(onResolved);
            },
            onRejected(reason) {
              handle(onRejected);
            },
          });
        }
      });
    }

    /* 
  Promise原型对象的catch()方法
  指定失败的回调函数
  返回值为一个新的Promise对象
  */
    catch(onRejected) {
      return this.then(null, onRejected);
    }

    /* 
  Promise函数对象方法：resolve
  返回一个指定结果的成功的Promise
  */
    static resolve = function (value) {
      return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      });
    };

    /* 
  Promise函数对象方法：reject
  返回一个指定reason失败的Promise
  */
    static reject = function (reason) {
      return new Promise((resolve, reject) => {
        reject(reason);
      });
    };

    /* 
  Promise函数对象方法：all
  返回一个Promise：只有当所有Promise都成功时，才成功；否则即失败
  */
    static all = function (promises) {
      // 返回一个新的promise
      return new Promise((resolve, reject) => {
        // 已成功的数量
        let resolvedCount = 0;
        // 待处理的promises数组的长度
        const promisesLength = promises.length;
        // 准备一个保存成功值的数组
        const values = new Array(promisesLength);
        // 遍历每个待处理的promise
        for (let i = 0; i < promisesLength; i++) {
          // promises中元素可能不是一个数组, 需要用resolve包装一下
          Promise.resolve(promises[i]).then(
            (value) => {
              // 成功当前promise成功的值到对应的下标
              values[i] = value;
              // 成功的数量加1
              resolvedCount++;
              // 一旦全部成功
              if (resolvedCount === promisesLength) {
                // 将所有成功值的数组作为返回promise对象的成功结果值
                resolve(values);
              }
            },
            (reason) => {
              // 一旦有一个promise产生了失败结果值, 将其作为返回promise对象的失败结果值
              reject(reason);
            },
          );
        }
      });
    };

    /* 
  Promise函数对象方法：race
  返回一个Promise：结果由第一个完成的Promise的结果决定
  */
    static race = function (promises) {
      // 返回新的promise对象
      return new Promise((resolve, reject) => {
        // 遍历所有promise
        for (var i = 0; i < promises.length; i++) {
          Promise.resolve(promises[i]).then(
            (value) => {
              // 只要有一个成功了, 返回的promise就成功了
              resolve(value);
            },
            (reason) => {
              // 只要有一个失败了, 返回的结果就失败了
              reject(reason);
            },
          );
        }
      });
    };

    /* 
  Promise函数对象新增方法：resolveDelay
  返回一个延迟指定时间才确定结果的promise对象
  */
    static resolveDelay = function (value, time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (value instanceof Promise) {
            // 如果value 是一个promise, 取这个promise 的结果值作为返回的promise 的结果值
            value.then(resolve, reject); // 如果value 成功, 调用resolve(val), 如果value 失败了, 调用reject(reason)
          } else {
            resolve(value);
          }
        }, time);
      });
    };

    /*
  Promise函数对象新增方法：rejectDelay
  返回一个延迟指定时间才失败的Promise 对象。
  */
    static rejectDelay = function (reason, time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(reason);
        }, time);
      });
    };
  }
})(window);

//向外暴露Promise函数
window.Promise = Promise;
