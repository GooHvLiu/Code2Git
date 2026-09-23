<template>
  <div class="right-adv">
    <div class="common-department">
      <div class="top">
        <div class="left">
          <el-icon><HomeFilled /></el-icon>
          <span>常见科室</span>
        </div>
        <div class="right">
          <span>全部</span>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>神经内容</li>
          <li>消化内科</li>
          <li>呼吸内科</li>
          <li>内科</li>
          <li>神经外科</li>
          <li>妇科</li>
          <li>产科</li>
          <li>儿科</li>
        </ul>
      </div>
    </div>
    <div class="web-notice">
      <div class="top">
        <div class="left">
          <el-icon><HelpFilled /></el-icon>
          <span>平台公告</span>
        </div>
        <div class="right">
          <span>全部</span>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>关于延长北京大学国际医院相关医疗知识储备的年限通知</li>
          <li>北京中医药大学东方医院部关于下发继续教育学习指标的通知</li>
          <li>武警总医院号源展厅更新通知的相关截止时间的通知</li>
        </ul>
      </div>
    </div>
    <div class="close-services-notice">
      <div class="top">
        <div class="left">
          <el-icon><Clock /></el-icon>
          <span>停诊公告</span>
        </div>
        <div class="right">
          <span>全部</span>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>中国人民解放军总医院第六住院部暂时关闭的原因及处理办法通知</li>
          <li>首都医科大学附属北京潞河池塘莲花区分院的主任工程师招聘事宜的通知</li>
          <li>中日友好医院中西医结合心理咨询及日方侵华罪名界定与赔款道歉的通知</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "QuickLink" });

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
.right-adv {
  margin-left: 10px;
  color: #a1a1a1;
  .common-department {
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
      .right:hover,
      .left:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .bottom {
      ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        li:hover {
          color: orange;
          cursor: pointer;
        }
      }
    }
  }
  .web-notice {
    margin-top: 25px;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
      .right:hover,
      .left:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .bottom {
      ul {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        li {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li:hover {
          color: orange;
          cursor: pointer;
        }
      }
    }
  }
  .close-services-notice {
    margin-top: 25px;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
      .right:hover,
      .left:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .bottom {
      ul {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        li {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li:hover {
          color: orange;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
