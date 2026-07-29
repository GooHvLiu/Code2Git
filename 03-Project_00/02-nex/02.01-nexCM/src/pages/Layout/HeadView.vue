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
      <div class="floatRight">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <svg-icon :icon-file-name="userInfo?.avatar || 'who'" class="svg-icon-class"></svg-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>{{ userInfo.username }}</el-dropdown-item>
            <el-dropdown-item divided command="userCenter">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="headBottom"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HeadBreadcrumb from "@/components/Breadcrumb/HeadBreadcrumb.vue";
export default {
  name: "HeadView",
  components: { HeadBreadcrumb },
  data() {
    return {
      isShow: false
    };
  },
  computed: {
    ...mapState("userInfo", ["userInfo"])
  },
  methods: {
    ...mapMutations("navCollapse", ["changeIsCollapse"]),
    changeShow() {
      this.changeIsCollapse(), (this.isShow = !this.isShow);
    },
    // 用户点击 右上角 进行的鼠标点击事件判断
    handleCommand(command) {
      // console.log("@@@", this.userInfo);

      // 用户点击 退出登录
      if (command === "logout") {
        // 删除本地token
        localStorage.removeItem("nexCM-authorization-token");
        // 删除本地用户信息
        localStorage.removeItem("nexCM-user-information");
        // 到登录页
        this.$router.push("/login");
      }
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
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
        .svg-icon-class {
          font-size: 1rem;
          margin: 10px 10px 0 0;
        }
      }
    }
  }
}
</style>
