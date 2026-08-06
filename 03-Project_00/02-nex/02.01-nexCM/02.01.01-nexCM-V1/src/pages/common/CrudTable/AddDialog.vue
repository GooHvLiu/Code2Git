<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="innerVisible"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="!loading"
    @close="handleClose"
  >
    <div class="add-dialog-content">
      <!-- 表单内容插槽：业务页面自己写 el-form -->
      <slot></slot>
    </div>
    <!-- 把这个 div，放进【el-dialog 组件内置的原生 footer 插槽】里面渲染 -->
    <div slot="footer">
      <el-button :disabled="loading" @click="handleClose">取 消</el-button>
      <!-- <el-button @click="test">test</el-button> -->
      <el-button type="primary" :loading="loading" @click="handleSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AddDialog",
  // 配置 model 后， v-model 传入的参数就是 visible ，不是value，对应的出发事件不是 put ，而是update:visible
  model: {
    prop: "visible",
    event: "update:visible"
  },
  props: {
    // 配置 model 后 v-model 控制显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗标题（不传则自动显示 新增/编辑）
    title: {
      type: String,
      default: ""
    },
    // 编辑时传入的行数据
    editData: {
      type: Object,
      default: null
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "600px"
    },
    // 提交状态 loading
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否可见控制变量
      innerVisible: this.visible,
      // 当前新增或修改之后的表单
      form: {}
    };
  },
  computed: {
    isEdit() {
      return !!(this.editData && Object.keys(this.editData).length > 0);
    },
    // 增加弹窗标题
    dialogTitle() {
      if (this.title) return this.title;
      return this.isEdit ? "编辑" : "新增";
    }
  },
  watch: {
    // 父类传递进来，控制是否显示的变量进行监控
    visible(val) {
      this.innerVisible = val;
      // 只有弹窗打开的时候初始化表单
      if (val) {
        if (this.isEdit) {
          // 编辑模式，拷贝父传过来的数据
          this.form = { ...this.editData };
        } else {
          // 新增模式，清空form
          this.form = {};
        }
      }
    },
    // 正在编辑的数据
    editData(newVal) {
      // 仅弹窗打开，并且是编辑模式才同步
      if (newVal && this.innerVisible) {
        this.form = { ...newVal };
      }
    }
  },
  methods: {
    // 测试使用
    /* test() {
      // console.log("当前弹出窗口的editData：", this.editData);
    }, */
    // 关闭弹窗
    handleClose() {
      this.innerVisible = false;
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    // 数据提交submit
    handleSubmit() {
      // 把表单数据抛给父页面，父页面自己做校验和调 API
      // console.log("form:", this.form, "isEdit:", this.isEdit);
      this.$emit("submit", {
        isEdit: this.isEdit
      });
    },
    // 给父页面调用：手动设置表单数据
    setForm(data) {
      this.form = { ...data };
    }
  }
};
</script>

<style scoped lang="less">
.add-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
