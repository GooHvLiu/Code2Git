<template>
  <div class="license-list">
    <el-card>
      <div slot="header" class="card-header">
        <div class="header-left">
          <span>📋 授权文件列表</span>
          <el-tag size="small" type="info">共 {{ list.length }} 条</el-tag>
        </div>
        <el-button type="primary" size="small" icon="el-icon-refresh" @click="loadList">刷新</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="fileName" label="文件名" min-width="260" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="file-name-cell">
              <span class="file-icon">📄</span>
              <span>{{ scope.row.fileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目" width="200" show-overflow-tooltip />
        <el-table-column label="授权类型" width="110">
          <template slot-scope="scope">
            <el-tag :type="typeTag(scope.row.licenseType)" size="small" effect="light">{{ typeLabel(scope.row.licenseType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="客户" width="150" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.customer?.name || '-' }}</template>
        </el-table-column>
        <el-table-column label="过期时间" width="170">
          <template slot-scope="scope">
            <span v-if="scope.row.expiresAt" class="expire-text">{{ formatTime(scope.row.expiresAt) }}</span>
            <el-tag v-else type="success" size="small" effect="plain">永久</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <el-tag v-if="isExpired(scope.row)" type="danger" size="small" effect="dark">已过期</el-tag>
            <el-tag v-else type="success" size="small" effect="dark">有效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-view" @click="viewDetail(scope.row)">详情</el-button>
            <el-button type="text" size="small" icon="el-icon-download" @click="download(scope.row)">下载</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" style="color:#F56C6C" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="list.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-text">暂无授权文件</div>
        <el-button type="primary" size="small" @click="$router.push('/license/gen')">去生成授权</el-button>
      </div>
    </el-card>

    <el-dialog title="授权详情" :visible.sync="detailVisible" width="600px">
      <div v-if="currentDetail" class="detail-content">
        <div class="detail-header">
          <div class="detail-icon">📄</div>
          <div>
            <div class="detail-title">{{ currentDetail.projectName }}</div>
            <div class="detail-sub">授权ID: {{ currentDetail.licenseId }}</div>
          </div>
          <el-tag :type="typeTag(currentDetail.licenseType)" size="medium">{{ typeLabel(currentDetail.licenseType) }}</el-tag>
        </div>
        <el-descriptions :column="1" border size="small" style="margin-top:20px">
          <el-descriptions-item label="项目ID">{{ currentDetail.projectId }}</el-descriptions-item>
          <el-descriptions-item label="机器绑定">{{ currentDetail.machineId ? currentDetail.machineId.substring(0,40)+'...' : '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="签发时间">{{ formatTime(currentDetail.issuedAt) }}</el-descriptions-item>
          <el-descriptions-item label="过期时间">{{ currentDetail.expiresAt ? formatTime(currentDetail.expiresAt) : '永久有效' }}</el-descriptions-item>
          <el-descriptions-item label="最大用户数">{{ currentDetail.maxUsers || '不限制' }}</el-descriptions-item>
          <el-descriptions-item label="功能授权">
            <el-tag v-for="f in currentDetail.features" :key="f" size="mini" style="margin:2px">{{ f }}</el-tag>
            <span v-if="!currentDetail.features?.length">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">{{ currentDetail.customer?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ currentDetail.customer?.contact || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentDetail.customer?.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentDetail.customer?.email || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLicenseList, deleteLicense, parseLicense } from '@/api';
import dayjs from 'dayjs';

export default {
  name: 'LicenseList',
  data() {
    return { list: [], loading: false, detailVisible: false, currentDetail: null };
  },
  mounted() { this.loadList(); },
  methods: {
    async loadList() {
      this.loading = true;
      try {
        const res = await getLicenseList();
        this.list = res.data.list || [];
      } catch (e) {} finally { this.loading = false; }
    },
    async viewDetail(row) {
      try {
        const res = await parseLicense({ filePath: row.filePath });
        this.currentDetail = res.data;
        this.detailVisible = true;
      } catch (e) {}
    },
    download(row) {
      const a = document.createElement('a');
      a.href = `/licenses/${row.fileName}`;
      a.download = row.fileName;
      a.click();
    },
    onDelete(row) {
      this.$confirm(`确定删除授权文件「${row.fileName}」吗？删除后不可恢复。`, '提示', { type: 'warning' })
        .then(async () => {
          await deleteLicense(row.fileName);
          this.$message.success('删除成功');
          this.loadList();
        }).catch(() => {});
    },
    isExpired(row) { return row.expiresAt && Date.now() > row.expiresAt; },
    typeLabel(type) {
      const map = { trial: '试用版', standard: '标准版', enterprise: '企业版', perpetual: '永久版' };
      return map[type] || type;
    },
    typeTag(type) {
      const map = { trial: 'info', standard: '', enterprise: 'warning', perpetual: 'success' };
      return map[type] || '';
    },
    formatTime(ts) { return ts ? dayjs(ts).format('YYYY-MM-DD HH:mm:ss') : '-'; }
  }
};
</script>

<style lang="less" scoped>
.card-header { display: flex; justify-content: space-between; align-items: center;
  .header-left { display: flex; align-items: center; gap: 10px; font-weight: 600; color: #1a1a2e; }
}
.file-name-cell { display: flex; align-items: center; gap: 8px;
  .file-icon { font-size: 18px; }
}
.expire-text { font-size: 13px; color: #606266; }
.empty-state { text-align: center; padding: 60px 0;
  .empty-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.5; }
  .empty-text { font-size: 14px; color: #909399; margin-bottom: 20px; }
}
.detail-header { display: flex; align-items: center; gap: 14px;
  .detail-icon { font-size: 40px; }
  .detail-title { font-size: 18px; font-weight: 700; color: #1a1a2e; }
  .detail-sub { font-size: 12px; color: #909399; margin-top: 4px; word-break: break-all; }
  flex: 1;
  .el-tag { margin-left: auto; }
}
</style>
