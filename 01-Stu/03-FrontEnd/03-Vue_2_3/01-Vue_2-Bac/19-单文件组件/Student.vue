<template>
  <div class="student">
    <h2>学生姓名：{{name}}</h2>	
    <h2>学生年龄：{{age}}</h2>	
  </div>
</template>

<script>
export default{
  name: 'Student',
  data() {
      return {
        name: '尚硅谷',
        age: 18
      }
  }
}
</script>

<style>
</style>