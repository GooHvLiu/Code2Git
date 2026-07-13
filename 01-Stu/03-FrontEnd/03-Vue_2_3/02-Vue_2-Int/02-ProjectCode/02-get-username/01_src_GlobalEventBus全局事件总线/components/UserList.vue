<template>
<div class="row">
  <!-- 展示欢迎词 -->
  <h1 v-show="dataInfo.isFirst">Welcome Using</h1>

  <!-- 展示加载中 -->
  <h1 style="margin-left: 10px;" v-show="dataInfo.isLoading">Loading...</h1>

  <!-- 展示用户列表 -->
  <div class="card" v-for="user in dataInfo.users" :key="user.login">
    <a :href="user.html_url" target="_blank">
      <img :src="user.avatar_url" style='width: 100px'/>
    </a>
    <p class="card-text">{{ user.login }}</p>
  </div>

  <!-- 展示错误信息 -->
  <h1 v-show="dataInfo.errMsg">{{dataInfo.errMsg}}</h1>
</div>
</template>

<script>
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
      //users.items为实际的服务器提供数据对应的数组
    this.$bus.$on('updateData',(dataObj)=>{
      //{...this.dataInfo,...dataObj}表示this.dataInfo中与dataObj一样的字段进行更换，其他的不需要更换
      this.dataInfo={...this.dataInfo,...dataObj};
      // console.log('使用全局事件总线',this.users);
      
    })
  },
  }
</script>

<style scoped>
.row{
  margin-left: 30px;
  width: 90%;
}

.album {
  min-height: 50rem; /* Can be removed; just added for demo purposes */
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: #f7f7f7;
}

.card {
  float: left;
  width: 33.333%;
  padding: .75rem;
  margin-bottom: 2rem;
  border: 1px solid #efefef;
  text-align: center;
}

.card > img {
  margin-bottom: .75rem;
  border-radius: 100px;
}

.card-text {
  font-size: 85%;
}
</style>