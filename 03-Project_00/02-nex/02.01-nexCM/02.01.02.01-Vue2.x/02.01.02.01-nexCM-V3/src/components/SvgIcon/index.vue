<template>
  <i v-if="isIconFont" :class="iconName"></i>
  <svg v-else class="svg-icon" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconHref" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      default: ''
    },
    iconFileName: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return this.iconClass || this.iconFileName || ''
    },
    isIconFont() {
      return this.iconName && this.iconName.indexOf('el-icon-') === 0
    },
    iconHref() {
      if (!this.iconName) return ''
      return '#icon-' + this.iconName.replace(/\//g, '-')
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1.6em;
  height: 1.6em;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>
