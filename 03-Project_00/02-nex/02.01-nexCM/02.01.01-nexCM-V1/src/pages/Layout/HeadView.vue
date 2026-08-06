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
            <el-dropdown-item divided command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="headBottom">
      <UserTags></UserTags>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HeadBreadcrumb from "@/components/Breadcrumb/HeadBreadcrumb.vue";
import { clearLoginStorage } from "@/common/utils/index.js";
import UserTags from "@/components/UserTags/UserTags.vue";
export default {
  name: "HeadView",
  components: { HeadBreadcrumb, UserTags },
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
        // 删除本地token 用户信息 Tag 缓存
        clearLoginStorage();
        // 到登录页
        this.$router.push("/login");
      }

      // 用户点击 退出登录
      if (command === "profile") {
        // 设定路由直接跳转到 /profile
        this.$router.push("/profile");
      }
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.HeadView {
  height: 84px;
  box-shadow: 8px 3px 0px #f7f7f7;
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
    box-shadow: 8px 3px 0 #f7f7f7;
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
  .headBottom {
    align-items: center;
  }
}
</style>
