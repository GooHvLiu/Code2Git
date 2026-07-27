<template>
  <div class="NavBar" :class="{ NavBarIsCollapse: isCollapse }">
    <h1 class="main-logo">
      <router-link to="/"><img :src="require('@/assets/logo.png')" alt="logo" width="30px" /></router-link>
      <span v-show="!isCollapse">nexCM 管理系统</span>
    </h1>
    <el-menu
      :unique-opened="true"
      default-active="#"
      :router="true"
      class="el-menu-vertical-demo"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <div v-for="item in menuItems" :key="item.id">
        <el-submenu :index="item.path" v-if="item.children">
          <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <svg-icon :icon-file-name="item.icon" class="svg-icon-class"></svg-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item :index="childrenItem.path" v-for="childrenItem in item.children" :key="childrenItem.id">{{
            childrenItem.title
          }}</el-menu-item>
        </el-submenu>
        <el-menu-item :index="item.path" v-else>
          <!-- <i class="el-icon-menu"></i> -->
          <svg-icon :icon-file-name="item.icon" class="svg-icon-class"></svg-icon>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NavBar",
  components: {},
  data() {
    return {};
  },
  computed: {
    //变量名字一样的情况下，使用数组最方便
    ...mapState("navCollapse", ["isCollapse"]),
    //变量名不一样的情况下，使用对象方法比较方便
    ...mapState("userMenu", { menuItems: "userMenu" })
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less">
.NavBar {
  width: 220px;
  height: 100%;
  transition: all 0.3s;
  background-color: #304156;
  box-shadow: 6px 0 5px #ccc;
  .el-menu {
    border: none;
  }
  .main-logo {
    padding: 10px;
    display: flex;
    align-items: center;
    img {
      margin: 0px 8px;
      padding-top: 2px;
    }
    span {
      color: #fff;
      font-weight: bold;
      white-space: nowrap;
    }
  }
}
.NavBarIsCollapse {
  width: 64px;
  .el-submenu__title {
    span {
      display: none;
    }
  }
}

// 展开状态下二级菜单和一级菜单鼠标悬停背景效果rgb(38, 52, 69);
.NavBar .el-menu-vertical-demo div .el-submenu .el-menu .el-menu-item {
  background-color: rgb(38, 52, 69) !important ;
}
.el-menu-vertical-demo .el-menu-item:hover,
::v-deep .el-submenu__title:hover {
  background-color: #444 !important;
}

// svg-icon图标样式
.svg-icon-class {
  margin-right: 10px;
  margin-top: 10px;
}
</style>
