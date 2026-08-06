<!--
  SvgIcon 组件 - SVG 图标组件
  使用 svg-sprite-loader 加载的 SVG 雪碧图
  
  使用方式：
  <svg-icon icon-class="dashboard" />
  <svg-icon icon-class="user" class-name="custom-class" />
-->
<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <!-- xlink:href 引用 svg 雪碧图中的 symbol -->
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    // 图标类名（对应 svg 文件名）
    iconClass: {
      type: String,
      required: true
    },
    // 自定义类名
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 生成 xlink:href，格式：#icon-xxx
    iconName() {
      return `#icon-${this.iconClass}`
    },
    // 合并类名
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor; /* 继承父元素的文字颜色 */
  overflow: hidden;
}
</style>
