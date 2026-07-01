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
    <h1 v-show="isShow" >我测试的单个动画效果</h1>
    </transition>
  </div>
</template>

<script>
  export default {
    name:'TransitionSingle',
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
    /* 过度的时间和参数可以在此设置，也可以单独在hello-enter-active和hello-leave-active设置 */
    /* transition: 1s linear; */
  }
/*   分开写的方式：元素进入的起点 */
  /* .hello-enter{
    transform: translateX(-100%);
  } */
  /* 分开写的方式：元素进入的终点 */
  /* .hello-enter-to{
    transform: translateX(0);
  } */

  /* 分开写的方式：元素离开的起点 */
  /* .hello-leave{
    transform: translateX(0);
  } */
  /* 分开写的方式：元素离开的终点 */
 /*  .hello-leave-to{
    transform: translateX(-100%);
  } */

  /* 合并写的方式：元素进入的起点/元素离开的终点 */
  .hello-enter,.hello-leave-to{
    transform: translateX(-100%);
  }

  /* 合并写的方式：元素进入的终点x/元素离开的终点 */
  .hello-enter-to,.hello-leave{
    transform: translateX(0);
  }

  /* 参数可以在此设置 */
  .hello-enter-active,.hello-leave-active{
    transition: 1s linear;
  }

</style>