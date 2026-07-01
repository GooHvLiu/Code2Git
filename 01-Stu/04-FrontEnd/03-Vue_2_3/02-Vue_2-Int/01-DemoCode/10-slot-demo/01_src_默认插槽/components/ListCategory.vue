<template>
  <div class="container">
    <h3>{{titles}}分类</h3>
    <ul>
      <!-- slot表示占位，等待父组件把标签体内容传递给我 -->
      <slot>我是默认内容，当父组件没有传递任何内容时，我再显示</slot>
    </ul>
  </div>
</template>

<script>
  export default {
    name:'ListCategory',
    props:['titles','items']
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