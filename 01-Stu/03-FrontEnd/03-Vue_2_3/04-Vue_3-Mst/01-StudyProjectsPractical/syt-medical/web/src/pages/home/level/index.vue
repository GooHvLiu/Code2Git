<template>
  <div class="page-home-level">
    <h1 class="hospital">医院</h1>
    <div class="level">
      <h1>等级：</h1>
      <ul class="level-list">
        <li class="active">全部</li>
        <li>三级甲等</li>
        <li>三级乙等</li>
        <li>二级甲等</li>
        <li>二级乙等</li>
        <li>一级</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'

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
.page-home-level {
  color: #a9a9a9;
  font-weight: 900;
  .hospital {
    margin: 10px 0;
  }
  .level {
    display: flex;
    margin-top: 15px;
    h1 {
      width: 60px;
    }
    .level-list {
      display: flex;
      li {
        margin-right: 15px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
