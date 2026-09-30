<template>
  <div class="page-wrap">
    <div class="scan">
      <img v-if="qrDataUrl" :src="qrDataUrl" alt="扫码登录" style="width: 200px; height: 200px" />
      <p class="tip">{{ tipText }}</p>
    </div>
    <div class="input">
      <p>输入手机号码登录</p>
      <el-button type="info" :icon="EditPen" circle @click="handleChatClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "ScanDialog" });
// 引入路由
import { useRouter } from "vue-router";
const router = useRouter();
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入 Element-Plus 图标元素
import { EditPen } from "@element-plus/icons-vue";
// 引入 网络请求
import { reqWxQrcode, reqWxScanStatus } from "@/api/user";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref, onMounted, onUnmounted } from "vue";
// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 响应式数据
const qrDataUrl = ref("");
const tipText = ref("请用微信扫描二维码");
let pollTimer: ReturnType<typeof setInterval> | null = null;

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
// 用户点击微信扫码登录 按钮
const handleChatClick = () => {
  userStore_Login.userLoginMethods_Input = true;
};
// 获取二维码
async function getQrcode() {
  try {
    const res = await reqWxQrcode();
    if (res.code === 200) {
      qrDataUrl.value = res.data.qrDataUrl;
      startPolling(res.data.uuid);
    }
  } catch (e) {
    console.error("获取二维码失败", e);
  }
}

// 轮询扫码状态
function startPolling(uuid: string) {
  stopPolling();
  pollTimer = setInterval(async () => {
    try {
      const res = await reqWxScanStatus(uuid);
      if (res.data.status === "done" && res.data.user) {
        stopPolling();
        tipText.value = "扫码成功，正在跳转...";
        // 存用户信息到 Pinia + localStorage
        userStore_Login.setUserInfo({
          token: res.data.token!,
          name: res.data.user.nickname
        });
        // 登录成功后 显示几秒钟之后再退出
        setTimeout(() => {
          // 关闭登录弹窗
          userStore_Login.userLoginVisible = false;
          // 跳转主页
          router.push("/");
        }, 100);
      } else if (res.data.status === "expired") {
        stopPolling();
        tipText.value = "二维码已过期，请刷新";
      }
    } catch (e) {
      console.error("轮询失败", e);
    }
  }, 2500);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
onMounted(() => {
  getQrcode();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .scan {
    margin-top: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    P {
      margin-top: 10px;
    }
  }
  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin-top: 15px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
}
</style>
