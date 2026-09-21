<template>
  <div class="page-error">
    <div v-if="show" class="content-box error-enter">
      <div class="decor-line-wrap">
        <div class="decor-line"></div>
        <div class="ball"></div>
      </div>
      <h1 class="code">404</h1>
      <h2 class="title">{{ t('layout.errorPage.notFound') }}</h2>
      <p class="desc">{{ t('layout.errorPage.notFoundDesc') }}</p>
      <p class="tip">{{ t('layout.errorPage.autoBackCountdown', { count: countDown }) }}{{ dotText }}</p>
      <el-button type="primary" size="large" @click="goHome">
        {{ t('layout.errorPage.backHome') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 404 页面
 * - 卡片式错误提示 + 装饰动画；
 * - 3 秒倒计时后自动返回首页，也可点击按钮立即返回。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'

defineOptions({ name: 'NotFound' })

const { t } = useI18n()
const router = useRouter()

const show = ref(true)
const countDown = ref(3)
const dotText = ref('')
let timerCount: ReturnType<typeof setInterval> | null = null
let timerDot: ReturnType<typeof setInterval> | null = null

function clearTimers(): void {
  if (timerCount) {
    clearInterval(timerCount)
    timerCount = null
  }
  if (timerDot) {
    clearInterval(timerDot)
    timerDot = null
  }
}

function goHome(): void {
  clearTimers()
  router.replace(ROUTE_PATHS.ROOT)
}

function startCountDown(): void {
  timerCount = setInterval(() => {
    countDown.value -= 1
    if (countDown.value <= 0) {
      clearTimers()
      goHome()
    }
  }, 1000)
}

function startDotAnimation(): void {
  const dotList = ['', '.', '..', '...']
  let index = 0
  timerDot = setInterval(() => {
    index = (index + 1) % dotList.length
    dotText.value = dotList[index]
  }, 400)
}

onMounted(() => {
  startCountDown()
  startDotAnimation()
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<style scoped lang="less">
.page-error {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @bg-gray 0%, @bg-page 100%);

  .content-box {
    position: relative;
    width: 360px;
    text-align: center;
    padding: @spacing-xxl @spacing-xxl;
    background: @bg-white;
    border-radius: @border-radius-lg;
    box-shadow: @shadow-lg;

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
        animation: ball-move 2.2s ease-in-out infinite alternate;
      }
    }

    .code {
      font-size: 96px;
      line-height: 1;
      color: @primary-color;
      margin: 0 0 @spacing-md;
      font-weight: 700;
      letter-spacing: 4px;
    }

    .title {
      font-size: @font-size-lg;
      color: @text-primary;
      margin: 0 0 @spacing-md;
      font-weight: 500;
    }

    .desc {
      font-size: @font-size-base;
      color: @text-regular;
      margin: 0 0 @spacing-sm;
    }

    .tip {
      font-size: @font-size-sm;
      color: @text-secondary;
      margin: 0 0 @spacing-xl;
      min-height: 20px;
    }
  }
}

.error-enter {
  animation: error-zoom-in 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes error-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes ball-move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(68px);
  }
}
</style>
