<template>
  <div id="page-root">
    <div class="todo-page">
      <div class="todo-container">
        <!-- <UserHeader :addTodo="addTodo"/> -->
        <!-- 如下为使用自定义事件实现的功能，可以使用@或者v-on: -->
        <UserHeader @addTodo="addTodo"/>

        <UserList :todos="todos"/>

        <!-- <UserFooter :todos="todos" :updateTodo="updateTodo" :clearSelectedTodos="clearSelectedTodos"/> -->
         <!-- 如下为使用自定义事件实现的功能，可以使用@或者v-on: -->
        <UserFooter :todos="todos" v-on:updateTodo="updateTodo" v-on:clearSelectedTodos="clearSelectedTodos"/>
      </div>
    </div>
  </div>
</template>

<script>
// 引入消息发布与订阅js模块
import pubsub from 'pubsub-js'

import UserHeader from './components/UserHeader'
import UserList from './components/UserList'
import UserFooter from './components/UserFooter'

export default {
  name: 'page-root',
  components: {
    UserHeader,UserList,UserFooter
  },
  data() {
    return {
      //将程序中存储更改为从浏览器本地获取
      todos:JSON.parse(localStorage.getItem('todos')) ||[],
      tempAr:[]
    }
  },
  methods: {
    //添加todo事项,也可以理解为自定义事件
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
    // 删除todo事项,_表示占位符，因为使用了消息发布与订阅方式，所以，第一个参数是PubName，第二个才是我们想要的id号
    deleteTodo(_,id){
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
  //将程序中存储更改为从浏览器本地获取
  /* // 下面为浅层监视
  watch: {
    todos(value){
      localStorage.setItem('todos',JSON.stringify(value))
    }
  }, */
   // 下面为深层监视
  watch: {
    todos:{
      deep:true,
      handler(value){
        localStorage.setItem('todos',JSON.stringify(value))
      }
    }
  },

  //通过总线bus创建获取数据后的自定义事件
  mounted() {
    this.$bus.$on('checkTodo',this.checkTodo)
    // this.$bus.$on('deleteTodo',this.deleteTodo)

    // 使用消息订阅与发布方法实现
    this.pubId=pubsub.subscribe('deleteTodo',this.deleteTodo)
  },

  //在销毁前进行删除自定义事件
  beforeDestroy() {
    this.$bus.$off('checkTodo')
    // this.$bus.$off('deleteTodo')
    pubsub.unsubscribe(this.pubId)
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
