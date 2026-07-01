<!-- 
* 第1步：介绍：目前采用http://www.animate.style的第三方库
* 第2步：安装：npm install animate.css --save
* 第3步：引入：在script标签下 引入，import 'animate.css';
* 第4步：
*   1）使用：在需要使用的标签上：<h1 class="animate__animated animate__bounce">An animated element</h1>
*   2）在vue2中：<transition-group name="animate__animated animate__bounce" :appear="true">
* 第5步：配置使用什么动画
*   1）在官网选择需要的进入动画（animate__swing），并通过enter-active-class="animate__swing"选定
*   2）在官网选择需要的离开动画（animate__backOutUp），并通过leave-active-class="animate__backOutUp"选定
-->
<template>
  <div>
    <button @click="isShow=!isShow">显示/隐藏</button>
    
    <transition-group 
    :appear="true"
    name="animate__animated animate__bounce" 
    enter-active-class="animate__swing"
    leave-active-class="animate__backOutUp"
    >
    <h1 v-show="isShow" key="1">我测试的多个动画效果-01</h1>
    <h1 v-show="isShow" key="2">我测试的多个动画效果-02</h1>
    </transition-group>
  </div>
</template>

<script>
  import 'animate.css'
  export default {
    name:'ThirdPartyAnimationLibrary',
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
</style>