<template>
  <li>
    <!-- 单个待办事项添加动画 -->
    <transition name="todo" appear>
    <!-- ref 是一个特殊属性，用于获取DOM元素或组件实例的引用 -->
    <label>
      <input type="checkbox" :checked="todo.done" @change="handleCheck(todo.id)">
      <span v-show="!todo.isEdit">{{ todo.title }}</span>
      <input 
      v-show="todo.isEdit"
      type="text" 
      :value="todo.title"
      @blur="handleBlur(todo,$event)"  
      ref="inputTitle"
      >
    </label>
    </transition>
    <button class="btn btn-danger" @click="handleDelete(todo.id)">删除</button>
    <button v-show="!todo.isEdit" class="btn btn-edit" @click="handleEdit(todo)">编辑</button>
  </li>
</template>

<script>
// 引入消息发布与订阅js模块
import pubsub from 'pubsub-js'

export default {
  name:'UserList',
  //声明接收todo对象
  props:['todo'],
  methods: {
    /* //事实上，可以直接使用checkTodo方法，跳过handleCheck方法，此处为了思路清晰，罗列到一起了
    //取消勾选
    handleCheck(id){
      this.checkTodo(id)
    }, */

    //通过总线通讯实现，勾选实现模块
    handleCheck(id){
      this.$bus.$emit('checkTodo',id)
    },

    /* // 点击删除
    handleDelete(id){
      if(confirm('确定要删除么？')){
        this.deleteTodo(id)
      }
    } */

      //通过总线通讯实现-删除元素
    handleDelete(id){
      if(confirm('确定要删除么？')){
        // this.$bus.$emit('deleteTodo',id)
        pubsub.publish('deleteTodo',id)
      }
    },
      //通过总线通讯实现-元素编辑
    handleEdit(todo){
      //ESLint的no-prototype-builtins规则禁止直接从目标对象访问Object.prototype,所以，只能是用这种方法
      if(Object.prototype.hasOwnProperty.call(todo,'isEdit')){
        todo.isEdit=true
      }
      else{
        this.$set(todo,'isEdit',true)
      }

      // 使用nextTick，其功能是在等待dom结束之后再执行
      this.$nextTick(function(){
        this.$refs.inputTitle.focus()
      })
    },
    //元素失去焦点就执行编辑功功能
    handleBlur(todo,e){
      todo.isEdit=false
      this.$bus.$emit('editTodo',todo.id,e.target.value)
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

    .todo-enter-active{
    animation: myanimation 1s linear;
  }

  .todo-leave-active{
    animation: myanimation 1s linear reverse;
  }

  @keyframes myanimation {
    from{
      transform: translateX(1000%);
    }
    to{
      transform: translateX(0px);
    }
  }
</style>