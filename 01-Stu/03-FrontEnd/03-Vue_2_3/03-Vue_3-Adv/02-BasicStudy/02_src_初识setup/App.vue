<template>
  <h1>下面是学生信息：</h1>
  <h2>姓名：{{ name }}</h2>
  <h2>年龄：{{ age }}</h2>
  <button @click="sayHello">说话</button>
</template>

<script>
// setup 返回值内返回渲染函数时使用
import { h } from "vue";
export default {
  name: "App",
  // 此处只是测试一些setup,暂时不考虑响应式的问题。
  setup() {
    // 数据
    let name = "张三";
    let age = 18;

    // 方法
    function sayHello() {
      alert(`我叫${name},我今年${age}岁，你好啊！`);
    }

    // 返回值，方式一：返回对象
    return {
      name,
      age,
      sayHello
    };

    /* // 返回值，方式二：返回渲染函数
    return () => h("h1", "我是 setup 返回的渲染函数"); */
  }
};
</script>
