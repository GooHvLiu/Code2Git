<template>
  <div>
    <h2>我是Home的内容</h2>
    <div>
      <ul class="nav nav-tabs">
        <li>
          <router-link class="list-group-item" active-class="active" to="/home/News">News</router-link>
        </li>
        <li>
          <router-link class="list-group-item" active-class="active" to="/home/Messages">Messages</router-link>
        </li>
      </ul>
      <div>
        <!-- 通过路由规则进行展示的页面 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:'UserHome'
  }
</script>