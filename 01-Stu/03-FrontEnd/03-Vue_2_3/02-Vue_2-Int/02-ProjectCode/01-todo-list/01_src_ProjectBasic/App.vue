<template>
  <div id="page-root">
    <div class="todo-page">
      <div class="todo-container">
        <UserHeader :addTodo="addTodo"/>
        <UserList :todos="todos" :checkTodo="checkTodo" :deleteTodo="deleteTodo"/>
        <UserFooter :todos="todos" :updateTodo="updateTodo" :clearSelectedTodos="clearSelectedTodos"/>
      </div>
    </div>
  </div>
</template>

<script>
import UserHeader from './components/UserHeader.vue'
import UserList from './components/UserList.vue'
import UserFooter from './components/UserFooter.vue'

export default {
  name: 'page-root',
  components: {
    UserHeader,UserList,UserFooter
  },
  data() {
    return {
      todos:[
        {id:'001',title:'抽烟',done:true},
        {id:'002',title:'喝酒',done:false},
        {id:'003',title:'烫头',done:true}
      ],
      tempAr:[]
    }
  },
  methods: {
    //添加todo事项
    addTodo(todoObj){
      this.todos.unshift(todoObj)
    },
    // 勾选todo事项
    checkTodo(id){
      this.todos.forEach(todo => {
       if(todo.id==id){
        todo.done=!todo.done
       }
      });
    },
    // 删除todo事项
    deleteTodo(id){
      this.todos=this.todos.filter((todo)=>{
        return todo.id!==id
      })
    },
    //修改todo事项状态
    updateTodo(isSelected){
        this.todos.forEach((todo)=>{
          todo.done=isSelected
        })
    },
    //清除被选中项
    clearSelectedTodos(){
      //当没有需要被删除的内容是，提示
      this.tempArr=this.todos.filter((todo)=>{
        return !todo.done
      })
      if(this.tempArr.length===this.todos.length){
        alert('没有需要删除的内容')
      }else{
        if(confirm('确定要删除么？')){
          this.todos=this.tempArr
      }
      }
      
    }
  },
}
</script>

<style>
  /* base css sets */
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    background: #fff;
    font-size: 14px;
  }
  ul {
    list-style: none;
  }
  .btn {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    margin-bottom: 0;
    line-height: 20px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  .btn:focus {
    outline: none;
  }
  .btn-danger {
    color: #fff;
    background-color: #da4f49;
    border: 1px solid #bd362f;
  }
  .btn-danger:hover {
    color: #fff;
    background-color: #bd362f;
  }
  .todo-page {
    width: 600px;
    margin: 0 auto;
  }
  .todo-page .todo-container {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
</style>
