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
      <span>{{ todo.title }}</span>
    </label>
    <button class="btn btn-danger" @click="deleteTodo(todo.id)">删除</button>
  </li>
</template>

<script>
export default {
  name: "UserItem",
  methods: {
    isChecked(todoId) {
      this.isCheckedOrNot(todoId);
    },
    deleteTodo(todoId) {
      if (confirm("确定要删除么？")) {
        this.isDeletedTodo(todoId);
      }
    }
  },
  props: ["todo", "isCheckedOrNot", "isDeletedTodo"]
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
