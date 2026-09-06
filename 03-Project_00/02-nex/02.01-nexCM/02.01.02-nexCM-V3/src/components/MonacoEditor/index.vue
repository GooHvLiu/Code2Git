<template>
  <div class="monaco-editor-container" ref="editorContainer">
    <div ref="editor" class="monaco-editor"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'MonacoEditor',
  props: {
    // 编辑器内容
    value: {
      type: String,
      default: ''
    },
    // 语言：javascript, typescript, json, html, css, plaintext
    language: {
      type: String,
      default: 'javascript'
    },
    // 主题：vs, vs-dark, hc-black
    theme: {
      type: String,
      default: 'vs'
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    },
    // 是否显示 minimap
    minimap: {
      type: Boolean,
      default: true
    },
    // 字体大小
    fontSize: {
      type: Number,
      default: 14
    },
    // 制表符大小
    tabSize: {
      type: Number,
      default: 2
    },
    // 是否自动换行
    wordWrap: {
      type: Boolean,
      default: false
    },
    // 需要高亮的行号（从1开始）
    highlightLines: {
      type: Array,
      default: () => []
    },
    // 自动滚动到的行号
    scrollToLine: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      decorations: []
    }
  },
  watch: {
    value(newVal) {
      if (this.editor && newVal !== this.editor.getValue()) {
        this.editor.setValue(newVal)
      }
    },
    language(newVal) {
      if (this.editor) {
        monaco.editor.setModelLanguage(this.editor.getModel(), newVal)
      }
    },
    theme(newVal) {
      monaco.editor.setTheme(newVal)
    },
    readOnly(newVal) {
      if (this.editor) {
        this.editor.updateOptions({ readOnly: newVal })
      }
    },
    highlightLines: {
      handler(newVal) {
        this.updateHighlight(newVal)
      },
      deep: true
    },
    scrollToLine(newVal) {
      if (newVal && this.editor) {
        this.editor.revealLineInCenter(newVal)
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeDestroy() {
    this.disposeEditor()
  },
  methods: {
    /**
     * 初始化编辑器
     */
    initEditor() {
      // 设置主题
      monaco.editor.setTheme(this.theme)

      // 创建编辑器
      this.editor = monaco.editor.create(this.$refs.editor, {
        value: this.value,
        language: this.language,
        theme: this.theme,
        readOnly: this.readOnly,
        minimap: { enabled: this.minimap },
        fontSize: this.fontSize,
        tabSize: this.tabSize,
        wordWrap: this.wordWrap ? 'on' : 'off',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        folding: true,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        padding: { top: 10, bottom: 10 }
      })

      // 内容变化事件
      this.editor.onDidChangeModelContent(() => {
        const value = this.editor.getValue()
        this.$emit('input', value)
        this.$emit('change', value)
      })

      // 高亮指定行
      if (this.highlightLines && this.highlightLines.length > 0) {
        this.$nextTick(() => {
          this.updateHighlight(this.highlightLines)
        })
      }

      // 滚动到指定行
      if (this.scrollToLine) {
        this.$nextTick(() => {
          this.editor.revealLineInCenter(this.scrollToLine)
        })
      }
    },

    /**
     * 更新高亮行
     */
    updateHighlight(lines) {
      if (!this.editor || !lines || lines.length === 0) {
        this.decorations = this.editor.deltaDecorations(this.decorations, [])
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

      this.decorations = this.editor.deltaDecorations(this.decorations, newDecorations)
    },

    /**
     * 获取编辑器内容
     */
    getValue() {
      return this.editor ? this.editor.getValue() : ''
    },

    /**
     * 设置编辑器内容
     */
    setValue(value) {
      if (this.editor) {
        this.editor.setValue(value)
      }
    },

    /**
     * 滚动到指定行
     */
    revealLine(line) {
      if (this.editor && line) {
        this.editor.revealLineInCenter(line)
      }
    },

    /**
     * 聚焦编辑器
     */
    focus() {
      if (this.editor) {
        this.editor.focus()
      }
    },

    /**
     * 销毁编辑器
     */
    disposeEditor() {
      if (this.editor) {
        this.editor.dispose()
        this.editor = null
      }
    },

    /**
     * 调整编辑器大小
     */
    layout() {
      if (this.editor) {
        this.editor.layout()
      }
    }
  }
}
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

/* 高亮行样式 */
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
