<template>
  <div class="menu-preview-container">
    <!-- 顶部工具栏 -->
    <div class="preview-header">
      <div class="header-left">
        <h2 class="preview-title">{{ t('superPanel.menuConfig.preview.title') }}</h2>
        <p class="preview-desc">{{ t('superPanel.menuConfig.preview.desc') }}</p>
      </div>
      <div class="header-right">
        <el-tag type="success" size="small">{{ t('superPanel.menuConfig.preview.mode') }}</el-tag>
      </div>
    </div>

    <!-- 预览内容区 -->
    <div class="preview-content">
      <!-- 模拟左侧菜单 -->
      <div class="preview-sidebar">
        <div class="preview-sidebar-logo">
          <div class="logo-link">
            <SvgIcon icon-class="logo" class-name="preview-logo-svg" />
            <span class="preview-logo-text">{{ t('common.systemName') }}</span>
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
            <template v-for="item in menuList" :key="item.id">
              <el-sub-menu v-if="item.children && item.children.length > 0 && item.type !== 1" :index="item.path">
                <template #title>
                  <el-icon><Menu /></el-icon>
                  <span>{{ getMenuTitle(item) }}</span>
                </template>
                <template v-for="child in item.children" :key="child.id">
                  <el-sub-menu
                    v-if="child.children && child.children.length > 0 && child.type !== 1"
                    :index="child.path"
                  >
                    <template #title>
                      <el-icon><Document /></el-icon>
                      <span>{{ getMenuTitle(child) }}</span>
                    </template>
                    <el-menu-item
                      v-for="grandChild in child.children"
                      v-show="!grandChild.hidden"
                      :key="grandChild.id"
                      :index="grandChild.path"
                    >
                      <el-icon><Document /></el-icon>
                      <template #title>{{ getMenuTitle(grandChild) }}</template>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-menu-item v-else v-show="!child.hidden" :index="child.path">
                    <el-icon><Document /></el-icon>
                    <template #title>{{ getMenuTitle(child) }}</template>
                  </el-menu-item>
                </template>
              </el-sub-menu>
              <el-menu-item v-else v-show="!item.hidden" :index="item.path">
                <el-icon><Menu /></el-icon>
                <template #title>{{ getMenuTitle(item) }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </div>

      <!-- 模拟主内容区 -->
      <div class="preview-main">
        <div class="main-placeholder">
          <el-icon class="placeholder-icon"><Monitor /></el-icon>
          <p>{{ t('superPanel.menuConfig.preview.mainTip') }}</p>
          <p class="tip-text">{{ t('superPanel.menuConfig.preview.mainTip2') }}</p>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="preview-footer">
      <span>{{ t('superPanel.menuConfig.preview.menuCount') }}: {{ menuCount }}</span>
      <span>{{ t('superPanel.menuConfig.preview.time') }}: {{ previewTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 菜单配置预览：从 localStorage 读取草稿菜单数据，模拟侧边栏渲染
 * @author GooHv
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { showWarning, showError } from '@/utils/ui/feedback'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { resolveMenuTitle } from '@/router/helper/menuTitle'
import { Menu, Document, Monitor } from '@element-plus/icons-vue'

const { t } = useI18n()

interface PreviewMenu {
  id: string
  path: string
  title?: string
  name?: string
  icon?: string
  type: number
  hidden?: number
  children?: PreviewMenu[]
}

const menuList = ref<PreviewMenu[]>([])
const activeMenu = ref('')
const previewTime = ref('')

const menuCount = computed(() => {
  let count = 0
  const countMenus = (nodes: PreviewMenu[]): void => {
    nodes.forEach(node => {
      if (node.type !== 1) count++
      if (node.children && node.children.length > 0) countMenus(node.children)
    })
  }
  countMenus(menuList.value)
  return count
})

function loadPreviewData(): void {
  try {
    const previewData = localStorage.getItem('menu_config_preview')
    if (previewData) {
      const data = JSON.parse(previewData)
      menuList.value = data.menuData || []
      activeMenu.value = data.activeMenu || ''
    } else {
      showWarning(t('superPanel.menuConfig.preview.noData'))
    }
  } catch (error) {
    console.error('加载预览数据失败:', error)
    showError(t('superPanel.menuConfig.preview.loadFailed'))
  }
}

function getMenuTitle(menu: PreviewMenu): string {
  if (!menu) return ''
  const title = menu.title || menu.name || ''
  return resolveMenuTitle(title)
}

function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

onMounted(() => {
  loadPreviewData()
  previewTime.value = formatTime(new Date())
})
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
.preview-content {
  flex: 1;
  display: flex;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
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
.preview-sidebar-scroll :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
.preview-sidebar-scroll :deep(.el-menu) {
  border-right: none;
}
.preview-sidebar-scroll :deep(.el-scrollbar__bar.is-vertical) {
  right: 0;
}
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
.placeholder-icon {
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
