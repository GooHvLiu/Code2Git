<template>
  <h1>下面是学生信息：</h1>
  <h2>姓名：{{ name }}</h2>
  <h2>年龄：{{ age }}</h2>
  <h3>工作岗位：{{ job.type }}</h3>
  <h3>工作薪资：{{ job.salary }}</h3>
  <button @click="changeInfo">数据响应</button>
</template>

<script>
import { ref } from "vue";
export default {
  name: "App",
  // 此处只是测试一些setup,暂时不考虑响应式的问题。
  setup() {
    // 数据
    let name = ref("张三");
    let age = ref(18);
    let job = ref({
      type: "前端工程师",
      salary: "30K"
    });

    // 响应数据的方法
    function changeInfo() {
      (name.value = "李四"),
        (age.value = 48),
        (job.value = {
          type: "UI工程师",
          salary: "60K"
        });
    }
    // 返回值，方式一：返回对象
    return {
      name,
      age,
      changeInfo,
      job
    };
  }
};
</script>
