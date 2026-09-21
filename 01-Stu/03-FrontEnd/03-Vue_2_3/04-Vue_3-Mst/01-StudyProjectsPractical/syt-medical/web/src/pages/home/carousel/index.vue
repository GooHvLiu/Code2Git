<template>
  <div class="page-home-carousel">
    <el-carousel>
      <el-carousel-item v-for="item in 4" :key="item">
        <img src="../../../assets/images/web-banner-1.png" alt="" />
      </el-carousel-item>
    </el-carousel>
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
.page-home-carousel {
  img {
    width: 100%;
    height: 350px;
  }
}
</style>
