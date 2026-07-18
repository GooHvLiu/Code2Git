<template>
  <li>
    <label>
      <input
        type="checkbox"
        name=""
        id=""
        :checked="todo.done"
        @change="isChecked(todo.id)"
      />
      <span v-show="!todo.isEdit">{{ todo.title }}</span>
      <input
        v-show="todo.isEdit"
        ref="inputTitle"
        type="text"
        :value="todo.title"
        @blur="HandleBlur(todo, $event)"
      />
    </label>

    <button class="btn btn-danger" @click="deleteTodo(todo.id)">删除</button>
    <button
      v-show="!todo.isEdit"
      class="btn btn-danger btn-edit"
      @click="editTodo(todo)"
    >
      编辑
    </button>
  </li>
</template>

<script>
import pubsub from "pubsub-js";
export default {
  name: "UserItem",
  methods: {
    isChecked(todoId) {
      this.$bus.$emit("isCheckedOrNot", todoId);
    },
    //删除按钮
    deleteTodo(todoId) {
      if (confirm("确定要删除么？")) {
        //如下为使用全局事件总线实现的
        // this.$bus.$emit("isDeletedTodo", todoId);
        //如下为使用消息订阅与发布实现的,如下为发布
        pubsub.publish("isDeletedTodo", todoId);
      }
    },
    //编辑按钮
    editTodo(todo) {
      if (Object.hasOwn(todo, "isEdit")) {
        todo.isEdit = true;
      } else {
        this.$set(todo, "isEdit", true);
      }
      this.$nextTick(function () {
        this.$refs.inputTitle.focus();
      });
    },
    //失去焦点
    HandleBlur(todo, e) {
      todo.isEdit = false;
      if (!e.target.value.trim()) return alert("输入不能为空");
      //通过事件总线绑定自定义事件
      this.$bus.$emit("isUpdateTitle", todo.id, e.target.value);
    }
  },
  props: ["todo"]
};
</script>

<style scoped>
/*list css sets*/
ul li {
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}
ul li label {
  float: left;
  cursor: pointer;
}
ul li label input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}
ul li button {
  float: right;
  display: none;
  margin-top: 3px;
}
ul li:before {
  content: initial;
}
ul li:last-child {
  border-bottom: none;
}
li:hover {
  background-color: #eee;
}
li:hover button {
  display: block;
}
</style>
