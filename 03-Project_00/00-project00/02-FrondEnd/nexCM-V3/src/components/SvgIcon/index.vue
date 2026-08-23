<template>
  <i v-if="iconFileName.indexOf('el-icon-') === 0" :class="iconFileName"></i>
  <svg
    v-else
    class="svg-icon"
    aria-hidden="true"
    v-on="$listeners"
  >
    <use :xlink:href="`#icon-${iconFileName}`" rel="external nofollow" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconFileName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1.6em;
  height: 1.6em;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>
