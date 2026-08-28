<template>
  <div class="page-404">
    <TransitionScale :duration="320" :scale="0.8" appear>
      <div class="content-box" v-if="show">
        <div class="decor-line-wrap">
          <div class="decor-line"></div>
          <div class="ball"></div>
        </div>
        <h1 class="code">404</h1>
        <h2 class="title">{{ $t("errorPage.notFound") }}</h2>
        <p class="tip">
          {{ $t("errorPage.countdown", { count: countDown }) }}{{ dotText }}
        </p>
        <el-button type="primary" size="medium" @click="goHome">{{
          $t("errorPage.backHome")
        }}</el-button>
      </div>
    </TransitionScale>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { TransitionScale } from "@morev/vue-transitions";
import { ROUTE_PATHS } from "@/router/constant/pathConstants";
import router from '@/router'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

// ===== 响应式数据 =====
const show = ref(true)
const countDown = ref(3)
const dotText = ref('')
let timerCount = null
let timerDot = null

// ===== 方法 =====
function startCountDown() {
  timerCount = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(timerCount)
      goHome()
    }
  }, 1000)
}

function startDotAnimation() {
  const dotList = ["", ".", "..", "..."]
  let index = 0
  timerDot = setInterval(() => {
    index = (index + 1) % dotList.length
    dotText.value = dotList[index]
  }, 400)
}

function goHome() {
  router.replace(ROUTE_PATHS.ROOT)
}

// ===== 生命周期 =====
onMounted(() => {
  startCountDown()
  startDotAnimation()
})

onBeforeUnmount(() => {
  clearInterval(timerCount)
  clearInterval(timerDot)
})
</script>

<style scoped lang="less">
.page-404 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @bg-gray 0%, @bg-page 100%);

  .content-box {
    position: relative;
    width: 350px;
    text-align: center;
    padding: @spacing-xxl @spacing-xxl;
    background: @bg-white;
    border-radius: @border-radius-lg;
    box-shadow: 0 8px 30px fade(@primary-color, 8%);

    .decor-line-wrap {
      position: relative;
      width: 80px;
      height: 4px;
      margin: 0 auto @spacing-lg;

      .decor-line {
        width: 100%;
        height: 4px;
        background: @primary-color;
        border-radius: 2px;
      }

      .ball {
        position: absolute;
        top: -12px;
        left: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: @primary-color;
        animation: ballMove 2.2s ease-in-out infinite alternate;
      }
    }

    .code {
      font-size: 96px;
      color: @primary-color;
      margin: 0 0 @spacing-md;
      font-weight: 700;
      letter-spacing: 4px;
    }

    .title {
      font-size: @font-size-lg;
      color: @text-primary;
      margin: 0 0 @spacing-lg;
      font-weight: 500;
    }

    .tip {
      font-size: @font-size-md;
      color: @text-regular;
      margin-bottom: @spacing-xxl;
    }
  }
}

// 小球来回往返动画
@keyframes ballMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(68px);
  }
}
</style>
