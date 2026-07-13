// 以上为async的验证与学习
{
  /*   //async的返回值是一个Promise对象
  //async函数返回的Promise的结果由函数执行的结果决定
  async function fn1() {
    //   return 1;
    //   throw 2;
    //   return Promise.reject(2);
    //   return Promise.resolve(2);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(4);
      }, 1000);
    });
  }

  const result = fn1();
  //return 1时，result的值是一个Promise对象
  console.log("直接打印result的值：", result);

  result.then(
    (value) => {
      console.log("onResolved()1", value);
    },
    (reason) => {
      console.log("onRejected()1", reason);
    },
  ); */
}

// 以下为await的验证与学习
{
  //测试Promise为成功时候的值：直接用await就可以得到
  function fn2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(5);
      }, 1000);
    });
  }

  //测试await右边不是Promise表达式的结果
  function fn4() {
    return 6;
  }

  //测试Promise为失败时候的值，需要使用try..catch...得到
  function fn5() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(6);
      }, 1000);
    });
  }

  //测试async 右边一个函数，但是返回值是1（但是加上async之后，返回Promise），await得到什么
  async function fn6() {
    return 7;
  }

  //如果使用await，该函数必须是异步的（async）
  async function fn3() {
    //若value得到的是Promise成功的值：await右侧表达式为Promise，得到的结果是该Promise成功的value
    {
      /* const value1 = await fn2();
      console.log("value=", value1); */
    }

    //若value得到的是Promise成功的值：await右侧表达式不是Promise，得到的结果就是该表达式本身的结果
    {
      /* const value2 = await fn4();
      console.log("value=", value2); */
    }

    //若value得到的是Promise失败的值：await不能得到失败的值，只能通过try...catch...获得
    {
      /* try {
        const value3 = await fn5();
        console.log("value=", value3);
      } catch (err) {
        console.log("失败的值为：", err);
      } */
    }

    //若value1得到的是Promise失败的值：await不能得到失败的值，只能通过try...catch...获得
    {
      try {
        //fn6 左边是async 但是函数实际返回1，这个时候value是Promise对象？还是1？是对象，因为fn6前面有async
        const value4 = await fn6();
        console.log("value=", value4);
      } catch (err) {
        console.log("失败的值为：", err);
      }
    }
  }

  fn3();
}
