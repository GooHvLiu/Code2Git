<template>
  <div class="HeadView">
    <el-button
      icon="el-icon-s-fold"
      v-show="!isShow"
      @click="isShow = !isShow"
    ></el-button
    ><el-button
      icon="el-icon-s-unfold"
      v-show="isShow"
      @click="isShow = !isShow"
    ></el-button>
  </div>
</template>

<script>
export default {
  name: "HeadView",
  components: {},
  data() {
    return {
      isShow: false
    };
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less">
.HeadView {
  height: 84px;
  box-shadow: 0px 5px 5px #ccc;
  button {
    width: 50px;
    height: 50px;
    margin: 0px;
    padding: 0px;
    font-size: 1.6rem;
    border: none;
  }
}
</style>
