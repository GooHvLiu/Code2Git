<template>
  <div id="app">
    <div class="todo-page">
      <div class="todo-container">
        <UserHeader v-on:isAddTodo="isAddTodo" />
        <UserLists :todos="todos" />
        <UserFooter
          :todos="todos"
          v-on:isSelectedOrNot="isSelectedOrNot"
          v-on:isClearAllSelected="isClearAllSelected"
          v-show="isShowOrNot"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UserHeader from "./components/UserHeader";
import UserFooter from "./components/UserFooter";
import UserLists from "./components/UserLists";

export default {
  name: "App",
  components: {
    UserHeader,
    UserFooter,
    UserLists
  },
  data() {
    return {
      //初始化时，从本地存储中读取数据
      todos: JSON.parse(localStorage.getItem("todos")) || []
    };
  },
  computed: {
    //todo事项 检测是否为空，如果为空，则不展示UserFooter.vue组件
    isShowOrNot() {
      if (this.todos.length === 0) {
        return false;
      }
      return true;
    }
  },
  methods: {
    //todo事项 添加
    isAddTodo(todoObj) {
      if (!todoObj) {
        alert("输入数据不能为空");
        return;
      }
      this.todos.unshift(todoObj);
    },
    //todo事项 被选中或取消
    isCheckedOrNot(todoId) {
      this.todos.forEach((todo) => {
        if (todo.id == todoId) {
          todo.done = !todo.done;
        }
      });
    },
    //todo事项 被删除
    isDeletedTodo(todoId) {
      this.todos = this.todos.filter((todo) => {
        return todo.id != todoId;
      });
    },
    //todo事项 被全选或全部选
    isSelectedOrNot(isSelectedStutas) {
      //isSelectedStutas与todo.done做匹配绑定
      this.todos.forEach((todo) => {
        todo.done = isSelectedStutas;
      });
    },
    //todo事项 全部删除选中事项
    isClearAllSelected() {
      if (confirm("您确定要删除么？")) {
        this.todos = this.todos.filter((todo) => {
          return !todo.done;
        });
      }
    }
  },
  watch: {
    /* //将用户输入数据存储在本地，使用本地存储方案，浅层监视无法实现监视对象内部属性
    todos(newvalue) {
      localStorage.setItem("todos", JSON.stringify(newvalue));
    } */

    //将用户输入数据存储在本地，使用本地存储方案，深度监视实现监视对象内部属性
    todos: {
      deep: true,
      handler(value) {
        localStorage.setItem("todos", JSON.stringify(value));
      }
    }
  },
  //通过创建自定义事件，实现总线通讯
  mounted() {
    this.$bus.$on("isCheckedOrNot", this.isCheckedOrNot);
    this.$bus.$on("isDeletedTodo", this.isDeletedTodo);
  },
  //在创建组件销毁前进行注销全局总线
  beforeDestroy() {
    this.$bus.$off("isCheckedOrNot");
    this.$bus.$off("isDeletedTodo");
  }
};
</script>

<style>
/* base css sets */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  background: #fff;
  font-size: 14px;
}
ul {
  list-style: none;
}
.btn {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin-bottom: 0;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.btn:focus {
  outline: none;
}
.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}
.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}
.todo-page {
  width: 600px;
  margin: 0 auto;
}
.todo-page .todo-container {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
