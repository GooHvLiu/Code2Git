<template>
  <div id="app">
    <UserSearch/>
    <UserList/>
  </div>
</template>

<script>
import UserList from "./components/UserList.vue";
import UserSearch from "./components/UserSearch.vue";
export default {
  name: 'App',
  components:{
    UserSearch,UserList
  },
  
}
</script>

<style>
 
</style>
