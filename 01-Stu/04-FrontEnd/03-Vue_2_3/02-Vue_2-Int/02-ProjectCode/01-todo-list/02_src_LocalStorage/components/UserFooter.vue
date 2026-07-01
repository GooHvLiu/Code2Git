<template>
  <!-- 页脚显示 -->
  <div class="todo-footer" v-show="todosTotal">
    <label>
      <input type="checkbox" name="" id="" :checked="isSelected" @change="modifySeclectedStutas">
    </label>
    <span>
      <span>已完成{{doneTotal}}</span> /全部{{todosTotal}}
    </span>
    <button class="btn btn-danger" @click="clearSelected">清除已完成任务</button>
  </div>
</template>

<script>

  export default {
    name:'UserFooter',
    props:['todos','updateTodo','clearSelectedTodos'],
    computed:{
      doneTotal(){
        let i=0
        this.todos.forEach((todo)=>{
          if(todo.done){
            i++
          }
        })
        return i
      },
      todosTotal(){
        return this.todos.length
      },
      isSelected(){
       return this.todosTotal===this.doneTotal && this.todosTotal>0
      }
    },
    methods:{
      modifySeclectedStutas(e){

        this.updateTodo(e.target.checked)
      },
      clearSelected(){
        this.clearSelectedTodos()
      }
    }
  }
</script>

<style  scoped>
  /*footer css sets*/
  .todo-footer {
    height: 40px;
    line-height: 40px;
    padding-left: 6px;
    margin-top: 5px;
  }
  .todo-footer label {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
  }
  .todo-footer label input {
    position: relative;
    top: -1px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .todo-footer button {
    float: right;
    margin-top: 5px;
  }
</style>