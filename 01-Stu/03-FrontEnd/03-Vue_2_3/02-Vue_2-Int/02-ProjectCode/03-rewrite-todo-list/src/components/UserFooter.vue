<template>
  <!-- 页脚显示 -->
  <div class="todo-footer">
    <label>
      <input
        type="checkbox"
        name=""
        id=""
        :checked="isAll"
        @change="SelectedAllOrNot"
      />
    </label>
    <span>
      <span>已完成 {{ isDoneCounts }} 条</span> /共 {{ TotalCounts }} 条</span
    >
    <button class="btn btn-danger" @click="clearAllSelected">
      清除已完成任务
    </button>
  </div>
</template>

<script>
export default {
  name: "UserFooter",
  computed: {
    // 计算当前一共多少条待办事项
    TotalCounts() {
      return this.todos.length;
    },
    // 计算当前一共多少条已完成待办事项
    isDoneCounts() {
      let todoCounts = 0;
      this.todos.forEach((todo) => {
        if (todo.done) {
          todoCounts++;
        }
      });
      return todoCounts;
    },
    // 通过checked属性进行计算赋值
    isAll() {
      return this.TotalCounts === this.isDoneCounts;
    }
  },

  methods: {
    //全部选中或者全部取消选中
    SelectedAllOrNot(e) {
      this.isSelectedOrNot(e.target.checked);
    },
    //清除全部选中待办事项
    clearAllSelected() {
      this.isClearAllSelected();
    }
  },
  props: ["todos", "isSelectedOrNot", "isClearAllSelected"]
};
</script>

<style scoped>
/*footer css sets*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}
.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}
.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}
.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>
