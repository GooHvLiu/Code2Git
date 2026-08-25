<template>
  <div class="data-management-container">
    <!-- 页签 -->
    <el-tabs v-model="activeTab" class="data-tabs" @tab-click="handleTabChange">
      <!-- 产能数据 -->
      <el-tab-pane label="产能数据" name="output">
        <div class="tab-content">
          <!-- 搜索区域 -->
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.output" class="search-form">
              <el-form-item label="统计类型">
                <el-select v-model="searchForms.output.type" placeholder="请选择" clearable style="width: 140px">
                  <el-option label="按小时" value="hour" />
                  <el-option label="按日" value="day" />
                  <el-option label="按周" value="week" />
                  <el-option label="按月" value="month" />
                  <el-option label="按班次" value="shift" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchForms.output.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item label="产品名称">
                <el-select v-model="searchForms.output.productName" placeholder="请选择" clearable style="width: 160px">
                  <el-option label="卡式瓶灌装" value="卡式瓶灌装" />
                  <el-option label="西林瓶灌装" value="西林瓶灌装" />
                  <el-option label="安瓿瓶灌装" value="安瓿瓶灌装" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="handleReset('output')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 操作栏 -->
          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">共 <b>{{ total }}</b> 条记录</span>
            </div>
            <div class="toolbar-right">
              <ExportDropdown
                :data="tableData.output"
                :columns="exportColumns.output"
                title="产能数据"
                filename="产能数据"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </div>

          <!-- 数据表格 -->
          <div class="table-section">
            <el-table
              ref="outputTable"
              :data="tableData.output"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="period" label="统计周期" width="160" align="center" />
              <el-table-column prop="productName" label="产品名称" width="140" align="center" />
              <el-table-column prop="targetQty" label="目标数量" width="110" align="center" />
              <el-table-column prop="actualQty" label="实际产量" width="110" align="center" />
              <el-table-column prop="qualifiedQty" label="合格数" width="100" align="center" />
              <el-table-column label="完成率" width="100" align="center">
                <template slot-scope="scope">
                  <span :class="scope.row.completionRate >= 90 ? 'text-success' : 'text-warning'">
                    {{ scope.row.completionRate }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="合格率" width="100" align="center">
                <template slot-scope="scope">
                  <span :class="scope.row.qualifiedRate >= 98 ? 'text-success' : 'text-warning'">
                    {{ scope.row.qualifiedRate }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="avgSpeed" label="平均速度(瓶/h)" width="130" align="center" />
              <el-table-column prop="startTime" label="开始时间" width="160" align="center" />
              <el-table-column prop="endTime" label="结束时间" width="160" align="center" />
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination-section">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 稼动率数据 -->
      <el-tab-pane label="稼动率数据" name="oee">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.oee" class="search-form">
              <el-form-item label="统计类型">
                <el-select v-model="searchForms.oee.type" placeholder="请选择" clearable style="width: 140px">
                  <el-option label="按日" value="day" />
                  <el-option label="按周" value="week" />
                  <el-option label="按月" value="month" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchForms.oee.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="handleReset('oee')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">共 <b>{{ total }}</b> 条记录</span>
            </div>
            <div class="toolbar-right">
              <ExportDropdown
                :data="tableData.oee"
                :columns="exportColumns.oee"
                title="稼动率数据"
                filename="稼动率数据"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </div>

          <div class="table-section">
            <el-table
              ref="oeeTable"
              :data="tableData.oee"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="period" label="统计周期" width="160" align="center" />
              <el-table-column prop="planTime" label="计划时间(h)" width="110" align="center" />
              <el-table-column prop="runTime" label="运行时间(h)" width="110" align="center" />
              <el-table-column prop="idleTime" label="空闲时间(h)" width="110" align="center" />
              <el-table-column prop="faultTime" label="故障时间(h)" width="110" align="center" />
              <el-table-column label="可用率" width="100" align="center">
                <template slot-scope="scope">
                  <span class="text-info">{{ scope.row.availability }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="性能率" width="100" align="center">
                <template slot-scope="scope">
                  <span class="text-info">{{ scope.row.performance }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="合格率" width="100" align="center">
                <template slot-scope="scope">
                  <span class="text-success">{{ scope.row.quality }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="OEE" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag size="small" :type="scope.row.oee >= 85 ? 'success' : scope.row.oee >= 70 ? 'warning' : 'danger'">
                    {{ scope.row.oee }}%
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="faultCount" label="故障次数" width="100" align="center" />
              <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
            </el-table>
          </div>

          <div class="pagination-section">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 生产数据 -->
      <el-tab-pane label="生产数据" name="production">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.production" class="search-form">
              <el-form-item label="批次号">
                <el-input v-model="searchForms.production.batchNo" placeholder="请输入批次号" clearable style="width: 180px" @keyup.enter.native="handleSearch" />
              </el-form-item>
              <el-form-item label="产品名称">
                <el-select v-model="searchForms.production.productName" placeholder="请选择" clearable style="width: 160px">
                  <el-option label="卡式瓶灌装" value="卡式瓶灌装" />
                  <el-option label="西林瓶灌装" value="西林瓶灌装" />
                  <el-option label="安瓿瓶灌装" value="安瓿瓶灌装" />
                </el-select>
              </el-form-item>
              <el-form-item label="生产状态">
                <el-select v-model="searchForms.production.status" placeholder="请选择" clearable style="width: 140px">
                  <el-option label="已完成" value="completed" />
                  <el-option label="生产中" value="running" />
                  <el-option label="已暂停" value="paused" />
                  <el-option label="异常" value="fault" />
                </el-select>
              </el-form-item>
              <el-form-item label="生产时间">
                <el-date-picker
                  v-model="searchForms.production.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="handleReset('production')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">共 <b>{{ total }}</b> 条记录</span>
            </div>
            <div class="toolbar-right">
              <ExportDropdown
                :data="tableData.production"
                :columns="exportColumns.production"
                title="生产数据"
                filename="生产数据"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </div>

          <div class="table-section">
            <el-table
              ref="productionTable"
              :data="tableData.production"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="batchNo" label="批次号" width="160" align="center" />
              <el-table-column prop="productName" label="产品名称" width="140" align="center" />
              <el-table-column prop="fillVolume" label="填充量(ml)" width="100" align="center" />
              <el-table-column prop="targetQty" label="目标数量" width="100" align="center" />
              <el-table-column prop="producedQty" label="已生产" width="100" align="center" />
              <el-table-column prop="qualifiedQty" label="合格数" width="100" align="center" />
              <el-table-column label="合格率" width="90" align="center">
                <template slot-scope="scope">
                  <span :class="scope.row.qualifiedRate >= 98 ? 'text-success' : 'text-warning'">
                    {{ scope.row.qualifiedRate }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="avgSpeed" label="平均速度(瓶/h)" width="130" align="center" />
              <el-table-column label="状态" width="90" align="center">
                <template slot-scope="scope">
                  <el-tag size="small" :type="getStatusType(scope.row.status)">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="160" align="center" />
              <el-table-column prop="endTime" label="结束时间" width="160" align="center" />
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
                  <el-button type="text" size="small" icon="el-icon-download" @click="handleExportOne(scope.row)">导出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-section">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 报警数据 -->
      <el-tab-pane label="报警数据" name="alarm">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.alarm" class="search-form">
              <el-form-item label="报警代码">
                <el-input v-model="searchForms.alarm.code" placeholder="请输入报警代码" clearable style="width: 160px" @keyup.enter.native="handleSearch" />
              </el-form-item>
              <el-form-item label="报警类型">
                <el-select v-model="searchForms.alarm.type" placeholder="请选择" clearable style="width: 160px">
                  <el-option label="位置异动" value="position" />
                  <el-option label="真空异常" value="vacuum" />
                  <el-option label="伺服使能" value="servo" />
                  <el-option label="超时报警" value="timeout" />
                  <el-option label="限位报警" value="limit" />
                </el-select>
              </el-form-item>
              <el-form-item label="报警级别">
                <el-select v-model="searchForms.alarm.level" placeholder="请选择" clearable style="width: 140px">
                  <el-option label="紧急" value="critical" />
                  <el-option label="警告" value="warning" />
                  <el-option label="提示" value="info" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchForms.alarm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="handleReset('alarm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">共 <b>{{ total }}</b> 条记录</span>
            </div>
            <div class="toolbar-right">
              <ExportDropdown
                :data="tableData.alarm"
                :columns="exportColumns.alarm"
                title="报警数据"
                filename="报警数据"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </div>

          <div class="table-section">
            <el-table
              ref="alarmTable"
              :data="tableData.alarm"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="alarmCode" label="报警代码" width="120" align="center" />
              <el-table-column prop="alarmName" label="报警名称" min-width="180" show-overflow-tooltip />
              <el-table-column prop="alarmType" label="报警类型" width="120" align="center" />
              <el-table-column label="报警级别" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag size="small" :type="scope.row.level === 'critical' ? 'danger' : scope.row.level === 'warning' ? 'warning' : 'info'">
                    {{ scope.row.level === 'critical' ? '紧急' : scope.row.level === 'warning' ? '警告' : '提示' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="发生时间" width="160" align="center" />
              <el-table-column prop="endTime" label="恢复时间" width="160" align="center" />
              <el-table-column prop="duration" label="持续时间" width="110" align="center" />
              <el-table-column prop="operator" label="处理人" width="100" align="center" />
              <el-table-column prop="remark" label="处理备注" min-width="150" show-overflow-tooltip />
            </el-table>
          </div>

          <div class="pagination-section">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 详情弹窗 -->
    <el-dialog title="生产详情" :visible.sync="detailDialogVisible" width="700px" append-to-body>
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="批次号">{{ currentRow.batchNo }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentRow.productName }}</el-descriptions-item>
        <el-descriptions-item label="填充量">{{ currentRow.fillVolume }} ml</el-descriptions-item>
        <el-descriptions-item label="生产状态">
          <el-tag size="small" :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="目标数量">{{ currentRow.targetQty }} 瓶</el-descriptions-item>
        <el-descriptions-item label="已生产">{{ currentRow.producedQty }} 瓶</el-descriptions-item>
        <el-descriptions-item label="合格数">{{ currentRow.qualifiedQty }} 瓶</el-descriptions-item>
        <el-descriptions-item label="合格率">{{ currentRow.qualifiedRate }}%</el-descriptions-item>
        <el-descriptions-item label="平均速度">{{ currentRow.avgSpeed }} 瓶/h</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentRow.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间" :span="2">{{ currentRow.endTime || '生产中' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentRow.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 数据管理页面 - 详细数据查询管理
 * 
 * 功能定位：对生产相关数据进行详细查询、筛选、搜索、下载、预览
 * 页签分类：
 * 1. 产能数据：按小时/日/周/月/班次统计的产能数据
 * 2. 稼动率数据：OEE综合效率、可用率、性能率、合格率
 * 3. 生产数据：批次生产详细数据
 * 4. 报警数据：报警历史记录
 * 
 * 功能特点：
 * - 每个页签独立的搜索筛选条件
 * - 复用 ExportDropdown 组件，支持 PDF/Excel 导出
 * - 支持全部导出和选中导出
 * - 支持分页、查看详情
 * 
 * 数据来源：
 * - 产能数据：后端从数据库查询（基于PLC实时数据采集存储）
 * - 稼动率数据：后端计算（运行时间D4020 / 停机时间D4022）
 * - 生产数据：批次表 + PLC实时数据
 * - 报警数据：报警历史表（基于M4000-M4110 + D4012）
 */
import ExportDropdown from '@/components/ExportDropdown'
import { mapState } from 'vuex'

export default {
  name: 'DataView',
  components: { ExportDropdown },
  data() {
    return {
      activeTab: 'output',
      selectedRows: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      detailDialogVisible: false,
      currentRow: null,
      // 各页签搜索表单
      searchForms: {
        output: { type: '', dateRange: [], productName: '' },
        oee: { type: '', dateRange: [] },
        production: { batchNo: '', productName: '', status: '', dateRange: [] },
        alarm: { code: '', type: '', level: '', dateRange: [] }
      },
      // 各页签表格数据
      tableData: {
        output: [],
        oee: [],
        production: [],
        alarm: []
      },
      // 各页签导出列配置
      exportColumns: {
        output: [
          { prop: 'period', label: '统计周期' },
          { prop: 'productName', label: '产品名称' },
          { prop: 'targetQty', label: '目标数量' },
          { prop: 'actualQty', label: '实际产量' },
          { prop: 'qualifiedQty', label: '合格数' },
          { prop: 'completionRate', label: '完成率(%)' },
          { prop: 'qualifiedRate', label: '合格率(%)' },
          { prop: 'avgSpeed', label: '平均速度(瓶/h)' },
          { prop: 'startTime', label: '开始时间' },
          { prop: 'endTime', label: '结束时间' }
        ],
        oee: [
          { prop: 'period', label: '统计周期' },
          { prop: 'planTime', label: '计划时间(h)' },
          { prop: 'runTime', label: '运行时间(h)' },
          { prop: 'idleTime', label: '空闲时间(h)' },
          { prop: 'faultTime', label: '故障时间(h)' },
          { prop: 'availability', label: '可用率(%)' },
          { prop: 'performance', label: '性能率(%)' },
          { prop: 'quality', label: '合格率(%)' },
          { prop: 'oee', label: 'OEE(%)' },
          { prop: 'faultCount', label: '故障次数' },
          { prop: 'remark', label: '备注' }
        ],
        production: [
          { prop: 'batchNo', label: '批次号' },
          { prop: 'productName', label: '产品名称' },
          { prop: 'fillVolume', label: '填充量(ml)' },
          { prop: 'targetQty', label: '目标数量' },
          { prop: 'producedQty', label: '已生产' },
          { prop: 'qualifiedQty', label: '合格数' },
          { prop: 'qualifiedRate', label: '合格率(%)' },
          { prop: 'avgSpeed', label: '平均速度(瓶/h)' },
          { prop: 'statusText', label: '状态' },
          { prop: 'startTime', label: '开始时间' },
          { prop: 'endTime', label: '结束时间' }
        ],
        alarm: [
          { prop: 'alarmCode', label: '报警代码' },
          { prop: 'alarmName', label: '报警名称' },
          { prop: 'alarmType', label: '报警类型' },
          { prop: 'levelText', label: '报警级别' },
          { prop: 'startTime', label: '发生时间' },
          { prop: 'endTime', label: '恢复时间' },
          { prop: 'duration', label: '持续时间' },
          { prop: 'operator', label: '处理人' },
          { prop: 'remark', label: '处理备注' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    currentUsername() {
      return this.userInfo?.realName || this.userInfo?.username || ''
    }
  },
  created() {
    // 确保设备数据已加载
    this.$store.dispatch('device/fetchAllData')
    this.loadData('output')
  },
  methods: {
    /**
     * 加载数据（模拟数据，实际项目中调用后端接口）
     */
    loadData(tab) {
      // 根据不同页签生成模拟数据
      const mockData = this.generateMockData(tab)
      this.tableData[tab] = mockData
      this.total = mockData.length
    },

    /**
     * 生成模拟数据
     */
    generateMockData(tab) {
      const data = []
      const products = ['卡式瓶灌装', '西林瓶灌装', '安瓿瓶灌装']
      const statuses = ['completed', 'running', 'paused', 'fault']
      const statusTexts = { completed: '已完成', running: '生产中', paused: '已暂停', fault: '异常' }
      const alarmTypes = ['位置异动', '真空异常', '伺服使能', '超时报警', '限位报警']
      const levels = ['critical', 'warning', 'info']
      const levelTexts = { critical: '紧急', warning: '警告', info: '提示' }

      for (let i = 1; i <= 30; i++) {
        const date = new Date(2026, 7, 24 - Math.floor(i / 3), 8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60))
        const pad = n => String(n).padStart(2, '0')
        const timeStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`

        if (tab === 'output') {
          const target = 5000 + Math.floor(Math.random() * 5000)
          const actual = Math.floor(target * (0.7 + Math.random() * 0.3))
          const qualified = Math.floor(actual * (0.95 + Math.random() * 0.049))
          data.push({
            id: i,
            period: `2026-08-${pad(24 - Math.floor(i / 3))} ${['白班', '夜班'][i % 2]}`,
            productName: products[Math.floor(Math.random() * products.length)],
            targetQty: target,
            actualQty: actual,
            qualifiedQty: qualified,
            completionRate: ((actual / target) * 100).toFixed(1),
            qualifiedRate: ((qualified / actual) * 100).toFixed(1),
            avgSpeed: 1000 + Math.floor(Math.random() * 500),
            startTime: timeStr,
            endTime: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours() + 4)}:${pad(date.getMinutes())}:00`
          })
        } else if (tab === 'oee') {
          const plan = 8
          const run = +(plan * (0.85 + Math.random() * 0.12)).toFixed(1)
          const idle = +((plan - run) * 0.6).toFixed(1)
          const fault = +(plan - run - idle).toFixed(1)
          const availability = ((run / plan) * 100).toFixed(1)
          const performance = (90 + Math.random() * 9).toFixed(1)
          const quality = (96 + Math.random() * 3.9).toFixed(1)
          const oee = ((availability * performance * quality) / 10000).toFixed(1)
          data.push({
            id: i,
            period: `2026-08-${pad(24 - Math.floor(i / 3))}`,
            planTime: plan,
            runTime: run,
            idleTime: idle,
            faultTime: fault,
            availability,
            performance,
            quality,
            oee,
            faultCount: Math.floor(Math.random() * 5),
            remark: fault > 0.5 ? '设备故障停机' : '正常运行'
          })
        } else if (tab === 'production') {
          const status = statuses[Math.floor(Math.random() * statuses.length)]
          const target = 5000 + Math.floor(Math.random() * 5000)
          const produced = status === 'completed' ? target : Math.floor(target * (0.3 + Math.random() * 0.6))
          const qualified = Math.floor(produced * (0.95 + Math.random() * 0.049))
          data.push({
            id: i,
            batchNo: `B202608${pad(24 - Math.floor(i / 3))}${String(i).padStart(3, '0')}`,
            productName: products[Math.floor(Math.random() * products.length)],
            fillVolume: (1.5 + Math.random() * 2).toFixed(1),
            targetQty: target,
            producedQty: produced,
            qualifiedQty: qualified,
            qualifiedRate: ((qualified / produced) * 100).toFixed(1),
            avgSpeed: 1000 + Math.floor(Math.random() * 500),
            status,
            statusText: statusTexts[status],
            startTime: timeStr,
            endTime: status === 'completed' ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours() + 4)}:${pad(date.getMinutes())}:00` : '',
            remark: ''
          })
        } else if (tab === 'alarm') {
          const level = levels[Math.floor(Math.random() * levels.length)]
          const duration = Math.floor(Math.random() * 300) + 10
          data.push({
            id: i,
            alarmCode: `M${4000 + Math.floor(Math.random() * 120)}`,
            alarmName: ['灌装轴位置异动报警', '真空异常报警', '伺服使能报警', '回原点超时报警', '正限位报警'][Math.floor(Math.random() * 5)],
            alarmType: alarmTypes[Math.floor(Math.random() * alarmTypes.length)],
            level,
            levelText: levelTexts[level],
            startTime: timeStr,
            endTime: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes() + Math.floor(duration / 60))}:${pad(duration % 60)}`,
            duration: `${Math.floor(duration / 60)}分${duration % 60}秒`,
            operator: ['张三', '李四', '王五', ''][Math.floor(Math.random() * 4)],
            remark: level === 'critical' ? '紧急处理，已更换部件' : level === 'warning' ? '已复位，继续观察' : '自动恢复'
          })
        }
      }
      return data
    },

    /**
     * 页签切换
     */
    handleTabChange(tab) {
      this.activeTab = tab.name
      this.currentPage = 1
      this.selectedRows = []
      this.loadData(tab.name)
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.currentPage = 1
      this.$message.success('搜索条件已应用')
    },

    /**
     * 重置
     */
    handleReset(tab) {
      if (tab === 'output') {
        this.searchForms.output = { type: '', dateRange: [], productName: '' }
      } else if (tab === 'oee') {
        this.searchForms.oee = { type: '', dateRange: [] }
      } else if (tab === 'production') {
        this.searchForms.production = { batchNo: '', productName: '', status: '', dateRange: [] }
      } else if (tab === 'alarm') {
        this.searchForms.alarm = { code: '', type: '', level: '', dateRange: [] }
      }
      this.currentPage = 1
      this.loadData(tab)
    },

    /**
     * 刷新
     */
    handleRefresh() {
      this.loadData(this.activeTab)
      this.$message.success('数据已刷新')
    },

    /**
     * 选中行变化
     */
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },

    /**
     * 分页大小变化
     */
    handleSizeChange(size) {
      this.pageSize = size
    },

    /**
     * 页码变化
     */
    handlePageChange(page) {
      this.currentPage = page
    },

    /**
     * 查看详情
     */
    handleView(row) {
      this.currentRow = row
      this.detailDialogVisible = true
    },

    /**
     * 导出单条
     */
    handleExportOne(row) {
      this.$message.info(`导出批次：${row.batchNo}`)
    },

    /**
     * 获取状态类型
     */
    getStatusType(status) {
      const map = { completed: 'success', running: 'primary', paused: 'warning', fault: 'danger' }
      return map[status] || 'info'
    },

    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const map = { completed: '已完成', running: '生产中', paused: '已暂停', fault: '异常' }
      return map[status] || status
    }
  }
}
</script>

<style scoped lang="less">
.data-management-container {
  padding: 16px;
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
}

// 页签样式
.data-tabs {
  /deep/ .el-tabs__header {
    margin-bottom: 12px;
    background: #fff;
    padding: 0 16px;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  }
  /deep/ .el-tabs__item {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
  }
  /deep/ .el-tabs__content {
    padding: 0;
  }
}

.tab-content {
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  padding: 16px;
}

// 搜索区域
.search-section {
  background: #f5f7fa;
  padding: 12px 16px 0;
  border-radius: 6px;
  margin-bottom: 12px;
  .search-form {
    /deep/ .el-form-item {
      margin-bottom: 12px;
    }
  }
}

// 操作栏
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .toolbar-left {
    .total-text {
      font-size: 13px;
      color: #606266;
      b { color: #409eff; font-size: 15px; }
    }
  }
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// 表格区域
.table-section {
  /deep/ .el-table {
    th {
      background: #f5f7fa !important;
      color: #606266;
      font-weight: 600;
    }
  }
}

// 分页区域
.pagination-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

// 文字颜色
.text-success {
  color: #67c23a;
  font-weight: 600;
}
.text-warning {
  color: #e6a23c;
  font-weight: 600;
}
.text-info {
  color: #409eff;
  font-weight: 600;
}
.text-danger {
  color: #f56c6c !important;
}
</style>
