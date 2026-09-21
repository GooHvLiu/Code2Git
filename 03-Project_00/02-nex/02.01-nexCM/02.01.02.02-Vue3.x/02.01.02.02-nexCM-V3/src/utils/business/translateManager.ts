/**
 * 翻译状态管理器（单例）
 * 独立的响应式状态管理，用于管理批量翻译的进度与状态；
 * 不依赖组件，关闭弹窗后翻译仍在后台继续。
 * @author GooHv
 */
import { reactive } from 'vue'

export interface TranslateResult {
  success: boolean
  message: string
  successCount: number
  failCount: number
  failItems: string[]
}

interface TranslateState {
  isTranslating: boolean
  targetFileName: string
  targetLangName: string
  nodePath: string | null
  nodeLabel: string
  totalCount: number
  currentCount: number
  successCount: number
  failCount: number
  failItems: string[]
  currentKey: string
  currentValue: string
  isCancelled: boolean
  dialogVisible: boolean
  isMinimized: boolean
  result: TranslateResult | null
}

/** 翻译状态（响应式单例） */
const state = reactive<TranslateState>({
  isTranslating: false,
  targetFileName: '',
  targetLangName: '',
  nodePath: null,
  nodeLabel: '',
  totalCount: 0,
  currentCount: 0,
  successCount: 0,
  failCount: 0,
  failItems: [],
  currentKey: '',
  currentValue: '',
  isCancelled: false,
  dialogVisible: false,
  isMinimized: false,
  result: null
})

type Listener = (s: TranslateState) => void
const listeners: Listener[] = []

function notifyListeners(): void {
  listeners.forEach((fn) => {
    try {
      fn(state)
    } catch (e) {
      console.error('[TranslateManager] 监听器执行失败:', e)
    }
  })
}

/** 开始翻译（并弹出进度窗） */
function startTranslate(
  targetFileName: string,
  targetLangName: string,
  totalCount: number,
  nodePath: string | null = null,
  nodeLabel = ''
): void {
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

/** 更新当前进度 */
function updateProgress(
  currentCount: number,
  successCount: number,
  failCount: number,
  currentKey: string,
  currentValue: string
): void {
  state.currentCount = currentCount
  state.successCount = successCount
  state.failCount = failCount
  state.currentKey = currentKey
  state.currentValue = currentValue
  notifyListeners()
}

/** 翻译完成（记录结果，由弹窗渲染结果区） */
function finishTranslate(success: boolean, message: string): void {
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

/** 请求取消（循环内轮询 isCancelled） */
function cancelTranslate(): void {
  state.isCancelled = true
  notifyListeners()
}

function showDialog(): void {
  state.dialogVisible = true
  state.isMinimized = false
  notifyListeners()
}

function hideDialog(): void {
  state.dialogVisible = false
  notifyListeners()
}

function minimize(): void {
  state.isMinimized = true
  notifyListeners()
}

function restore(): void {
  state.isMinimized = false
  notifyListeners()
}

function addFailItem(keyPath: string): void {
  state.failItems.push(keyPath)
}

function addListener(fn: Listener): void {
  if (typeof fn === 'function') listeners.push(fn)
}

function removeListener(fn: Listener): void {
  const index = listeners.indexOf(fn)
  if (index > -1) listeners.splice(index, 1)
}

/** 进度百分比 0-100 */
function getProgressPercent(): number {
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
