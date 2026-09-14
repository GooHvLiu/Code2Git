<template>
  <h1>下面是学生信息：</h1>
  <h2>姓名：{{ person.name }}</h2>
  <h2>年龄：{{ person.age }}</h2>
  <h3>工作岗位：{{ person.job.type }}</h3>
  <h3>工作薪资：{{ person.job.salary }}</h3>
  <h3>个人爱好：{{ person.hobby }}</h3>
  <button @click="changeInfo">数据响应</button>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "App",
  // 此处只是测试一些setup,暂时不考虑响应式的问题。
  setup() {
    // 数据
    let person = reactive({
      name: "张三",
      age: 18,
      job: {
        type: "前端工程师",
        salary: "30K"
      },
      hobby: ["抽烟", "喝酒", "烫头"]
    });
    // 响应数据的方法
    function changeInfo() {
      person.name = "李四";
      person.age = 48;
      person.job.type = "UI工程师";
      person.job.salary = "60K";
      person.hobby[0] = "学习";
      person.hobby[1] = "看书";
      person.hobby[2] = "跑步";
    }
    // 返回值，方式一：返回对象
    return {
      person,
      changeInfo
    };
  }
};
</script>
