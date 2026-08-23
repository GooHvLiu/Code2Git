<template>
  <el-tag v-if="dictItem" :type="dictItem.list_class || dictItem.css_class || 'info'" size="small" effect="light">
    {{ dictItem.label }}
  </el-tag>
  <span v-else-if="value !== undefined && value !== null && value !== ''">{{ value }}</span>
  <span v-else>--</span>
</template>

<script>
/**
 * 字典标签组件
 * 支持两种方式：
 * 1. 传入 options 数组：<dict-tag :options="statusOptions" :value="row.status" />
 * 2. 传入 dictCode（字典类型编码），自动从后端加载：<dict-tag dict-code="user_status" :value="row.status" />
 *
 * options 格式：[{ label: '正常', value: '1', type: 'success' }]
 * type 可选：success / warning / danger / info / primary
 */
import { requestGetDictItemsByCodeApi } from '@/api'

// 字典数据缓存（全局共享，避免重复请求）
const dictCache = {}
// 字典请求中状态（全局共享，避免并发重复请求）
const dictLoading = {}
// 字典请求等待队列（全局共享，并发请求等待第一个请求返回）
const dictWaitQueue = {}

export default {
  name: 'DictTag',
  props: {
    /** 字典选项列表（手动传入） */
    options: {
      type: Array,
      default: () => []
    },
    /** 字典类型编码（从后端自动加载） */
    dictCode: {
      type: String,
      default: ''
    },
    /** 当前值 */
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loadedOptions: [] // 从后端加载的字典选项
    }
  },
  computed: {
    /** 最终使用的字典选项列表 */
    finalOptions() {
      return this.options.length > 0 ? this.options : this.loadedOptions
    },
    dictItem() {
      return this.finalOptions.find(item => String(item.value) === String(this.value))
    }
  },
  watch: {
    dictCode: {
      immediate: true,
      handler(code) {
        if (code) {
          this.loadDictData(code)
        }
      }
    }
  },
  methods: {
    /** 加载字典数据（带缓存 + 并发请求合并） */
    async loadDictData(code) {
      // 命中缓存
      if (dictCache[code]) {
        this.loadedOptions = dictCache[code]
        return
      }
      // 如果有相同请求正在加载，等待第一个请求返回
      if (dictLoading[code]) {
        await new Promise(resolve => {
          if (!dictWaitQueue[code]) dictWaitQueue[code] = []
          dictWaitQueue[code].push(resolve)
        })
        if (dictCache[code]) {
          this.loadedOptions = dictCache[code]
        }
        return
      }
      // 标记为加载中
      dictLoading[code] = true
      try {
        const res = await requestGetDictItemsByCodeApi(code)
        this.loadedOptions = res.data || []
        dictCache[code] = this.loadedOptions
        // 通知等待的请求
        if (dictWaitQueue[code]) {
          dictWaitQueue[code].forEach(resolve => resolve())
          delete dictWaitQueue[code]
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[DictTag] 加载字典数据失败: ${code}`, e)
        // 通知等待的请求（失败也通知，避免一直等待）
        if (dictWaitQueue[code]) {
          dictWaitQueue[code].forEach(resolve => resolve())
          delete dictWaitQueue[code]
        }
      } finally {
        delete dictLoading[code]
      }
    },
    /** 清除字典缓存（修改字典后调用） */
    clearCache(code) {
      if (code) {
        delete dictCache[code]
      } else {
        Object.keys(dictCache).forEach(key => delete dictCache[key])
      }
    }
  }
}
</script>
