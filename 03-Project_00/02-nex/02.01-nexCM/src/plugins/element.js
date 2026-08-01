import Vue from 'vue'
// 按需引入组件
import {
  Button,
  Form,
  FormItem,
  Input,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  TableColumn,
  Pagination,
  Table,
  Tag,
  Message
} from 'element-ui'

// 注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(Tag)

// 全局实例挂载 $message
Vue.prototype.$message = Message

// 可选：统一导出，方便后续扩展
export default function installElement() { }