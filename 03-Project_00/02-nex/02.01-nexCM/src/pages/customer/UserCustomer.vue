<template>
  <div class="UserCustomer">
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="name" label="客户姓名"> </el-table-column>
        <el-table-column prop="phone" label="客户电话"> </el-table-column>
        <el-table-column prop="sex" label="客户性别"> </el-table-column>
        <el-table-column prop="agent" label="客户代表"> </el-table-column>
        <el-table-column label="录入日期">
          <template slot-scope="scope">{{ scope.row.date | formatDate("YYYY/MM/DD") }}</template>
        </el-table-column>
        <el-table-column label="基本操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-list">
      <el-pagination
        background
        layout="prev,sizes,pager, next"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="totalData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { requestGetCustomerListApi } from "@/common/request/index.js";
// 引入通用分页mixin
import TablePageMixin from "@/common/mixins/tablePage.mixin";

export default {
  name: "UserCustomer",
  mixins: [TablePageMixin],
  components: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    // 从state中获取到 navCollapse 变量
    ...mapState("navCollapse", ["isCollapse"])
  },
  watch: {},
  methods: {
    handleSelectionChange() {},
    // rowIndex 表示第几行，从 0 行开始；rowData 表示对应的数据
    handleEdit(rowIndex, rowData) {
      console.log("@handleEdit@rowIndex", rowIndex, "---", "@handleEdit@rowData", rowData);
    },
    // rowIndex 表示第几行，从 0 行开始；rowData 表示对应的数据
    handleDelete(rowIndex, rowData) {
      console.log("@handleDelete@rowIndex", rowIndex, "---", "@handleDelete@rowData", rowData);
    },

    // 封装 request 方法 params={ page: 1, pageSize: 50 }
    async requestLoadTableData() {
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      };
      const customerData = await requestGetCustomerListApi(params);
      // console.log("customerData", customerData);
      this.totalData = customerData.data.total;
      this.tableData = customerData.data.list.map((item) => {
        return {
          name: item.name,
          phone: item.phone,
          sex: item.sex === 1 ? "男" : "女",
          agent: item.agentName,
          date: item.entry_time
        };
      });
      // 方法在 mixin.js 中数据刷新后重绘表格
      this.refreshTableLayout();
    }
  },
  // 组件创建后即向服务器获取表格数据
  created() {
    this.requestLoadTableData();
  },
  mounted() {},
  beforeDestroy() {}
};
</script>

<style scoped lang="less">
.UserCustomer {
  margin-left: 10px;
  display: grid;
  gap: 15px;
  width: 100%-10px;
  min-width: 970px;
  .table {
    width: 100%;
    min-width: 0;
  }
  .page-list {
    justify-self: start;
  }
}
</style>
