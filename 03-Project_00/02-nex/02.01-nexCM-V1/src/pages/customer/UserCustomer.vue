<template>
  <div class="user-customer">
    <!-- 1. 搜索栏 v-model="inputValue"表示为:value="inputValue" @input="inputValue = $event"-->
    <SearchBar
      :serverTableData="tableData"
      v-model="inputValue"
      :dropDownOptions="dropDownOptions"
      :dropDownValue.sync="currentDropVal"
      placeholder="请输入内容"
      @search="onSearchBar_BTN_Search"
      @reset="onSearchBar_BTN_Reset"
    >
      <!-- 右侧操作按钮 -->
      <template #actions>
        <!-- 新增客户信息按钮 -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click="onSearchBar_BTN_Add_onTable_Edit({})">
          新增客户
        </el-button>
        <!-- 通过表格导入数据按钮 -->
        <el-button type="info" size="small" icon="el-icon-upload2" @click="importVisible = true"> 导入 </el-button>
        <!-- 将数据导出按钮 -->
        <ExportButton :loading="exportLoading" @click="onSearchBar_BTN_Export" />
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
      @page-change="loadServerCustomerInfo"
      @size-change="onShowTableSizeChange"
      @selection-change="onShowTableSelectionChange"
      @sort-change="onShowTableSortChange"
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
        <el-button size="mini" type="text" @click="onSearchBar_BTN_Add_onTable_Edit(row)">编辑</el-button>
        <el-button size="mini" type="text" style="color: #f56c6c" @click="onShowTableDeleteOne(row)"> 删除 </el-button>
      </template>
    </ShowTable>

    <!-- 3. 新增/编辑弹窗 -->
    <AddDialog
      v-model="dialogVisible"
      :editData="currentRow"
      :loading="submitLoading"
      @submit="onAddDialogSubmit"
      @close="onAddDialogClose"
    >
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
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户代表" prop="agent">
          <el-input v-model="form.agent" placeholder="请输入客户代表"></el-input>
        </el-form-item>
      </el-form>
    </AddDialog>

    <!-- 4. 导入弹窗 -->
    <ImportDialog v-model="importVisible" :loading="importLoading" @confirm="onImportDialogImport" />
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
      // SearchBar - 下拉菜单 选项
      dropDownOptions: [
        { id: "001", value: "客户姓名", keyValue: "name", placeholder: "请输入姓名" },
        { id: "002", value: "客户代表", keyValue: "agent", placeholder: "请输入姓名" }
      ],
      // SearchBar - 下拉菜单 选中内容
      currentDropVal: "",
      // SearchBar - 搜索框 当前内容
      inputValue: "",
      // ShowTable - 从服务器获取到的数据
      tableData: [],
      // ShowTable - 从服务器获取到的数据总数
      totalData: 0,
      // ShowTable - 加载状态 变量
      tableLoading: false,
      // ShowTable - 分页/当前页 参数变量
      currentPage: 1,
      // ShowTable - 分页 可用参数变量
      pageSizes: [10, 20, 30, 50],
      // ShowTable - 分页/当前页 本地存储
      pageSize: Number(localStorage.getItem(SESSIONSTORAGE_KEYS.STORAGE_PAGE_SIZE_KEY)) || 10,
      //  ShowTable - 当前选中的行数
      selectedRows: [],
      // ShowTable - 当前行信息 只读属性，不可修改
      currentRow: null,

      // SearchBar/ShowTable 新增/编辑 用户界面
      dialogVisible: false,
      // SearchBar/ShowTable 新增/编辑 当前编辑行表单，表单编辑副本
      form: {},
      // SearchBar/ShowTable 新增/编辑 form 原始备份，弹窗打开那一刻复制一份原始数据
      originForm: null,
      // SearchBar/ShowTable 新增/编辑 表单验证规则
      rules: {
        name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入客户电话", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的11位手机号码",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "请选择客户性别", trigger: "change" }],
        agent: [{ required: true, message: "请输入客户代表姓名", trigger: "blur" }]
      },

      // SearchBar/ShowTable 新增/编辑  提交ing
      submitLoading: false,

      // ImportDialog - 导入窗口 显示或隐藏
      importVisible: false,
      // ImportDialog - 导入窗口 进行中或空闲中
      importLoading: false,
      // ExportDialog - 导入窗口 进行中或空闲中
      exportLoading: false
    };
  },
  computed: {
    //  MainPage - 菜单栏是否被折叠变量获取
    ...mapState("navCollapse", ["isCollapse"])
  },
  watch: {
    // MainPage - 菜单栏是否被折叠变量监控
    isCollapse() {
      this.$nextTick(() => {
        this.$refs.showTable?.doLayout();
      });
    }
  },
  methods: {
    /**
     * GeneralMethod - 通过提供的信息获取到对应加载表里里面的具体哪一条对象信息
     * @param currentDropVal 下拉框当前选项
     * @param dictionary 查询下拉框当前选项对应是id还是name
     */
    getFieldByDropList(currentDropVal = this.currentDropVal, dictionary = this.dropDownOptions) {
      // 通过字典查询 keyValue
      const keyValueTemp = dictionary.find((item) => item.value === currentDropVal);
      const keyValue = keyValueTemp ? keyValueTemp.keyValue : "";
      return keyValue;
      // console.log("找到的下拉框字段为：", keyValue);
    },
    // MainPage - 数据加载
    async loadServerCustomerInfo() {
      this.tableLoading = true;
      // console.log("获取到的表格数据：", this.tableData);
      // 获取下拉列表字段
      const field = this.getFieldByDropList();

      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.inputValue,
          field: field
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

    // SearchBar - 对搜索框内的内容进行搜索，inputValue搜索框输入值
    onSearchBar_BTN_Search(inputValue) {
      this.inputValue = inputValue;
      this.currentPage = 1;
      this.loadServerCustomerInfo();
    },

    // SearchBar - 对搜索框内的内容进行重置
    onSearchBar_BTN_Reset() {
      this.inputValue = "";
      this.currentPage = 1;
      this.loadServerCustomerInfo();
    },

    // ShowTable - 分页参数修改
    onShowTableSizeChange(size) {
      this.pageSize = size;
      localStorage.setItem(SESSIONSTORAGE_KEYS.STORAGE_PAGE_SIZE_KEY, size);
      this.currentPage = 1;
      this.loadServerCustomerInfo();
    },

    // ShowTable - 选中表格单行
    onShowTableSelectionChange(selection) {
      this.selectedRows = selection;
      console.log("主界面中选中的行数数据：", this.selectedRows);
    },

    // ShowTable - 用户点击重新排序
    onShowTableSortChange(sortInfo) {
      console.log("主界面中选中的行数数据：", sortInfo);
    },

    // SearchBar/ShowTable - 新增/编辑窗口打开
    onSearchBar_BTN_Add_onTable_Edit(row) {
      this.dialogVisible = true;

      // 在编辑模式下
      if (row) {
        this.currentRow = row;
        // 将当前行数据展开给form
        this.form = { ...row };
        this.originForm = JSON.parse(JSON.stringify(row));
        // console.log("点击编辑的变量this.form,", this.form);
      }
      // 在新增模式下
      else {
        this.currentRow = null;
        this.form = { name: "", phone: "", sex: "", agent: "" };
        this.originForm = JSON.parse(JSON.stringify(this.form));
      }
      // clearValidate为表单内置方法，用于清除表单残留验证提示红字
      this.$nextTick(() => {
        this.$refs.customerForm.clearValidate();
      });
    },
    //  SearchBar/ShowTable - 点击提交按钮
    async onAddDialogSubmit({ isEdit }) {
      // 表单校验
      try {
        await this.$refs.customerForm.validate();
      } catch {
        return;
      }
      // 对比 当前form 和 originForm，完全相等就直接return，不提交
      const now = JSON.stringify(this.form);
      const old = JSON.stringify(this.originForm);
      if (now === old) {
        this.$message.info("数据未发生修改，无需保存");
        return;
      }

      this.submitLoading = true;
      try {
        // 如果是编辑客户信息
        if (isEdit) {
          const loadEditForm = {
            ...this.form,
            sex: this.form.sex === "女" ? 0 : 1
          };
          await requestUpdateCustomerApi(this.form.id, loadEditForm);
          this.$message.success("编辑成功");
        }
        // 如果是新增客户信息
        else {
          const loadCreateForm = {
            ...this.form,
            sex: this.form.sex === "女" ? 0 : 1
          };
          console.log("需要新增的客户信息：", loadCreateForm);

          await requestAddCustomerApi(loadCreateForm);
          this.$message.success("新增成功");
        }
        this.dialogVisible = false;
        this.loadServerCustomerInfo();
      } finally {
        this.submitLoading = false;
      }
    },
    // SearchBar/ShowTable - 点击关闭按钮
    onAddDialogClose() {
      this.dialogVisible = false;
      this.currentRow = null;
      this.originForm = null;
      // clearValidate为表单验证提示红字清空，否则会残留在界面
      this.$nextTick(() => {
        // && 表示短路运算，如果 this.$refs.customerForm 已经销毁，后面就不再运算
        this.$refs.customerForm && this.$refs.customerForm.clearValidate();
      });
    },
    // ShowTable - 单行删除
    onShowTableDeleteOne(row) {
      this.$confirm("确认删除该客户？", "提示", {
        type: "warning"
      })
        .then(async () => {
          await requestDeleteCustomerApi(row.id);
          this.$message.success("删除成功");
          this.loadServerCustomerInfo();
        })
        .catch(() => {});
    },

    // SearchBar - 导入按钮
    async onImportDialogImport(file) {
      this.importLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        await requestImportCustomerApi(formData);
        this.$message.success("导入成功");
        this.importVisible = false;
        this.loadServerCustomerInfo();
      } finally {
        this.importLoading = false;
      }
    },
    // SearchBar - 导出按钮
    async onSearchBar_BTN_Export() {
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
    }
  },
  created() {
    // MainPage - 被创建后初始化
    if (this.dropDownOptions.length > 0) {
      this.currentDropVal = this.dropDownOptions[0].value;
    }
    this.loadServerCustomerInfo();
  }
};
</script>

<style scoped lang="less">
.user-customer {
  padding: 15px;
}
</style>
