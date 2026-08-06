<template>
  <el-dialog
    title="导入数据"
    :visible.sync="innerVisible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-upload
      ref="upload"
      drag
      action="#"
      :auto-upload="false"
      :limit="1"
      :on-change="handleFileChange"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :accept="accept"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">支持 {{ acceptText }} 格式，文件大小不超过 100MB</div>
    </el-upload>

    <div slot="footer">
      <el-button type="info" @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm"> 开始导入 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ImportDialog",
  props: {
    // 父组件通过 v-model 传递过来的value
    value: Boolean,
    loading: Boolean,
    // 允许的文件类型
    accept: {
      type: String,
      default: ".xlsx,.xls,.csv"
    },
    acceptText: {
      type: String,
      default: "xlsx/xls/csv"
    }
  },
  data() {
    return {
      innerVisible: this.value,
      fileList: []
    };
  },
  watch: {
    // 监控父组件通过 v-model 传递过来的数据
    value(val) {
      this.innerVisible = val;
      // 如果父组件通知不显示，那么数据即可清空
      if (!val) {
        this.fileList = [];
      }
    }
  },
  methods: {
    handleFileChange(file) {
      this.fileList = [file];
    },
    handleExceed() {
      this.$message.warning("只能上传一个文件，请先删除已选文件");
    },
    // 弹窗关闭处理
    handleClose() {
      this.innerVisible = false;
      // 绑定父组件 v-model 自定义事件，将父组件的importVisible同步变更
      this.$emit("input", false);
    },
    handleConfirm() {
      if (this.fileList.length === 0) {
        this.$message.warning("请先选择要导入的文件");
        return;
      }
      // 把原始 File 对象抛给父页面，父页面自己调上传接口
      this.$emit("confirm", this.fileList[0].raw);
    },
    // 给父页面调用：清空文件列表
    clearFiles() {
      this.fileList = [];
      this.$refs.upload.clearFiles();
    }
  }
};
</script>
