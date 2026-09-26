<template>
  <div class="page-wrap">
    <div class="content">
      <div class="top">
        <div class="left">
          <img src="../../../assets/login/followPic.png" alt="微信扫一扫关注" />
          <div class="tips">
            <el-icon><ChatDotRound /></el-icon>
            <P>微信扫一扫关注</P>
            <P>“快速预约挂号”</P>
          </div>
        </div>
        <div class="right">
          <img src="../../../assets/login/appDown.png" alt="扫一扫下载" />
          <div class="tips">
            <el-icon><Iphone /></el-icon>
            <P>扫一扫下载</P>
            <P>“预约挂号”APP</P>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p>尚医通 官方指定平台</p>
        <p>快速挂号 安全放心</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "FollowApp" });

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: #717171;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .top {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 30px;
      .left,
      .left > .tips,
      .right,
      .right > .tips {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
    }
    .bottom {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        font-size: 1.5rem;
        margin: 10px 0;
      }
    }
  }
}
</style>
