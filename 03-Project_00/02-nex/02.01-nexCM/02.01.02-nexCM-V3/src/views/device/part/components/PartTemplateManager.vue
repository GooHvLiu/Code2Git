<template>
  <div class="part-template-manager">
    <!-- 顶部操作栏 -->
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="$t('menu.device.part.template.searchPlaceholder')"
          clearable
          style="width: 280px"
          @clear="loadTemplateList"
          @keyup.enter.native="loadTemplateList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            v-permission="'device:part:template:search'"
            @click="loadTemplateList"
          ></el-button>
        </el-input>
      </div>
      <div class="toolbar-right">
        <el-button
          v-permission="'device:part:template:add'"
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          >{{ $t("menu.device.part.template.add") }}</el-button
        >
        <el-button
          icon="el-icon-refresh"
          v-permission="'device:part:template:refresh'"
          @click="loadTemplateList"
          >{{ $t("menu.device.part.template.refresh") }}</el-button
        >
      </div>
    </div>

    <!-- 模板列表表格 -->
    <el-table
      :data="filteredTemplates"
      v-loading="loading"
      border
      stripe
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
      style="width: 100%"
    >
      <el-table-column
        :label="$t('menu.device.part.template.column.templateName')"
        prop="name_key"
        min-width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <i v-if="row.icon" :class="row.icon" style="margin-right: 8px; color: #409eff"></i>
          {{ getTemplateName(row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.device.part.template.column.templateKey')"
        prop="template_key"
        min-width="150"
        align="center"
      />
      <el-table-column
        :label="$t('menu.device.part.template.column.codePrefix')"
        prop="code_prefix"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.device.part.template.column.defaultSpec')"
        prop="default_spec"
        min-width="150"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        :label="$t('menu.device.part.template.column.defaultRatedLife')"
        prop="default_rated_life"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.default_rated_life }} {{ $t("menu.device.part.page.unit.times") }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.device.part.template.column.statMethod')"
        prop="stat_method"
        min-width="140"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ getStatMethodText(row.stat_method) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.device.part.template.column.statTag')"
        prop="stat_tag"
        min-width="180"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        :label="$t('menu.device.part.template.column.status')"
        prop="enabled"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="mini">
            {{ row.enabled ? $t("menu.device.part.template.status.enabled") : $t("menu.device.part.template.status.disabled") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.device.part.template.column.action')"
        width="180"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            v-permission="'device:part:template:edit'"
            :disabled="row.part_count > 0 || row.is_base_template === 1"
            :style="(row.part_count > 0 || row.is_base_template === 1) ? 'color: #c0c4cc !important; cursor: not-allowed;' : ''"
            @click="handleEdit(row)"
            >{{ $t("menu.device.part.template.edit") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            :style="(row.part_count > 0 || row.is_base_template === 1) ? 'color: #c0c4cc !important; cursor: not-allowed;' : 'color: #f56c6c'"
            v-permission="'device:part:template:delete'"
            :disabled="row.part_count > 0 || row.is_base_template === 1"
            @click="handleDelete(row)"
            >{{ $t("menu.device.part.template.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑模板弹窗 -->
    <el-dialog
      :title="isEdit ? $t('menu.device.part.template.edit') : $t('menu.device.part.template.add')"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        label-width="140px"
        class="template-dialog-form"
      >
        <el-form-item
          :label="$t('menu.device.part.template.form.templateName')"
          prop="source_template_key"
        >
          <el-select
            v-model="templateForm.source_template_key"
            :placeholder="$t('menu.device.part.template.form.templateName')"
            style="width: 100%"
            :disabled="isEdit"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="item in sourceTemplates"
              :key="item.template_key"
              :label="getTemplateName(item)"
              :value="item.template_key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.template.form.defaultSpec')"
          prop="default_spec"
        >
          <el-input
            v-model="templateForm.default_spec"
            :placeholder="$t('menu.device.part.template.form.defaultSpec')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.device.part.template.form.defaultRatedLife')"
          prop="default_rated_life"
        >
          <el-input-number
            v-model="templateForm.default_rated_life"
            :min="1"
            :max="9999999"
            :step="1000"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleConfirm">
          {{ $t("common.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { Message, MessageBox } from "element-ui";
import {
  getPartTemplatesForAdmin,
  getBasePartTemplates,
  addPartTemplate,
  updatePartTemplate,
  deletePartTemplate,
} from "@/api/devicePart";
import { useI18n } from "@/composables/useI18n";

const { t: $t } = useI18n();

// 加载状态
const loading = ref(false);
const saving = ref(false);

// 搜索关键词
const searchKeyword = ref("");

// 模板列表
const templateList = ref([]);

// 源模板列表（用于新增模板时选择）
const sourceTemplates = ref([]);

// 弹窗状态
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentTemplate = ref(null);

// 表单引用
const templateFormRef = ref(null);

// 表单数据
const templateForm = reactive({
  source_template_key: "",
  default_spec: "",
  default_rated_life: 10000,
});

// 表单验证规则
const templateRules = {
  source_template_key: [{ required: true, message: "请选择模板名称", trigger: "change" }],
  default_spec: [{ required: true, message: "请输入默认规格型号", trigger: "blur" }],
  default_rated_life: [{ required: true, message: "请输入默认额定寿命", trigger: "blur" }],
};

// 过滤后的模板列表
const filteredTemplates = computed(() => {
  if (!searchKeyword.value) return templateList.value;
  const keyword = searchKeyword.value.toLowerCase();
  return templateList.value.filter(
    (item) =>
      item.template_key?.toLowerCase().includes(keyword) ||
      item.code_prefix?.toLowerCase().includes(keyword) ||
      item.default_spec?.toLowerCase().includes(keyword) ||
      getTemplateName(item).toLowerCase().includes(keyword)
  );
});

// 获取模板名称
function getTemplateName(template) {
  if (!template) return "";
  if (template.name_key && template.name_key.startsWith("menu.")) {
    return $t(template.name_key);
  }
  return template.name_key || template.template_name || template.name || "";
}

// 获取统计方式文本
function getStatMethodText(method) {
  const map = {
    success_count: $t("menu.device.part.template.statMethod.successCount"),
    rotation_count: $t("menu.device.part.template.statMethod.rotationCount"),
    manual: $t("menu.device.part.template.statMethod.manual"),
  };
  return map[method] || method;
}

// 加载模板列表
async function loadTemplateList() {
  loading.value = true;
  try {
    // 并行加载所有模板和基础模板
    const [res, baseRes] = await Promise.all([
      getPartTemplatesForAdmin(),
      getBasePartTemplates()
    ]);
    
    if (res.code === 200) {
      templateList.value = res.data || [];
    } else {
      Message.error(res.msg || res.message || "加载模板列表失败");
    }
    
    if (baseRes.code === 200) {
      // 源模板列表只包含基础模板，用于新增模板时选择
      sourceTemplates.value = baseRes.data || [];
    }
  } catch (err) {
    Message.error("加载模板列表失败");
  } finally {
    loading.value = false;
  }
}

// 重置表单
function resetForm() {
  Object.assign(templateForm, {
    source_template_key: "",
    default_spec: "",
    default_rated_life: 0,
  });
  if (templateFormRef.value) {
    templateFormRef.value.clearValidate();
  }
}

// 模板名称选择变化时，自动填充该模板对应的额定寿命
function handleTemplateChange(templateKey) {
  if (!templateKey) {
    templateForm.default_rated_life = 0;
    return;
  }
  const selectedTemplate = sourceTemplates.value.find(item => item.template_key === templateKey);
  if (selectedTemplate) {
    templateForm.default_rated_life = selectedTemplate.default_rated_life || 0;
  }
}

// 新增模板
function handleAdd() {
  isEdit.value = false;
  currentTemplate.value = null;
  resetForm();
  dialogVisible.value = true;
}

// 编辑模板
function handleEdit(row) {
  isEdit.value = true;
  currentTemplate.value = row;
  resetForm();
  Object.assign(templateForm, {
    source_template_key: row.template_key,
    default_spec: row.default_spec,
    default_rated_life: row.default_rated_life,
  });
  dialogVisible.value = true;
}

// 删除模板
async function handleDelete(row) {
  try {
    await MessageBox.confirm(
      $t("menu.device.part.template.message.deleteConfirm"),
      $t("common.tip"),
      {
        confirmButtonText: $t("common.confirm"),
        cancelButtonText: $t("common.cancel"),
        type: "warning",
      }
    );
    const res = await deletePartTemplate(row.id);
    if (res.code === 200) {
      Message.success($t("menu.device.part.template.message.deleteSuccess"));
      loadTemplateList();
    } else {
      Message.error(res.msg || res.message || "删除模板失败");
    }
  } catch (err) {
    if (err !== "cancel") {
      Message.error(err.msg || err.message || "删除模板失败");
    }
  }
}

// 确认保存
async function handleConfirm() {
  if (!templateFormRef.value) return;
  try {
    await templateFormRef.value.validate();
    saving.value = true;

    let data;
    if (isEdit.value) {
      // 编辑模板：只允许修改规格型号和额定寿命
      data = {
        default_spec: templateForm.default_spec,
        default_rated_life: templateForm.default_rated_life,
      };
    } else {
      // 新增模板：传递源模板的template_key，以及新的规格型号和额定寿命
      data = {
        source_template_key: templateForm.source_template_key,
        default_spec: templateForm.default_spec,
        default_rated_life: templateForm.default_rated_life,
      };
    }

    let res;
    if (isEdit.value) {
      res = await updatePartTemplate(currentTemplate.value.id, data);
    } else {
      res = await addPartTemplate(data);
    }

    if (res.code === 200) {
      Message.success(
        isEdit.value
          ? $t("menu.device.part.template.message.editSuccess")
          : $t("menu.device.part.template.message.addSuccess")
      );
      dialogVisible.value = false;
      loadTemplateList();
    } else {
      Message.error(res.msg || res.message || "保存模板失败");
    }
  } catch (err) {
    if (err !== "cancel") {
      Message.error(err.msg || err.message || "保存模板失败");
    }
  } finally {
    saving.value = false;
  }
}

// 页面加载时获取模板列表
onMounted(() => {
  loadTemplateList();
});

// 暴露方法给父组件
defineExpose({
  loadTemplateList,
});
</script>

<style scoped>
.part-template-manager {
  padding: 0;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-dialog-form {
  padding: 0 20px;
}
</style>

