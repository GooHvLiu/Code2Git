<template>
    <!-- 头部显示 -->
    <div class="todo-header">
      <input type="text" placeholder="请输入您的任务名称，按回车确认" v-model="title" @keyup.enter="add">
    </div>
</template>

<script>
  import {nanoid} from 'nanoid'
  export default {
   name:'UserHeader' ,
   data() {
    return {
      title:''
    }
   },
   props:['addTodo'],
   methods: {
   add(){
    // 校验输入数据不能为空
    if(!this.title.trim()) return alert('输入不能为空')
    //将用户的输入包装成一个todo对象
    const todoObj={id:nanoid(),title:this.title,done:false}
    //通知app组件去添加一个todo对象
    this.addTodo(todoObj)
    //清空
    this.title=''
    
   } 
  }
  }
</script>

<style scoped>
  /* header css sets */
  .todo-header input {
    width: 580px;
    height: 28px;
    font-size: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 7px;
  }
  .todo-header input:focus {
    outline: none;
    border-color: rgba(82, 168, 236, 0.8);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
  }
</style> 