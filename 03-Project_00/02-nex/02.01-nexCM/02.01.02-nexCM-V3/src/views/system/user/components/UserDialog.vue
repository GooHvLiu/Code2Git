<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="560px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form v-if="dialogVisible" ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item
        v-for="field in visibleFields"
        :key="field.prop"
        :label="$t(field.label)"
        :prop="field.prop"
      >
        <!-- 文本输入 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="form[field.prop]"
          :placeholder="$t(field.placeholder)"
          :disabled="field.disabledEdit && isEdit"
          clearable
        />
        <!-- 密码输入 -->
        <el-input
          v-if="field.type === 'password'"
          v-model="form[field.prop]"
          type="password"
          :placeholder="$t(field.placeholder)"
          show-password
          clearable
        />
        <!-- 下拉选择 -->
        <el-select
          v-if="field.type === 'select'"
          v-model="form[field.prop]"
          :placeholder="$t(field.placeholder)"
          style="width: 100%"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- 树形下拉选择（部门） -->
        <el-select
          v-if="field.type === 'treeselect'"
          v-model="form[field.prop]"
          :placeholder="$t(field.placeholder)"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in flatDeptList"
            :key="item.id"
            :label="item.dept_name"
            :value="item.id"
          />
        </el-select>
        <!-- 单选按钮 -->
        <el-radio-group
          v-if="field.type === 'radio'"
          v-model="form[field.prop]"
        >
          <el-radio
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.value"
            >{{ opt.label }}</el-radio
          >
        </el-radio-group>
        <!-- 文本域 -->
        <el-input
          v-if="field.type === 'textarea'"
          v-model="form[field.prop]"
          type="textarea"
          :rows="3"
          :placeholder="$t(field.placeholder)"
          class="fixed-textarea"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">{{ $t("common.cancel") }}</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
        >{{ $t("common.confirm") }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useDict } from "@/composables/useDict";
import { requestAddUserApi, requestUpdateUserApi } from "@/api";
import { requestGetRoleAllApi } from "@/api";
import { requestGetDeptTreeApi } from "@/api";
import { withCache } from "@/utils/cache";
import { getRoleName } from "@/utils/roleMapper";

const emit = defineEmits(["success"]);

// 字典数据
const { dict } = useDict(["user_status", "user_sex", "user_role"]);

// 弹窗状态
const dialogVisible = ref(false);
const submitLoading = ref(false);

// 表单 ref
const formRef = ref(null);

// 角色列表（从角色管理接口获取）
const roleList = ref([]);
// 部门树（从部门管理接口获取）
const deptTree = ref([]);

// 获取默认表单值
function getDefaultForm() {
  return {
    id: null,
    username: "",
    password: "",
    real_name: "",
    sex: 0,
    phone: "",
    email: "",
    dept_id: null,
    role: "operator",
    status: 1,
    remark: "",
  };
}

// 表单数据
const form = reactive(getDefaultForm());
// 表单默认值（用于重置）
const defaultForm = getDefaultForm();

// 是否编辑模式
const isEdit = computed(() => !!form.id);

// 弹窗标题（国际化）
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑用户" : "新增用户";
});

// 角色选项（从角色管理接口获取）
const roleOptions = computed(() => {
  return roleList.value.map((item) => ({
    label: getRoleName(item) || item.role_code,
    value: item.role_code,
  }));
});

// 扁平化的部门列表（树形结构转扁平，用于下拉选择）
const flatDeptList = computed(() => {
  const result = [];
  const flatten = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      result.push({ id: item.id, dept_name: item.dept_name });
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };
  flatten(deptTree.value);
  return result;
});

// 性别选项（从数据字典获取，统一转换为数字类型）
const sexOptions = computed(() => {
  return (dict.value.user_sex || []).map((item) => ({
    ...item,
    value: Number(item.value),
  }));
});

// 状态选项（从数据字典获取，统一转换为数字类型）
const statusOptions = computed(() => {
  return (dict.value.user_status || []).map((item) => ({
    ...item,
    value: Number(item.value),
  }));
});

// 字段配置数组（驱动表单渲染）
const fieldConfig = computed(() => [
  {
    prop: "username",
    label: "menu.system.user.page.username",
    type: "input",
    placeholder: "menu.system.user.page.usernamePlaceholder",
    required: true,
    disabledEdit: true,
  },
  {
    prop: "password",
    label: "menu.system.user.page.password",
    type: "password",
    placeholder: "menu.system.user.page.passwordPlaceholder",
    required: true,
    show: (isEdit) => !isEdit,
  },
  {
    prop: "real_name",
    label: "menu.system.user.page.realName",
    type: "input",
    placeholder: "menu.system.user.page.realNamePlaceholder",
    required: false,
  },
  {
    prop: "sex",
    label: "menu.system.user.page.sex",
    type: "radio",
    required: false,
    options: sexOptions.value,
  },
  {
    prop: "phone",
    label: "menu.system.user.page.phone",
    type: "input",
    placeholder: "menu.system.user.page.phonePlaceholder",
    required: false,
  },
  {
    prop: "email",
    label: "menu.system.user.page.email",
    type: "input",
    placeholder: "menu.system.user.page.emailPlaceholder",
    required: false,
  },
  {
    prop: "dept_id",
    label: "menu.system.user.page.dept",
    type: "treeselect",
    placeholder: "menu.system.user.page.deptPlaceholder",
    required: false,
  },
  {
    prop: "role",
    label: "menu.system.user.page.role",
    type: "select",
    placeholder: "menu.system.user.page.rolePlaceholder",
    required: false,
    options: roleOptions.value,
  },
  {
    prop: "status",
    label: "menu.system.user.page.status",
    type: "radio",
    required: false,
    options: statusOptions.value,
    show: (isEdit) => isEdit,
  },
  {
    prop: "remark",
    label: "menu.system.user.page.remark",
    type: "textarea",
    placeholder: "menu.system.user.page.remarkPlaceholder",
    required: false,
  },
]);

// 根据显示条件过滤后的字段列表
const visibleFields = computed(() => {
  return fieldConfig.value.filter((field) => {
    if (typeof field.show === "function") {
      return field.show(isEdit.value);
    }
    return true;
  });
});

// 表单校验规则（从 fieldConfig 动态生成）
const rules = computed(() => {
  const rules = {};
  fieldConfig.value.forEach((field) => {
    if (field.required) {
      rules[field.prop] = [
        {
          required: true,
          message: field.placeholder || field.label,
          trigger: "blur",
        },
      ];
    }
    // 邮箱格式校验
    if (field.prop === "email") {
      rules[field.prop] = [
        { type: "email", message: "邮箱格式不正确", trigger: "blur" },
      ];
    }
    // 用户名长度校验
    if (field.prop === "username") {
      rules[field.prop] = [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 2, max: 50, message: "用户名长度为2-50个字符", trigger: "blur" },
      ];
    }
    // 密码长度校验（仅新增时）
    if (field.prop === "password" && !isEdit.value) {
      rules[field.prop] = [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 32, message: "密码长度为6-32个字符", trigger: "blur" },
      ];
    }
  });
  return rules;
});

// 加载角色列表（从角色管理接口，带缓存）
async function loadRoleList() {
  try {
    const res = await withCache("user_roleList", () => requestGetRoleAllApi());
    roleList.value = res.data || [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[UserDialog] 加载角色列表失败:", e);
  }
}

// 加载部门树（从部门管理接口，带缓存）
async function loadDeptTree() {
  try {
    const res = await withCache("user_deptTree", () => requestGetDeptTreeApi());
    deptTree.value = res.data || [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[UserDialog] 加载部门树失败:", e);
  }
}

// 打开弹窗
function open(row) {
  dialogVisible.value = true;
  nextTick(() => {
    if (row) {
      // 编辑：回填数据
      Object.assign(form, defaultForm, row);
    } else {
      // 新增：重置表单
      Object.assign(form, defaultForm);
    }
    // 清除表单校验
    formRef.value && formRef.value.clearValidate();
  });
}

// 关闭弹窗
function close() {
  dialogVisible.value = false;
  Object.assign(form, defaultForm);
  formRef.value && formRef.value.clearValidate();
}

// 提交 API（过滤只读字段）
function submitApi(formData) {
  const ALLOWED_FIELDS = [
    "username",
    "password",
    "role",
    "real_name",
    "sex",
    "phone",
    "email",
    "dept_id",
    "avatar",
    "remark",
    "status",
  ];
  const cleanData = {};
  ALLOWED_FIELDS.forEach((key) => {
    if (formData[key] !== undefined) {
      cleanData[key] = formData[key];
    }
  });
  if (formData.id) {
    cleanData.id = formData.id;
  }
  return formData.id
    ? requestUpdateUserApi(cleanData)
    : requestAddUserApi(cleanData);
}

// 提交表单
function handleSubmit() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    submitLoading.value = true;
    try {
      await submitApi(form);
      close();
      emit("success");
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      submitLoading.value = false;
    }
  });
}

onMounted(() => {
  loadRoleList();
  loadDeptTree();
});

// 暴露方法给父组件
defineExpose({
  open,
  close,
});
</script>

<style scoped lang="less">
/* 固定 textarea 高度，禁止拖拽调整大小，内容过多时显示滚动条 */
.fixed-textarea /deep/ .el-textarea__inner {
  resize: none;
  min-height: 80px !important;
  max-height: 80px !important;
  overflow-y: auto;
}

/* el-select 选中文字完整显示，不截断 */
/deep/ .el-select .el-select__tags-text {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  max-width: none;
}
/deep/ .el-select .el-input__inner {
  text-overflow: clip;
}
</style>
