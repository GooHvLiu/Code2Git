/**
 * ==========================================
 * 通用业务组件全局注册
 * ==========================================
 * 注册后可在任意页面直接使用标签，无需每次 import
 *
 * 已注册组件：
 * - Pagination      通用分页
 * - SvgIcon         SVG 图标
 * - DictTag         字典标签
 * - SearchForm      搜索表单
 * - TableToolbar    表格工具栏
 * - UploadImage     图片上传
 * - I18nInput       多语言输入（中英文双输入框）
 *
 * 用法：
 * <pagination :total="total" @pagination="handlePagination" />
 * <svg-icon icon-file-name="home" />
 * <dict-tag :options="statusOptions" :value="row.status" />
 */
import Pagination from '@/components/Pagination/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import TableToolbar from '@/components/TableToolbar/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'
import ElectronicSignature from '@/components/ElectronicSignature/index.vue'
import I18nInput from '@/components/I18nInput/index.vue'

/**
 * 需要全局注册的组件列表
 * 新增通用组件时在此添加即可
 */
const components = [
  Pagination,
  SvgIcon,
  DictTag,
  SearchForm,
  TableToolbar,
  UploadImage,
  ElectronicSignature,
  I18nInput
]

export default {
  install(Vue) {
    components.forEach(component => {
      // 优先使用组件定义的 name，没有则用文件名
      const name = component.name || component.__name
      if (name) {
        Vue.component(name, component)
      }
    })
  }
}
