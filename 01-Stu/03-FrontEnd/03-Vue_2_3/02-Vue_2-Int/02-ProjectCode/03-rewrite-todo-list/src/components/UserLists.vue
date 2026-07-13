<template>
  <!-- 待办事项显示 -->
  <ul class="todo-list">
    <UserItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :isCheckedOrNot="isCheckedOrNot"
      :isDeletedTodo="isDeletedTodo"
    />
  </ul>
</template>

<script>
import UserItem from "./UserItem";
export default {
  name: "UserLists",
  components: {
    UserItem
  },
  props: ["todos", "isCheckedOrNot", "isDeletedTodo"]
};
</script>

<style scoped>
/*Item css sets*/
.todo-list {
  margin-top: 10px;
  width: 580px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}
.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
