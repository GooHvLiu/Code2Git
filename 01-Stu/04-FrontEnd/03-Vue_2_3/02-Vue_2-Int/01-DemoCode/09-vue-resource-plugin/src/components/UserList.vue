<template>
<div>
  <!-- 展示欢迎词 -->
  <h1 v-show="dataInfo.isFirst">Welcome Using</h1>

  <!-- 展示加载中 -->
  <h1 v-show="dataInfo.isLoading">Loading...</h1>

  <!-- 展示用户列表 -->
  <div v-for="user in dataInfo.users" :key="user.login">
    <a :href="user.html_url" target="_blank">
      <img :src="user.avatar_url" style='width: 100px'/>
    </a>
    <p >{{ user.login }}</p>
  </div>

  <!-- 展示错误信息 -->
  <h1 v-show="dataInfo.errMsg">{{dataInfo.errMsg}}</h1>
</div>
</template>

<script>
  import pubsub from 'pubsub-js'
  export default {
    name:'UserList',
    data() {
      return {
        dataInfo:{
          // 是否为初次使用
        isFirst:true,

        //是否为正在加载中
        isLoading:false,

        //错误信息的展示
        errMsg:'',

        //通过搜索框，服务器反馈的数据存放在数组中
        users:[],
        }
        
      }
    },
    mounted() {
      //此为消息订阅与发布方式处理npm
      this.pId=pubsub.subscribe('updateData',(FunName,dataObj)=>{
        console.log(dataObj);
        this.dataInfo={...this.dataInfo,...dataObj};
      })
  },
  }
</script>
