<template>
  <div class="project-manage">
    <el-card>
      <div slot="header" class="card-header">
        <div class="header-left">
          <span>📦 项目管理</span>
          <el-tag size="small" type="info">共 {{ list.length }} 个项目</el-tag>
        </div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="onAdd">新增项目</el-button>
      </div>
      <div class="project-grid" v-loading="loading">
        <div class="project-card" v-for="item in list" :key="item.id" @click="onEdit(item)">
          <div class="project-icon" :style="{ background: getGradient(item.id) }">
            {{ item.name.charAt(0).toUpperCase() }}
          </div>
          <div class="project-info">
            <div class="project-name">{{ item.name }}</div>
            <div class="project-id">{{ item.id }}</div>
            <div class="project-desc">{{ item.description || "暂无描述" }}</div>
            <div class="project-tags">
              <el-tag v-for="f in item.features?.slice(0, 3)" :key="f" size="mini" effect="plain">{{ f }}</el-tag>
              <el-tag v-if="item.features?.length > 3" size="mini" type="info">+{{ item.features.length - 3 }}</el-tag>
            </div>
          </div>
          <div class="project-actions" @click.stop>
            <el-button type="text" size="small" icon="el-icon-edit" @click="onEdit(item)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" style="color: #f56c6c" @click="onDelete(item)"
              >删除</el-button
            >
          </div>
        </div>
        <div v-if="list.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">📦</div>
          <div class="empty-text">暂无项目，点击右上角添加</div>
        </div>
      </div>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="560px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="medium">
        <el-form-item label="项目ID" prop="id">
          <el-input v-model="form.id" :disabled="isEdit" placeholder="如: nex-cm-v2" />
          <div class="form-tip">项目唯一标识，创建后不可修改</div>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="如: nexCM 医疗设备管理系统" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="项目简要描述" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model="form.techStack" placeholder="如: Vue2, Element UI, Express" />
        </el-form-item>
        <el-form-item label="功能模块">
          <el-select
            v-model="form.features"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="输入功能名称后回车添加"
            style="width: 100%"
          >
            <el-option v-for="f in featureSuggestions" :key="f" :label="f" :value="f" />
          </el-select>
          <div class="form-tip">可自定义输入，用于功能级授权控制</div>
        </el-form-item>
        <el-divider content-position="left">客户信息（生成授权时自动带出，可修改）</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="form.customer.name" placeholder="客户/公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="form.customer.contact" placeholder="联系人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.customer.phone" placeholder="联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.customer.email" placeholder="邮箱地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjects, addProject, updateProject, deleteProject } from "@/api";

export default {
  name: "ProjectManage",
  data() {
    return {
      list: [],
      loading: false,
      dialogVisible: false,
      isEdit: false,
      form: { id: "", name: "", description: "", techStack: "", features: [], customer: { name: "", contact: "", phone: "", email: "" } },
      rules: {
        id: [{ required: true, message: "请输入项目ID", trigger: "blur" }],
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }]
      },
      featureSuggestions: [
        "user_manage",
        "customer_manage",
        "device_manage",
        "system_config",
        "api_service",
        "auth",
        "database",
        "report",
        "alarm",
        "order"
      ]
    };
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? "编辑项目" : "新增项目";
    }
  },
  mounted() {
    this.loadList();
  },
  methods: {
    async loadList() {
      this.loading = true;
      try {
        const res = await getProjects();
        this.list = res.data.list || [];
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    getGradient(id) {
      const gradients = [
        "linear-gradient(135deg,#667eea,#764ba2)",
        "linear-gradient(135deg,#43e97b,#38f9d7)",
        "linear-gradient(135deg,#fa709a,#fee140)",
        "linear-gradient(135deg,#4facfe,#00f2fe)",
        "linear-gradient(135deg,#f093fb,#f5576c)",
        "linear-gradient(135deg,#a8edea,#fed6e3)"
      ];
      let hash = 0;
      for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
      return gradients[Math.abs(hash) % gradients.length];
    },
    onAdd() {
      this.isEdit = false;
      this.form = { id: "", name: "", description: "", techStack: "", features: [], customer: { name: "", contact: "", phone: "", email: "" } };
      this.dialogVisible = true;
      this.$nextTick(() => this.$refs.form?.clearValidate());
    },
    onEdit(row) {
      this.isEdit = true;
      this.form = {
        ...row,
        features: row.features ? [...row.features] : [],
        customer: row.customer ? { ...row.customer } : { name: "", contact: "", phone: "", email: "" }
      };
      this.dialogVisible = true;
    },
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        try {
          if (this.isEdit) {
            await updateProject(this.form.id, this.form);
            this.$message.success("更新成功");
          } else {
            await addProject(this.form);
            this.$message.success("新增成功");
          }
          this.dialogVisible = false;
          this.loadList();
        } catch (e) {}
      });
    },
    onDelete(row) {
      this.$confirm(`确定删除项目「${row.name}」吗？`, "提示", { type: "warning" })
        .then(async () => {
          await deleteProject(row.id);
          this.$message.success("删除成功");
          this.loadList();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: #1a1a2e;
  }
}
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.project-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 14px;
  position: relative;
  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
  .project-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .project-info {
    flex: 1;
    min-width: 0;
    .project-name {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .project-id {
      font-size: 11px;
      color: #667eea;
      font-family: monospace;
      margin-top: 2px;
    }
    .project-desc {
      font-size: 12px;
      color: #909399;
      margin-top: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .project-tags {
      margin-top: 8px;
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }
  .project-actions {
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover .project-actions {
    opacity: 1;
  }
}
.empty-state {
  grid-column: 1/-1;
  text-align: center;
  padding: 60px 0;
  .empty-icon {
    font-size: 56px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  .empty-text {
    font-size: 14px;
    color: #909399;
  }
}
</style>
