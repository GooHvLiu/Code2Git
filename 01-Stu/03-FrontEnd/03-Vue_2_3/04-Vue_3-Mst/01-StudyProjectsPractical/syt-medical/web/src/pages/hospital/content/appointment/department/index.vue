<template>
  <div class="page-wrap">
    <el-row>
      <!-- 左侧部分 class='el-col-3' -->
      <el-col :span="3">
        <!-- 左侧的一级科室菜单 -->
        <el-menu text-color="#717171" :default-active="activeDepCode" active-text-color="black" @select="handleSelect">
          <!-- 子菜单科室名称 -->
          <el-menu-item v-for="deptArr in useStore_HosDepartment.hospitalDepartment" :index="deptArr.depcode">
            <span>{{ deptArr.depname }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <!-- 右侧部分 class='el-col-21' -->
      <el-col :span="21">
        <!-- 右侧的具体科室是通过当前是否有活跃一级科室决定的 -->
        <div v-if="activeDepCode" :key="activeDepCode">
          <!-- 展示当前选中的一级科室的名字 -->
          <h3 class="dept-title">{{ currentDept?.depname }}</h3>
          <!-- 渲染实际的子科室的名称 -->
          <div class="dept-child-list">
            <div class="dept-item" v-for="child in currentDept?.children" :key="child.depcode">
              {{ child.depname }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Department" });
// 导入 医院部门的 Store
import { useHospitalDepartmentStore } from "@/stores";
const useStore_HosDepartment = useHospitalDepartmentStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { computed, ref } from "vue";

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 创建菜单中子菜单活跃挂载的类变量
let activeDepCode = ref<string>("");

// 计算属性
// const computedVal = computed(() => {})
// 通过 activeDepCode 是否有值计算当前被选中的一级科室 currentDept
const currentDept = computed(() => {
  return useStore_HosDepartment.hospitalDepartment?.find((item) => {
    return item.depcode === activeDepCode.value;
  });
});

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
// 当菜单被选中
const handleSelect = (key: string) => {
  // 用于菜单识别当前活跃子菜单标识
  activeDepCode.value = key;
};
</script>

<style scoped lang="less">
.page-wrap {
  margin: 20px 0;
  color: #717171;
  .el-row {
    .el-col-3 {
      .el-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-menu-item {
          padding: 0 30px;
          &:hover {
            color: black;
          }
        }
      }
    }
    .el-col-21 {
      padding-left: 15px;
      h3 {
        background-color: #f8f8f8;
        line-height: 2.5rem;
        font-weight: 800;
      }
      .dept-child-list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        line-height: 2rem;
        div {
          margin: 10px 0;
          &:hover {
            color: orange;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
