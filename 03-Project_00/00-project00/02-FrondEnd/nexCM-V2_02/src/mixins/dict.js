/**
 * ==========================================
 * 字典数据 Mixin
 * ==========================================
 * 页面中自动加载所需的字典数据，存入 dict 数据对象
 *
 * 用法：
 * export default {
 *   mixins: [dictMixin],
 *   data() {
 *     return {
 *       // 需要加载的字典编码列表
 *       dictCodes: ['sys_user_status', 'sys_user_sex'],
 *       // 字典数据会自动存入此对象
 *       dict: {
 *         sys_user_status: [],
 *         sys_user_sex: []
 *       }
 *     }
 *   }
 * }
 *
 * 模板中使用：
 * <dict-tag :options="dict.sys_user_status" :value="row.status" />
 */
import { getDicts } from '@/utils/dict'

export default {
  data() {
    return {
      /** 字典数据容器（子类可定义具体字段） */
      dict: {}
    }
  },
  created() {
    this.initDict()
  },
  methods: {
    /**
     * 初始化字典数据
     * 子类需定义 this.dictCodes 数组
     */
    async initDict() {
      if (!this.dictCodes || !this.dictCodes.length) return
      const result = await getDicts(this.dictCodes)
      this.dict = { ...this.dict, ...result }
    }
  }
}
