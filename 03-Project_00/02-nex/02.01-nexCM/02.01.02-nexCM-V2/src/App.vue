<!--
  App.vue - 根组件
  只负责渲染路由出口，整个应用的布局由路由组件决定
-->
<template>
  <div id="app">
    <!-- 路由出口：当前路由匹配到的组件会渲染在这里 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
