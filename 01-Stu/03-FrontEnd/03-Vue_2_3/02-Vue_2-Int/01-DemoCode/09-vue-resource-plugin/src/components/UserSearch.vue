<template>
  <div class="container">
    <section class="jumbotron">
      <h3 class="jumbotron-heading">Search Github Users</h3>
      <div>
        <input type="text" placeholder="enter the name you search" v-model="info.keyWord"/>&nbsp;<button @click="getUsers">Search</button>
      </div>
    </section>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
  export default {
    name:'UserSearch',
    data() {
      return {
        info:{
          keyWord:''
        }
      }
    },
    methods: {
      getUsers(){
        //请求前更新List的数据
        pubsub.publish('updateData',{isFirst:false,isLoading:true,errMsg:'',users:[]})
        //使用vue-resource第三方库方式，使用方法，返回值等等都是一致的，只是将axios.get更改为this.$http.get
        this.$http.get(`https://api.github.com/search/users?q=${this.info.keyWord}`).then(
          response => {
            //此为消息发布与订阅方式处理
            pubsub.publish('updateData',{isLoading:false,errMsg:'',users:response.data.items})
          },
          error => {
            //此为消息发布与订阅方式处理
            pubsub.publish('updateData',{isLoading:false,errMsg:error.message,users:[]})
          }
        )
      }
    },
  }
</script>