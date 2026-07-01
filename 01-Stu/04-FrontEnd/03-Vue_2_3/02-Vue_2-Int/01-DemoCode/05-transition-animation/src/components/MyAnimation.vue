<template>
  <div>
    <button @click="isShow=!isShow">显示/隐藏</button>
    <!-- 
      1）transition 默认不加属性时，css名为.v-enter-active和.v-leave-active
      2) 增加name属性，即：<transition name="hello"></transition>
      那么，动画上的v...就要更改为.hello-enter-active和.hello-leave-active
      3) 增加:appear="true"或appear属性时，刷新页面时就出现动画
    -->
    <transition name="hello" :appear="true">
    <h1 v-show="isShow" >我测试的过度效果</h1>
    </transition>
  </div>
</template>

<script>
  export default {
    name:'MyAnimation',
    data() {
      return {
        isShow:true
      }
    },
  }
</script>

<style scoped>
  h1{
    background-color: orange;
  }
  .hello-enter-active{
    animation: myanimation 1s linear;
  }

  .hello-leave-active{
    animation: myanimation 1s linear reverse;
  }

  @keyframes myanimation {
    from{
      transform: translateX(-100%);
    }
    to{
      transform: translateX(0px);
    }
  }
</style>