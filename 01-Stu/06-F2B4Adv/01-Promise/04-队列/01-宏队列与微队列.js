//基于下面的运行结果可以得到：微队列早于宏队列
{
  /*   setTimeout(() => {
    //会立即放入到宏队列
    console.log("timeout callback1()");
  }, 0);

  setTimeout(() => {
    //会立即放入到宏队列
    console.log("timeout callback2()");
  }, 0);

  //为了快速验证，使用的不是Promise实例对象，而是Promise函数
  Promise.resolve(1).then(
    //会立即放入到微队列
    (value) => {
      console.log("Promise onResoled1()", value);
    },
  );

  Promise.resolve(2).then(
    //会立即放入到微队列
    (value) => {
      console.log("Promise onResoled2()", value);
    },
  ); */
}

//若微队列和宏队列都在一起，那么优先宏队列
/* 
Promise onResoled1() 1
01-宏队列与微队列.js:59 Promise onResoled2() 2
01-宏队列与微队列.js:40 timeout callback1()
01-宏队列与微队列.js:37 timeout-Promise onResoled3() 3
01-宏队列与微队列.js:45 timeout callback2()
*/
{
  setTimeout(() => {
    //会立即放入到宏队列
    Promise.resolve(3).then(
      //会立即放入到微队列
      (value) => {
        console.log("timeout-Promise onResoled3()", value);
      },
    );
    console.log("timeout callback1()");
  }, 0);

  setTimeout(() => {
    //会立即放入到宏队列
    console.log("timeout callback2()");
  }, 0);

  //为了快速验证，使用的不是Promise实例对象，而是Promise函数
  Promise.resolve(1).then(
    //会立即放入到微队列
    (value) => {
      console.log("Promise onResoled1()", value);
    },
  );

  Promise.resolve(2).then(
    //会立即放入到微队列
    (value) => {
      console.log("Promise onResoled2()", value);
    },
  );
}
