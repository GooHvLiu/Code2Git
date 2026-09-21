/**
 * ==========================================
 * 通用业务组件全局注册（Vue3 插件）
 * ==========================================
 * 注册后可在任意页面直接使用标签，无需每次 import。
 *
 * 已注册组件（标签名 → 组件）：
 * - Pagination      通用分页
 * - SvgIcon         SVG 图标
 * - DictTag         字典标签
 * - SearchForm      搜索表单
 * - TableToolbar    表格工具栏
 * - UploadImage     图片上传
 *
 * 用法：
 *   <pagination v-model:page="query.page" v-model:limit="query.limit" :total="total" @pagination="loadList" />
 *   <svg-icon icon-class="home" />
 *   <dict-tag :options="statusOptions" :value="row.status" />
 *
 * 说明：采用显式标签名映射，不依赖组件自身 defineOptions.name，
 *       确保无 name 的 <script setup> 组件也能被全局注册。
 *
 * 作者：GooHv
 */
import type { App } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import TableToolbar from '@/components/TableToolbar/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'

/** 标签名 → 组件 映射；新增通用组件时在此追加即可 */
const componentMap: Record<string, object> = {
  Pagination,
  SvgIcon,
  DictTag,
  SearchForm,
  TableToolbar,
  UploadImage
}

export default {
  install(app: App): void {
    Object.entries(componentMap).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
