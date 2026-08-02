<template>
  <div class="hello">
    <h3>Uploading Files Tool Page</h3>
    <el-upload
      class="upload-demo"
      action="#"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传服务</el-button>
      <div slot="tip" class="el-upload__tip">只能上传小型文件，不要超过500kb</div>
    </el-upload>
    <div class="files-download">
      <el-dropdown style="margin-top: 10px" @command="handleCommand">
        <span class="el-dropdown-link">
          <span class="dropdown-title">{{ dropDownTitle }}</span
          ><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="input.original_name" v-for="input in inputList" :key="input.id"
            ><span class="dropdown-text">{{ input.original_name }}</span></el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button style="margin-left: 10px" size="small" type="warning" @click="downloadFile">下载文件</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      fileList: [],
      // 从服务器获取到的清单
      inputList: [],
      // 下拉框目前的内容，也就是待下载的文件
      dropDownTitle: localStorage.getItem("updownload-test-dropdown-listName") || "下拉菜单"
    };
  },
  methods: {
    // 提交上传服务器
    async submitUpload() {
      if (!this.fileList || this.fileList.length === 0) return this.$message.warning("请先选择文件");

      const formData = new FormData();
      // key 必须是 'file' 如果后端只支持单文件，这里改为 formData.append('file', this.fileList[0].raw) 即可
      this.fileList.forEach((fileItem) => {
        formData.append("file", fileItem.raw);
      });
      try {
        console.log("发送的数据：", formData);

        // 假设后端运行在 3000 端口 api 本地接口为api/upload-local，网络接口为api/upload-cloud
        const res = await axios.post("http://localhost:3000/api/upload-local", formData);
        if (res.data.code === 200) {
          this.$message.success("上传成功" + res.data.data);
          this.fileList = [];
        }
      } catch (err) {
        this.$message.error("上传失败" + err);
      }
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(_, fileList) {
      this.fileList = fileList;
    },
    // 移除文件时
    handleRemove(_, fileList) {
      this.fileList = fileList;
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log("预览文件:", file);
    },
    // 文件数量超限
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 文件上传之前的钩子
    beforeUpload(file) {
      console.log("我是即将被上传的文件：", file.name);
    },
    // 移除之前的钩子
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？共选择了 ${fileList.length} 个文件`);
    },
    // 点击下拉框的方法
    handleCommand(command) {
      this.dropDownTitle = command;
      localStorage.setItem("updownload-test-dropdown-listName", this.dropDownTitle);
    },
    // 下载指定文件方法
    async downloadFile() {
      console.log("inputList:", this.inputList, "dropDownTitle", this.dropDownTitle);
      for (let index = 1; index <= this.inputList.length; index++) {
        if (this.inputList[index - 1].original_name === this.dropDownTitle) {
          //下载文件不用axios.get请求，直接原生打开网页
          window.open(`http://localhost:3000/api/download/${index}`, "_blank");
        } else {
          this.$message.warning("请先选择正确文件");
        }
      }
    }
  },
  async created() {
    try {
      // 组件创建后，从服务器获取文件清单
      const filesRes = await axios.get("http://localhost:3000/api/download/lists");
      console.log("filesRes:", filesRes);

      if (filesRes.data.code === 200) {
        this.inputList = filesRes.data.data || [];
        const storageStr = localStorage.getItem("updownload-test-dropdown-listName") || "";
        const index = this.inputList.findIndex((item) => {
          return item.original_name === storageStr;
        });
        if (index === -1) {
          localStorage.removeItem("updownload-test-dropdown-listName");
          this.dropDownTitle = "下拉菜单";
        }
      }
    } catch (error) {
      console.error("获取文件清单失败:", error);
    }
  }
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

::v-deep .dropdown-text {
  display: inline-block;
  /* 限制最大宽度，大约刚好能显示5个中文字符 */
  font-size: 0.6rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
::v-deep .dropdown-title {
  display: inline-block;
  /* 限制最大宽度，大约刚好能显示5个中文字符 */
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
