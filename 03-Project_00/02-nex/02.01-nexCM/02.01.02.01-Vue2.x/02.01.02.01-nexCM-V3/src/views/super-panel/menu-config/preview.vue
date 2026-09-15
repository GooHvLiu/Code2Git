<template>
  <div class="menu-preview-container">
    <!-- 顶部工具栏 -->
    <div class="preview-header">
      <div class="header-left">
        <h2 class="preview-title">{{ $t('superPanel.menuConfig.preview.title') }}</h2>
        <p class="preview-desc">{{ $t('superPanel.menuConfig.preview.desc') }}</p>
      </div>
      <div class="header-right">
        <el-tag type="success" size="small">{{ $t('superPanel.menuConfig.preview.mode') }}</el-tag>
      </div>
    </div>

    <!-- 预览内容区 -->
    <div class="preview-content">
      <!-- 模拟左侧菜单 -->
      <div class="preview-sidebar">
        <div class="preview-sidebar-logo">
          <div class="logo-link">
            <svg-icon icon-file-name="logo" class="preview-logo-svg" />
            <span class="preview-logo-text">{{ $t('common.systemName') }}</span>
          </div>
        </div>
        <el-scrollbar class="preview-sidebar-scroll">
          <el-menu
            :default-active="activeMenu"
            :unique-opened="true"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            mode="vertical"
          >
            <template v-for="item in menuList">
              <!-- 一级菜单（有子菜单） -->
              <el-submenu
                :key="'sub-' + item.id"
                v-if="item.children && item.children.length > 0 && item.type !== 1"
                :index="item.path"
              >
                <template slot="title">
                  <i :class="item.icon || 'el-icon-menu'"></i>
                  <span slot="title">{{ getMenuTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                  <!-- 二级菜单（有子菜单） -->
                  <el-submenu
                    :key="'sub-' + child.id"
                    v-if="child.children && child.children.length > 0 && child.type !== 1"
                    :index="child.path"
                  >
                    <template slot="title">
                      <i :class="child.icon || 'el-icon-document'"></i>
                      <span slot="title">{{ getMenuTitle(child) }}</span>
                    </template>
                    <el-menu-item
                      v-for="grandChild in child.children"
                      :key="grandChild.id"
                      :index="grandChild.path"
                      v-show="!grandChild.hidden"
                    >
                      <i :class="grandChild.icon || 'el-icon-document'"></i>
                      <span slot="title">{{ getMenuTitle(grandChild) }}</span>
                    </el-menu-item>
                  </el-submenu>
                  <!-- 二级菜单（无子菜单） -->
                  <el-menu-item
                    :key="'item-' + child.id"
                    v-else
                    :index="child.path"
                    v-show="!child.hidden"
                  >
                    <i :class="child.icon || 'el-icon-document'"></i>
                    <span slot="title">{{ getMenuTitle(child) }}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
              <!-- 一级菜单（无子菜单） -->
              <el-menu-item
                :key="'item-' + item.id"
                v-else
                :index="item.path"
                v-show="!item.hidden"
              >
                <i :class="item.icon || 'el-icon-menu'"></i>
                <span slot="title">{{ getMenuTitle(item) }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </div>

      <!-- 模拟主内容区 -->
      <div class="preview-main">
        <div class="main-placeholder">
          <i class="el-icon-monitor"></i>
          <p>{{ $t('superPanel.menuConfig.preview.mainTip') }}</p>
          <p class="tip-text">{{ $t('superPanel.menuConfig.preview.mainTip2') }}</p>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="preview-footer">
      <span>{{ $t('superPanel.menuConfig.preview.menuCount') }}: {{ menuCount }}</span>
      <span>{{ $t('superPanel.menuConfig.preview.time') }}: {{ previewTime }}</span>
    </div>
  </div>
</template>

<script>
import { resolveMenuTitle } from '@/router/helper/menuTitle'

export default {
  name: "MenuConfigPreview",
  data() {
    return {
      menuList: [],
      activeMenu: '',
      previewTime: ''
    }
  },
  computed: {
    menuCount() {
      let count = 0;
      const countMenus = (nodes) => {
        nodes.forEach(node => {
          if (node.type !== 1) { // 不计算按钮类型
            count++;
          }
          if (node.children && node.children.length > 0) {
            countMenus(node.children);
          }
        });
      };
      countMenus(this.menuList);
      return count;
    }
  },
  created() {
    this.loadPreviewData();
    this.previewTime = this.formatTime(new Date());
  },
  methods: {
    // 加载预览数据
    loadPreviewData() {
      try {
        const previewData = localStorage.getItem('menu_config_preview');
        if (previewData) {
          const data = JSON.parse(previewData);
          this.menuList = data.menuData || [];
          this.activeMenu = data.activeMenu || '';
        } else {
          this.$message.warning(this.$t('superPanel.menuConfig.preview.noData'));
        }
      } catch (error) {
        console.error('加载预览数据失败:', error);
        this.$message.error(this.$t('superPanel.menuConfig.preview.loadFailed'));
      }
    },
    // 获取菜单标题：菜单 title 统一存 i18n key，复用与主侧边栏一致的 resolveMenuTitle 翻译
    getMenuTitle(menu) {
      if (!menu) return '';
      const title = menu.title || menu.name || '';
      return resolveMenuTitle(title);
    },
    // 格式化时间
    formatTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }
}
</script>

<style scoped>
.menu-preview-container {
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

/* 顶部工具栏 */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
}

.preview-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.preview-desc {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

/* 预览内容区 */
.preview-content {
  flex: 1;
  display: flex;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 模拟左侧菜单 */
.preview-sidebar {
  width: 210px;
  background: #304156;
  display: flex;
  flex-direction: column;
}

.preview-sidebar-logo {
  height: 50px;
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0;
  background: #2b3648;
  color: #fff;
}

.preview-sidebar-logo .logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 16px;
  width: 100%;
}

.preview-logo-svg {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-left: 3px;
  flex-shrink: 0;
}

.preview-logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-left: 12px;
  white-space: nowrap;
}

.preview-sidebar-scroll {
  flex: 1;
  width: 100%;
}

.preview-sidebar-scroll >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

/* 确保 el-menu 没有右边框，避免宽度不一致 */
.preview-sidebar-scroll >>> .el-menu {
  border-right: none;
}

/* 确保滚动条不占据内容宽度 */
.preview-sidebar-scroll >>> .el-scrollbar__bar.is-vertical {
  right: 0;
}

/* 模拟主内容区 */
.preview-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.main-placeholder {
  text-align: center;
  color: #909399;
}

.main-placeholder .el-icon-monitor {
  font-size: 64px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.main-placeholder p {
  margin: 8px 0;
  font-size: 14px;
}

.tip-text {
  font-size: 12px !important;
  color: #c0c4cc !important;
}

/* 底部信息 */
.preview-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 13px;
  color: #909399;
}
</style>
