<template>
  <!-- 待办事项显示 -->
  <ul class="todo-list">
    <UserItem 
    v-for="todoObj in todos" 
    :key="todoObj.id" 
    :todo="todoObj"
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
    props:['todos']
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