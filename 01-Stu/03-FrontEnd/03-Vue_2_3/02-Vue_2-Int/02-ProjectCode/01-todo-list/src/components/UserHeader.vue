<template>
  <!-- 头部显示 -->
  <div class="todo-header">
    <input
      type="text"
      placeholder="请输入您的任务名称，按回车确认"
      v-model="title"
      @keyup.enter="add"
    />
  </div>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  name: "UserHeader",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    //当用户点击enter键之后，进入此方式的执行
    add() {
      if (!this.title.trim()) return;
      //创建数据对象todoObj
      const todoObj = { id: nanoid(), title: this.title, done: false };
      //使用父组件传递过来的方法实现数据的子传父功能
      // this.isAddTodo(todoObj);
      //使用自定义事件触发子传父功能
      this.$emit("isAddTodo", todoObj);
      //清空显示框数据
      this.title = "";
    }
  },
  //在组件销毁前，注销自定义事件
  beforeDestroy() {
    this.$off();
  }
  // props: ["isAddTodo"]
};
</script>

<style scoped>
/* header css sets */
.todo-header input {
  width: 580px;
  height: 28px;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}
.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(82, 168, 236, 0.6);
}
</style>
