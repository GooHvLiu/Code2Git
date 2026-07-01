<template>
  <!-- 待办事项显示 -->
  <ul class="todo-list">
    <UserItem 
    v-for="todoObj in todos" 
    :key="todoObj.id" 
    :todo="todoObj"
    :checkTodo="checkTodo"
    :deleteTodo="deleteTodo"
  />
  </ul>
</template>

<script>
import UserItem  from './UserItem.vue';
  export default {
    name:'UserList',
    components:{
      UserItem
    },
    props:['todos','checkTodo','deleteTodo']
  }
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