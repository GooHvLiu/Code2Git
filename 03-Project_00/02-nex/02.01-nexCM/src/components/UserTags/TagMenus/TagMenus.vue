<template>
  <!-- 全屏遮罩 @click.self：只有点击遮罩空白区域触发，点击菜单内部不会关闭 -->
  <div class="UserTags4Right" @click.self="$emit('close')">
    <div class="context-menu" :style="menuStyle">
      <ul class="menu-item-group">
        <li class="menu-item" v-for="item in filterMenu" :key="item.id"><i :class="item.icon"></i>{{ item.text }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagMenus",
  components: {},
  data() {
    return {
      tagMenu: [
        {
          id: 1,
          icon: "el-icon-refresh-right",
          text: "刷新页面"
        },
        {
          id: 2,
          icon: "el-icon-close",
          text: "关闭当前"
        },
        {
          id: 3,
          icon: "el-icon-circle-close",
          text: "关闭其他"
        },
        {
          id: 4,
          icon: "el-icon-back",
          text: "关闭左侧"
        },
        {
          id: 5,
          icon: "el-icon-right",
          text: "关闭右侧"
        },
        {
          id: 6,
          icon: "el-icon-circle-close",
          text: "全部关闭"
        }
      ]
    };
  },
  props: {
    mouseX: { type: Number, default: 0 },
    mouseY: { type: Number, default: 0 },
    currentRightIndex: { type: Number, required: true },
    totalTagArr: { type: Number, required: true }
  },
  watch: {},
  computed: {
    // 过滤菜单：首页隐藏【关闭当前、关闭左侧】
    filterMenu() {
      // 1. 获取当前菜单列表的总长度
      const totalLength = this.totalTagArr;

      // 2. 使用 Set 提升查找性能
      const hideIds = new Set();

      // 3.1 首页（索引0）的特殊保护
      if (this.currentRightIndex === 0) {
        // 隐藏"关闭左侧"（左边没有标签了）和 "关闭当前"（根据你的业务需求添加）
        hideIds.add(4);
        hideIds.add(2);
      }

      // 3.2 点击的是【最后一个】标签
      if (this.currentRightIndex === totalLength - 1) {
        // 隐藏"关闭右侧"（右边没有标签了）
        hideIds.add(5);
      }

      // 3.3 只有【唯一一个】标签时
      if (totalLength === 1) {
        // 隐藏"关闭其他"（没有其他标签可关了）
        hideIds.add(3);
      }

      // 3.2 只有【唯二个】标签时
      if (this.currentRightIndex === 1) {
        // 隐藏"关闭其他"（没有其他标签可关了）
        hideIds.add(4);
      }

      // 3.4 如果不需要隐藏任何菜单，直接返回原数组（性能最优）
      if (hideIds.size === 0) {
        return this.tagMenu;
      }

      // 4. 过滤掉需要隐藏的菜单，返回新数组
      return this.tagMenu.filter((item) => !hideIds.has(item.id));
    },

    // 通过数据对显示样式进行创建
    menuStyle() {
      // 菜单预估宽高（和css保持一致）
      const menuWidth = 160;
      const menuHeight = 240;
      // 浏览器可视区域宽高
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      let x = this.mouseX;
      let y = this.mouseY;

      // 右侧溢出：鼠标向左偏移菜单宽度
      if (x + menuWidth > winW) {
        x = x - menuWidth;
      }
      // 底部溢出：鼠标向上偏移菜单高度
      if (y + menuHeight > winH) {
        y = y - menuHeight;
      }

      return {
        left: `${x}px`,
        top: `${y}px`
      };
    }
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less">
.UserTags4Right {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9997;
  .context-menu {
    width: 105px;
    position: fixed;
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    .menu-item-group {
      .menu-item {
        font-size: 0.8rem;
        padding: 10px 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        &:hover {
          background: #f5f7fa;
        }
      }
    }
  }
}
</style>
