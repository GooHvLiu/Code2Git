<template>
  <div ref="containerRef" class="monaco-editor-container">
    <div ref="editorRef" class="monaco-editor"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * Monaco 代码编辑器封装
 * v-model 绑定内容（modelValue），emit change。
 * 通过 ref 暴露 getValue/setValue/revealLine/focus/layout。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

defineOptions({ name: 'MonacoEditor' })

interface Props {
  /** 编辑器内容（v-model） */
  modelValue?: string
  /** 语言：javascript / typescript / json / html / css / plaintext */
  language?: string
  /** 主题：vs / vs-dark / hc-black */
  theme?: string
  /** 是否只读 */
  readOnly?: boolean
  /** 是否显示 minimap */
  minimap?: boolean
  /** 字体大小 */
  fontSize?: number
  /** tab 宽度 */
  tabSize?: number
  /** 是否自动换行 */
  wordWrap?: boolean
  /** 需高亮的行号（从 1 开始） */
  highlightLines?: number[]
  /** 自动滚动到的行号 */
  scrollToLine?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'vs',
  readOnly: false,
  minimap: true,
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  highlightLines: () => [],
  scrollToLine: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const containerRef = ref<HTMLElement>()
const editorRef = ref<HTMLElement>()

let editor: monaco.editor.IStandaloneCodeEditor | null = null
let decorations: string[] = []
let handleResize: (() => void) | null = null

watch(
  () => props.modelValue,
  newVal => {
    if (editor && newVal !== editor.getValue()) {
      editor.setValue(newVal)
    }
  }
)

watch(
  () => props.language,
  newVal => {
    if (editor?.getModel()) {
      monaco.editor.setModelLanguage(editor.getModel()!, newVal)
    }
  }
)

watch(
  () => props.theme,
  newVal => {
    monaco.editor.setTheme(newVal)
  }
)

watch(
  () => props.readOnly,
  newVal => {
    if (editor) editor.updateOptions({ readOnly: newVal })
  }
)

watch(
  () => props.highlightLines,
  newVal => updateHighlight(newVal),
  { deep: true }
)

watch(
  () => props.scrollToLine,
  newVal => {
    if (newVal && editor) editor.revealLineInCenter(newVal)
  }
)

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function initEditor(): void {
  monaco.editor.setTheme(props.theme)

  editor = monaco.editor.create(editorRef.value!, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readOnly,
    minimap: { enabled: props.minimap },
    fontSize: props.fontSize,
    tabSize: props.tabSize,
    wordWrap: props.wordWrap ? 'on' : 'off',
    automaticLayout: false,
    scrollBeyondLastLine: false,
    folding: true,
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    cursorBlinking: 'smooth',
    smoothScrolling: true,
    padding: { top: 10, bottom: 10 }
  })

  editor.onDidChangeModelContent(() => {
    const value = editor!.getValue()
    emit('update:modelValue', value)
    emit('change', value)
  })

  if (props.highlightLines.length > 0) {
    updateHighlight(props.highlightLines)
  }
  if (props.scrollToLine) {
    editor.revealLineInCenter(props.scrollToLine)
  }
}

function updateHighlight(lines: number[]): void {
  if (!editor || !lines || lines.length === 0) {
    if (editor) decorations = editor.deltaDecorations(decorations, [])
    return
  }
  const newDecorations = lines.map(line => ({
    range: new monaco.Range(line, 1, line, 1),
    options: {
      isWholeLine: true,
      className: 'monaco-highlight-line',
      glyphMarginClassName: 'monaco-highlight-glyph'
    }
  }))
  decorations = editor.deltaDecorations(decorations, newDecorations)
}

function getValue(): string {
  return editor ? editor.getValue() : ''
}

function setValue(value: string): void {
  if (editor) editor.setValue(value)
}

function revealLine(line: number): void {
  if (editor && line) editor.revealLineInCenter(line)
}

function focusEditor(): void {
  if (editor) editor.focus()
}

function disposeEditor(): void {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

function layout(): void {
  if (editor) editor.layout()
}

defineExpose({ getValue, setValue, revealLine, focus: focusEditor, layout })

onMounted(() => {
  requestAnimationFrame(() => initEditor())
  handleResize = debounce(() => {
    if (editor) editor.layout()
  }, 100)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
  disposeEditor()
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.monaco-editor {
  width: 100%;
  height: 100%;
}

:deep(.monaco-highlight-line) {
  background-color: rgba(64, 158, 255, 0.15) !important;
  border-left: 3px solid #409eff !important;
}

:deep(.monaco-highlight-glyph) {
  background-color: #409eff !important;
  width: 4px !important;
  margin-left: 2px !important;
}
</style>
