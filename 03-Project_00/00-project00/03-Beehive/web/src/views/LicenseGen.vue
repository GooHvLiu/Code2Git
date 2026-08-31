<template>
  <div class="license-gen">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <div slot="header" class="card-header">
            <span>📝 生成授权文件</span>
            <el-tag size="small" type="info">RSA-2048 + AES-256</el-tag>
          </div>
          <el-form :model="form" :rules="rules" ref="form" label-width="110px" size="medium">
            <!-- 基本信息 -->
            <div class="form-section">
              <div class="section-title"><span class="section-dot"></span>基本信息</div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="选择项目" prop="projectId">
                    <el-select
                      v-model="form.projectId"
                      placeholder="请选择项目"
                      style="width: 100%"
                      @change="onProjectChange"
                      filterable
                    >
                      <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="授权类型" prop="licenseType">
                    <el-select v-model="form.licenseType" placeholder="请选择" style="width: 100%">
                      <el-option v-for="t in licenseTypes" :key="t.value" :label="t.label" :value="t.value">
                        <span>{{ t.label }}</span>
                        <el-tag size="mini" :type="t.tag" style="margin-left: 8px">{{ t.desc }}</el-tag>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 授权配置 -->
            <div class="form-section">
              <div class="section-title"><span class="section-dot"></span>授权配置</div>
              <el-row :gutter="20">
                <el-col :span="12" v-if="form.licenseType !== 'perpetual'">
                  <el-form-item label="有效天数">
                    <el-input-number v-model="form.validDays" :min="1" :max="3650" style="width: 160px" />
                    <div class="form-tip">默认365天，最大10年</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="服务器数量">
                    <el-input-number v-model="form.maxUsers" :min="0" :max="99999" style="width: 160px" />
                    <div class="form-tip">服务器端授权数，0表示不限制</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户端数量">
                    <el-input-number v-model="form.maxDevices" :min="0" :max="99999" style="width: 120px" />
                    <div class="form-tip">在线设备/客户端数，0表示不限制</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="功能授权">
                <el-checkbox-group v-model="form.features">
                  <el-checkbox v-for="f in featureOptions" :key="f" :label="f" border>{{ f }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <!-- 机器绑定 -->
            <div class="form-section">
              <div class="section-title"><span class="section-dot"></span>机器绑定</div>
              <el-form-item label="绑定方式">
                <el-radio-group v-model="bindMode">
                  <el-radio-button label="none">不绑定</el-radio-button>
                  <el-radio-button label="current">绑定当前服务器</el-radio-button>
                  <el-radio-button label="custom">手动输入</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="bindMode === 'custom'" label="机器ID">
                <el-input v-model="form.machineId" placeholder="请输入客户端机器ID（64位SHA256哈希）" />
              </el-form-item>
              <div v-if="bindMode === 'current'" class="machine-info">
                <i class="el-icon-cpu"></i>
                <span>当前服务器机器ID：</span>
                <el-tag size="small" type="info" effect="plain">{{ currentMachineId || "加载中..." }}</el-tag>
              </div>
            </div>

            <!-- 客户信息 -->
            <div class="form-section">
              <div class="section-title"><span class="section-dot"></span>客户信息</div>
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
            </div>

            <el-form-item>
              <el-button
                type="primary"
                size="medium"
                :loading="generating"
                @click="onGenerate"
                icon="el-icon-document-add"
              >
                生成授权文件
              </el-button>
              <el-button size="medium" @click="onReset" icon="el-icon-refresh-left">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧预览 -->
      <el-col :span="8">
        <el-card class="preview-card">
          <div slot="header" class="card-header">
            <span>👁️ 授权预览</span>
          </div>
          <div class="preview-content">
            <div class="preview-header">
              <div class="preview-icon">📄</div>
              <div class="preview-title">授权文件</div>
              <div class="preview-sub">.lic 加密格式</div>
            </div>
            <el-divider />
            <div class="preview-item">
              <span class="preview-label">项目</span>
              <span class="preview-value">{{ form.projectName || "未选择" }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">授权类型</span>
              <el-tag size="small" :type="currentTypeTag">{{ currentTypeLabel }}</el-tag>
            </div>
            <div class="preview-item" v-if="form.licenseType !== 'perpetual'">
              <span class="preview-label">有效期</span>
              <span class="preview-value">{{ form.validDays }} 天</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">服务器数量</span>
              <span class="preview-value">{{ form.maxUsers === 0 ? "不限制" : form.maxUsers + " 台" }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">客户端数量</span>
              <span class="preview-value">{{ form.maxDevices === 0 ? "不限制" : form.maxDevices + " 台" }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">机器绑定</span>
              <span class="preview-value">{{ bindModeLabel }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">功能模块</span>
              <span class="preview-value">{{ form.features.length || 0 }} 个</span>
            </div>
            <el-divider />
            <div class="preview-tip">
              <i class="el-icon-info"></i>
              <span>生成后授权文件将用 RSA 私钥签名，AES-256 加密存储，客户端无法篡改。</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 结果弹窗 -->
    <el-dialog title="授权生成成功" :visible.sync="resultVisible" width="560px" custom-class="result-dialog">
      <div class="result-content">
        <div class="result-icon">✅</div>
        <h3 class="result-title">授权文件已生成</h3>
        <p class="result-sub">{{ result.fileName }}</p>
        <el-descriptions :column="1" border size="small" style="margin-top: 20px">
          <el-descriptions-item label="授权ID">{{ result.licenseId }}</el-descriptions-item>
          <el-descriptions-item label="项目">{{ result.licenseData?.projectName }}</el-descriptions-item>
          <el-descriptions-item label="授权类型">{{ result.licenseData?.licenseType }}</el-descriptions-item>
          <el-descriptions-item label="签发时间">{{ formatTime(result.licenseData?.issuedAt) }}</el-descriptions-item>
          <el-descriptions-item label="过期时间">{{
            result.licenseData?.expiresAt ? formatTime(result.licenseData.expiresAt) : "永久有效"
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer">
        <el-button @click="copyLicenseId" icon="el-icon-document-copy">复制授权ID</el-button>
        <el-button type="primary" @click="downloadLicense" icon="el-icon-download">下载授权文件</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLicenseTypes, getMachineId, generateLicense, getProjects, updateProject } from "@/api";
import dayjs from "dayjs";

export default {
  name: "LicenseGen",
  data() {
    return {
      form: {
        projectId: "",
        projectName: "",
        licenseType: "standard",
        validDays: 365,
        maxUsers: 0,
        maxDevices: 0,
        machineId: "",
        features: [],
        customer: { name: "", contact: "", phone: "", email: "" }
      },
      rules: {
        projectId: [{ required: true, message: "请选择项目", trigger: "change" }],
        licenseType: [{ required: true, message: "请选择授权类型", trigger: "change" }]
      },
      projects: [],
      licenseTypes: [],
      featureOptions: [],
      bindMode: "none",
      currentMachineId: "",
      generating: false,
      result: {},
      resultVisible: false
    };
  },
  computed: {
    currentTypeLabel() {
      const t = this.licenseTypes.find((x) => x.value === this.form.licenseType);
      return t ? t.label : "-";
    },
    currentTypeTag() {
      const t = this.licenseTypes.find((x) => x.value === this.form.licenseType);
      return t ? t.tag : "";
    },
    bindModeLabel() {
      return { none: "不绑定", current: "绑定当前服务器", custom: "手动输入" }[this.bindMode];
    }
  },
  async mounted() {
    await Promise.all([this.loadProjects(), this.loadLicenseTypes(), this.loadMachineId()]);
  },
  methods: {
    async loadProjects() {
      const res = await getProjects();
      this.projects = res.data.list || [];
    },
    async loadLicenseTypes() {
      const res = await getLicenseTypes();
      const tagMap = { trial: "info", standard: "", enterprise: "warning", perpetual: "success" };
      const descMap = { trial: "试用", standard: "标准", enterprise: "企业", perpetual: "永久" };
      this.licenseTypes = (res.data.types || []).map((t) => ({ ...t, tag: tagMap[t.value], desc: descMap[t.value] }));
    },
    async loadMachineId() {
      try {
        const res = await getMachineId();
        this.currentMachineId = res.data.machineId;
      } catch (e) {}
    },
    onProjectChange(id) {
      const proj = this.projects.find((p) => p.id === id);
      if (proj) {
        this.form.projectName = proj.name;
        this.featureOptions = proj.features || [];
        this.form.features = proj.features ? [...proj.features] : [];
        // 自动带出客户信息（可修改）
        if (proj.customer) {
          this.form.customer = {
            name: proj.customer.name || "",
            contact: proj.customer.contact || "",
            phone: proj.customer.phone || "",
            email: proj.customer.email || ""
          };
        } else {
          this.form.customer = { name: "", contact: "", phone: "", email: "" };
        }
      }
    },
    async onGenerate() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.generating = true;
        try {
          const payload = { ...this.form };
          if (this.bindMode === "none") payload.machineId = "";
          if (this.bindMode === "current") payload.machineId = this.currentMachineId;
          const res = await generateLicense(payload);
          this.result = res.data;
          this.resultVisible = true;
          // 同步最新客户信息到项目管理
          try {
            const proj = this.projects.find((p) => p.id === this.form.projectId);
            if (proj) {
              await updateProject(this.form.projectId, {
                ...proj,
                customer: { ...this.form.customer }
              });
              // 更新本地项目列表中的客户信息
              const idx = this.projects.findIndex((p) => p.id === this.form.projectId);
              if (idx !== -1) {
                this.$set(this.projects, idx, { ...this.projects[idx], customer: { ...this.form.customer } });
              }
            }
          } catch (e) {
            console.warn("同步客户信息到项目失败:", e);
          }
        } catch (e) {
        } finally {
          this.generating = false;
        }
      });
    },
    onReset() {
      this.$refs.form.resetFields();
      this.form.features = [];
      this.form.customer = { name: "", contact: "", phone: "", email: "" };
      this.bindMode = "none";
    },
    downloadLicense() {
      const a = document.createElement("a");
      a.href = `/licenses/${this.result.fileName}`;
      a.download = this.result.fileName;
      a.click();
    },
    copyLicenseId() {
      navigator.clipboard.writeText(this.result.licenseId);
      this.$message.success("授权ID已复制");
    },
    formatTime(ts) {
      return ts ? dayjs(ts).format("YYYY-MM-DD HH:mm:ss") : "-";
    }
  }
};
</script>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-section {
  margin-bottom: 24px;
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ebeef5;
    .section-dot {
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background: linear-gradient(180deg, #667eea, #764ba2);
    }
  }
}
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.machine-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  margin-left: 110px;
  margin-bottom: 18px;
}

.preview-card {
  position: sticky;
  top: 20px;
}
.preview-content {
  .preview-header {
    text-align: center;
    padding: 10px 0;
    .preview-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }
    .preview-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .preview-sub {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
  .preview-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 13px;
    .preview-label {
      color: #909399;
    }
    .preview-value {
      color: #303133;
      font-weight: 500;
      max-width: 60%;
      text-align: right;
      word-break: break-all;
    }
  }
  .preview-tip {
    display: flex;
    gap: 8px;
    padding: 12px;
    background: #ecf5ff;
    border-radius: 8px;
    font-size: 12px;
    color: #409eff;
    line-height: 1.6;
    i {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
}

.result-content {
  text-align: center;
  padding: 10px 0;
  .result-icon {
    font-size: 56px;
    margin-bottom: 12px;
  }
  .result-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
  }
  .result-sub {
    font-size: 13px;
    color: #909399;
    margin-top: 6px;
    word-break: break-all;
  }
}
</style>
