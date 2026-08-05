<template>
  <div class="search-bar">
    <!-- 左侧搜索区 -->
    <div class="search-bar-left">
      <!-- 下拉框选择 -->
      <el-select
        size="small"
        style="width: 110px"
        v-model="innerDropVal"
        placeholder="请选择"
        @change="handleDropChange"
      >
        <el-option v-for="item in dropDownOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <!-- 默认搜索框，可通过 v-model 绑定关键字 -->
      <el-input
        size="small"
        ref="elInut"
        v-if="showSearch"
        v-model="inputValue"
        :placeholder="getSearchPlaceHolder"
        clearable
        style="width: 180px; margin-right: 10px"
        @keyup.enter.native="handleSearch"
        @clear="handleClear"
      >
        <i class="el-icon-search el-input__icon" slot="suffix" @click="handleSearch"></i>
      </el-input>

      <!-- 自定义筛选插槽：业务页面塞下拉、日期等 -->
      <slot name="filters"></slot>
      <el-button size="small" v-if="showSearch" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button size="small" v-if="showSearch && showReset" type="danger" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
    </div>
    <!-- 右侧操作区插槽：放新增、导入、导出按钮 -->
    <div class="search-bar-right">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  components: {},
  data() {
    return {
      // 输入框内的候选内容字符串
      inputValue: this.value,
      // 内部变量，承接props下拉值
      innerDropVal: this.dropDownValue
    };
  },
  props: {
    // 下拉菜单的可选项
    dropDownOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    // 下拉菜单的默认值
    dropDownValue: {
      type: String,
      default: ""
    },
    // 从服务器获取到的表格显示内容
    serverTableData: {
      type: Array,
      //  prop 默认值是数组 / 对象，必须用函数返回，防止组件实例之间数据污染！
      default() {
        return [];
      }
    },
    // 从父组件v-model传递过来的 value 值
    value: {
      type: String,
      default: ""
    },
    // 输入框的 placeholder
    placeholder: {
      type: String,
      default: "请输入关键词搜索"
    },
    // 父组件传递过来用于判断是否显示搜索框
    showSearch: {
      type: Boolean,
      default: true
    },
    // 父组件传递过来用于判断是否显示重置按钮
    showReset: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    // 监控输入框的输入值，一旦有变化，更新本组件内部的inputValue
    value(val) {
      this.inputValue = val;
    },
    // 下拉框的变更
    dropDownValue(val) {
      this.innerDropVal = val;
    }
  },
  computed: {
    // 通过识别下拉框内容设置placeHolder内容
    getSearchPlaceHolder() {
      let item = this.dropDownOptions.find((i) => i.value === this.dropDownValue);
      return item?.placeholder || "请输入内容";
    }
  },
  methods: {
    // 下拉切换触发
    handleDropChange(val) {
      this.innerDropVal = val;
      // 核心！通知父组件更新 dropDownValue.sync依靠这个事件
      console.log("val", val);

      this.$emit("update:dropDownValue", val);
    },

    // 当按下键盘或者清空时触发
    handleSearch() {
      this.$emit("input", this.inputValue);
      this.$emit("search", this.inputValue);
    },
    // 当按下搜索框的清空按键
    handleClear() {
      this.inputValue = "";
      this.$emit("input", this.inputValue);
      this.handleSearch();
    },
    // 当按下重置按钮后触发
    handleReset() {
      // 清空搜索框内容
      this.inputValue = "";
      if (this.dropDownOptions.length > 0) {
        this.innerDropVal = this.dropDownOptions[0].value;
        this.$emit("update:dropDownValue", this.innerDropVal);
      }
      // 清空父组件对应的@input的value
      this.$emit("input", "");
      // 清空父组件对应的@reset方法
      this.$emit("reset");
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;

  &-left {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow-x: auto; //空间不足 横向滚动，禁止换行下移
    flex-shrink: 1;
    flex-grow: 1;
    padding-bottom: 4px;
    min-height: 36px;
  }
  &-right {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    flex-shrink: 0; // 右侧新增/导入导出按钮，禁止被压缩，永远不换行错位
  }
}
</style>
