<template>
  <div class="system-config-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ pageTitle }}
        </h2>
        <p class="page-desc">
          {{ $t('system.config.desc') }}
        </p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          :disabled="configStatus !== 'ready'"
          :loading="loading"
          @click="handleSave"
        >
          {{ $t('system.config.save') }}
        </el-button>
        <el-button
          icon="el-icon-refresh-left"
          size="small"
          :disabled="configStatus !== 'ready'"
          :loading="loading"
          @click="handleReset"
        >
          {{ $t('system.config.reset') }}
        </el-button>
      </div>
    </div>

    <!-- 主体内容：左侧导航 + 右侧配置 -->
    <div class="config-body">
      <!-- 左侧分类导航 -->
      <div class="config-sidebar">
        <div
          v-for="item in filteredMenuList"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeMenu === item.key }"
          @click="activeMenu = item.key"
        >
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </div>
      </div>

      <!-- 右侧配置内容 -->
      <div class="config-content">
        <!-- 加载中状态 -->
        <div v-if="configStatus === 'loading'" class="config-status-wrapper">
          <div class="config-status-loading">
            <i class="el-icon-loading status-icon"></i>
            <p class="status-text">{{ $t('system.config.statusLoading') }}</p>
          </div>
        </div>

        <!-- 加载失败状态 -->
        <div v-else-if="configStatus === 'error'" class="config-status-wrapper">
          <div class="config-status-error">
            <i class="el-icon-warning-outline status-icon error-icon"></i>
            <h3 class="status-title">{{ $t('system.config.loadFailedTitle') }}</h3>
            <p class="status-desc">{{ $t('system.config.loadFailedDesc') }}</p>
            <el-button type="primary" icon="el-icon-refresh" @click="loadConfigs">
              {{ $t('common.refresh') }}
            </el-button>
          </div>
        </div>

        <!-- 配置不完整状态 -->
        <div v-else-if="configStatus === 'incomplete'" class="config-status-wrapper">
          <div class="config-status-incomplete">
            <el-alert
              :title="$t('system.config.incompleteTitle')"
              type="warning"
              :closable="false"
              show-icon
              class="incomplete-alert"
            >
              <template #default>
                <p class="incomplete-desc">
                  {{ $t('system.config.incompleteDetected', { count: missingConfigKeys.length }) }}
                </p>
                <div class="missing-keys-list">
                  <p class="missing-keys-title">{{ $t('system.config.missingKeysTitle') }}</p>
                  <ul>
                    <li v-for="key in missingConfigKeys" :key="key">
                      {{ key }}
                    </li>
                  </ul>
                </div>
                <p class="incomplete-tip">
                  {{ $t('system.config.incompleteTip') }}
                </p>
              </template>
            </el-alert>
            <div class="incomplete-actions">
              <el-button type="primary" icon="el-icon-refresh" @click="loadConfigs">
                {{ $t('common.refresh') }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 正常配置内容（只有 ready 状态才显示） -->
        <div v-else class="config-panels-wrapper">
          <!-- 系统设置 -->
          <div v-if="activeMenu === 'system'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.system.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="label-with-tip">
                    {{ $t('system.config.system.sessionTimeout') }}
                    <el-tooltip :content="$t('system.config.system.sessionTimeoutTip')" placement="top">
                      <i class="el-icon-question label-tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.sessionTimeout"
                  :min="5"
                  :max="120"
                  :step="5"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('system.config.system.minutes') }}</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="label-with-tip">
                    {{ $t('system.config.system.defaultPageSize') }}
                    <el-tooltip :content="$t('system.config.system.defaultPageSizeTip')" placement="top">
                      <i class="el-icon-question label-tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="form.defaultPageSize" style="width: 200px">
                  <el-option :label="10" :value="10" />
                  <el-option :label="20" :value="20" />
                  <el-option :label="50" :value="50" />
                  <el-option :label="100" :value="100" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="label-with-tip">
                    {{ $t('system.config.system.defaultLanguage') }}
                    <el-tooltip :content="$t('system.config.system.defaultLanguageTip')" placement="top">
                      <i class="el-icon-question label-tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="form.defaultLanguage" style="width: 200px">
                  <el-option
                    v-for="lang in languageOptions"
                    :key="lang.value"
                    :label="lang.autonym || lang.label"
                    :value="lang.value"
                  >
                    <span style="display: flex; align-items: center">
                      <svg-icon
                        :icon-class="lang.flag || 'global'"
                        style="width: 20px; height: 20px; margin-right: 8px"
                      />
                      <span>{{ lang.autonym || lang.label }}</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="label-with-tip">
                    {{ $t('system.config.system.dateFormat') }}
                    <el-tooltip :content="$t('system.config.system.dateFormatTip')" placement="top">
                      <i class="el-icon-question label-tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="form.dateFormat" style="width: 200px">
                  <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                  <el-option label="YYYY/MM/DD" value="YYYY/MM/DD" />
                  <el-option label="DD-MM-YYYY" value="DD-MM-YYYY" />
                  <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 安全设置 -->
          <div v-if="activeMenu === 'security'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.security.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item :label="$t('system.config.security.watermarkEnabled')">
                <el-switch v-model="form.watermarkEnabled" active-color="#13ce66" inactive-color="#c0c4cc" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.security.watermarkText') }}
                    <el-tooltip :content="$t('system.config.security.watermarkTextTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.watermarkText"
                  :placeholder="$t('system.config.security.watermarkPlaceholder')"
                  clearable
                  style="width: 200px"
                />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.security.loginFailedThreshold') }}
                    <el-tooltip :content="$t('system.config.security.loginFailedThresholdTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.loginFailedThreshold"
                  :min="1"
                  :max="20"
                  :step="1"
                  controls-position="right"
                />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.security.lockDurationMinutes') }}
                    <el-tooltip :content="$t('system.config.security.lockDurationMinutesTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.lockDurationMinutes"
                  :min="1"
                  :max="1440"
                  :step="1"
                  controls-position="right"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 设备连接设置 -->
          <div v-if="activeMenu === 'plc'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('superPanel.config.plc.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.plc.protocol') }}
                    <el-tooltip :content="$t('superPanel.config.plc.protocolTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="form.plcProtocol" style="width: 200px">
                  <el-option label="Modbus TCP" value="ModbusTcp" />
                  <el-option label="S7" value="S7" />
                  <el-option label="OPC UA" value="OpcUa" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.plc.host') }}
                    <el-tooltip :content="$t('superPanel.config.plc.hostTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input v-model="form.plcHost" placeholder="192.168.1.100" style="width: 250px" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.plc.port') }}
                    <el-tooltip :content="$t('superPanel.config.plc.portTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.plcPort" :min="1" :max="65535" controls-position="right" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.plc.unitId') }}
                    <el-tooltip :content="$t('superPanel.config.plc.unitIdTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number v-model="form.plcUnitId" :min="1" :max="255" controls-position="right" />
              </el-form-item>

              <el-divider content-position="left">
                {{ $t('superPanel.config.plc.pollSettings') }}
              </el-divider>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.plc.pollFast') }}
                    <el-tooltip :content="$t('superPanel.config.plc.pollFastTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.pollFastInterval"
                  :min="50"
                  :max="5000"
                  :step="50"
                  controls-position="right"
                />
                <span class="unit-text">ms</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.plc.pollSlow') }}
                    <el-tooltip :content="$t('superPanel.config.plc.pollSlowTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.pollSlowInterval"
                  :min="100"
                  :max="10000"
                  :step="100"
                  controls-position="right"
                />
                <span class="unit-text">ms</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 导出设置 -->
          <div v-if="activeMenu === 'export'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.export.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.export.pdfWatermarkEnabled') }}
                    <el-tooltip :content="$t('system.config.export.pdfWatermarkEnabledTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.pdfWatermarkEnabled" active-color="#13ce66" inactive-color="#c0c4cc" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.export.pdfWatermarkText') }}
                    <el-tooltip :content="$t('system.config.export.pdfWatermarkTextTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.pdfWatermarkText"
                  :placeholder="$t('system.config.export.pdfWatermarkPlaceholder')"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 连接设置 -->
          <div v-if="activeMenu === 'connection'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('superPanel.config.connection.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.connection.heartbeatInterval') }}
                    <el-tooltip :content="$t('superPanel.config.connection.heartbeatIntervalTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.heartbeatInterval"
                  :min="5000"
                  :max="60000"
                  :step="1000"
                  controls-position="right"
                />
                <span class="unit-text">ms</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.connection.deviceStatusCheckInterval') }}
                    <el-tooltip
                      :content="$t('superPanel.config.connection.deviceStatusCheckIntervalTip')"
                      placement="top"
                    >
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.deviceStatusCheckInterval"
                  :min="60"
                  :max="3600"
                  :step="60"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('superPanel.config.connection.unitSecond') }}</span>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.connection.deviceOfflineThreshold') }}
                    <el-tooltip :content="$t('superPanel.config.connection.deviceOfflineThresholdTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.deviceOfflineThreshold"
                  :min="120"
                  :max="7200"
                  :step="60"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('superPanel.config.connection.unitSecond') }}</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.connection.maintenanceCheckInterval') }}
                    <el-tooltip
                      :content="$t('superPanel.config.connection.maintenanceCheckIntervalTip')"
                      placement="top"
                    >
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.maintenanceCheckInterval"
                  :min="1"
                  :max="168"
                  :step="1"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('superPanel.config.connection.unitHour') }}</span>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('superPanel.config.connection.partLifeStatInterval') }}
                    <el-tooltip :content="$t('superPanel.config.connection.partLifeStatIntervalTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.partLifeStatInterval"
                  :min="1"
                  :max="60"
                  :step="1"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('superPanel.config.connection.unitMinute') }}</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 设备参数 -->
          <div v-if="activeMenu === 'device'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.device.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.deviceName') }}
                    <el-tooltip :content="$t('system.config.device.deviceNameTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.deviceName"
                  :placeholder="$t('system.config.device.deviceName')"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.deviceCode') }}
                    <el-tooltip :content="$t('system.config.device.deviceCodeTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.deviceCode"
                  :placeholder="$t('system.config.device.deviceCode')"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.deviceRegion') }}
                    <el-tooltip :content="$t('system.config.device.deviceRegionTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-cascader
                  v-model="form.deviceRegion"
                  :options="regionOptions"
                  :props="{ expandTrigger: 'hover' }"
                  :placeholder="$t('system.config.device.deviceRegion')"
                  clearable
                  filterable
                  popper-class="device-region-cascader"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.deviceInstallDate') }}
                    <el-tooltip :content="$t('system.config.device.deviceInstallDateTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-date-picker
                  v-model="form.deviceInstallDate"
                  type="date"
                  :placeholder="$t('system.config.device.deviceInstallDate')"
                  value-format="yyyy-MM-dd"
                  style="width: 300px"
                />
              </el-form-item>
            </el-form>

            <!-- 部件寿命提醒设置 -->
            <h3 class="panel-title" style="margin-top: 24px">
              {{ $t('system.config.device.partLifeSettingsTitle') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.partLifeReminderEnabled') }}
                    <el-tooltip :content="$t('system.config.device.partLifeReminderEnabledTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.partLifeReminderEnabled" :active-value="true" :inactive-value="false" />
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.partLifeThreshold') }}
                    <el-tooltip :content="$t('system.config.device.partLifeThresholdTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select
                  v-model="form.partLifeThreshold"
                  style="width: 200px"
                  :disabled="!form.partLifeReminderEnabled"
                >
                  <el-option label="10%" value="10" />
                  <el-option label="20%" value="20" />
                  <el-option label="30%" value="30" />
                  <el-option label="50%" value="50" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.partLifeRemindInterval') }}
                    <el-tooltip :content="$t('system.config.device.partLifeRemindIntervalTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select
                  v-model="form.partLifeRemindInterval"
                  style="width: 200px"
                  :disabled="!form.partLifeReminderEnabled"
                >
                  <el-option :label="$t('system.config.device.intervalHour')" value="hour" />
                  <el-option :label="$t('system.config.device.intervalShift')" value="shift" />
                  <el-option :label="$t('system.config.device.intervalDay')" value="day" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.device.snoozeInterval') }}
                    <el-tooltip :content="$t('system.config.device.snoozeIntervalTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-select
                  v-model="form.partLifeSnoozeInterval"
                  style="width: 200px"
                  :disabled="!form.partLifeReminderEnabled"
                >
                  <el-option :label="$t('system.config.device.snooze5min')" value="5" />
                  <el-option :label="$t('system.config.device.snooze10min')" value="10" />
                  <el-option :label="$t('system.config.device.snooze30min')" value="30" />
                  <el-option :label="$t('system.config.device.snooze1hour')" value="60" />
                  <el-option :label="$t('system.config.device.snooze2hour')" value="120" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 订单设置 -->
          <div v-if="activeMenu === 'order'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.order.title') }}
            </h3>

            <!-- 生产控制区域 -->
            <div class="config-section">
              <div class="section-title">
                <i class="el-icon-cpu"></i>
                <span>{{ $t('system.config.order.productionControl') }}</span>
              </div>
              <el-form :model="form" label-width="250px">
                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.allowNoOrderProduction') }}
                      <el-tooltip :content="$t('system.config.order.allowNoOrderProductionTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.allowNoOrderProduction" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.noOrderProductionHighlight') }}
                      <el-tooltip :content="$t('system.config.order.noOrderProductionHighlightTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch
                    v-model="form.noOrderProductionHighlight"
                    :disabled="!form.allowNoOrderProduction"
                    active-color="#e6a23c"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.orderSwitchConfirm') }}
                      <el-tooltip :content="$t('system.config.order.orderSwitchConfirmTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.orderSwitchConfirm" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.autoArchiveCompleted') }}
                      <el-tooltip :content="$t('system.config.order.autoArchiveCompletedTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.autoArchiveCompleted" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>
              </el-form>
            </div>

            <!-- 统计展示区域 -->
            <div class="config-section">
              <div class="section-title">
                <i class="el-icon-data-line"></i>
                <span>{{ $t('system.config.order.statDisplay') }}</span>
              </div>
              <el-form :model="form" label-width="250px">
                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.showOperatorName') }}
                      <el-tooltip :content="$t('system.config.order.showOperatorNameTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.showOperatorName" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.showAlarmCount') }}
                      <el-tooltip :content="$t('system.config.order.showAlarmCountTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.showAlarmCount" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.showRuntime') }}
                      <el-tooltip :content="$t('system.config.order.showRuntimeTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.showRuntime" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>
              </el-form>
            </div>

            <!-- 报告设置区域 -->
            <div class="config-section">
              <div class="section-title">
                <i class="el-icon-document"></i>
                <span>{{ $t('system.config.order.reportConfig') }}</span>
              </div>
              <el-form :model="form" label-width="250px">
                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.reportIncludeAlarmDetail') }}
                      <el-tooltip :content="$t('system.config.order.reportIncludeAlarmDetailTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.reportIncludeAlarmDetail" active-color="#13ce66" inactive-color="#c0c4cc" />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.reportIncludeOperatorDetail') }}
                      <el-tooltip :content="$t('system.config.order.reportIncludeOperatorDetailTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch
                    v-model="form.reportIncludeOperatorDetail"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.reportIncludeDownloadCount') }}
                      <el-tooltip :content="$t('system.config.order.reportIncludeDownloadCountTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch
                    v-model="form.reportIncludeDownloadCount"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span class="config-label-tip">
                      {{ $t('system.config.order.allowRunningOrderDownload') }}
                      <el-tooltip :content="$t('system.config.order.allowRunningOrderDownloadTip')" placement="top">
                        <i class="el-icon-question tip-icon"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="form.allowRunningOrderDownload" active-color="#e6a23c" inactive-color="#c0c4cc" />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 邮箱配置 -->
          <div v-if="activeMenu === 'email'" class="config-panel">
            <EmailConfig />
          </div>

          <!-- 邮件日志 -->
          <div v-if="activeMenu === 'emailLog'" class="config-panel">
            <EmailLog />
          </div>

          <!-- 通知设置 -->
          <div v-if="activeMenu === 'notification'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.notification.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <!-- 自动已读天数 -->
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.notification.autoReadDays') }}
                    <el-tooltip :content="$t('system.config.notification.autoReadDaysTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.notificationAutoReadDays"
                  :min="1"
                  :max="30"
                  :step="1"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('system.config.notification.unitDay') }}</span>
              </el-form-item>

              <!-- 声音提醒 -->
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.notification.soundEnabled') }}
                    <el-tooltip :content="$t('system.config.notification.soundEnabledTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-switch v-model="form.notificationSoundEnabled" active-value="true" inactive-value="false" />
              </el-form-item>
            </el-form>
          </div>

          <!-- 授权设置 -->
          <div v-if="activeMenu === 'licenseSetting'" class="config-panel">
            <h3 class="panel-title">
              {{ $t('system.config.licenseSetting.title') }}
            </h3>
            <el-form :model="form" label-width="160px">
              <!-- 到期提醒天数 -->
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.licenseSetting.expiringDays') }}
                    <el-tooltip :content="$t('system.config.licenseSetting.expiringDaysTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.licenseExpiringDays"
                  :min="1"
                  :max="90"
                  :step="1"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('system.config.licenseSetting.unitDay') }}</span>
              </el-form-item>

              <!-- 宽限期 -->
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.licenseSetting.gracePeriod') }}
                    <el-tooltip :content="$t('system.config.licenseSetting.gracePeriodTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.licenseGracePeriod"
                  :min="0"
                  :max="30"
                  :step="1"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('system.config.licenseSetting.unitDay') }}</span>
              </el-form-item>

              <!-- 检查间隔 -->
              <el-form-item>
                <template #label>
                  <span class="config-label-tip">
                    {{ $t('system.config.licenseSetting.checkInterval') }}
                    <el-tooltip :content="$t('system.config.licenseSetting.checkIntervalTip')" placement="top">
                      <i class="el-icon-question tip-icon"></i>
                    </el-tooltip>
                  </span>
                </template>
                <el-input-number
                  v-model="form.licenseCheckInterval"
                  :min="1"
                  :max="168"
                  :step="1"
                  controls-position="right"
                />
                <span class="unit-text">{{ $t('system.config.licenseSetting.unitHour') }}</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 授权管理 -->
          <div v-if="activeMenu === 'license'" class="config-panel license-panel">
            <!-- 顶部操作栏 -->
            <div class="license-toolbar">
              <div class="toolbar-title">
                <i class="el-icon-key"></i>
                <span>{{ $t('system.config.superPanelLicense.manageTitle') }}</span>
              </div>
              <div class="toolbar-actions">
                <el-button size="small" icon="el-icon-refresh" :loading="licenseLoading" @click="loadLicenseData">
                  {{ $t('system.config.superPanelLicense.refresh') }}
                </el-button>
                <el-button size="small" type="primary" icon="el-icon-upload2" @click="showLicenseImport = true">
                  {{ $t('system.config.superPanelLicense.importLicense') }}
                </el-button>
                <el-button v-if="isAdmin" size="small" icon="el-icon-download" @click="handleDownloadLicense">
                  {{ $t('system.config.superPanelLicense.download') }}
                </el-button>
              </div>
            </div>

            <!-- 授权状态卡片 -->
            <div class="license-status-card" :class="{ valid: licenseData.valid, invalid: !licenseData.valid }">
              <div class="status-left">
                <i :class="licenseData.valid ? 'el-icon-circle-check' : 'el-icon-warning-outline'"></i>
                <div class="status-text">
                  <div class="status-main">
                    {{
                      licenseData.valid
                        ? $t('system.config.superPanelLicense.statusValid')
                        : $t('system.config.superPanelLicense.statusInvalid')
                    }}
                  </div>
                  <div class="status-type">
                    <el-tag size="small" :type="licenseTypeTag(licenseData.licenseType)" effect="dark">
                      {{ licenseTypeLabel(licenseData.licenseType) }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="status-right">
                <div class="status-item">
                  <span class="item-label">{{ $t('system.config.superPanelLicense.expireTime') }}</span>
                  <span class="item-value">{{ formatLicenseTime(licenseData.expiresAt) }}</span>
                </div>
                <div class="status-item">
                  <span class="item-label">{{ $t('system.config.superPanelLicense.remaining') }}</span>
                  <span class="item-value countdown">{{ licenseCountdown }}</span>
                </div>
                <div class="status-item">
                  <span class="item-label">{{ $t('system.config.superPanelLicense.projectName') }}</span>
                  <span class="item-value">{{ licenseData.projectName || '-' }}</span>
                </div>
                <div class="status-item">
                  <span class="item-label">{{ $t('system.config.superPanelLicense.customerName') }}</span>
                  <span class="item-value">{{ licenseData.customer?.name || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- 折叠面板：详细信息 -->
            <el-collapse v-model="licenseActiveNames" class="license-collapse">
              <!-- 授权详细信息 -->
              <el-collapse-item :title="$t('system.config.superPanelLicense.detailTitle')" name="detail">
                <div class="license-detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.licenseId') }}
                    </div>
                    <div class="detail-value mono-text">
                      {{ licenseData.licenseId || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.projectId') }}
                    </div>
                    <div class="detail-value mono-text">
                      {{ licenseData.projectId || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.projectName') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.projectName || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.licenseType') }}
                    </div>
                    <div class="detail-value">
                      <el-tag size="small" :type="licenseTypeTag(licenseData.licenseType)">
                        {{ licenseTypeLabel(licenseData.licenseType) }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.issuedAt') }}
                    </div>
                    <div class="detail-value">
                      {{ formatLicenseTime(licenseData.issuedAt) }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.expireTime') }}
                    </div>
                    <div class="detail-value">
                      {{ formatLicenseTime(licenseData.expiresAt) }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.customerName') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.name || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.contact') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.contact || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.phone') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.phone || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.email') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.email || '-' }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.maxUsers') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.maxUsers || $t('system.config.superPanelLicense.unlimited') }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.maxDevices') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.maxDevices || $t('system.config.superPanelLicense.unlimited') }}
                    </div>
                  </div>
                  <div class="detail-item detail-item-full">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.features') }}
                    </div>
                    <div class="detail-value">
                      <el-tag
                        v-for="f in licenseData.features || []"
                        :key="f"
                        size="small"
                        effect="plain"
                        style="margin-right: 6px; margin-bottom: 4px"
                      >
                        {{ f }}
                      </el-tag>
                      <span v-if="!licenseData.features || licenseData.features.length === 0" class="text-muted">{{
                        $t('system.config.superPanelLicense.allFeatures')
                      }}</span>
                    </div>
                  </div>
                </div>
              </el-collapse-item>

              <!-- 机器绑定信息 -->
              <el-collapse-item :title="$t('system.config.superPanelLicense.machineBind')" name="machine">
                <div class="machine-info">
                  <div class="machine-row">
                    <span class="machine-label">{{ $t('system.config.superPanelLicense.currentMachineId') }}</span>
                    <div class="machine-value-wrap">
                      <span class="machine-id mono-text">{{ licenseData.machineId || '-' }}</span>
                      <el-button
                        v-if="licenseData.machineId"
                        type="text"
                        size="small"
                        icon="el-icon-document-copy"
                        @click="copyMachineId"
                      ></el-button>
                    </div>
                  </div>
                  <div class="machine-row">
                    <span class="machine-label">{{ $t('system.config.superPanelLicense.boundMachineId') }}</span>
                    <span class="machine-id mono-text">{{
                      licenseData.boundMachineId || $t('system.config.superPanelLicense.notBoundAny')
                    }}</span>
                  </div>
                  <div class="machine-row">
                    <span class="machine-label">{{ $t('system.config.superPanelLicense.matchStatus') }}</span>
                    <el-tag :type="licenseData.machineMatched ? 'success' : 'danger'" size="small">
                      <i
                        :class="licenseData.machineMatched ? 'el-icon-circle-check' : 'el-icon-circle-close'"
                        style="margin-right: 2px"
                      ></i>
                      {{
                        licenseData.machineMatched
                          ? $t('system.config.superPanelLicense.matched')
                          : $t('system.config.superPanelLicense.notMatched')
                      }}
                    </el-tag>
                  </div>
                </div>
              </el-collapse-item>

              <!-- 时间防护信息 -->
              <el-collapse-item :title="$t('system.config.superPanelLicense.timeGuard')" name="time">
                <div class="time-info">
                  <div class="time-row">
                    <span class="time-label">{{ $t('system.config.superPanelLicense.timeGuardStatus') }}</span>
                    <el-tag :type="licenseData.timeGuard?.exists ? 'success' : 'info'" size="small">
                      {{
                        licenseData.timeGuard?.exists
                          ? $t('system.config.superPanelLicense.enabled')
                          : $t('system.config.superPanelLicense.notInitialized')
                      }}
                    </el-tag>
                  </div>
                  <div class="time-row">
                    <span class="time-label">{{ $t('system.config.superPanelLicense.lastVerified') }}</span>
                    <span class="time-value">{{ formatLicenseTime(licenseData.timeGuard?.lastVerifiedAt) }}</span>
                  </div>
                  <div class="time-row">
                    <span class="time-label">{{ $t('system.config.superPanelLicense.serverTime') }}</span>
                    <span class="time-value">{{ formatLicenseTime(licenseData.serverTime) }}</span>
                  </div>
                  <div class="time-row">
                    <span class="time-label">{{ $t('system.config.superPanelLicense.operation') }}</span>
                    <el-button
                      type="primary"
                      size="small"
                      icon="el-icon-refresh"
                      :loading="licenseSyncing"
                      @click="handleSyncLicenseTime"
                    >
                      {{ $t('system.config.superPanelLicense.networkDiagnosis') }}
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>

              <!-- 授权文件信息（仅管理员） -->
              <el-collapse-item v-if="isAdmin" :title="$t('system.config.superPanelLicense.fileInfo')" name="file">
                <div v-if="licenseData.licenseFile" class="license-detail-grid">
                  <div class="detail-item detail-item-full">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.filePath') }}
                    </div>
                    <div class="detail-value mono-text">
                      {{ licenseData.licenseFile.path }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.fileName') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.licenseFile.fileName }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.fileSize') }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.licenseFile.sizeFormatted }}
                    </div>
                  </div>
                  <div class="detail-item detail-item-full">
                    <div class="detail-label">
                      {{ $t('system.config.superPanelLicense.lastModified') }}
                    </div>
                    <div class="detail-value">
                      {{ formatLicenseTime(licenseData.licenseFile.lastModified) }}
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="el-icon-document-delete"></i>
                  <span>{{ $t('system.config.superPanelLicense.noLicenseFile') }}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>

    <!-- 授权导入弹窗 -->
    <el-dialog
      v-model="showLicenseImport"
      :title="$t('system.config.superPanelLicense.importDialogTitle')"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="import-tip">
        <i class="el-icon-info"></i>
        <span>{{ $t('system.config.superPanelLicense.importTip') }}</span>
      </div>
      <el-upload
        class="import-upload"
        drag
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleLicenseFileChange"
        accept=".lic"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t('system.config.superPanelLicense.dragUpload') }}
        </div>
      </el-upload>
      <div v-if="selectedLicenseFile" class="selected-file-info">
        <i class="el-icon-document-checked"></i>
        <span class="file-name">{{ selectedLicenseFile.name }}</span>
      </div>
      <template #footer>
        <el-button @click="showLicenseImport = false">
          {{ $t('system.config.superPanelLicense.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="licenseImporting"
          :disabled="!selectedLicenseFile"
          @click="handleImportLicense"
        >
          {{ $t('system.config.superPanelLicense.confirmImport') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 系统参数配置页（同时承载 super-panel 参数配置模式）
 * 作者：GooHv
 */
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { requestGetAllConfigsApi, requestUpdateConfigsApi, requestResetConfigsApi } from '@/api'
import { applyConfig } from '@/utils/config/config'
import { useLicense } from '@/composables/useLicense'
import { getCascaderOptions, getCoordsByValues } from '@/utils/business/worldCities'
import { dynamicLanguages, loadLanguageList } from '@/i18n'
import { useUserStore } from '@/store/modules/user'
import { useDeviceStore } from '@/store/modules/device'
import { showSuccess, showError, showWarning } from '@/utils/ui/feedback'
import EmailConfig from '@/components/EmailConfig/index.vue'
import EmailLog from '@/components/EmailLog/index.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigForm = Record<string, any>

const { locale, t } = useI18n()
const route = useRoute()
const userStore = useUserStore()
const deviceStore = useDeviceStore()

const regionOptions = computed(() => getCascaderOptions(locale.value))
const languageOptions = ref([...dynamicLanguages])

const menuList = computed(() => [
  { key: 'system', icon: 'Setting', title: t('system.config.system.title') },
  { key: 'security', icon: 'Lock', title: t('system.config.security.title') },
  { key: 'plc', icon: 'Cpu', title: t('superPanel.config.plc.title') },
  { key: 'export', icon: 'Document', title: t('system.config.export.title') },
  { key: 'connection', icon: 'Connection', title: t('superPanel.config.connection.title') },
  { key: 'device', icon: 'Cpu', title: t('system.config.device.title') },
  { key: 'email', icon: 'Message', title: t('superPanel.config.email.title') },
  { key: 'emailLog', icon: 'Document', title: t('system.config.emailLog.title') },
  { key: 'notification', icon: 'Bell', title: t('system.config.notification.title') },
  { key: 'order', icon: 'List', title: t('system.config.order.title') },
  { key: 'licenseSetting', icon: 'Setting', title: t('system.config.licenseSetting.title') },
  { key: 'license', icon: 'Key', title: t('system.config.superPanelLicense.manageTitle') }
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const licenseApi = useLicense()
const {
  licenseLoading,
  licenseSyncing,
  licenseImporting,
  showLicenseImport,
  licenseCountdown,
  licenseActiveNames,
  loadLicenseData,
  handleLicenseFileChange,
  handleImportLicense,
  handleDownloadLicense,
  handleSyncLicenseTime,
  copyMachineId,
  formatLicenseTime,
  licenseTypeTag,
  licenseTypeLabel
} = licenseApi
/** licenseData 在 useLicense 中为 ref({})，模板访问其字段时按需断言为任意记录 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const licenseData = computed<any>(() => licenseApi.licenseData.value as any)
/** selectedLicenseFile 在 useLicense 中为 ref(null)，模板访问 .name 时按需断言 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedLicenseFile = computed<any>(() => licenseApi.selectedLicenseFile.value as any)

const loading = ref(false)

const SUPER_PANEL_TABS = ['plc', 'connection', 'email']
const isSuperPanelMode = computed(() => {
  const seg = route.path.split('/').filter(Boolean)
  return seg[0] === 'super-panel' && seg[1] === 'config'
})

const activeMenu = ref<string>(isSuperPanelMode.value ? 'plc' : 'system')

const configStatus = ref<'loading' | 'ready' | 'incomplete' | 'error'>('loading')
const missingConfigKeys = ref<string[]>([])

const REQUIRED_CONFIG_KEYS = [
  'sessionTimeout',
  'defaultPageSize',
  'defaultLanguage',
  'dateFormat',
  'watermarkEnabled',
  'watermarkText',
  'loginFailedThreshold',
  'lockDurationMinutes',
  'plcProtocol',
  'plcHost',
  'plcPort',
  'plcUnitId',
  'pollFastInterval',
  'pollSlowInterval',
  'pdfWatermarkEnabled',
  'pdfWatermarkText',
  'heartbeatInterval',
  'deviceStatusCheckInterval',
  'deviceOfflineThreshold',
  'maintenanceCheckInterval',
  'partLifeStatInterval',
  'deviceName',
  'deviceCode',
  'deviceRegion',
  'deviceInstallDate',
  'partLifeReminderEnabled',
  'partLifeThreshold',
  'partLifeRemindInterval',
  'partLifeSnoozeInterval',
  'allowNoOrderProduction',
  'noOrderProductionHighlight',
  'showOperatorName',
  'showAlarmCount',
  'showRuntime',
  'reportIncludeAlarmDetail',
  'reportIncludeOperatorDetail',
  'reportIncludeDownloadCount',
  'allowRunningOrderDownload',
  'autoArchiveCompleted',
  'orderSwitchConfirm',
  'plcReconnectDelay',
  'plcEnablePoll',
  'plcEnableWriteAudit',
  'plcMaxWriteRetry',
  'emailSendTimeout',
  'emailMaxRetries',
  'emailRetryDelay',
  'uploadMaxFileSize',
  'uploadAllowedTypes',
  'uploadPath',
  'uploadEnableAudit',
  'auditRetentionDays',
  'auditAutoArchive',
  'licenseExpiringDays',
  'licenseGracePeriod',
  'licenseCheckInterval',
  'notificationAutoReadDays',
  'notificationSoundEnabled'
]

const initialForm: ConfigForm = {}
REQUIRED_CONFIG_KEYS.forEach(key => {
  initialForm[key] = undefined
})
const form = reactive<ConfigForm>(initialForm)

const isAdmin = computed(() => {
  const level = Number((userStore.userInfo as unknown as { role_level?: number }).role_level)
  return level > 0 && level <= 2
})

const MIGRATED_TO_SUPER_PANEL_KEYS = ['plc', 'connection', 'email']
const filteredMenuList = computed(() => {
  if (isSuperPanelMode.value) {
    return menuList.value.filter(item => SUPER_PANEL_TABS.includes(item.key))
  }
  const adminOnlyKeys = ['security', 'export', 'order']
  return menuList.value.filter(item => {
    if (MIGRATED_TO_SUPER_PANEL_KEYS.includes(item.key)) return false
    if (adminOnlyKeys.includes(item.key)) return isAdmin.value
    return true
  })
})

const pageTitle = computed(() => {
  if (isSuperPanelMode.value) return t('superPanel.config.page.title')
  return t('system.config.childrenMenu.title')
})

function parseDeviceRegion(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed as string[]
    } catch {
      /* 非 JSON */
    }
    if (value.includes(',')) return value.split(',').map(s => s.trim())
  }
  return []
}

function parseDate(value: unknown): string {
  if (!value) return ''
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return ''
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  if (typeof value === 'number') {
    const ts = value < 1e12 ? value * 1000 : value
    return parseDate(new Date(ts))
  }
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const date = new Date(value)
    if (!isNaN(date.getTime())) return parseDate(date)
    return value
  }
  return ''
}

function assignFormData(data: ConfigForm): void {
  REQUIRED_CONFIG_KEYS.forEach(key => {
    if (data && key in data) form[key] = data[key]
  })
}

function checkConfigCompleteness(data: ConfigForm | null): string[] {
  if (!data || typeof data !== 'object') return REQUIRED_CONFIG_KEYS
  return REQUIRED_CONFIG_KEYS.filter(key => !(key in data))
}

async function loadConfigs(): Promise<void> {
  loading.value = true
  configStatus.value = 'loading'
  missingConfigKeys.value = []
  try {
    const res = await requestGetAllConfigsApi()
    if (res.code === 200 && res.data) {
      const missingKeys = checkConfigCompleteness(res.data as ConfigForm)
      if (missingKeys.length > 0) {
        configStatus.value = 'incomplete'
        missingConfigKeys.value = missingKeys
        assignFormData(res.data as ConfigForm)
        showWarning(t('system.config.missingItemsWarning', { count: missingKeys.length }))
      } else {
        configStatus.value = 'ready'
        assignFormData(res.data as ConfigForm)
        form.partLifeReminderEnabled =
          form.partLifeReminderEnabled === true ||
          form.partLifeReminderEnabled === 'true' ||
          form.partLifeReminderEnabled === 1 ||
          form.partLifeReminderEnabled === '1'
        const parsedRegion = parseDeviceRegion(form.deviceRegion)
        const parsedDate = parseDate(form.deviceInstallDate)
        form.deviceRegion = []
        form.deviceInstallDate = ''
        await nextTick()
        form.deviceRegion = parsedRegion
        form.deviceInstallDate = parsedDate
        form.defaultLanguage = locale.value
      }
    } else {
      configStatus.value = 'error'
      showError(t('system.config.loadDataAbnormal'))
    }
  } catch (err) {
    console.error('[参数配置] 加载配置失败:', err)
    configStatus.value = 'error'
    showError(t('system.config.loadNetworkError'))
  } finally {
    loading.value = false
  }
}

async function handleSave(): Promise<void> {
  if (configStatus.value !== 'ready') {
    const statusMsg: Record<string, string> = {
      loading: t('system.config.statusLoading'),
      incomplete: t('system.config.statusIncomplete'),
      error: t('system.config.statusLoadError')
    }
    showError(statusMsg[configStatus.value] || t('system.config.statusAbnormal'))
    return
  }
  const missingKeys = checkConfigCompleteness(form)
  if (missingKeys.length > 0) {
    showError(t('system.config.missingItems', { count: missingKeys.length, items: missingKeys.join(', ') }))
    return
  }
  loading.value = true
  try {
    const res = await requestUpdateConfigsApi(form)
    if (res.code === 200) {
      applyConfig((res.data || form) as Parameters<typeof applyConfig>[0])
      const cityInfo = getCoordsByValues(form.deviceRegion)
      deviceStore.setDeviceInfo({
        name: form.deviceName,
        code: form.deviceCode,
        location: cityInfo ? `${cityInfo.countryNameZh}·${cityInfo.nameZh}` : '',
        locationCode: form.deviceRegion,
        locationCoords: cityInfo ? { lng: cityInfo.lng, lat: cityInfo.lat } : null,
        installDate: form.deviceInstallDate
      })
      showSuccess(t('common.saveSuccess'))
    } else {
      showError(t('system.config.saveFailedRetry'))
    }
  } catch (err) {
    console.error('[参数配置] 保存配置失败:', err)
    showError(t('system.config.saveFailedNetwork'))
  } finally {
    loading.value = false
  }
}

function handleReset(): void {
  if (configStatus.value !== 'ready') {
    showWarning(t('system.config.resetNotAllowed'))
    return
  }
  requestResetConfigsApi()
    .then(res => {
      if (res.code === 200 && res.data) {
        const missingKeys = checkConfigCompleteness(res.data as ConfigForm)
        if (missingKeys.length > 0) {
          configStatus.value = 'incomplete'
          missingConfigKeys.value = missingKeys
          showWarning(t('system.config.resetMissingItems', { count: missingKeys.length }))
          return
        }
        configStatus.value = 'ready'
        assignFormData(res.data as ConfigForm)
        form.partLifeReminderEnabled =
          form.partLifeReminderEnabled === true ||
          form.partLifeReminderEnabled === 'true' ||
          form.partLifeReminderEnabled === 1 ||
          form.partLifeReminderEnabled === '1'
        form.defaultLanguage = locale.value
        applyConfig(form as Parameters<typeof applyConfig>[0])
        showSuccess(t('common.resetSuccess'))
      } else {
        showError(t('system.config.resetFailedRetry'))
      }
    })
    .catch(err => {
      console.error('[参数配置] 重置配置失败:', err)
      showError(t('system.config.resetFailedNetwork'))
    })
}

onMounted(async () => {
  if (!isSuperPanelMode.value) {
    const adminOnlyKeys = ['security', 'export', 'order']
    if (!isAdmin.value && adminOnlyKeys.includes(activeMenu.value)) {
      activeMenu.value = 'system'
    }
  }
  try {
    const langList = await loadLanguageList()
    languageOptions.value = [...langList]
  } catch (err) {
    console.error('[SystemConfig] 加载语言列表失败:', err)
  }
  loadConfigs()
  loadLicenseData()
})
</script>

<style scoped lang="less">
.system-config-container {
  padding: 0;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    flex-shrink: 0;

    .header-left {
      .page-title {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #303133;
      }

      .page-desc {
        margin: 0;
        font-size: 13px;
        color: #909399;
      }
    }

    .header-right {
      display: flex;
      gap: 10px;
    }
  }

  .config-body {
    flex: 1;
    display: flex;
    gap: 20px;
    overflow: hidden;

    // 左侧分类导航
    .config-sidebar {
      width: 200px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 8px;
      padding: 10px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 14px;
        color: #606266;
        transition: all 0.2s;
        border-left: 3px solid transparent;

        i {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        &:hover {
          background: #f5f7fa;
          color: #409eff;
        }

        &.active {
          background: #ecf5ff;
          color: #409eff;
          border-left-color: #409eff;
          font-weight: 500;
        }
      }
    }

    // 右侧配置内容
    .config-content {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 30px 40px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      overflow-y: auto;

      // 状态显示容器（加载中/失败/不完整）
      .config-status-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        height: 100%;
      }

      // 加载中状态
      .config-status-loading {
        text-align: center;
        .status-icon {
          font-size: 48px;
          color: #409eff;
          animation: rotating 2s linear infinite;
        }
        .status-text {
          margin-top: 16px;
          font-size: 14px;
          color: #606266;
        }
      }

      // 加载失败状态
      .config-status-error {
        text-align: center;
        .status-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }
        .error-icon {
          color: #f56c6c;
        }
        .status-title {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
        }
        .status-desc {
          font-size: 14px;
          color: #909399;
          margin: 0 0 24px 0;
        }
      }

      // 配置不完整状态
      .config-status-incomplete {
        width: 100%;
        max-width: 700px;
        .incomplete-alert {
          margin-bottom: 20px;
          :deep(.el-alert__description) {
            margin-top: 12px;
          }
          .incomplete-desc {
            font-size: 14px;
            color: #606266;
            margin: 0 0 12px 0;
          }
          .missing-keys-list {
            background: #fdf6ec;
            border: 1px solid #faecd8;
            border-radius: 4px;
            padding: 12px 16px;
            margin: 12px 0;
            .missing-keys-title {
              font-size: 13px;
              font-weight: 600;
              color: #e6a23c;
              margin: 0 0 8px 0;
            }
            ul {
              margin: 0;
              padding-left: 20px;
              li {
                font-size: 13px;
                color: #606266;
                line-height: 1.8;
                font-family: Consolas, Monaco, monospace;
              }
            }
          }
          .incomplete-tip {
            font-size: 13px;
            color: #909399;
            margin: 12px 0 0 0;
          }
        }
        .incomplete-actions {
          text-align: center;
        }
      }

      .config-panel {
        .panel-title {
          margin: 0 0 25px 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f2f5;
        }

        :deep(.el-form-item) {
          margin-bottom: 22px;
        }

        :deep(.el-form-item__label) {
          font-size: 14px;
          color: #606266;
        }

        .unit-text {
          margin-left: 10px;
          font-size: 13px;
          color: #909399;
        }

        .form-tip {
          margin-left: 10px;
          font-size: 12px;
          color: #909399;
        }

        // 分区域配置
        .config-section {
          margin-bottom: 30px;
          padding: 20px;
          background: #fafbfc;
          border-radius: 8px;
          border: 1px solid #ebeef5;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
          color: #409eff;

          i {
            margin-right: 8px;
            font-size: 16px;
          }
        }

        .form-tip {
          margin-left: 12px;
          font-size: 12px;
          color: #909399;

          &.disabled {
            color: #c0c4cc;
          }
        }
      }
    }

    // 授权管理面板
    .license-panel {
      .license-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;

        .toolbar-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #303133;

          i {
            font-size: 20px;
            color: #409eff;
          }
        }

        .toolbar-actions {
          display: flex;
          gap: 8px;
        }
      }

      .license-status-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 15px;

        &.valid {
          background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
          border: 1px solid #e1f3d8;

          .status-left i {
            color: #67c23a;
          }

          .status-main {
            color: #67c23a;
          }
        }

        &.invalid {
          background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
          border: 1px solid #fde2e2;

          .status-left i {
            color: #f56c6c;
          }

          .status-main {
            color: #f56c6c;
          }
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 12px;

          i {
            font-size: 36px;
          }

          .status-text {
            .status-main {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 4px;
            }
          }
        }

        .status-right {
          display: flex;
          gap: 30px;

          .status-item {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .item-label {
              font-size: 12px;
              color: #909399;
            }

            .item-value {
              font-size: 13px;
              color: #303133;
              font-weight: 500;

              &.countdown {
                color: #e6a23c;
              }
            }
          }
        }
      }

      .license-collapse {
        :deep(.el-collapse-item__header) {
          font-size: 13px;
          font-weight: 500;
          color: #606266;
          background: #f5f7fa;
          padding-left: 15px;
        }

        :deep(.el-collapse-item__content) {
          padding: 15px;
        }
      }

      // 授权详细信息 - grid 卡片布局
      .license-detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .detail-item {
          background: #fafbfc;
          border: 1px solid #f0f2f5;
          border-radius: 6px;
          padding: 10px 14px;
          transition: all 0.2s;

          &:hover {
            background: #f5f7fa;
            border-color: #dcdfe6;
          }

          .detail-label {
            color: #909399;
            margin-bottom: 6px;
            font-weight: 500;
          }

          .detail-value {
            color: #303133;
            word-break: break-all;
            line-height: 1.5;
          }

          &.detail-item-full {
            grid-column: 1 / -1;
          }
        }
      }

      .mono-text {
        font-family: 'Courier New', monospace;
        color: #606266;
        word-break: break-all;
      }

      .text-muted {
        color: #c0c4cc;
        font-size: 12px;
      }

      // 机器绑定信息
      .machine-info {
        .machine-row {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .machine-label {
            width: 90px;
            color: #909399;
            flex-shrink: 0;
          }

          .machine-value-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
          }

          .machine-id {
            flex: 1;
          }
        }
      }

      // 时间防护信息
      .time-info {
        .time-row {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .time-label {
            width: 90px;
            color: #909399;
            flex-shrink: 0;
          }

          .time-value {
            color: #303133;
          }
        }
      }

      // 授权文件信息已使用 .license-detail-grid 布局

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
        color: #c0c4cc;

        i {
          font-size: 40px;
          margin-bottom: 10px;
        }

        span {
          font-size: 13px;
        }
      }
    }
  }
}

.unit-tip {
  margin-left: 10px;
}

// 授权导入弹窗样式
.import-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #ecf5ff;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #409eff;

  i {
    font-size: 16px;
  }
}

.import-upload {
  :deep(.el-upload-dragger) {
    padding: 30px 20px;
  }
}

.selected-file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding: 10px 15px;
  background: #f0f9eb;
  border-radius: 4px;
  font-size: 13px;

  i {
    font-size: 18px;
    color: #67c23a;
  }

  .file-name {
    color: #67c23a;
    font-weight: 500;
  }
}

/* 配置项标签：文字 + 问号图标，不换行 */
.config-label-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.tip-icon {
  font-size: 14px;
  color: #c0c4cc;
  cursor: help;
  transition: color 0.2s;

  &:hover {
    color: #409eff;
  }
}
</style>

<!-- 全局样式：设备所在地区级联选择器下拉面板 -->
<style>
.device-region-cascader {
  max-height: 420px !important;
  overflow: hidden !important;
}

.device-region-cascader .el-cascader-panel {
  max-height: 420px !important;
}

.device-region-cascader .el-cascader-menu {
  max-height: 380px !important;
  overflow-y: auto !important;
}

.device-region-cascader .el-cascader-menu::-webkit-scrollbar {
  width: 6px;
}

.device-region-cascader .el-cascader-menu::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.device-region-cascader .el-cascader-menu::-webkit-scrollbar-track {
  background: #f5f7fa;
}
</style>
