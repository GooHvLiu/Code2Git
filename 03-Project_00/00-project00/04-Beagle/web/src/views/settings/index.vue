<template>
  <div class="page-container">
    <div class="card">
      <div class="header-title">系统设置</div>

      <el-tabs v-model="activeTab">
        <el-tab-pane name="info">
          <template #label>
            <span>平台信息</span>
            <el-tooltip content="查看平台基本信息和版本" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-descriptions :column="2" border style="margin-top: 20px">
            <el-descriptions-item>
              <template #label>
                <span>平台名称</span>
                <el-tooltip content="Beagle 测试平台的官方名称" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              Beagle 测试平台
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span>版本</span>
                <el-tooltip content="当前平台版本号" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              v1.0.0
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span>后端地址</span>
                <el-tooltip content="后端 API 服务地址，前端通过此地址调用接口" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              http://localhost:3003
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span>前端地址</span>
                <el-tooltip content="前端开发服务器地址" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              http://localhost:5173
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span>插件总数</span>
                <el-tooltip content="当前已安装的插件数量" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              {{ pluginCount }} 个
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span>数据库</span>
                <el-tooltip content="数据存储引擎，SQLite 无需独立安装数据库服务" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              SQLite (sql.js)
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane name="storage">
          <template #label>
            <span>存储路径</span>
            <el-tooltip content="配置各类数据在服务器上的存储位置，修改后需重启后端服务生效" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-form label-width="150px" style="max-width: 600px; margin-top: 20px">
            <el-form-item>
              <template #label>
                <span>数据库文件</span>
                <el-tooltip content="SQLite 数据库文件路径，存储项目、插件、执行记录等数据" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input v-model="settings.databasePath" />
            </el-form-item>
            <el-form-item>
              <template #label>
                <span>报告输出目录</span>
                <el-tooltip content="每次测试执行生成的 JSON 报告存放目录" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input v-model="settings.reportPath" />
            </el-form-item>
            <el-form-item>
              <template #label>
                <span>插件存放目录</span>
                <el-tooltip content="插件源码所在目录，新插件放入后重启后端即可自动识别" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input v-model="settings.pluginPath" />
            </el-form-item>
            <el-form-item>
              <template #label>
                <span>日志目录</span>
                <el-tooltip content="后端运行日志存放目录" placement="top">
                  <el-icon class="label-tip"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input v-model="settings.logPath" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPluginList } from '@/api/plugins'
import request from '@/api/request'

const activeTab = ref('info')
const pluginCount = ref(0)
const settings = ref({
  databasePath: 'server/data/beagle.db',
  reportPath: 'server/reports/',
  pluginPath: 'server/src/test-modules/',
  logPath: 'server/logs/'
})

async function saveSettings() {
  try {
    await request({ url: '/settings/storage', method: 'post', data: settings.value })
    ElMessage.success('设置已保存')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

onMounted(async () => {
  try {
    const res = await getPluginList()
    pluginCount.value = res.data.length
  } catch (e) { /* ignore */ }
  try {
    const res = await request({ url: '/settings/storage', method: 'get' })
    if (res.data) Object.assign(settings.value, res.data)
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.header-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
