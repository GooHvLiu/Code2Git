<template>
  <div class="NavBar" :class="{ NavBarIsCollapse: isCollapse }">
    <h1 class="main-logo">
      <router-link to="/"
        ><img :src="require('@/assets/logo.png')" alt="logo" width="30px"
      /></router-link>
      <span v-show="!isCollapse">nexCM 管理系统</span>
    </h1>
    <el-menu
      :unique-opened="true"
      default-active="/"
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
            <i class="el-icon-location"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            :index="childrenItem.path"
            v-for="childrenItem in item.children"
            :key="childrenItem.id"
            >{{ childrenItem.title }}</el-menu-item
          >
        </el-submenu>
        <el-menu-item :index="item.path" v-else>
          <i class="el-icon-menu"></i>
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
    return {
      // 菜单栏的数组结构
      menuItems: [
        { id: "_001", title: "网站首页", path: "/" },
        {
          id: "_002",
          title: "客户管理",
          path: "/customer",
          children: [
            { id: "_002_001", title: "客户档案", path: "/customer/customer" },
            { id: "_002_02", title: "拜访记录", path: "/customer/visit" }
          ]
        },
        {
          id: "_003",
          title: "修养预约",
          path: "/business",
          children: [
            {
              id: "_003_001",
              title: "预约信息",
              path: "/business/appointment"
            },
            { id: "_003_002", title: "服务项目", path: "/business/service" },
            { id: "_003_003", title: "结算单据", path: "/business/statement" }
          ]
        },
        {
          id: "_004",
          title: "流程管理",
          path: "/flow",
          children: [
            { id: "_004_001", title: "流程定义", path: "/flow/definition" },
            { id: "_004_002", title: "审核流程", path: "/flow/approve" }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState("navCollapse", ["isCollapse"])
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
</style>
