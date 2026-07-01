<template>
  <div class="school">
    <h2>学校名称：{{name}}</h2>	
    <h2>学校地址：{{address}}</h2>	
    <button @click="showX">点我输出x</button>
  </div>
</template>

<script>

export default {
  name: 'School',
  data() {
      return {
        name: '尚硅谷',
        address: '北京'
      }
    },
    methods: {
      showX() {
        console.log(this.x)
      }
    },
}
</script>

<style>

.school{
  background-color: orange;
  padding: 5px;
}
</style>