<template>
  <!-- 待办事项显示，使用第三方库：animate.css -->
  <!-- <ul class="todo-list">
    <transition-group
      enter-active-class="animate__animated animate__headShake"
      leave-active-class="animate__animated animate__bounceOut"
    >
      <UserItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </transition-group>
  </ul> -->

  <!-- 待办事项显示，main.js引入第三方库：Velocity.js -->
  <!-- <ul class="todo-list">
    <transition-group
      :css="false"
      tag="ul"
      class="todo-list"
      @enter="enter"
      @leave="leave"
    >
      <UserItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </transition-group>
  </ul> -->

  <!-- 待办事项显示，引入 gsap 第三方依赖 -->
  <ul class="todo-list">
    <transition-group
      :css="false"
      tag="ul"
      class="todo-list"
      @enter="enter"
      @leave="leave"
    >
      <UserItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </transition-group>
  </ul>
</template>

<script>
// 1）引入animate.css第三方css库
import "animate.css";

// 3）引入gsap第三方依赖
import { gsap } from "gsap";

import UserItem from "./UserItem";
export default {
  name: "UserLists",
  components: {
    UserItem
  },
  methods: {
    // 以下配合Velocity.js第三方js库使用测试
    /**
     * 入场钩子：新增todo，DOM刚插入页面触发
     * @param {HTMLElement} el 当前新增的UserItem根DOM元素（li）
     * @param {Function} done 动画完成回调，必须调用，通知Vue动画结束
     */
    /* enter(el, done) {
      // this.$velocity(目标元素, 动画属性配置, 动画参数配置)
      this.$velocity(
        // 要执行动画的DOM节点（当前新增的li）
        el,
        // 结束透明度1，初始透明度0（从透明变为不透明），结束Y轴偏移0，初始向下偏移30px（从下方滑入），动画总时长 600ms，动画执行完毕自动调用done()，释放DOM渲染流程
        { opacity: [1, 0], translateY: [0, 30] },
        { duration: 600, complete: done }
      );
    }, */
    /**
     * 离场钩子：删除todo，DOM即将移除页面触发
     * @param {HTMLElement} el 当前待删除的li DOM
     * @param {Function} done 动画完成回调，执行完再删除DOM
     */
    /* leave(el, done) {
      this.$velocity(
        el,
        // 离场：从不透明变为透明，向上滑出，结束0透明，初始1不透明，结束上移30px，初始原位0
        { opacity: [0, 1], translateY: [-30, 0] },
        { duration: 600, complete: done }
      );
    } */
    //以下配合 gsap 第三方依赖使用测试
    enter(el, done) {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        onComplete: done
      });
    },
    leave(el, done) {
      gsap.to(el, {
        opacity: 0,
        y: -40,
        duration: 0.6,
        onComplete: done
      });
    }
  },
  props: ["todos"]
};
</script>

<style scoped>
/*Item css sets*/
.todo-list {
  margin-top: 10px;
  width: 580px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}
.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
