// 引入尺寸观察器
import ResizeObserver from "resize-observer-polyfill";
// 引入 sessionStorage 常量
import { SESSIONSTORAGE_KEYS } from "../constants/storageKey"
export default {
  data() {
    return {
      // 分页基础
      currentPage: 1,
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: Number(localStorage.getItem(SESSIONSTORAGE_KEYS.STORAGE_PAGE_SIZE_KEY)) || 10,
      totalData: 0,

      // 表格自适应
      resizeObserver: null,
      resizeTimer: null
    };
  },

  watch: {
    // 侧边栏折叠，表格重绘
    isCollapse() {
      this.$nextTick(() => {
        this.$refs.multipleTable?.doLayout();
      });
    }
  },

  mounted() {
    // 调取 监听表格容器尺寸变化 函数
    this.initTableResize();
  },

  beforeDestroy() {
    // 销毁监听，防止内存泄漏
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    clearTimeout(this.resizeTimer);
  },

  methods: {
    // 监听表格容器尺寸变化
    initTableResize() {
      const tableWrap = this.$el.querySelector(".table");
      if (!tableWrap) return;
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.$refs.multipleTable?.doLayout();
        }, 80);
      });
      this.resizeObserver.observe(tableWrap);
    },

    // 页码切换
    async handleCurrentChange(page) {
      this.currentPage = page;
      await this.requestLoadTableData();
    },

    // 每页条数切换：存入本地缓存，强制回到第一页【行业规范】
    async handleSizeChange(size) {
      this.pageSize = size;
      localStorage.setItem(SESSIONSTORAGE_KEYS.STORAGE_PAGE_SIZE_KEY, size);
      this.currentPage = 1;
      await this.requestLoadTableData();
    },

    // 表格强制刷新布局
    refreshTableLayout() {
      this.$nextTick(() => {
        this.$refs.multipleTable?.doLayout();
      });
    },

    // 加载列表数据 业务页面必须实现 requestLoadTableData 方法
    requestLoadTableData() {
      throw new Error("当前页面必须实现 requestLoadTableData 方法");
    }
  }
};