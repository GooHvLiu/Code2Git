<template>
  <div class="UserTags">
    <el-tag
      size="small"
      class="Tag"
      :closable="isClosable(item.path)"
      :effect="isTagActive(item) ? 'dark' : 'plain'"
      :disable-transitions="true"
      @click="clickTag(item.path)"
      @close="handleClose(index)"
      @contextmenu.native.prevent="openContentMenu($event, index)"
      v-for="(item, index) in tagArr"
      :key="item.path"
      ><i :class="isTagActive(item) ? 'activeCircle' : ''"></i>{{ item.title }}</el-tag
    >
    <TagMenus
      v-if="menuShow"
      :mouseX="mouseX"
      :mouseY="mouseY"
      :currentRightIndex="currentRightIndex"
      :totalTagArr="totalTagArr"
      @sendSingleTagMenuClick="handleSingleTagMenuClick"
      @close="menuShow = false"
    ></TagMenus>
  </div>
</template>

<script>
import TagMenus from "./TagMenus/TagMenus.vue";
import { SESSIONSTORAGE_KEYS } from "@/common/constants/storageKey.js";
import { setSessionStorage, getSessionStorage } from "@/common/utils/index.js";
export default {
  name: "UserTags",
  components: { TagMenus },
  data() {
    return {
      // 标签栏的数据存储
      tagArr: getSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST) || [
        {
          title: "网站首页",
          path: "/home",
          isActive: true
        }
      ],
      // 标签右键传参
      menuShow: false,
      mouseX: 0,
      mouseY: 0,
      currentRightIndex: null,
      totalTagArr: 0
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        // 去往的路径地址
        const targetPath = to.path;
        // 查找是否已经存在该路由标签
        const existItem = this.tagArr.find((item) => item.path === targetPath);
        // 不存在：新增标签,如果已经存在，说明是点击之前的，那么交给点击事件处理
        if (!existItem) {
          this.tagArr.push({
            title: to.meta.titles[to.meta.titles.length - 1],
            path: targetPath,
            isActive: true
          });
        }
        // 标签本地持久化
        this.saveTagsCache();
      }
    }
  },
  computed: {},
  methods: {
    // 如果是 网站首页 是不允许被关闭的
    isClosable(path) {
      if (path === "/home") return false;
      return true;
    },
    // 是否激活 isActive 统一在此处处理
    isTagActive(item) {
      return item.path === this.$route.path;
    },

    // 点击标签只负责跳转路由，不用修改激活状态
    clickTag(path) {
      if (this.$route.path != path) {
        this.$router.push(path);
      }
    },

    // 点击 Tag 关闭按钮
    handleClose(index) {
      // 获取将要删除的标签
      const delTag = this.tagArr[index];
      // 删除标签
      this.tagArr.splice(index, 1);

      // 标签本地持久化
      this.saveTagsCache();

      // 关键：只有关闭【当前正在访问页面】，才执行路由跳转
      if (delTag.path === this.$route.path) {
        // 防止全部删空（保底首页）
        if (this.tagArr.length > 0) {
          const lastItem = this.tagArr[this.tagArr.length - 1];
          this.$router.push(lastItem.path);
        } else {
          this.$router.push("/home");
        }
      }
    },

    // 右键标签弹出右键菜单栏
    openContentMenu(e, id) {
      // console.log("当前在UserTags,点击右键的ID是：", id);

      // 获取当前路由对应的标签下标
      const activeIndex = this.tagArr.findIndex((item) => item.path === this.$route.path);
      if (activeIndex === id) {
        (this.mouseX = e.clientX),
          (this.mouseY = e.clientY),
          (this.currentRightIndex = id),
          (this.menuShow = true),
          (this.totalTagArr = this.tagArr.length);
      }
    },

    // 用户点击右键菜单之后的统一处理
    handleSingleTagMenuClick(menuId) {
      const rightIndex = this.currentRightIndex;
      // console.log("当前父组件收到的被点击的菜单ID：", menuId);
      switch (menuId) {
        // 1 - 刷新页面
        case 1: {
          location.reload();
          break;
        }

        // 2 - 关闭当前
        case 2: {
          this.handleClose(rightIndex);
          this.saveTagsCache();
          break;
        }

        // 3 - 关闭其他：只保留选中标签和网站首页
        case 3: {
          this.tagArr = [
            {
              title: "网站首页",
              path: "/home",
              isActive: false
            },
            this.tagArr[rightIndex]
          ];
          this.saveTagsCache();
          break;
        }

        // 4 - 关闭左侧
        case 4: {
          this.tagArr.splice(1, rightIndex - 1);
          this.saveTagsCache();
          break;
        }

        // 5 - 关闭右侧
        case 5: {
          this.tagArr.splice(rightIndex + 1);
          this.saveTagsCache();
          break;
        }

        // 6 - 全部关闭，只保留首页
        case 6: {
          this.tagArr = [
            {
              title: "网站首页",
              path: "/home",
              isActive: true
            }
          ];
          this.saveTagsCache();
          this.$router.push("/home");
          break;
        }

        default:
          break;
      }
    },

    // 持久化标签数组方法 统一在此处理
    saveTagsCache() {
      setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, this.tagArr);
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.UserTags {
  margin: 6px 0 0 9px;
  .Tag {
    margin: 0 1px 0 1px;
  }
  .Tag:hover {
    cursor: pointer;
  }
  .activeCircle {
    width: 8px;
    height: 8px;
    background-color: #fff;
    display: inline-block;
    border-radius: 50%;
    margin-right: 4px;
  }
}
</style>
