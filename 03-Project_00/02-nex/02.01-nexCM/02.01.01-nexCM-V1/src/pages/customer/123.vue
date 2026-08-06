<template>
  <div class="UserCustomer">
    <div class="table-header-bar">
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="inputValue"
        :fetch-suggestions="querySearch"
        placeholder="请输入客户名称或电话"
        @select="handleSelect"
      >
        <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick"> </i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.name }}</div>
          <span class="phone">{{ item.phone }}</span>
        </template>
      </el-autocomplete>
    </div>
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
        <el-table-column sortable prop="agent" label="客户代表"> </el-table-column>
        <el-table-column sortable label="录入日期">
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
      // 客户信息表格数据
      tableData: [],
      // 搜索框内信息
      inputValue: ""
    };
  },
  computed: {
    // 从state中获取到 navCollapse 变量
    ...mapState("navCollapse", ["isCollapse"])
  },
  watch: {},
  methods: {
    // 表格 - 选择改变后的方法
    handleSelectionChange() {},
    // 表格 - rowIndex 表示第几行，从 0 行开始；rowData 表示对应的数据
    handleEdit(rowIndex, rowData) {
      console.log("@handleEdit@rowIndex", rowIndex, "---", "@handleEdit@rowData", rowData);
    },
    // 表格 - rowIndex 表示第几行，从 0 行开始；rowData 表示对应的数据
    handleDelete(rowIndex, rowData) {
      console.log("@handleDelete@rowIndex", rowIndex, "---", "@handleDelete@rowData", rowData);
    },

    // 表格 - 封装 request 方法 params={ page: 1, pageSize: 50 }
    async requestLoadTableData() {
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      };
      const customerData = await requestGetCustomerListApi(params);
      // console.log("customerData", customerData);

      // 将远程获取到的数据总数传递给 totalData
      this.totalData = customerData.data.total;

      // 将远程获取到的数据转换为表格显示的变量 tableData
      this.tableData = customerData.data.list.map((item) => {
        return {
          name: item.name,
          phone: item.phone,
          sex: item.sex === 1 ? "男" : "女",
          agent: item.agentName,
          date: item.entry_time
        };
      });
      // console.log("表格显示的内容：", this.tableData);

      // 方法在 mixin.js 中数据刷新后重绘表格
      this.refreshTableLayout();
    },

    // 输入框 - 返回输入建议的方法，仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它
    // queryString:输入的内容
    // cb:回调函数，即slot-scope="{ item }"里面的item
    querySearch(queryString, cb) {
      // 将从服务器获取的表格数据提取出来处理
      var tableData = this.tableData;
      // 输入框下拉菜单清单的获取
      var inputDropdownList = queryString ? tableData.filter(this.createFilter(queryString)) : tableData;
      // 调用 callback 返回建议列表的数据
      cb(inputDropdownList);
    },

    // 输入框 -  返回一个回调函数进行数据处理
    createFilter(queryString) {
      // 返回一个回调函数，用于调用这个函数的数组的单个数值与输入的数值是否匹配
      return (tableData) => {
        return tableData.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    // 输入框 - 选中下拉菜单内的信息后的方法
    handleSelect(item) {
      this.inputValue = item.name;
      console.log("~~开始检索并显示:", item.name);
    },
    // 输入框 - 点击搜索图标后的方法
    handleIconClick(ev) {
      console.log("ev", ev);
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
  .table-header-bar {
    margin-left: -10px;
  }
  .table {
    width: 100%;
    min-width: 0;
  }
  .page-list {
    justify-self: start;
  }
}
</style>
<style lang="less">
.my-autocomplete {
  width: 500px;
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .phone {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
</style>
