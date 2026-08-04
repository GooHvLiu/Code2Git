<template>
  <div class="search-bar">
    <!-- 左侧搜索区 -->
    <div class="search-bar-left">
      <el-select v-model="innerDropVal" placeholder="请选择" @change="handleDropChange">
        <el-option v-for="item in dropDownOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- 默认搜索框，可通过 v-model 绑定关键字 -->
      <el-autocomplete
        popper-class="my-autocomplete"
        v-if="showSearch"
        v-model="inputValue"
        :placeholder="getSearchPlaceHolder"
        clearable
        style="width: 280px; margin-right: 10px"
        @keyup.enter.native="handleSearch"
        @clear="handleSearch"
      >
        <i slot="suffix" class="el-icon-search el-input__icon" @click="handleSearch"></i>
      </el-autocomplete>
      <!-- 自定义筛选插槽：业务页面塞下拉、日期等 -->
      <slot name="filters"></slot>
      <el-button v-if="showSearch" type="primary" icon="el-icon-search" @click="handleSearch"> 搜索 </el-button>
      <el-button v-if="showSearch && showReset" type="danger" icon="el-icon-refresh" @click="handleReset">
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
    // 父组件修改dropDownValue，同步更新子组件内部
    dropDownValue(val) {
      this.innerDropVal = val;
    },
    // 监控输入框的输入值，一旦有变化，更新本组件内部的inputValue
    value(val) {
      this.inputValue = val;
    }
  },
  computed: {
    // 通过识别下拉框内容设置placeHolder内容
    getSearchPlaceHolder() {
      let idx = this.dropDownOptions.findIndex((item) => item.value === this.dropDownValue);
      if (idx != -1) {
        let placeHolderValue = this.dropDownOptions[idx].placeholder;
        return placeHolderValue;
      } else {
        return "请输入内容";
      }
    }
  },
  methods: {
    // 下拉切换触发
    handleDropChange(val) {
      this.innerDropVal = val;
      // 核心！通知父组件更新 currentDropVal，.sync依靠这个事件
      this.$emit("update:dropDownValue", val);
    },
    // 当按下键盘或者清空是触发
    handleSearch() {
      this.$emit("input", this.inputValue);
      this.$emit("search", this.inputValue);
    },
    // 当按下重置按钮后触发
    handleReset() {
      this.inputValue = "";
      this.$emit("input", "");
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
    flex-wrap: wrap;
    gap: 10px;
  }
  &-right {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }
}
</style>
<style lang="less">
.my-autocomplete {
  width: 500px;

  .el-autocomplete-suggestion__list li {
    line-height: normal;
    padding: 7px;
    .name {
      font-size: 11px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .phone {
      font-size: 14px;
      color: #b4b4b4;
    }
  }
}
</style>
