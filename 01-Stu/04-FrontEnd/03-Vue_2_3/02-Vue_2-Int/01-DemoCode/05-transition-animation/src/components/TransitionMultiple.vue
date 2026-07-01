<template>
  <div>
    <button @click="isShow=!isShow">显示/隐藏</button>
    <!-- transition只能使用在单个元素动画上，如果多个元素需要使用动画，需要使用transition-group -->
    <transition-group name="hello" :appear="true">
    <h1 v-show="isShow" key="1">我测试的多个动画效果-01</h1>
    <h1 v-show="isShow" key="2">我测试的多个动画效果-02</h1>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name:'TransitionMultiple',
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