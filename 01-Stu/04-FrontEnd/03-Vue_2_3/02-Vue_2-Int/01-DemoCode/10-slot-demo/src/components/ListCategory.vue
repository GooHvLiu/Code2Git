<template>
  <div class="container">
    <h3>游戏分类</h3>
    <ul>
      <!-- slot表示占位，等待父组件把标签体内容传递给我 -->
      <!-- 作用域插槽，可以通过 :games="games"，将数据传递给其他vue组件,接收端默认为对象，里面有对应传递过去的各类属性和函数 -->
      <slot :games="games" show="Hello,i am Andy">我是默认内容，当父组件没有传递任何内容时，我再显示</slot>
    </ul>
  </div>
</template>

<script>
  export default {
    name:'ListCategory',
    data() {
      return {
        games:['红色警戒','穿越火线','劲舞团','超级玛丽'],
      }
    }
  }
</script>

<style scoped>
.container{
  background-color: skyblue;
  width: 200px;
  height: 300px;
  text-align: center;
}

h3{
  background-color: orange;
}

ul{
  text-align: left;
  list-style: none;
}


</style>