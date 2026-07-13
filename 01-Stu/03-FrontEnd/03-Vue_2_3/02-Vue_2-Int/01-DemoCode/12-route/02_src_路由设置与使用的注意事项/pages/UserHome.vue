<template>
  <div>
    <h2>我是Home的内容</h2>
  </div>
</template>

<script>
  export default {
    name:'UserHome',
    //测试路由页面在使用前后是否被销毁
    beforeDestroy() {
			console.log('About组件即将被销毁了')
		},
    //测试：
      // 1）路由页面在使用前后是否被销毁
      // 2）不同路由页面的route是否是一个，不是一个
      // 3）不同路由页面的router是否是一个，是一个
		mounted() {
			console.log('About组件挂载完毕了',this)
			window.aboutRoute = this.$route
			window.aboutRouter = this.$router
		}, 
  }
</script>