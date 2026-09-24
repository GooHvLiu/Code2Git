<template>
  <div class="data-management-container">
    <el-tabs v-model="activeTab" class="data-tabs" @tab-change="handleTabChange">
      <!-- 产能数据 -->
      <el-tab-pane :label="t('layout.home.dataview.output.title')" name="output">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.output" class="search-form">
              <el-form-item :label="t('layout.home.data.label.type')">
                <el-select
                  v-model="searchForms.output.type"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option :label="t('layout.home.data.period.byHour')" value="hour" />
                  <el-option :label="t('layout.home.data.period.byDay')" value="day" />
                  <el-option :label="t('layout.home.data.period.byWeek')" value="week" />
                  <el-option :label="t('layout.home.data.period.byMonth')" value="month" />
                  <el-option :label="t('layout.home.data.period.byShift')" value="shift" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.dateRange')">
                <el-date-picker
                  v-model="searchForms.output.dateRange"
                  type="daterange"
                  size="small"
                  :range-separator="t('layout.home.data.placeholder.to')"
                  :start-placeholder="t('layout.home.data.placeholder.startDate')"
                  :end-placeholder="t('layout.home.data.placeholder.endDate')"
                  value-format="YYYY-MM-DD"
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.productName')">
                <el-select
                  v-model="searchForms.output.productName"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option
                    :label="t('layout.home.data.product.cartridge')"
                    :value="t('layout.home.data.product.cartridge')"
                  />
                  <el-option :label="t('layout.home.data.product.vial')" :value="t('layout.home.data.product.vial')" />
                  <el-option
                    :label="t('layout.home.data.product.ampoule')"
                    :value="t('layout.home.data.product.ampoule')"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permission="'home:data:output:search'"
                  type="primary"
                  :icon="Search"
                  size="small"
                  @click="handleSearch"
                  >{{ t('layout.home.data.button.search') }}</el-button
                >
                <el-button
                  v-permission="'home:data:output:reset'"
                  :icon="RefreshLeft"
                  size="small"
                  @click="handleReset('output')"
                  >{{ t('layout.home.data.button.reset') }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">{{ t('layout.home.data.total', { total }) }}</span>
            </div>
            <div class="toolbar-right">
              <export-dropdown
                v-permission="'home:data:output:export'"
                :data="tableData.output"
                :columns="exportColumns.output"
                :title="t('layout.home.data.tabs.output')"
                :filename="t('layout.home.data.tabs.output')"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button
                v-permission="'home:data:output:refresh'"
                type="primary"
                :icon="Refresh"
                size="small"
                @click="handleRefresh"
                >{{ t('layout.home.data.button.refresh') }}</el-button
              >
            </div>
          </div>

          <div class="table-section">
            <el-table
              :data="tableData.output"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" :label="t('layout.home.data.column.index')" width="60" align="center" />
              <el-table-column prop="period" :label="t('layout.home.data.column.period')" width="160" align="center" />
              <el-table-column
                prop="productName"
                :label="t('layout.home.data.column.productName')"
                width="140"
                align="center"
              />
              <el-table-column
                prop="targetQty"
                :label="t('layout.home.data.column.targetQty')"
                width="110"
                align="center"
              />
              <el-table-column
                prop="actualQty"
                :label="t('layout.home.data.column.actualQty')"
                width="110"
                align="center"
              />
              <el-table-column
                prop="qualifiedQty"
                :label="t('layout.home.data.column.qualifiedQty')"
                width="100"
                align="center"
              />
              <el-table-column :label="t('layout.home.data.column.completionRate')" width="100" align="center">
                <template #default="scope">
                  <span :class="scope.row.completionRate >= 90 ? 'text-success' : 'text-warning'"
                    >{{ scope.row.completionRate }}%</span
                  >
                </template>
              </el-table-column>
              <el-table-column :label="t('layout.home.data.column.qualifiedRate')" width="100" align="center">
                <template #default="scope">
                  <span :class="scope.row.qualifiedRate >= 98 ? 'text-success' : 'text-warning'"
                    >{{ scope.row.qualifiedRate }}%</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="avgSpeed"
                :label="t('layout.home.data.column.avgSpeed')"
                width="130"
                align="center"
              />
              <el-table-column
                prop="startTime"
                :label="t('layout.home.data.column.startTime')"
                width="160"
                align="center"
              />
              <el-table-column
                prop="endTime"
                :label="t('layout.home.data.column.endTime')"
                min-width="160"
                align="center"
              />
            </el-table>
          </div>

          <div class="pagination-section">
            <pagination
              v-model:page="currentPage"
              v-model:limit="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              @pagination="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 稼动率数据 -->
      <el-tab-pane :label="t('layout.home.dataview.oee.title')" name="oee">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.oee" class="search-form">
              <el-form-item :label="t('layout.home.data.label.type')">
                <el-select
                  v-model="searchForms.oee.type"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option :label="t('layout.home.data.period.byDay')" value="day" />
                  <el-option :label="t('layout.home.data.period.byWeek')" value="week" />
                  <el-option :label="t('layout.home.data.period.byMonth')" value="month" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.dateRange')">
                <el-date-picker
                  v-model="searchForms.oee.dateRange"
                  type="daterange"
                  :range-separator="t('layout.home.data.placeholder.to')"
                  :start-placeholder="t('layout.home.data.placeholder.startDate')"
                  :end-placeholder="t('layout.home.data.placeholder.endDate')"
                  value-format="YYYY-MM-DD"
                  size="small"
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permission="'home:data:oee:search'"
                  type="primary"
                  :icon="Search"
                  size="small"
                  @click="handleSearch"
                  >{{ t('layout.home.data.button.search') }}</el-button
                >
                <el-button
                  v-permission="'home:data:oee:reset'"
                  :icon="RefreshLeft"
                  size="small"
                  @click="handleReset('oee')"
                  >{{ t('layout.home.data.button.reset') }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">{{ t('layout.home.data.total', { total }) }}</span>
            </div>
            <div class="toolbar-right">
              <export-dropdown
                v-permission="'home:data:oee:export'"
                :data="tableData.oee"
                :columns="exportColumns.oee"
                :title="t('layout.home.data.tabs.oee')"
                :filename="t('layout.home.data.tabs.oee')"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button
                v-permission="'home:data:oee:refresh'"
                type="primary"
                :icon="Refresh"
                size="small"
                @click="handleRefresh"
                >{{ t('layout.home.data.button.refresh') }}</el-button
              >
            </div>
          </div>

          <div class="table-section">
            <el-table :data="tableData.oee" border stripe style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" :label="t('layout.home.data.column.index')" width="60" align="center" />
              <el-table-column prop="period" :label="t('layout.home.data.column.period')" width="160" align="center" />
              <el-table-column
                prop="planTime"
                :label="t('layout.home.data.column.planTime')"
                width="110"
                align="center"
              />
              <el-table-column
                prop="runTime"
                :label="t('layout.home.data.column.runTime')"
                width="110"
                align="center"
              />
              <el-table-column
                prop="idleTime"
                :label="t('layout.home.data.column.idleTime')"
                width="110"
                align="center"
              />
              <el-table-column
                prop="faultTime"
                :label="t('layout.home.data.column.faultTime')"
                width="110"
                align="center"
              />
              <el-table-column :label="t('layout.home.data.column.availability')" width="100" align="center">
                <template #default="scope"
                  ><span class="text-info">{{ scope.row.availability }}%</span></template
                >
              </el-table-column>
              <el-table-column :label="t('layout.home.data.column.performance')" width="100" align="center">
                <template #default="scope"
                  ><span class="text-info">{{ scope.row.performance }}%</span></template
                >
              </el-table-column>
              <el-table-column :label="t('layout.home.data.column.qualifiedRate')" width="100" align="center">
                <template #default="scope"
                  ><span class="text-success">{{ scope.row.quality }}%</span></template
                >
              </el-table-column>
              <el-table-column :label="t('layout.home.data.column.oee')" width="100" align="center">
                <template #default="scope">
                  <el-tag
                    size="small"
                    :type="scope.row.oee >= 85 ? 'success' : scope.row.oee >= 70 ? 'warning' : 'danger'"
                    >{{ scope.row.oee }}%</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="faultCount"
                :label="t('layout.home.data.column.faultCount')"
                width="100"
                align="center"
              />
              <el-table-column
                prop="remark"
                :label="t('layout.home.data.column.remark')"
                min-width="150"
                show-overflow-tooltip
              />
            </el-table>
          </div>

          <div class="pagination-section">
            <pagination
              v-model:page="currentPage"
              v-model:limit="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              @pagination="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 生产数据 -->
      <el-tab-pane :label="t('layout.home.dataview.production.title')" name="production">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.production" class="search-form">
              <el-form-item :label="t('layout.home.data.label.batchNo')">
                <el-input
                  v-model="searchForms.production.batchNo"
                  :placeholder="t('layout.home.data.placeholder.inputBatchNo')"
                  clearable
                  size="small"
                  style="width: 140px"
                  @keyup.enter="handleSearch"
                />
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.productName')">
                <el-select
                  v-model="searchForms.production.productName"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option
                    :label="t('layout.home.data.product.cartridge')"
                    :value="t('layout.home.data.product.cartridge')"
                  />
                  <el-option :label="t('layout.home.data.product.vial')" :value="t('layout.home.data.product.vial')" />
                  <el-option
                    :label="t('layout.home.data.product.ampoule')"
                    :value="t('layout.home.data.product.ampoule')"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.status')">
                <el-select
                  v-model="searchForms.production.status"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option :label="t('layout.home.data.status.completed')" value="completed" />
                  <el-option :label="t('layout.home.data.status.running')" value="running" />
                  <el-option :label="t('layout.home.data.status.paused')" value="paused" />
                  <el-option :label="t('layout.home.data.status.fault')" value="fault" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.productionTime')">
                <el-date-picker
                  v-model="searchForms.production.dateRange"
                  type="daterange"
                  :range-separator="t('layout.home.data.placeholder.to')"
                  size="small"
                  :start-placeholder="t('layout.home.data.placeholder.startDate')"
                  :end-placeholder="t('layout.home.data.placeholder.endDate')"
                  value-format="YYYY-MM-DD"
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permission="'home:data:production:search'"
                  type="primary"
                  :icon="Search"
                  size="small"
                  @click="handleSearch"
                  >{{ t('layout.home.data.button.search') }}</el-button
                >
                <el-button
                  v-permission="'home:data:production:reset'"
                  :icon="RefreshLeft"
                  size="small"
                  @click="handleReset('production')"
                  >{{ t('layout.home.data.button.reset') }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">{{ t('layout.home.data.total', { total }) }}</span>
            </div>
            <div class="toolbar-right">
              <export-dropdown
                v-permission="'home:data:production:export'"
                :data="tableData.production"
                :columns="exportColumns.production"
                :title="t('layout.home.data.tabs.production')"
                :filename="t('layout.home.data.tabs.production')"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button
                v-permission="'home:data:production:refresh'"
                type="primary"
                :icon="Refresh"
                size="small"
                @click="handleRefresh"
                >{{ t('layout.home.data.button.refresh') }}</el-button
              >
            </div>
          </div>

          <div class="table-section">
            <el-table
              :data="tableData.production"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" :label="t('layout.home.data.column.index')" width="60" align="center" />
              <el-table-column
                prop="batchNo"
                :label="t('layout.home.data.column.batchNo')"
                width="160"
                align="center"
              />
              <el-table-column
                prop="productName"
                :label="t('layout.home.data.column.productName')"
                width="140"
                align="center"
              />
              <el-table-column
                prop="fillVolume"
                :label="t('layout.home.data.column.fillVolume')"
                width="100"
                align="center"
              />
              <el-table-column
                prop="targetQty"
                :label="t('layout.home.data.column.targetQty')"
                width="100"
                align="center"
              />
              <el-table-column
                prop="producedQty"
                :label="t('layout.home.data.column.producedQty')"
                width="100"
                align="center"
              />
              <el-table-column
                prop="qualifiedQty"
                :label="t('layout.home.data.column.qualifiedQty')"
                width="100"
                align="center"
              />
              <el-table-column :label="t('layout.home.data.column.qualifiedRate')" width="90" align="center">
                <template #default="scope">
                  <span :class="scope.row.qualifiedRate >= 98 ? 'text-success' : 'text-warning'"
                    >{{ scope.row.qualifiedRate }}%</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="avgSpeed"
                :label="t('layout.home.data.column.avgSpeed')"
                width="130"
                align="center"
              />
              <el-table-column :label="t('layout.home.data.column.status')" width="90" align="center">
                <template #default="scope">
                  <el-tag size="small" :type="getStatusType(scope.row.status)">{{
                    getStatusText(scope.row.status)
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="startTime"
                :label="t('layout.home.data.column.startTime')"
                width="160"
                align="center"
              />
              <el-table-column
                prop="endTime"
                :label="t('layout.home.data.column.endTime')"
                width="160"
                align="center"
              />
              <el-table-column :label="t('layout.home.data.column.action')" width="120" align="center" fixed="right">
                <template #default="scope">
                  <el-button
                    v-permission="'home:data:production:detail'"
                    type="primary"
                    link
                    size="small"
                    :icon="View"
                    @click="handleView(scope.row)"
                    >{{ t('layout.home.data.button.detail') }}</el-button
                  >
                  <el-button
                    v-permission="'home:data:production:exportSingle'"
                    type="primary"
                    link
                    size="small"
                    :icon="Download"
                    @click="handleExportOne(scope.row)"
                    >{{ t('layout.home.data.button.export') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-section">
            <pagination
              v-model:page="currentPage"
              v-model:limit="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              @pagination="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 报警数据 -->
      <el-tab-pane :label="t('layout.home.dataview.alarm.title')" name="alarm">
        <div class="tab-content">
          <div class="search-section">
            <el-form :inline="true" :model="searchForms.alarm" class="search-form">
              <el-form-item :label="t('layout.home.data.label.alarmCode')">
                <el-input
                  v-model="searchForms.alarm.code"
                  :placeholder="t('layout.home.data.placeholder.inputAlarmCode')"
                  clearable
                  size="small"
                  style="width: 140px"
                  @keyup.enter="handleSearch"
                />
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.alarmType')">
                <el-select
                  v-model="searchForms.alarm.type"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option :label="t('layout.home.data.alarmType.position')" value="position" />
                  <el-option :label="t('layout.home.data.alarmType.vacuum')" value="vacuum" />
                  <el-option :label="t('layout.home.data.alarmType.servo')" value="servo" />
                  <el-option :label="t('layout.home.data.alarmType.timeout')" value="timeout" />
                  <el-option :label="t('layout.home.data.alarmType.limit')" value="limit" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.alarmLevel')">
                <el-select
                  v-model="searchForms.alarm.level"
                  :placeholder="t('layout.home.data.placeholder.select')"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option :label="t('layout.home.data.alarmLevel.critical')" value="critical" />
                  <el-option :label="t('layout.home.data.alarmLevel.warning')" value="warning" />
                  <el-option :label="t('layout.home.data.alarmLevel.info')" value="info" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('layout.home.data.label.dateRange')">
                <el-date-picker
                  v-model="searchForms.alarm.dateRange"
                  type="daterange"
                  :range-separator="t('layout.home.data.placeholder.to')"
                  size="small"
                  :start-placeholder="t('layout.home.data.placeholder.startDate')"
                  :end-placeholder="t('layout.home.data.placeholder.endDate')"
                  value-format="YYYY-MM-DD"
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permission="'home:data:alarm:search'"
                  type="primary"
                  :icon="Search"
                  size="small"
                  @click="handleSearch"
                  >{{ t('layout.home.data.button.search') }}</el-button
                >
                <el-button
                  v-permission="'home:data:alarm:reset'"
                  :icon="RefreshLeft"
                  size="small"
                  @click="handleReset('alarm')"
                  >{{ t('layout.home.data.button.reset') }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <div class="toolbar-section">
            <div class="toolbar-left">
              <span class="total-text">{{ t('layout.home.data.total', { total }) }}</span>
            </div>
            <div class="toolbar-right">
              <export-dropdown
                v-permission="'home:data:alarm:export'"
                :data="tableData.alarm"
                :columns="exportColumns.alarm"
                :title="t('layout.home.data.tabs.alarm')"
                :filename="t('layout.home.data.tabs.alarm')"
                :selected="selectedRows"
                :exporter="currentUsername"
              />
              <el-button
                v-permission="'home:data:alarm:refresh'"
                type="primary"
                :icon="Refresh"
                size="small"
                @click="handleRefresh"
                >{{ t('layout.home.data.button.refresh') }}</el-button
              >
            </div>
          </div>

          <div class="table-section">
            <el-table
              :data="tableData.alarm"
              border
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column type="index" :label="t('layout.home.data.column.index')" width="60" align="center" />
              <el-table-column
                prop="alarmCode"
                :label="t('layout.home.data.column.alarmCode')"
                width="120"
                align="center"
              />
              <el-table-column
                prop="alarmName"
                :label="t('layout.home.data.column.alarmName')"
                min-width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="alarmType"
                :label="t('layout.home.data.column.alarmType')"
                width="120"
                align="center"
              />
              <el-table-column :label="t('layout.home.data.column.alarmLevel')" width="100" align="center">
                <template #default="scope">
                  <el-tag
                    size="small"
                    :type="
                      scope.row.level === 'critical' ? 'danger' : scope.row.level === 'warning' ? 'warning' : 'info'
                    "
                  >
                    {{
                      scope.row.level === 'critical'
                        ? t('layout.home.data.alarmLevel.critical')
                        : scope.row.level === 'warning'
                          ? t('layout.home.data.alarmLevel.warning')
                          : t('layout.home.data.alarmLevel.info')
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="startTime"
                :label="t('layout.home.data.column.occurTime')"
                width="160"
                align="center"
              />
              <el-table-column
                prop="endTime"
                :label="t('layout.home.data.column.recoverTime')"
                width="160"
                align="center"
              />
              <el-table-column
                prop="duration"
                :label="t('layout.home.data.column.duration')"
                width="110"
                align="center"
              />
              <el-table-column
                prop="operator"
                :label="t('layout.home.data.column.operator')"
                width="100"
                align="center"
              />
              <el-table-column
                prop="remark"
                :label="t('layout.home.data.column.handleRemark')"
                min-width="150"
                show-overflow-tooltip
              />
            </el-table>
          </div>

          <div class="pagination-section">
            <pagination
              v-model:page="currentPage"
              v-model:limit="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              @pagination="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" :title="t('layout.home.data.detailTitle')" width="700px" append-to-body>
      <el-descriptions v-if="currentRow" :column="2" border>
        <el-descriptions-item :label="t('layout.home.data.column.batchNo')">{{
          currentRow.batchNo
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('layout.home.data.column.productName')">{{
          currentRow.productName
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('layout.home.data.column.fillVolume')"
          >{{ currentRow.fillVolume }} ml</el-descriptions-item
        >
        <el-descriptions-item :label="t('layout.home.data.column.status')">
          <el-tag size="small" :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('layout.home.data.column.targetQty')"
          >{{ currentRow.targetQty }} {{ t('layout.home.dashboard.metrics.bottle') }}</el-descriptions-item
        >
        <el-descriptions-item :label="t('layout.home.data.column.producedQty')"
          >{{ currentRow.producedQty }} {{ t('layout.home.dashboard.metrics.bottle') }}</el-descriptions-item
        >
        <el-descriptions-item :label="t('layout.home.data.column.qualifiedQty')"
          >{{ currentRow.qualifiedQty }} {{ t('layout.home.dashboard.metrics.bottle') }}</el-descriptions-item
        >
        <el-descriptions-item :label="t('layout.home.data.column.qualifiedRate')"
          >{{ currentRow.qualifiedRate }}%</el-descriptions-item
        >
        <el-descriptions-item :label="t('layout.home.data.column.avgSpeed')"
          >{{ currentRow.avgSpeed }} {{ t('layout.home.dashboard.metrics.bottlePerHour') }}</el-descriptions-item
        >
        <el-descriptions-item :label="t('layout.home.data.column.startTime')">{{
          currentRow.startTime
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('layout.home.data.column.endTime')" :span="2">{{
          currentRow.endTime || t('layout.home.data.status.producing')
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('layout.home.data.column.remark')" :span="2">{{
          currentRow.remark || '-'
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">{{ t('layout.home.data.button.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 数据管理 - 详细数据查询管理（产能/稼动率/生产/报警四个页签）
 * 注：当前为模拟数据占位，待对接后端；UI 文案已接入 layout.home.data 国际化。
 * 作者：GooHv
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, Refresh, RefreshLeft, View, Download } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { useUserStore } from '@/store/modules/user'
import { showSuccess, showInfo } from '@/utils/ui/feedback'
import type { ExportColumn } from '@/utils/business/exportTable'

const { t } = useI18n()
const userStore = useUserStore()

type TabName = 'output' | 'oee' | 'production' | 'alarm'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

const activeTab = ref<TabName>('output')
const selectedRows = ref<Row[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentRow = ref<Row | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchForms = reactive<Record<TabName, Record<string, any>>>({
  output: { type: '', dateRange: [], productName: '' },
  oee: { type: '', dateRange: [] },
  production: { batchNo: '', productName: '', status: '', dateRange: [] },
  alarm: { code: '', type: '', level: '', dateRange: [] }
})

const tableData = reactive<Record<TabName, Row[]>>({ output: [], oee: [], production: [], alarm: [] })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exportColumns = reactive<Record<TabName, ExportColumn[]>>({
  output: [
    { prop: 'period', label: t('layout.home.data.column.period') },
    { prop: 'productName', label: t('layout.home.data.column.productName') },
    { prop: 'targetQty', label: t('layout.home.data.column.targetQty') },
    { prop: 'actualQty', label: t('layout.home.data.column.actualQty') },
    { prop: 'qualifiedQty', label: t('layout.home.data.column.qualifiedQty') },
    { prop: 'completionRate', label: t('layout.home.data.column.completionRate') },
    { prop: 'qualifiedRate', label: t('layout.home.data.column.qualifiedRate') },
    { prop: 'avgSpeed', label: t('layout.home.data.column.avgSpeed') },
    { prop: 'startTime', label: t('layout.home.data.column.startTime') },
    { prop: 'endTime', label: t('layout.home.data.column.endTime') }
  ],
  oee: [
    { prop: 'period', label: t('layout.home.data.column.period') },
    { prop: 'planTime', label: t('layout.home.data.column.planTime') },
    { prop: 'runTime', label: t('layout.home.data.column.runTime') },
    { prop: 'idleTime', label: t('layout.home.data.column.idleTime') },
    { prop: 'faultTime', label: t('layout.home.data.column.faultTime') },
    { prop: 'availability', label: t('layout.home.data.column.availability') },
    { prop: 'performance', label: t('layout.home.data.column.performance') },
    { prop: 'quality', label: t('layout.home.data.column.qualifiedRate') },
    { prop: 'oee', label: t('layout.home.data.column.oee') },
    { prop: 'faultCount', label: t('layout.home.data.column.faultCount') },
    { prop: 'remark', label: t('layout.home.data.column.remark') }
  ],
  production: [
    { prop: 'batchNo', label: t('layout.home.data.column.batchNo') },
    { prop: 'productName', label: t('layout.home.data.column.productName') },
    { prop: 'fillVolume', label: t('layout.home.data.column.fillVolume') },
    { prop: 'targetQty', label: t('layout.home.data.column.targetQty') },
    { prop: 'producedQty', label: t('layout.home.data.column.producedQty') },
    { prop: 'qualifiedQty', label: t('layout.home.data.column.qualifiedQty') },
    { prop: 'qualifiedRate', label: t('layout.home.data.column.qualifiedRate') },
    { prop: 'avgSpeed', label: t('layout.home.data.column.avgSpeed') },
    { prop: 'statusText', label: t('layout.home.data.column.status') },
    { prop: 'startTime', label: t('layout.home.data.column.startTime') },
    { prop: 'endTime', label: t('layout.home.data.column.endTime') }
  ],
  alarm: [
    { prop: 'alarmCode', label: t('layout.home.data.column.alarmCode') },
    { prop: 'alarmName', label: t('layout.home.data.column.alarmName') },
    { prop: 'alarmType', label: t('layout.home.data.column.alarmType') },
    { prop: 'levelText', label: t('layout.home.data.column.alarmLevel') },
    { prop: 'startTime', label: t('layout.home.data.column.occurTime') },
    { prop: 'endTime', label: t('layout.home.data.column.recoverTime') },
    { prop: 'duration', label: t('layout.home.data.column.duration') },
    { prop: 'operator', label: t('layout.home.data.column.operator') },
    { prop: 'remark', label: t('layout.home.data.column.handleRemark') }
  ]
})

const currentUsername = computed(() => userStore.userInfo?.realName || userStore.userInfo?.username || '')

function loadData(tab: TabName): void {
  const mockData = generateMockData(tab)
  tableData[tab] = mockData
  total.value = mockData.length
}

function generateMockData(tab: TabName): Row[] {
  const data: Row[] = []
  const products = ['卡式瓶灌装', '西林瓶灌装', '安瓿瓶灌装']
  const statuses = ['completed', 'running', 'paused', 'fault']
  const statusTexts: Record<string, string> = {
    completed: '已完成',
    running: '生产中',
    paused: '已暂停',
    fault: '异常'
  }
  const alarmTypes = ['位置异动', '真空异常', '伺服使能', '超时报警', '限位报警']
  const levels = ['critical', 'warning', 'info']
  const levelTexts: Record<string, string> = { critical: '紧急', warning: '警告', info: '提示' }

  for (let i = 1; i <= 30; i++) {
    const date = new Date(
      2026,
      7,
      24 - Math.floor(i / 3),
      8 + Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 60)
    )
    const pad = (n: number) => String(n).padStart(2, '0')
    const timeStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`
    const endTimeBase = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours() + 4)}:${pad(date.getMinutes())}:00`

    if (tab === 'output') {
      const target = 5000 + Math.floor(Math.random() * 5000)
      const actual = Math.floor(target * (0.7 + Math.random() * 0.3))
      const qualified = Math.floor(actual * (0.95 + Math.random() * 0.049))
      data.push({
        id: i,
        period: `2026-08-${pad(24 - Math.floor(i / 3))} ${[t('common.shift.day'), t('common.shift.night')][i % 2]}`,
        productName: products[Math.floor(Math.random() * products.length)],
        targetQty: target,
        actualQty: actual,
        qualifiedQty: qualified,
        completionRate: ((actual / target) * 100).toFixed(1),
        qualifiedRate: ((qualified / actual) * 100).toFixed(1),
        avgSpeed: 1000 + Math.floor(Math.random() * 500),
        startTime: timeStr,
        endTime: endTimeBase
      })
    } else if (tab === 'oee') {
      const plan = 8
      const run = +(plan * (0.85 + Math.random() * 0.12)).toFixed(1)
      const idle = +((plan - run) * 0.6).toFixed(1)
      const fault = +(plan - run - idle).toFixed(1)
      const availability = ((run / plan) * 100).toFixed(1)
      const performance = (90 + Math.random() * 9).toFixed(1)
      const quality = (96 + Math.random() * 3.9).toFixed(1)
      const oee = ((Number(availability) * Number(performance) * Number(quality)) / 10000).toFixed(1)
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
        endTime: status === 'completed' ? endTimeBase : '',
        remark: ''
      })
    } else {
      const level = levels[Math.floor(Math.random() * levels.length)]
      const duration = Math.floor(Math.random() * 300) + 10
      data.push({
        id: i,
        alarmCode: `M${4000 + Math.floor(Math.random() * 120)}`,
        alarmName: ['灌装轴位置异动报警', '真空异常报警', '伺服使能报警', '回原点超时报警', '正限位报警'][
          Math.floor(Math.random() * 5)
        ],
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
}

function handleTabChange(name: string | number): void {
  const tab = name as TabName
  activeTab.value = tab
  currentPage.value = 1
  selectedRows.value = []
  loadData(tab)
}

function handleSearch(): void {
  currentPage.value = 1
  showSuccess(t('layout.home.data.searchApplied'))
}

function handleReset(tab: TabName): void {
  if (tab === 'output') searchForms.output = { type: '', dateRange: [], productName: '' }
  else if (tab === 'oee') searchForms.oee = { type: '', dateRange: [] }
  else if (tab === 'production') searchForms.production = { batchNo: '', productName: '', status: '', dateRange: [] }
  else searchForms.alarm = { code: '', type: '', level: '', dateRange: [] }
  currentPage.value = 1
  loadData(tab)
}

function handleRefresh(): void {
  loadData(activeTab.value)
  showSuccess(t('layout.home.data.refreshed'))
}

function handleSelectionChange(rows: Row[]): void {
  selectedRows.value = rows
}

function handlePageChange(): void {
  /* 模拟数据前端分页占位 */
}

function handleView(row: Row): void {
  currentRow.value = row
  detailDialogVisible.value = true
}

function handleExportOne(row: Row): void {
  showInfo(t('layout.home.data.exportBatch', { batchNo: row.batchNo }))
}

function getStatusType(status?: string): 'success' | 'primary' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'primary' | 'warning' | 'danger'> = {
    completed: 'success',
    running: 'primary',
    paused: 'warning',
    fault: 'danger'
  }
  return (status && map[status]) || 'info'
}

function getStatusText(status?: string): string {
  const map: Record<string, string> = {
    completed: t('layout.home.data.status.completed'),
    running: t('layout.home.data.status.running'),
    paused: t('layout.home.data.status.paused'),
    fault: t('layout.home.data.status.fault')
  }
  return (status && map[status]) || status || ''
}

onMounted(() => {
  loadData('output')
})
</script>

<style scoped lang="less">
.data-management-container {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 84px);
}

// 页签样式
.data-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
    background: #fff;
    padding: 0 16px;
    border-radius: 8px 8px 0 0;
    border: 1px solid #ebeef5;
    border-bottom: none;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  }
  :deep(.el-tabs__item) {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
  }
  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.tab-content {
  background: #fff;
  border-radius: 0 0 8px 8px;
  border: 1px solid #ebeef5;
  border-top: none;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  padding: 16px;
}

// 搜索区域
.search-section {
  background: #fff;
  padding: 12px 16px 0;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
  .search-form {
    :deep(.el-form-item) {
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
      b {
        color: #409eff;
        font-size: 15px;
      }
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
  :deep(.el-table) {
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
