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
  Message,
  DatePicker,
  Select,
  Autocomplete,
  Dialog,
  RadioGroup,
  Radio,
  Option,
  Upload,
  Loading
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
Vue.use(DatePicker)
Vue.use(Autocomplete)
Vue.use(Select)
Vue.use(RadioGroup)
Vue.use(Loading)
Vue.use(Radio)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Upload)

// 全局实例挂载 $message
Vue.prototype.$message = Message

// 可选：统一导出，方便后续扩展
export default function installElement() { }