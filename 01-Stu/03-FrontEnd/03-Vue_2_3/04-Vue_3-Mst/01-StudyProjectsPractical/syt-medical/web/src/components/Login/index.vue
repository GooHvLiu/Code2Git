<template>
  <div class="page-wrap">
    <!-- 登录界面主窗口 -->
    <el-dialog
      v-model="userStore_Login.userLoginVisible"
      title="用户登录 - 尚医通"
      width="700"
      transition="dialog-slide"
    >
      <!-- 内容组件 -->
      <div class="content">
        <!-- 内容组件中 左侧部分 -->
        <div class="left">
          <!-- 左侧部分的 输入手机号登录 组件 -->
          <div v-show="userStore_Login.userLoginMethods_Input" class="input">
            <InputDialog />
          </div>
          <!-- 左侧部分的 扫码登录 组件 -->
          <div v-show="!userStore_Login.userLoginMethods_Input" class="scan">
            <ScanDialog />
          </div>
        </div>
        <!-- 内容组件中 右侧部分 -->
        <div class="right">
          <FollowApp />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="userStore_Login.userLoginVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Login" });
// 引入登录窗口小组件
import FollowApp from "./FollowApp/index.vue";
import InputDialog from "./InputDialog/index.vue";
import ScanDialog from "./ScanDialog/index.vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();

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
  .content {
    display: grid;
    grid-template-columns: 50% 50%;
    .left {
      border: 1px solid #f1f1f1;
    }
  }
}

// 弹窗出现动画
/* Slide Animation */
.dialog-slide-enter-active,
.dialog-slide-leave-active,
.dialog-slide-enter-active .el-dialog,
.dialog-slide-leave-active .el-dialog {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.dialog-slide-enter-from,
.dialog-slide-leave-to {
  opacity: 0;
}
.dialog-slide-enter-from .el-dialog,
.dialog-slide-leave-to .el-dialog {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
