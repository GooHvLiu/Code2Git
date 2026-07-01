<template>
  <li>
    <label>
      <input type="checkbox" :checked="todo.done" @change="handleCheck(todo.id)">
      <span>{{ todo.title }}</span>
    </label>
    <button class="btn btn-danger" @click="handleDelete(todo.id)">删除</button>
  </li>
</template>

<script>
  export default {
    name:'UserList',
    //声明接收todo对象
    props:['todo','checkTodo','deleteTodo'],
    methods: {
      //事实上，可以直接使用checkTodo方法，跳过handleCheck方法，此处为了思路清晰，罗列到一起了
      //取消勾选
      handleCheck(id){
        this.checkTodo(id)
      },
      // 点击删除
      handleDelete(id){
        if(confirm('确定要删除么？')){
          this.deleteTodo(id)
        }
      }
    },
  }
</script>

<style scoped>
  /*list css sets*/
  li {
    height: 36px;
    line-height: 36px;
    padding: 0 5px;
    border-bottom: 1px solid #ddd;
  }
  li label {
    float: left;
    cursor: pointer;
  }
  li label input {
    vertical-align: middle;
    margin-right: 6px;
    position: relative;
    top: -1px;
  }
  li button {
    float: right;
    display: none;
    margin-top: 3px;
  }
  li:before {
    content: initial;
  }
  li:last-child {
    border-bottom: none;
  }
  li:hover{
    background-color: gray;
  }

  li:hover button{
    display: block;
  }
</style>