<template>
  <div class="page-home-region">
    <div class="region">
      <h1>地区：</h1>
      <ul class="region-list">
        <li class="active">全部</li>
        <li>东城区</li>
        <li>西城区</li>
        <li>朝阳区</li>
        <li>丰台区</li>
        <li>石景山区</li>
        <li>海淀区</li>
        <li>门头沟区</li>
        <li>房山区</li>
        <li>通州区</li>
        <li>顺义区</li>
        <li>昌平区</li>
        <li>大兴区</li>
        <li>怀柔区</li>
        <li>平台区</li>
        <li>密云区</li>
        <li>延庆区</li>
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
.page-home-region {
  color: #a9a9a9;
  font-weight: 900;
  .region {
    display: flex;
    margin-top: 15px;
    h1 {
      margin-top: 10px;
      width: 69px;
    }
    .region-list {
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 15px;
        margin-top: 10px;
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
