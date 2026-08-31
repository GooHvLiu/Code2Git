<template>
  <div class="dict-management">
    <el-row :gutter="20">
      <!-- 左侧：字典类型列表 -->
      <el-col :span="8">
        <div class="dict-type-panel">
          <div class="panel-header">
            <span>{{ $t("menu.system.dict.page.typeList") }}</span>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="handleAddType"
            >
              {{ $t("common.add") }}
            </el-button>
          </div>
          <el-table
            v-loading="typeLoading"
            :data="typeList"
            border
            highlight-current-row
            @current-change="handleTypeChange"
            :header-cell-style="{
              background: '#f5f7fa',
              color: '#606266',
              fontWeight: 'bold',
            }"
            style="width: 100%"
          >
            <el-table-column
              prop="dict_name"
              :label="$t('menu.system.dict.page.typeName')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="dict_code"
              :label="$t('menu.system.dict.page.typeCode')"
              min-width="120"
              align="center"
            />
            <el-table-column
              :label="$t('common.operation')"
              width="100"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click.stop="handleEditType(row)"
                  >{{ $t("common.edit") }}</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click.stop="handleDeleteType(row)"
                  >{{ $t("common.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <!-- 右侧：字典项列表 -->
      <el-col :span="16">
        <div class="dict-item-panel">
          <div class="panel-header">
            <span>{{
              currentType
                ? currentType.dict_name +
                  " - " +
                  $t("menu.system.dict.page.itemList")
                : $t("menu.system.dict.page.itemList")
            }}</span>
            <div class="panel-actions">
              <export-dropdown
                :data="itemList"
                :columns="exportColumns"
                :title="exportTitle"
                :filename="exportTitle"
                :exporter="$store.state.user.userInfo?.username || ''"
              />
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                :disabled="!currentType"
                @click="handleAddItem"
              >
                {{ $t("common.add") }}
              </el-button>
            </div>
          </div>
          <el-table
            v-loading="itemLoading"
            :data="itemList"
            border
            stripe
            :header-cell-style="{
              background: '#f5f7fa',
              color: '#606266',
              fontWeight: 'bold',
              textAlign: 'center',
            }"
          >
            <el-table-column
              :label="$t('common.index')"
              type="index"
              width="60"
              align="center"
            />
            <el-table-column
              prop="label"
              :label="$t('menu.system.dict.page.itemLabel')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="value"
              :label="$t('menu.system.dict.page.itemValue')"
              min-width="120"
              align="center"
            />
            <el-table-column
              :label="$t('menu.system.dict.page.itemStatus')"
              prop="status"
              width="80"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tag
                  size="small"
                  :type="row.status === 1 ? 'success' : 'danger'"
                >
                  {{
                    row.status === 1
                      ? $t("common.enable")
                      : $t("common.disable")
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              :label="$t('common.sort')"
              width="80"
              align="center"
            />
            <el-table-column
              :label="$t('common.operation')"
              width="150"
              align="center"
              fixed="right"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEditItem(row)"
                  >{{ $t("common.edit") }}</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click="handleDeleteItem(row)"
                  >{{ $t("common.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 字典类型弹窗 -->
    <el-dialog
      :title="typeDialog.title"
      :visible.sync="typeDialog.visible"
      width="560px"
    >
      <el-form
        :model="typeForm"
        :rules="typeRules"
        ref="typeForm"
        label-width="100px"
      >
        <el-form-item
          :label="$t('menu.system.dict.page.typeName')"
          prop="dict_name"
        >
          <i18n-input
            v-model="typeForm.dict_name"
            type="input"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.system.dict.page.typeCode')"
          prop="dict_code"
        >
          <el-input
            v-model="typeForm.dict_code"
            :placeholder="$t('menu.system.dict.page.typeCodePlaceholder')"
            :disabled="typeDialog.isEdit"
          />
        </el-form-item>
        <el-form-item :label="$t('common.description')" prop="description">
          <i18n-input
            v-model="typeForm.description"
            type="textarea"
            :rows="2"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="200"
          />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="typeForm.status">
            <el-radio :label="1">{{ $t("common.enable") }}</el-radio>
            <el-radio :label="0">{{ $t("common.disable") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort">
          <el-input-number v-model="typeForm.sort" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="typeDialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitTypeForm">{{
          $t("common.confirm")
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 字典项弹窗 -->
    <el-dialog
      :title="itemDialog.title"
      :visible.sync="itemDialog.visible"
      width="560px"
    >
      <el-form
        :model="itemForm"
        :rules="itemRules"
        ref="itemForm"
        label-width="100px"
      >
        <el-form-item
          :label="$t('menu.system.dict.page.itemLabel')"
          prop="label"
        >
          <i18n-input
            v-model="itemForm.label"
            type="input"
            :zh-label="'中文'"
            :en-label="'English'"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.system.dict.page.itemValue')"
          prop="value"
        >
          <el-input
            v-model="itemForm.value"
            :placeholder="$t('menu.system.dict.page.itemValuePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="itemForm.status">
            <el-radio :label="1">{{ $t("common.enable") }}</el-radio>
            <el-radio :label="0">{{ $t("common.disable") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort">
          <el-input-number v-model="itemForm.sort" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('common.remark')" prop="remark">
          <el-input v-model="itemForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="itemDialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitItemForm">{{
          $t("common.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { Message, MessageBox } from "element-ui";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import {
  requestGetDictTypeListApi,
  requestCreateDictTypeApi,
  requestUpdateDictTypeApi,
  requestDeleteDictTypeApi,
  requestGetDictItemListApi,
  requestCreateDictItemApi,
  requestUpdateDictItemApi,
  requestDeleteDictItemApi,
} from "@/api";
import { useI18n } from "@/composables/useI18n";

const { t: $t } = useI18n();

// ===== 响应式数据 =====
const typeLoading = ref(false);
const itemLoading = ref(false);
const typeList = ref([]);
const itemList = ref([]);
const currentType = ref(null);
const typeFormRef = ref(null);
const itemFormRef = ref(null);

const typeDialog = reactive({ visible: false, title: "", isEdit: false });
const itemDialog = reactive({ visible: false, title: "", isEdit: false });

const typeForm = reactive({
  dict_name: {},
  dict_code: "",
  description: {},
  status: 1,
  sort: 0,
});
const itemForm = reactive({
  label: {},
  value: "",
  status: 1,
  sort: 0,
  remark: "",
});

const typeRules = {
  dict_name: [
    {
      required: true,
      message: $t("menu.system.dict.page.typeNameRequired"),
      trigger: "blur",
    },
  ],
  dict_code: [
    {
      required: true,
      message: $t("menu.system.dict.page.typeCodeRequired"),
      trigger: "blur",
    },
  ],
};

const itemRules = {
  label: [
    {
      required: true,
      message: $t("menu.system.dict.page.itemLabelRequired"),
      trigger: "blur",
    },
  ],
  value: [
    {
      required: true,
      message: $t("menu.system.dict.page.itemValueRequired"),
      trigger: "blur",
    },
  ],
};

// ===== 计算属性 =====
const exportColumns = computed(() => [
  { label: $t("menu.system.dict.page.itemLabel"), prop: "label", width: 150 },
  { label: $t("menu.system.dict.page.itemValue"), prop: "value", width: 150 },
  {
    label: $t("menu.system.dict.page.itemStatus"),
    prop: "status",
    width: 80,
    formatter: (row) =>
      row.status === 1 ? $t("common.enable") : $t("common.disable"),
  },
  { label: $t("common.sort"), prop: "sort", width: 80 },
  { label: $t("common.remark"), prop: "remark", width: 200 },
]);

const exportTitle = computed(() =>
  currentType.value
    ? `${currentType.value.dict_name} - ${$t("menu.system.dict.page.itemList")}`
    : $t("menu.system.dict.page.itemList")
);

// ===== 方法 =====
// 加载字典类型列表
async function loadTypeList() {
  typeLoading.value = true;
  try {
    const res = await requestGetDictTypeListApi({ page: 1, pageSize: 100 });
    typeList.value = res.data?.list || [];
    if (typeList.value.length > 0 && !currentType.value) {
      currentType.value = typeList.value[0];
      loadItemList();
    }
  } finally {
    typeLoading.value = false;
  }
}

// 加载字典项列表
async function loadItemList() {
  if (!currentType.value) return;
  itemLoading.value = true;
  try {
    const res = await requestGetDictItemListApi({
      type_id: currentType.value.id,
      page: 1,
      pageSize: 100,
    });
    itemList.value = res.data?.list || [];
  } finally {
    itemLoading.value = false;
  }
}

// 切换字典类型
function handleTypeChange(row) {
  currentType.value = row;
  loadItemList();
}

// 新增字典类型
function handleAddType() {
  Object.assign(typeDialog, {
    visible: true,
    title: $t("menu.system.dict.page.addType"),
    isEdit: false,
  });
  Object.assign(typeForm, {
    dict_name: {},
    dict_code: "",
    description: {},
    status: 1,
    sort: 0,
  });
}

// 编辑字典类型
function handleEditType(row) {
  Object.assign(typeDialog, {
    visible: true,
    title: $t("menu.system.dict.page.editType"),
    isEdit: true,
  });
  // I18nInput 组件直接绑定 JSON 对象，无需转换
  Object.assign(typeForm, { ...row });
}

// 提交字典类型表单
function submitTypeForm() {
  typeFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      // I18nInput 组件已自动处理 JSON 转换，直接提交
      if (typeDialog.isEdit) {
        await requestUpdateDictTypeApi(typeForm.id, typeForm);
        Message.success($t("common.updateSuccess"));
      } else {
        await requestCreateDictTypeApi(typeForm);
        Message.success($t("common.createSuccess"));
      }
      typeDialog.visible = false;
      loadTypeList();
    } catch (e) {
      Message.error(e.msg || $t("common.operationFailed"));
    }
  });
}

// 删除字典类型
function handleDeleteType(row) {
  MessageBox.confirm(
    $t("menu.system.dict.page.deleteTypeConfirm"),
    $t("common.tip"),
    {
      confirmButtonText: $t("common.confirm"),
      cancelButtonText: $t("common.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      await requestDeleteDictTypeApi(row.id);
      Message.success($t("common.deleteSuccess"));
      if (currentType.value?.id === row.id) {
        currentType.value = null;
        itemList.value = [];
      }
      loadTypeList();
    })
    .catch(() => {});
}

// 新增字典项
function handleAddItem() {
  Object.assign(itemDialog, {
    visible: true,
    title: $t("menu.system.dict.page.addItem"),
    isEdit: false,
  });
  Object.assign(itemForm, {
    label: {},
    value: "",
    status: 1,
    sort: 0,
    remark: "",
  });
}

// 编辑字典项
function handleEditItem(row) {
  Object.assign(itemDialog, {
    visible: true,
    title: $t("menu.system.dict.page.editItem"),
    isEdit: true,
  });
  // I18nInput 组件直接绑定 JSON 对象，无需转换
  Object.assign(itemForm, { ...row });
}

// 提交字典项表单
function submitItemForm() {
  itemFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      // I18nInput 组件已自动处理 JSON 转换，直接提交
      const data = { ...itemForm, type_id: currentType.value.id };
      if (itemDialog.isEdit) {
        await requestUpdateDictItemApi(itemForm.id, data);
        Message.success($t("common.updateSuccess"));
      } else {
        await requestCreateDictItemApi(data);
        Message.success($t("common.createSuccess"));
      }
      itemDialog.visible = false;
      loadItemList();
    } catch (e) {
      Message.error(e.msg || $t("common.operationFailed"));
    }
  });
}

// 删除字典项
function handleDeleteItem(row) {
  MessageBox.confirm(
    $t("menu.system.dict.page.deleteItemConfirm"),
    $t("common.tip"),
    {
      confirmButtonText: $t("common.confirm"),
      cancelButtonText: $t("common.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      await requestDeleteDictItemApi(row.id);
      Message.success($t("common.deleteSuccess"));
      loadItemList();
    })
    .catch(() => {});
}

// ===== 生命周期 =====
onMounted(() => {
  loadTypeList();
});
</script>

<style scoped lang="less">
.dict-management {
  .dict-type-panel,
  .dict-item-panel {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    overflow: hidden;
  }
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
    font-weight: 600;
    font-size: 14px;
    .panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
