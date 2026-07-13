<template>
  <!-- 待办事项显示 -->
  <ul class="todo-list">
    <transition-group 
    name="animate__animated animate__bounce" 
    appear
    enter-active-class="animate__backInDown"
    leave-active-class="animate__backOutRight"
    >
      <UserItem 
        v-for="todoObj in todos" 
        :key="todoObj.id" 
        :todo="todoObj"
      />
    </transition-group>
  </ul>

</template>

<script>
// 通过引用第三方库的方式来实现动画效果
import 'animate.css';
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