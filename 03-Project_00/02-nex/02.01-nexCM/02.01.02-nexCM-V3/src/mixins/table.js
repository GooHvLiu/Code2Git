/**
 * ==========================================
 * 表格通用 Mixin
 * ==========================================
 * 封装列表页的通用逻辑：搜索、分页、加载状态、获取数据
 *
 * 用法：
 * export default {
 *   mixins: [tableMixin],
 *   data() {
 *     return {
 *       // 必须定义：获取列表的 API 方法
 *       listApi: requestGetUserListApi,
 *       // 搜索表单数据
 *       queryParams: { username: '', status: '' },
 *       // 表格数据
 *       tableData: []
 *     }
 *   },
 *   methods: {
 *     // 可选：自定义请求参数处理
 *     beforeFetch(params) { return params }
 *   }
 * }
 */
import config from '@/config'
import { getConfig } from '@/utils/config'

export default {
  data() {
    return {
      /** 加载状态 */
      loading: false,
      /** 当前页码 */
      pageNum: 1,
      /** 每页条数（优先从系统配置读取，兜底用 config.PAGE_SIZE） */
      pageSize: getConfig('defaultPageSize', config.PAGE_SIZE),
      /** 总条数 */
      total: 0,
      /** 排序字段 */
      orderBy: '',
      /** 排序方式 */
      orderDir: 'desc'
    }
  },
  created() {
    // 监听系统配置变化：默认每页条数改变时更新
    window.addEventListener('defaultPageSizeChanged', this.handleDefaultPageSizeChanged)
    // 页面创建时自动获取列表
    this.getList()
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('defaultPageSizeChanged', this.handleDefaultPageSizeChanged)
  },
  methods: {
    /**
     * 系统默认每页条数变化时处理
     */
    handleDefaultPageSizeChanged(event) {
      const newPageSize = event.detail?.pageSize
      if (newPageSize && newPageSize !== this.pageSize) {
        this.pageSize = newPageSize
        this.pageNum = 1
        this.getList()
      }
    },
    /**
     * 获取列表数据
     * 子类需定义 this.listApi 方法
     */
    async getList() {
      if (!this.listApi) {
        // eslint-disable-next-line no-console
        console.warn('[tableMixin] 请定义 listApi 方法')
        return
      }
      this.loading = true
      try {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          orderBy: this.orderBy,
          orderDir: this.orderDir,
          ...this.queryParams
        }
        // 允许子类在请求前处理参数
        const finalParams = this.beforeFetch ? this.beforeFetch(params) : params
        const res = await this.listApi(finalParams)
        this.tableData = res.data?.list || res.data?.records || []
        this.total = res.data?.total || 0
      } catch (e) {
        // 错误已由 request 拦截器统一处理
      } finally {
        this.loading = false
      }
    },

    /**
     * 搜索
     */
    handleQuery() {
      this.pageNum = 1
      this.getList()
    },

    /**
     * 重置搜索
     */
    handleReset() {
      // 重置搜索表单（子类需实现 resetQuery 或自行处理）
      if (this.resetQuery) {
        this.resetQuery()
      } else {
        Object.keys(this.queryParams).forEach(key => {
          this.queryParams[key] = ''
        })
      }
      this.pageNum = 1
      this.getList()
    },

    /**
     * 页码改变
     */
    handlePageChange(page) {
      this.pageNum = page
      this.getList()
    },

    /**
     * 每页条数改变
     */
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1
      this.getList()
    },

    /**
     * 排序改变
     */
    handleSortChange({ prop, order }) {
      this.orderBy = prop || ''
      this.orderDir = order === 'ascending' ? 'asc' : 'desc'
      this.getList()
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.getList()
    }
  }
}
