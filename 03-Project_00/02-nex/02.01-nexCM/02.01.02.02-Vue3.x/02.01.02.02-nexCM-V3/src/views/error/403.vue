<template>
  <div class="page-error">
    <div class="content-box error-enter">
      <div class="decor-line-wrap">
        <div class="decor-line"></div>
        <div class="ball"></div>
      </div>
      <h1 class="code">403</h1>
      <h2 class="title">{{ t('layout.errorPage.forbidden') }}</h2>
      <p class="desc">{{ t('layout.errorPage.forbiddenDesc') }}</p>
      <div class="actions">
        <el-button size="large" @click="goBack">{{ t('layout.errorPage.back') }}</el-button>
        <el-button type="primary" size="large" @click="goHome">
          {{ t('layout.errorPage.backHome') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 403 页面
 * - 卡片式无权限提示 + 装饰动画；
 * - 提供“返回上一页 / 返回首页”两个出口，不做自动跳转。
 */
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'

defineOptions({ name: 'Forbidden' })

const { t } = useI18n()
const router = useRouter()

function goBack(): void {
  router.back()
}

function goHome(): void {
  router.replace(ROUTE_PATHS.ROOT)
}
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
        background: @warning-color;
        border-radius: 2px;
      }

      .ball {
        position: absolute;
        top: -12px;
        left: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: @warning-color;
        animation: ball-move 2.2s ease-in-out infinite alternate;
      }
    }

    .code {
      font-size: 96px;
      line-height: 1;
      color: @warning-color;
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
      margin: 0 0 @spacing-xl;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: @spacing-md;
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
