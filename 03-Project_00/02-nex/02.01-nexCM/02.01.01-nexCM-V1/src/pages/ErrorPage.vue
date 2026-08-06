<template>
  <div class="page-404">
    <TransitionScale :duration="320" :scale="0.8" appear>
      <div class="content-box" v-if="show">
        <div class="decor-line-wrap">
          <div class="decor-line"></div>
          <div class="ball"></div>
        </div>
        <h1 class="code">404</h1>
        <h2 class="title">页面不存在</h2>
        <p class="tip">页面将在 {{ countDown }} 秒后自动返回首页{{ dotText }}</p>
        <el-button type="primary" size="medium" @click="goHome"> 立即前往首页 </el-button>
      </div>
    </TransitionScale>
  </div>
</template>

<script>
import { TransitionScale } from "@morev/vue-transitions";
export default {
  name: "ErrorPage",
  components: {
    TransitionScale
  },
  data() {
    return {
      show: true,
      countDown: 3,
      dotText: "",
      timerCount: null,
      timerDot: null
    };
  },
  mounted() {
    this.startCountDown();
    this.startDotAnimation();
  },
  beforeDestroy() {
    clearInterval(this.timerCount);
    clearInterval(this.timerDot);
  },
  methods: {
    startCountDown() {
      this.timerCount = setInterval(() => {
        this.countDown--;
        if (this.countDown <= 0) {
          clearInterval(this.timerCount);
          this.goHome();
        }
      }, 1000);
    },
    startDotAnimation() {
      const dotList = ["", ".", "..", "..."];
      let index = 0;
      this.timerDot = setInterval(() => {
        index = (index + 1) % dotList.length;
        this.dotText = dotList[index];
      }, 400);
    },
    goHome() {
      this.$router.replace("/");
    }
  }
};
</script>

<style scoped lang="less">
.page-404 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);

  .content-box {
    position: relative;
    width: 350px;
    text-align: center;
    padding: 60px 80px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(64, 158, 255, 0.08);

    .decor-line-wrap {
      position: relative;
      width: 80px;
      height: 4px;
      margin: 0 auto 24px;

      .decor-line {
        width: 100%;
        height: 4px;
        background: #409eff;
        border-radius: 2px;
      }

      .ball {
        position: absolute;
        top: -12px;
        left: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #409eff;
        animation: ballMove 2.2s ease-in-out infinite alternate;
      }
    }

    .code {
      font-size: 96px;
      color: #409eff;
      margin: 0 0 16px;
      font-weight: 700;
      letter-spacing: 4px;
    }

    .title {
      font-size: 22px;
      color: #303133;
      margin: 0 0 20px;
      font-weight: 500;
    }

    .tip {
      font-size: 16px;
      color: #606266;
      margin-bottom: 36px;
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
