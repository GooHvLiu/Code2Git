<template>
  <div class="user-customer">
    <!-- 1. 搜索栏 v-model="inputValue"表示为:value="inputValue" @input="inputValue = $event"-->
    <SearchBar
      :serverTableData="tableData"
      v-model="inputValue"
      :dropDownOptions="dropDownOptions"
      :dropDownValue.sync="currentDropVal"
      placeholder="请输入内容"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 右侧操作按钮 -->
      <template #actions>
        <!-- 新增客户信息按钮 -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click="searchBarHandleAdd"> 新增客户 </el-button>
        <!-- 通过表格导入数据按钮 -->
        <el-button type="info" size="small" icon="el-icon-upload2" @click="importVisible = true"> 导入 </el-button>
        <!-- 将数据导出按钮 -->
        <ExportButton :loading="exportLoading" @click="handleExport" />
      </template>
    </SearchBar>

    <!-- 2. 数据表格 -->
    <ShowTable
      ref="showTable"
      :table-data="tableData"
      :loading="tableLoading"
      :total="totalData"
      :page.sync="currentPage"
      :page-size.sync="pageSize"
      @page-change="loadTableData"
      @size-change="handleSizeChange"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 业务列定义 -->
      <template #business>
        <el-table-column prop="name" label="客户姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="客户电话" min-width="130"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80"></el-table-column>
        <el-table-column prop="agent" label="客户代表" min-width="120" sortable="custom"></el-table-column>
        <el-table-column prop="date" label="录入日期" min-width="120" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.date | formatDate("YYYY/MM/DD") }}
          </template>
        </el-table-column>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <el-button size="mini" type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button size="mini" type="text" style="color: #f56c6c" @click="handleDelete(row)"> 删除 </el-button>
      </template>
    </ShowTable>

    <!-- 3. 新增/编辑弹窗 -->
    <AddDialog v-model="dialogVisible" :edit-data="currentRow" :loading="submitLoading" @submit="handleSubmit">
      <!-- 客户表单（业务特有） -->
      <el-form :model="form" ref="customerForm" :rules="rules" label-width="90px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入客户电话"></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户代表" prop="agent">
          <el-input v-model="form.agent" placeholder="请输入客户代表"></el-input>
        </el-form-item>
      </el-form>
    </AddDialog>

    <!-- 4. 导入弹窗 -->
    <ImportDialog v-model="importVisible" :loading="importLoading" @confirm="handleImport" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  requestGetCustomerListApi,
  requestAddCustomerApi,
  requestUpdateCustomerApi,
  requestDeleteCustomerApi,
  requestExportCustomerApi,
  requestImportCustomerApi
} from "@/common/request/index.js";
import { SearchBar, ShowTable, AddDialog, ImportDialog, ExportButton } from "../common/index.js";
import { SESSIONSTORAGE_KEYS } from "@/common/constants/storageKey";

export default {
  name: "UserCustomer",
  components: { SearchBar, ShowTable, AddDialog, ImportDialog, ExportButton },
  data() {
    return {
      // 下拉菜单选项
      dropDownOptions: [
        { value: "选项1", label: "客户姓名", placeholder: "请输入客户姓名或电话" },
        { value: "选项2", label: "客户代表", placeholder: "请输入客户代表姓名" }
      ],

      // 当前下拉框选中的内容
      currentDropVal: "",
      // 表格 数据
      tableData: [],
      // 表格 加载状态
      tableLoading: false,
      // 表格 分页
      currentPage: 1,
      pageSizes: [10, 20, 30, 50],
      pageSize: Number(localStorage.getItem(SESSIONSTORAGE_KEYS.STORAGE_PAGE_SIZE_KEY)) || 10,
      totalData: 0,

      // 搜索输入框里面的value
      inputValue: "",

      // 弹窗汇总
      // 新增、编辑用户界面
      dialogVisible: false,
      // 弹窗-导入窗口的显示或隐藏
      importVisible: false,

      // 当前编辑行信息
      currentRow: null,
      // loading
      // 新增或编辑界面的数据正在提交
      submitLoading: false,
      // loading-导出窗口的状态 进行中或空闲中
      exportLoading: false,
      // loading-导入窗口的状态 进行中或空闲中
      importLoading: false,

      // 当前选中的行数
      selectedRows: [],

      // 当前选中的行表单
      form: {},
      rules: {
        name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入客户电话", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("navCollapse", ["isCollapse"])
  },
  watch: {
    isCollapse() {
      this.$nextTick(() => {
        this.$refs.showTable?.doLayout();
      });
    }
  },
  methods: {
    // 数据加载
    async loadTableData() {
      this.tableLoading = true;
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.inputValue
        };
        const res = await requestGetCustomerListApi(params);
        this.totalData = res.data.total;
        this.tableData = res.data.list.map((item) => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          sex: item.sex === 1 ? "男" : "女",
          agent: item.agentName,
          date: item.entry_time
        }));
      } finally {
        this.tableLoading = false;
        this.$nextTick(() => {
          this.$refs.showTable?.doLayout();
        });
      }
    },

    //搜索输入框 - 对搜索框内的内容进行搜索
    handleSearch(inputValue) {
      this.inputValue = inputValue;
      this.currentPage = 1;
      this.loadTableData();
    },

    //搜索输入框 - 对搜索框内的内容进行重置
    handleReset() {
      this.inputValue = "";
      this.currentPage = 1;
      this.loadTableData();
    },

    // ========== 分页 ==========
    handleSizeChange(size) {
      this.pageSize = size;
      localStorage.setItem(SESSIONSTORAGE_KEYS.STORAGE_PAGE_SIZE_KEY, size);
      this.currentPage = 1;
      this.loadTableData();
    },

    // SearchBar - 新增
    searchBarHandleAdd() {
      this.currentRow = null;
      this.form = {};
      this.dialogVisible = true;
    },
    //表格 - 编辑
    handleEdit(row) {
      // console.log("点击编辑的变量row,", row);
      this.currentRow = row;
      this.form = { ...row };
      // console.log("点击编辑的变量this.form,", this.form);
      this.dialogVisible = true;
    },
    // 当用户打开新增或编辑窗口后，点击提交按钮后
    async handleSubmit({ form, isEdit, id }) {
      // 表单校验
      try {
        await this.$refs.customerForm.validate();
      } catch {
        return;
      }

      this.submitLoading = true;
      try {
        if (isEdit) {
          // console.log("用户id", id, "用户信息:", form);
          await requestUpdateCustomerApi(id, form);
          this.$message.success("编辑成功");
        } else {
          await requestAddCustomerApi(form);
          this.$message.success("新增成功");
        }
        this.dialogVisible = false;
        this.loadTableData();
      } finally {
        this.submitLoading = false;
      }
    },
    // SearchBar - 删除
    handleDelete(row) {
      this.$confirm("确认删除该客户？", "提示", {
        type: "warning"
      })
        .then(async () => {
          await requestDeleteCustomerApi(row.id);
          this.$message.success("删除成功");
          this.loadTableData();
        })
        .catch(() => {});
    },

    // 导入
    async handleImport(file) {
      this.importLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        await requestImportCustomerApi(formData);
        this.$message.success("导入成功");
        this.importVisible = false;
        this.loadTableData();
      } finally {
        this.importLoading = false;
      }
    },
    // 导出
    async handleExport() {
      this.exportLoading = true;
      try {
        const res = await requestExportCustomerApi({ keyword: this.inputValue });
        // 文件下载
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `客户列表_${Date.now()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } finally {
        this.exportLoading = false;
      }
    },

    // 选中单行时进行的处理工作
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      console.log("主界面中选中的行数数据：", this.selectedRows);
    },

    // 用户点击重新排序
    handleSortChange(sortInfo) {
      console.log("主界面中选中的行数数据：", sortInfo);
    }
  },
  created() {
    // 页面初始化，默认选中第一条
    if (this.dropDownOptions.length > 0) {
      this.currentDropVal = this.dropDownOptions[0].value;
    }
    this.loadTableData();
  }
};
</script>

<style scoped lang="less">
.user-customer {
  padding: 15px;
}
</style>
