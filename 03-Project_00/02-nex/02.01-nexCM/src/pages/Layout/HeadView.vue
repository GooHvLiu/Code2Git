<template>
  <div class="HeadView">
    <div class="headTop">
      <div class="floatLeft">
        <div class="iconButton">
          <el-button icon="el-icon-s-fold" v-show="!isShow" @click="changeShow"></el-button
          ><el-button icon="el-icon-s-unfold" v-show="isShow" @click="changeShow"></el-button>
        </div>
        <div class="breadCrumb">
          <HeadBreadcrumb></HeadBreadcrumb>
        </div>
      </div>
      <div class="floatRight"></div>
    </div>
    <div class="headBottom"></div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import HeadBreadcrumb from "@/components/Breadcrumb/HeadBreadcrumb.vue";
export default {
  name: "HeadView",
  components: { HeadBreadcrumb },
  data() {
    return {
      isShow: false
    };
  },
  computed: {},
  methods: {
    ...mapMutations("navCollapse", ["changeIsCollapse"]),
    changeShow() {
      this.changeIsCollapse(), (this.isShow = !this.isShow);
    }
  },
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
    margin-left: 10px;
    padding: 0;
    font-size: 1.6rem;
    border: none;
  }
  .headTop {
    height: 50px;
    box-shadow: 0 3px 3px #eee;
    .floatLeft {
      float: left;
      display: flex;
      align-items: center;
    }
    .floatRight {
      float: right;
    }
  }
}
</style>
