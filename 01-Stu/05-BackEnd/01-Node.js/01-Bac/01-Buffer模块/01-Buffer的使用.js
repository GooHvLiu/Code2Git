//使用Buffer.alloc创建
/* {
  //创建了一个长度为 10 字节的 Buffer，相当于申请了 10 字节的内存空间，每个字节的值为 0
  let buf_1 = Buffer.alloc(10);
  console.log(buf_1);// 结果为 <Buffer 00 00 00 00 00 00 00 00 00 00>
} */

//使用Buffer.allocUnsafe创建
/* {
  //创建了一个长度为 10 字节的 Buffer，buffer 中可能存在旧的数据, 可能会影响执行结果，所以叫unsafe
  let buf_2 = Buffer.allocUnsafe(10);
  console.log(buf_2);// 结果为 <Buffer 00 00 00 00 00 00 00 00 00 00>
} */

//使用Buffer.from创建
/* {
  //通过字符串创建 Buffer
  let buf_3 = Buffer.from('hello');
  //通过数组创建 Buffer
  let buf_4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
  console.log(buf_3, buf_4);// 结果为 <Buffer 68 65 6c 6c 6f> <Buffer 69 6c 6f 76 65 79 6f 75>
} */

//Buffer 与字符串的转化
/* {
  let buf_5 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
  console.log(buf_5.toString())//结果为iloveyou
} */

//Buffer读取
/* {
  //读取
  let buf_6 = Buffer.from('hello');
  console.log(buf_6[1]);//结果为101
  //修改
  buf_6[1] = 97;
  //查看字符串结果
  console.log(buf_6.toString());//结果为hallo
} */
