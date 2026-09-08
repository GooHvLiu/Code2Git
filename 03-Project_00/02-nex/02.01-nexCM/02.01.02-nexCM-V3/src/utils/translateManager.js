/**
 * 翻译状态管理器
 * 独立的响应式状态管理，用于管理批量翻译的进度、状态等
 * 不依赖组件，关闭弹窗后翻译仍在后台继续
 */
import { reactive } from 'vue'

// 翻译状态
const state = reactive({
  // 是否正在翻译
  isTranslating: false,
  // 当前翻译的目标文件名
  targetFileName: '',
  // 当前翻译的目标语言名称
  targetLangName: '',
  // 节点翻译时的节点路径（null 表示全量翻译）
  nodePath: null,
  // 节点翻译时的节点名称
  nodeLabel: '',
  // 总数量
  totalCount: 0,
  // 当前已完成数量
  currentCount: 0,
  // 成功数量
  successCount: 0,
  // 失败数量
  failCount: 0,
  // 失败的 key 列表
  failItems: [],
  // 当前正在翻译的 key
  currentKey: '',
  // 当前正在翻译的内容
  currentValue: '',
  // 是否取消
  isCancelled: false,
  // 进度弹窗是否可见
  dialogVisible: false,
  // 是否最小化
  isMinimized: false,
  // 翻译结果（用于完成后显示）
  result: null
})

// 监听器列表（用于通知状态变化）
const listeners = []

// 通知所有监听器
function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn(state)
    } catch (e) {
      console.error('[TranslateManager] 监听器执行失败:', e)
    }
  })
}

// 开始翻译
function startTranslate(targetFileName, targetLangName, totalCount, nodePath = null, nodeLabel = '') {
  state.isTranslating = true
  state.targetFileName = targetFileName
  state.targetLangName = targetLangName
  state.nodePath = nodePath
  state.nodeLabel = nodeLabel
  state.totalCount = totalCount
  state.currentCount = 0
  state.successCount = 0
  state.failCount = 0
  state.failItems = []
  state.currentKey = ''
  state.currentValue = ''
  state.isCancelled = false
  state.dialogVisible = true
  state.isMinimized = false
  state.result = null
  notifyListeners()
}

// 更新当前翻译进度
function updateProgress(currentCount, successCount, failCount, currentKey, currentValue) {
  state.currentCount = currentCount
  state.successCount = successCount
  state.failCount = failCount
  state.currentKey = currentKey
  state.currentValue = currentValue
  notifyListeners()
}

// 翻译完成
function finishTranslate(success, message) {
  state.isTranslating = false
  state.result = {
    success,
    message,
    successCount: state.successCount,
    failCount: state.failCount,
    failItems: [...state.failItems]
  }
  notifyListeners()
}

// 取消翻译
function cancelTranslate() {
  state.isCancelled = true
  notifyListeners()
}

// 显示弹窗
function showDialog() {
  state.dialogVisible = true
  state.isMinimized = false
  notifyListeners()
}

// 隐藏弹窗
function hideDialog() {
  state.dialogVisible = false
  notifyListeners()
}

// 最小化
function minimize() {
  state.isMinimized = true
  notifyListeners()
}

// 还原（从最小化恢复）
function restore() {
  state.isMinimized = false
  notifyListeners()
}

// 添加失败项
function addFailItem(keyPath) {
  state.failItems.push(keyPath)
}

// 添加监听器
function addListener(fn) {
  if (typeof fn === 'function') {
    listeners.push(fn)
  }
}

// 移除监听器
function removeListener(fn) {
  const index = listeners.indexOf(fn)
  if (index > -1) {
    listeners.splice(index, 1)
  }
}

// 计算进度百分比
function getProgressPercent() {
  if (state.totalCount === 0) return 0
  return Math.round((state.currentCount / state.totalCount) * 100)
}

export default {
  state,
  startTranslate,
  updateProgress,
  finishTranslate,
  cancelTranslate,
  showDialog,
  hideDialog,
  minimize,
  restore,
  addFailItem,
  addListener,
  removeListener,
  getProgressPercent
}
