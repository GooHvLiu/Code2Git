<template>
  <div class="system-config-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("menu.system.config.childrenMenu.title") }}
        </h2>
        <p class="page-desc">
          {{ $t("menu.system.config.childrenMenu.desc") }}
        </p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="handleSave"
          :disabled="configStatus !== 'ready'"
          :loading="loading"
        >
          {{ $t("menu.system.config.childrenMenu.save") }}
        </el-button>
        <el-button
          icon="el-icon-refresh-left"
          @click="handleReset"
          :disabled="configStatus !== 'ready'"
          :loading="loading"
        >
          {{ $t("menu.system.config.childrenMenu.reset") }}
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
            <p class="status-text">配置加载中，请稍候...</p>
          </div>
        </div>

        <!-- 加载失败状态 -->
        <div v-else-if="configStatus === 'error'" class="config-status-wrapper">
          <div class="config-status-error">
            <i class="el-icon-warning-outline status-icon error-icon"></i>
            <h3 class="status-title">配置加载失败</h3>
            <p class="status-desc">请检查网络连接或联系管理员</p>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="loadConfigs"
            >
              重新加载
            </el-button>
          </div>
        </div>

        <!-- 配置不完整状态 -->
        <div
          v-else-if="configStatus === 'incomplete'"
          class="config-status-wrapper"
        >
          <div class="config-status-incomplete">
            <el-alert
              title="配置不完整"
              type="warning"
              :closable="false"
              show-icon
              class="incomplete-alert"
            >
              <template #default>
                <p class="incomplete-desc">
                  检测到
                  <b>{{ missingConfigKeys.length }}</b>
                  个未初始化的配置项，当前页面禁止编辑和保存。
                </p>
                <div class="missing-keys-list">
                  <p class="missing-keys-title">缺失的配置项：</p>
                  <ul>
                    <li v-for="key in missingConfigKeys" :key="key">
                      {{ key }}
                    </li>
                  </ul>
                </div>
                <p class="incomplete-tip">
                  请联系管理员执行配置初始化 SQL，或点击下方按钮重新加载。
                </p>
              </template>
            </el-alert>
            <div class="incomplete-actions">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="loadConfigs"
              >
                重新加载
              </el-button>
            </div>
          </div>
        </div>

        <!-- 正常配置内容（只有 ready 状态才显示） -->
        <div v-else class="config-panels-wrapper">
          <!-- 系统设置 -->
          <div v-if="activeMenu === 'system'" class="config-panel">
            <h3 class="panel-title">
              {{ $t("menu.system.config.childrenMenu.system.title") }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.system.sessionTimeout')
                "
              >
                <el-input-number
                  v-model="form.sessionTimeout"
                  :min="5"
                  :max="120"
                  :step="5"
                  controls-position="right"
                />
                <span class="unit-text">{{
                  $t("menu.system.config.childrenMenu.system.minutes")
                }}</span>
              </el-form-item>

              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.system.defaultPageSize')
                "
              >
                <el-select v-model="form.defaultPageSize" style="width: 200px">
                  <el-option :label="10" :value="10" />
                  <el-option :label="20" :value="20" />
                  <el-option :label="50" :value="50" />
                  <el-option :label="100" :value="100" />
                </el-select>
              </el-form-item>

              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.system.defaultLanguage')
                "
              >
                <el-select v-model="form.defaultLanguage" style="width: 200px">
                  <el-option label="简体中文" value="zh-CN" />
                  <el-option label="English" value="en-US" />
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('menu.system.config.childrenMenu.system.dateFormat')"
              >
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
              {{ $t("menu.system.config.childrenMenu.security.title") }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.security.watermarkEnabled'
                  )
                "
              >
                <el-switch
                  v-model="form.watermarkEnabled"
                  active-color="#13ce66"
                  inactive-color="#c0c4cc"
                />
              </el-form-item>

              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.security.watermarkText')
                "
              >
                <el-input
                  v-model="form.watermarkText"
                  :placeholder="
                    $t(
                      'menu.system.config.childrenMenu.security.watermarkPlaceholder'
                    )
                  "
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 设备连接设置 -->
          <div v-if="activeMenu === 'plc'" class="config-panel">
            <h3 class="panel-title">
              {{ $t("menu.system.config.childrenMenu.plc.title") }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="$t('menu.system.config.childrenMenu.plc.protocol')"
              >
                <el-select v-model="form.plcProtocol" style="width: 200px">
                  <el-option label="Modbus TCP" value="ModbusTcp" />
                  <el-option label="S7" value="S7" />
                  <el-option label="OPC UA" value="OpcUa" />
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('menu.system.config.childrenMenu.plc.host')"
              >
                <el-input
                  v-model="form.plcHost"
                  placeholder="192.168.1.100"
                  style="width: 250px"
                />
              </el-form-item>

              <el-form-item
                :label="$t('menu.system.config.childrenMenu.plc.port')"
              >
                <el-input-number
                  v-model="form.plcPort"
                  :min="1"
                  :max="65535"
                  controls-position="right"
                />
              </el-form-item>

              <el-form-item
                :label="$t('menu.system.config.childrenMenu.plc.unitId')"
              >
                <el-input-number
                  v-model="form.plcUnitId"
                  :min="1"
                  :max="255"
                  controls-position="right"
                />
              </el-form-item>

              <el-divider content-position="left">{{
                $t("menu.system.config.childrenMenu.plc.pollSettings")
              }}</el-divider>

              <el-form-item
                :label="$t('menu.system.config.childrenMenu.plc.pollFast')"
              >
                <el-input-number
                  v-model="form.pollFastInterval"
                  :min="50"
                  :max="5000"
                  :step="50"
                  controls-position="right"
                />
                <span class="unit-text">ms</span>
              </el-form-item>

              <el-form-item
                :label="$t('menu.system.config.childrenMenu.plc.pollSlow')"
              >
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
              {{ $t("menu.system.config.childrenMenu.export.title") }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.export.pdfWatermarkEnabled'
                  )
                "
              >
                <el-switch
                  v-model="form.pdfWatermarkEnabled"
                  active-color="#13ce66"
                  inactive-color="#c0c4cc"
                />
              </el-form-item>

              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.export.pdfWatermarkText')
                "
              >
                <el-input
                  v-model="form.pdfWatermarkText"
                  :placeholder="
                    $t(
                      'menu.system.config.childrenMenu.export.pdfWatermarkPlaceholder'
                    )
                  "
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 连接设置 -->
          <div v-if="activeMenu === 'connection'" class="config-panel">
            <h3 class="panel-title">
              {{ $t("menu.system.config.childrenMenu.connection.title") }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.connection.heartbeatInterval'
                  )
                "
              >
                <el-input-number
                  v-model="form.heartbeatInterval"
                  :min="5000"
                  :max="60000"
                  :step="1000"
                  controls-position="right"
                />
                <span class="unit-text">ms</span>
              </el-form-item>
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.connection.deviceStatusCheckInterval'
                  )
                "
              >
                <el-input-number
                  v-model="form.deviceStatusCheckInterval"
                  :min="60"
                  :max="3600"
                  :step="60"
                  controls-position="right"
                />
                <span class="unit-text">{{
                  $t("menu.system.config.childrenMenu.connection.unitSecond")
                }}</span>
              </el-form-item>
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.connection.deviceOfflineThreshold'
                  )
                "
              >
                <el-input-number
                  v-model="form.deviceOfflineThreshold"
                  :min="120"
                  :max="7200"
                  :step="60"
                  controls-position="right"
                />
                <span class="unit-text">{{
                  $t("menu.system.config.childrenMenu.connection.unitSecond")
                }}</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 设备参数 -->
          <div v-if="activeMenu === 'device'" class="config-panel">
            <h3 class="panel-title">
              {{ $t("menu.system.config.childrenMenu.device.title") }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="$t('menu.system.config.childrenMenu.device.deviceName')"
              >
                <el-input
                  v-model="form.deviceName"
                  :placeholder="
                    $t('menu.system.config.childrenMenu.device.deviceName')
                  "
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item
                :label="$t('menu.system.config.childrenMenu.device.deviceCode')"
              >
                <el-input
                  v-model="form.deviceCode"
                  :placeholder="
                    $t('menu.system.config.childrenMenu.device.deviceCode')
                  "
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.device.deviceRegion')
                "
              >
                <el-cascader
                  v-model="form.deviceRegion"
                  :options="regionOptions"
                  :props="{ expandTrigger: 'hover' }"
                  :placeholder="
                    $t('menu.system.config.childrenMenu.device.deviceRegion')
                  "
                  clearable
                  filterable
                  popper-class="device-region-cascader"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.device.deviceInstallDate')
                "
              >
                <el-date-picker
                  v-model="form.deviceInstallDate"
                  type="date"
                  :placeholder="
                    $t(
                      'menu.system.config.childrenMenu.device.deviceInstallDate'
                    )
                  "
                  value-format="yyyy-MM-dd"
                  style="width: 300px"
                />
              </el-form-item>
            </el-form>

            <!-- 部件寿命提醒设置 -->
            <h3 class="panel-title" style="margin-top: 24px">
              {{
                $t(
                  "menu.system.config.childrenMenu.device.partLifeSettingsTitle"
                )
              }}
            </h3>
            <el-form :model="form" label-width="160px" label-position="right">
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.device.partLifeReminderEnabled'
                  )
                "
              >
                <el-switch
                  v-model="form.partLifeReminderEnabled"
                  :active-value="true"
                  :inactive-value="false"
                />
                <div class="form-tip">
                  {{
                    $t(
                      "menu.system.config.childrenMenu.device.partLifeReminderEnabledTip"
                    )
                  }}
                </div>
              </el-form-item>
              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.device.partLifeThreshold')
                "
              >
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
                <div class="form-tip">
                  {{
                    $t(
                      "menu.system.config.childrenMenu.device.partLifeThresholdTip"
                    )
                  }}
                </div>
              </el-form-item>
              <el-form-item
                :label="
                  $t(
                    'menu.system.config.childrenMenu.device.partLifeRemindInterval'
                  )
                "
              >
                <el-select
                  v-model="form.partLifeRemindInterval"
                  style="width: 200px"
                  :disabled="!form.partLifeReminderEnabled"
                >
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.intervalHour')
                    "
                    value="hour"
                  />
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.intervalShift')
                    "
                    value="shift"
                  />
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.intervalDay')
                    "
                    value="day"
                  />
                </el-select>
                <div class="form-tip">
                  {{
                    $t(
                      "menu.system.config.childrenMenu.device.partLifeRemindIntervalTip"
                    )
                  }}
                </div>
              </el-form-item>
              <el-form-item
                :label="
                  $t('menu.system.config.childrenMenu.device.snoozeInterval')
                "
              >
                <el-select
                  v-model="form.partLifeSnoozeInterval"
                  style="width: 200px"
                  :disabled="!form.partLifeReminderEnabled"
                >
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.snooze5min')
                    "
                    value="5"
                  />
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.snooze10min')
                    "
                    value="10"
                  />
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.snooze30min')
                    "
                    value="30"
                  />
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.snooze1hour')
                    "
                    value="60"
                  />
                  <el-option
                    :label="
                      $t('menu.system.config.childrenMenu.device.snooze2hour')
                    "
                    value="120"
                  />
                </el-select>
                <div class="form-tip">
                  {{
                    $t(
                      "menu.system.config.childrenMenu.device.snoozeIntervalTip"
                    )
                  }}
                </div>
              </el-form-item>
            </el-form>
          </div>

          <!-- 订单设置 -->
          <div v-if="activeMenu === 'order'" class="config-panel">
            <h3 class="panel-title">
              {{ $t("menu.system.config.childrenMenu.order.title") }}
            </h3>

            <!-- 生产控制区域 -->
            <div class="config-section">
              <div class="section-title">
                <i class="el-icon-cpu"></i>
                <span>{{
                  $t("menu.system.config.childrenMenu.order.productionControl")
                }}</span>
              </div>
              <el-form :model="form" label-width="250px" label-position="right">
                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.allowNoOrderProduction'
                    )
                  "
                >
                  <el-switch
                    v-model="form.allowNoOrderProduction"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                  <span class="form-tip">{{
                    $t(
                      "menu.system.config.childrenMenu.order.allowNoOrderProductionTip"
                    )
                  }}</span>
                </el-form-item>

                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.noOrderProductionHighlight'
                    )
                  "
                >
                  <el-switch
                    v-model="form.noOrderProductionHighlight"
                    :disabled="!form.allowNoOrderProduction"
                    active-color="#e6a23c"
                    inactive-color="#c0c4cc"
                  />
                  <span
                    class="form-tip"
                    :class="{ disabled: !form.allowNoOrderProduction }"
                  >
                    {{
                      $t(
                        "menu.system.config.childrenMenu.order.noOrderProductionHighlightTip"
                      )
                    }}
                  </span>
                </el-form-item>

                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.orderSwitchConfirm'
                    )
                  "
                >
                  <el-switch
                    v-model="form.orderSwitchConfirm"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.autoArchiveCompleted'
                    )
                  "
                >
                  <el-switch
                    v-model="form.autoArchiveCompleted"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>
              </el-form>
            </div>

            <!-- 统计展示区域 -->
            <div class="config-section">
              <div class="section-title">
                <i class="el-icon-data-line"></i>
                <span>{{
                  $t("menu.system.config.childrenMenu.order.statDisplay")
                }}</span>
              </div>
              <el-form :model="form" label-width="250px" label-position="right">
                <el-form-item
                  :label="
                    $t('menu.system.config.childrenMenu.order.showOperatorName')
                  "
                >
                  <el-switch
                    v-model="form.showOperatorName"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    $t('menu.system.config.childrenMenu.order.showAlarmCount')
                  "
                >
                  <el-switch
                    v-model="form.showAlarmCount"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    $t('menu.system.config.childrenMenu.order.showRuntime')
                  "
                >
                  <el-switch
                    v-model="form.showRuntime"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>
              </el-form>
            </div>

            <!-- 报告设置区域 -->
            <div class="config-section">
              <div class="section-title">
                <i class="el-icon-document"></i>
                <span>{{
                  $t("menu.system.config.childrenMenu.order.reportConfig")
                }}</span>
              </div>
              <el-form :model="form" label-width="250px" label-position="right">
                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.reportIncludeAlarmDetail'
                    )
                  "
                >
                  <el-switch
                    v-model="form.reportIncludeAlarmDetail"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.reportIncludeOperatorDetail'
                    )
                  "
                >
                  <el-switch
                    v-model="form.reportIncludeOperatorDetail"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.reportIncludeDownloadCount'
                    )
                  "
                >
                  <el-switch
                    v-model="form.reportIncludeDownloadCount"
                    active-color="#13ce66"
                    inactive-color="#c0c4cc"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    $t(
                      'menu.system.config.childrenMenu.order.allowRunningOrderDownload'
                    )
                  "
                >
                  <el-switch
                    v-model="form.allowRunningOrderDownload"
                    active-color="#e6a23c"
                    inactive-color="#c0c4cc"
                  />
                  <span class="form-tip">{{
                    $t(
                      "menu.system.config.childrenMenu.order.allowRunningOrderDownloadTip"
                    )
                  }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 授权管理 -->
          <div
            v-if="activeMenu === 'license'"
            class="config-panel license-panel"
          >
            <!-- 顶部操作栏 -->
            <div class="license-toolbar">
              <div class="toolbar-title">
                <i class="el-icon-key"></i>
                <span>{{
                  $t("menu.system.config.childrenMenu.license.manageTitle")
                }}</span>
              </div>
              <div class="toolbar-actions">
                <el-button
                  size="mini"
                  icon="el-icon-refresh"
                  @click="loadLicenseData"
                  :loading="licenseLoading"
                  >{{
                    $t("menu.system.config.childrenMenu.license.refresh")
                  }}</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-upload2"
                  @click="showLicenseImport = true"
                  >{{
                    $t("menu.system.config.childrenMenu.license.importLicense")
                  }}</el-button
                >
                <el-button
                  v-if="isAdmin"
                  size="mini"
                  icon="el-icon-download"
                  @click="handleDownloadLicense"
                  >{{
                    $t("menu.system.config.childrenMenu.license.download")
                  }}</el-button
                >
              </div>
            </div>

            <!-- 授权状态卡片 -->
            <div
              class="license-status-card"
              :class="{ valid: licenseData.valid, invalid: !licenseData.valid }"
            >
              <div class="status-left">
                <i
                  :class="
                    licenseData.valid
                      ? 'el-icon-circle-check'
                      : 'el-icon-warning-outline'
                  "
                ></i>
                <div class="status-text">
                  <div class="status-main">
                    {{
                      licenseData.valid
                        ? $t(
                            "menu.system.config.childrenMenu.license.statusValid"
                          )
                        : $t(
                            "menu.system.config.childrenMenu.license.statusInvalid"
                          )
                    }}
                  </div>
                  <div class="status-type">
                    <el-tag
                      size="mini"
                      :type="licenseTypeTag(licenseData.licenseType)"
                      effect="dark"
                      >{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag
                    >
                  </div>
                </div>
              </div>
              <div class="status-right">
                <div class="status-item">
                  <span class="item-label">{{
                    $t("menu.system.config.childrenMenu.license.expireTime")
                  }}</span>
                  <span class="item-value">{{
                    formatLicenseTime(licenseData.expiresAt)
                  }}</span>
                </div>
                <div class="status-item">
                  <span class="item-label">{{
                    $t("menu.system.config.childrenMenu.license.remaining")
                  }}</span>
                  <span class="item-value countdown">{{
                    licenseCountdown
                  }}</span>
                </div>
                <div class="status-item">
                  <span class="item-label">{{
                    $t("menu.system.config.childrenMenu.license.projectName")
                  }}</span>
                  <span class="item-value">{{
                    licenseData.projectName || "-"
                  }}</span>
                </div>
                <div class="status-item">
                  <span class="item-label">{{
                    $t("menu.system.config.childrenMenu.license.customerName")
                  }}</span>
                  <span class="item-value">{{
                    licenseData.customer?.name || "-"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 折叠面板：详细信息 -->
            <el-collapse v-model="licenseActiveNames" class="license-collapse">
              <!-- 授权详细信息 -->
              <el-collapse-item
                :title="
                  $t('menu.system.config.childrenMenu.license.detailTitle')
                "
                name="detail"
              >
                <div class="license-detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.licenseId")
                      }}
                    </div>
                    <div class="detail-value mono-text">
                      {{ licenseData.licenseId || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.projectId")
                      }}
                    </div>
                    <div class="detail-value mono-text">
                      {{ licenseData.projectId || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t(
                          "menu.system.config.childrenMenu.license.projectName"
                        )
                      }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.projectName || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t(
                          "menu.system.config.childrenMenu.license.licenseType"
                        )
                      }}
                    </div>
                    <div class="detail-value">
                      <el-tag
                        size="mini"
                        :type="licenseTypeTag(licenseData.licenseType)"
                        >{{ licenseTypeLabel(licenseData.licenseType) }}</el-tag
                      >
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.issuedAt")
                      }}
                    </div>
                    <div class="detail-value">
                      {{ formatLicenseTime(licenseData.issuedAt) }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.expireTime")
                      }}
                    </div>
                    <div class="detail-value">
                      {{ formatLicenseTime(licenseData.expiresAt) }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t(
                          "menu.system.config.childrenMenu.license.customerName"
                        )
                      }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.name || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.contact")
                      }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.contact || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t("menu.system.config.childrenMenu.license.phone") }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.phone || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{ $t("menu.system.config.childrenMenu.license.email") }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.customer?.email || "-" }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.maxUsers")
                      }}
                    </div>
                    <div class="detail-value">
                      {{
                        licenseData.maxUsers ||
                        $t("menu.system.config.childrenMenu.license.unlimited")
                      }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.maxDevices")
                      }}
                    </div>
                    <div class="detail-value">
                      {{
                        licenseData.maxDevices ||
                        $t("menu.system.config.childrenMenu.license.unlimited")
                      }}
                    </div>
                  </div>
                  <div class="detail-item detail-item-full">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.features")
                      }}
                    </div>
                    <div class="detail-value">
                      <el-tag
                        v-for="f in licenseData.features || []"
                        :key="f"
                        size="mini"
                        effect="plain"
                        style="margin-right: 6px; margin-bottom: 4px"
                        >{{ f }}</el-tag
                      >
                      <span
                        v-if="
                          !licenseData.features ||
                          licenseData.features.length === 0
                        "
                        class="text-muted"
                        >{{
                          $t(
                            "menu.system.config.childrenMenu.license.allFeatures"
                          )
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </el-collapse-item>

              <!-- 机器绑定信息 -->
              <el-collapse-item
                :title="
                  $t('menu.system.config.childrenMenu.license.machineBind')
                "
                name="machine"
              >
                <div class="machine-info">
                  <div class="machine-row">
                    <span class="machine-label">{{
                      $t(
                        "menu.system.config.childrenMenu.license.currentMachineId"
                      )
                    }}</span>
                    <div class="machine-value-wrap">
                      <span class="machine-id mono-text">{{
                        licenseData.machineId || "-"
                      }}</span>
                      <el-button
                        v-if="licenseData.machineId"
                        type="text"
                        size="mini"
                        icon="el-icon-document-copy"
                        @click="copyMachineId"
                      ></el-button>
                    </div>
                  </div>
                  <div class="machine-row">
                    <span class="machine-label">{{
                      $t(
                        "menu.system.config.childrenMenu.license.boundMachineId"
                      )
                    }}</span>
                    <span class="machine-id mono-text">{{
                      licenseData.boundMachineId ||
                      $t("menu.system.config.childrenMenu.license.notBoundAny")
                    }}</span>
                  </div>
                  <div class="machine-row">
                    <span class="machine-label">{{
                      $t("menu.system.config.childrenMenu.license.matchStatus")
                    }}</span>
                    <el-tag
                      :type="licenseData.machineMatched ? 'success' : 'danger'"
                      size="mini"
                    >
                      <i
                        :class="
                          licenseData.machineMatched
                            ? 'el-icon-circle-check'
                            : 'el-icon-circle-close'
                        "
                        style="margin-right: 2px"
                      ></i>
                      {{
                        licenseData.machineMatched
                          ? $t(
                              "menu.system.config.childrenMenu.license.matched"
                            )
                          : $t(
                              "menu.system.config.childrenMenu.license.notMatched"
                            )
                      }}
                    </el-tag>
                  </div>
                </div>
              </el-collapse-item>

              <!-- 时间防护信息 -->
              <el-collapse-item
                :title="$t('menu.system.config.childrenMenu.license.timeGuard')"
                name="time"
              >
                <div class="time-info">
                  <div class="time-row">
                    <span class="time-label">{{
                      $t(
                        "menu.system.config.childrenMenu.license.timeGuardStatus"
                      )
                    }}</span>
                    <el-tag
                      :type="licenseData.timeGuard?.exists ? 'success' : 'info'"
                      size="mini"
                    >
                      {{
                        licenseData.timeGuard?.exists
                          ? $t(
                              "menu.system.config.childrenMenu.license.enabled"
                            )
                          : $t(
                              "menu.system.config.childrenMenu.license.notInitialized"
                            )
                      }}
                    </el-tag>
                  </div>
                  <div class="time-row">
                    <span class="time-label">{{
                      $t("menu.system.config.childrenMenu.license.lastVerified")
                    }}</span>
                    <span class="time-value">{{
                      formatLicenseTime(licenseData.timeGuard?.lastVerifiedAt)
                    }}</span>
                  </div>
                  <div class="time-row">
                    <span class="time-label">{{
                      $t("menu.system.config.childrenMenu.license.serverTime")
                    }}</span>
                    <span class="time-value">{{
                      formatLicenseTime(licenseData.serverTime)
                    }}</span>
                  </div>
                  <div class="time-row">
                    <span class="time-label">{{
                      $t("menu.system.config.childrenMenu.license.operation")
                    }}</span>
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-refresh"
                      @click="handleSyncLicenseTime"
                      :loading="licenseSyncing"
                      >{{
                        $t(
                          "menu.system.config.childrenMenu.license.networkDiagnosis"
                        )
                      }}</el-button
                    >
                  </div>
                </div>
              </el-collapse-item>

              <!-- 授权文件信息（仅管理员） -->
              <el-collapse-item
                v-if="isAdmin"
                :title="$t('menu.system.config.childrenMenu.license.fileInfo')"
                name="file"
              >
                <div v-if="licenseData.licenseFile" class="license-detail-grid">
                  <div class="detail-item detail-item-full">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.filePath")
                      }}
                    </div>
                    <div class="detail-value mono-text">
                      {{ licenseData.licenseFile.path }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.fileName")
                      }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.licenseFile.fileName }}
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">
                      {{
                        $t("menu.system.config.childrenMenu.license.fileSize")
                      }}
                    </div>
                    <div class="detail-value">
                      {{ licenseData.licenseFile.sizeFormatted }}
                    </div>
                  </div>
                  <div class="detail-item detail-item-full">
                    <div class="detail-label">
                      {{
                        $t(
                          "menu.system.config.childrenMenu.license.lastModified"
                        )
                      }}
                    </div>
                    <div class="detail-value">
                      {{
                        formatLicenseTime(licenseData.licenseFile.lastModified)
                      }}
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="el-icon-document-delete"></i>
                  <span>{{
                    $t("menu.system.config.childrenMenu.license.noLicenseFile")
                  }}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>

    <!-- 授权导入弹窗 -->
    <el-dialog
      :title="$t('menu.system.config.childrenMenu.license.importDialogTitle')"
      :visible.sync="showLicenseImport"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="import-tip">
        <i class="el-icon-info"></i>
        <span>{{
          $t("menu.system.config.childrenMenu.license.importTip")
        }}</span>
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
          {{ $t("menu.system.config.childrenMenu.license.dragUpload") }}
        </div>
      </el-upload>
      <div v-if="selectedLicenseFile" class="selected-file-info">
        <i class="el-icon-document-checked"></i>
        <span class="file-name">{{ selectedLicenseFile.name }}</span>
      </div>
      <div slot="footer">
        <el-button @click="showLicenseImport = false">{{
          $t("menu.system.config.childrenMenu.license.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="licenseImporting"
          :disabled="!selectedLicenseFile"
          @click="handleImportLicense"
          >{{
            $t("menu.system.config.childrenMenu.license.confirmImport")
          }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import store from "@/store";
import { Message } from "element-ui";
import {
  requestGetAllConfigsApi,
  requestUpdateConfigsApi,
  requestResetConfigsApi,
} from "@/api";
import { applyConfig } from "@/utils/config";
import { useLicense } from "@/composables/useLicense";
import { useI18n } from "@/composables/useI18n";
import { getCascaderOptions, getCoordsByValues } from "@/utils/worldCities";
import { nextTick } from "vue";

// 使用 useI18n 获取响应式的当前语言和 t 函数
const { locale, t } = useI18n();

// 全球城市级联选择器数据（根据当前语言，响应式更新）
const regionOptions = computed(() => getCascaderOptions(locale.value));

// 菜单列表（响应式，根据语言自动更新）
const menuList = computed(() => [
  {
    key: "system",
    icon: "el-icon-setting",
    title: t("menu.system.config.childrenMenu.system.title"),
  },
  {
    key: "security",
    icon: "el-icon-lock",
    title: t("menu.system.config.childrenMenu.security.title"),
  },
  {
    key: "plc",
    icon: "el-icon-cpu",
    title: t("menu.system.config.childrenMenu.plc.title"),
  },
  {
    key: "export",
    icon: "el-icon-document",
    title: t("menu.system.config.childrenMenu.export.title"),
  },
  {
    key: "connection",
    icon: "el-icon-connection",
    title: t("menu.system.config.childrenMenu.connection.title"),
  },
  {
    key: "device",
    icon: "el-icon-cpu",
    title: t("menu.system.config.childrenMenu.device.title"),
  },
  {
    key: "order",
    icon: "el-icon-s-order",
    title: t("menu.system.config.childrenMenu.order.title"),
  },
  {
    key: "license",
    icon: "el-icon-key",
    title: t("menu.system.config.childrenMenu.license.manageTitle"),
  },
]);
const {
  licenseData,
  licenseLoading,
  licenseSyncing,
  licenseImporting,
  showLicenseImport,
  selectedLicenseFile,
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
  licenseTypeLabel,
} = useLicense();

// 加载状态
const loading = ref(false);
// 当前激活的菜单
const activeMenu = ref("system");

/**
 * 配置状态：
 * - loading: 加载中
 * - ready: 加载完成，数据完整
 * - incomplete: 加载完成，但数据不完整（有缺失配置项）
 * - error: 加载失败
 */
const configStatus = ref("loading");
// 缺失的配置项列表
const missingConfigKeys = ref([]);

/**
 * 必需的配置项清单（所有应该存在的配置项）
 * 与后端 initDefaultData 保持一致
 */
const REQUIRED_CONFIG_KEYS = [
  // 系统设置
  "sessionTimeout",
  "defaultPageSize",
  "defaultLanguage",
  "dateFormat",
  // 安全设置
  "watermarkEnabled",
  "watermarkText",
  // PLC 设置
  "plcProtocol",
  "plcHost",
  "plcPort",
  "plcUnitId",
  "pollFastInterval",
  "pollSlowInterval",
  // 导出设置
  "pdfWatermarkEnabled",
  "pdfWatermarkText",
  // 连接设置
  "heartbeatInterval",
  "deviceStatusCheckInterval",
  "deviceOfflineThreshold",
  // 设备参数
  "deviceName",
  "deviceCode",
  "deviceRegion",
  "deviceInstallDate",
  // 部件寿命提醒设置
  "partLifeReminderEnabled",
  "partLifeThreshold",
  "partLifeRemindInterval",
  "partLifeSnoozeInterval",
  // 订单设置
  "allowNoOrderProduction",
  "noOrderProductionHighlight",
  "showOperatorName",
  "showAlarmCount",
  "showRuntime",
  "reportIncludeAlarmDetail",
  "reportIncludeOperatorDetail",
  "reportIncludeDownloadCount",
  "allowRunningOrderDownload",
  "autoArchiveCompleted",
  "orderSwitchConfirm",
];

// 表单数据（先创建普通对象包含所有属性，再创建 reactive 对象，解决 Vue2 无法检测动态添加属性的问题；所有数据来自后端）
const initialForm = {};
REQUIRED_CONFIG_KEYS.forEach((key) => {
  initialForm[key] = undefined;
});
const form = reactive(initialForm);

// 是否管理员
const isAdmin = computed(() => {
  return store?.state?.user?.userInfo?.role === "administrator";
});

/**
 * 根据角色权限过滤后的菜单列表
 * - 系统设置、连接设置：任何角色都能查看和设置
 * - 安全设置、设备连接、导出设置、订单设置：只有管理员有权限
 * - 授权管理：所有人能看
 */
const filteredMenuList = computed(() => {
  const adminOnlyKeys = ["security", "plc", "export", "order"];
  return menuList.value.filter((item) => {
    if (adminOnlyKeys.includes(item.key)) {
      return isAdmin.value;
    }
    return true;
  });
});

/**
 * 解析 deviceRegion 为数组格式（兼容多种后端存储格式）
 */
function parseDeviceRegion(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    // JSON 字符串格式：'["CN","CN-WX"]'
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // 不是 JSON，继续尝试其他格式
    }
    // 逗号分隔格式：'CN,CN-WX'
    if (value.includes(",")) {
      return value.split(",").map((s) => s.trim());
    }
  }
  return [];
}

/**
 * 解析日期为 YYYY-MM-DD 字符串格式（兼容 Date 对象、时间戳、各种字符串格式）
 */
function parseDate(value) {
  if (!value) return "";
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return "";
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof value === "number") {
    // 时间戳（毫秒或秒）
    const ts = value < 1e12 ? value * 1000 : value;
    return parseDate(new Date(ts));
  }
  if (typeof value === "string") {
    // 已经是 YYYY-MM-DD 格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // 其他字符串格式，尝试转成 Date 再格式化
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return parseDate(date);
    }
    return value;
  }
  return "";
}

/**
 * 逐个赋值到 form（避免删除属性后再添加导致 Vue2 响应式丢失）
 */
function assignFormData(data) {
  REQUIRED_CONFIG_KEYS.forEach((key) => {
    if (data && key in data) {
      form[key] = data[key];
    }
  });
}

/**
 * 校验配置数据完整性
 * @param {Object} data 后端返回的配置数据
 * @returns {Array} 缺失的配置项列表
 */
function checkConfigCompleteness(data) {
  if (!data || typeof data !== "object") return REQUIRED_CONFIG_KEYS;
  return REQUIRED_CONFIG_KEYS.filter((key) => !(key in data));
}

/**
 * 加载配置
 */
async function loadConfigs() {
  loading.value = true;
  configStatus.value = "loading";
  missingConfigKeys.value = [];

  try {
    const res = await requestGetAllConfigsApi();
    if (res.code === 200 && res.data) {
      // 校验数据完整性
      const missingKeys = checkConfigCompleteness(res.data);

      if (missingKeys.length > 0) {
        // 数据不完整：设置状态，禁止编辑保存
        configStatus.value = "incomplete";
        missingConfigKeys.value = missingKeys;
        // 逐个赋值（避免删除属性后再添加导致 Vue2 响应式丢失）
        assignFormData(res.data);
        Message.warning(
          `检测到 ${missingKeys.length} 个未配置项，请联系管理员初始化配置`
        );
      } else {
        // 数据完整：正常加载
        configStatus.value = "ready";
        // 逐个赋值（避免删除属性后再添加导致 Vue2 响应式丢失）
        assignFormData(res.data);

        // partLifeReminderEnabled 兼容数据库存储的字符串 'true'/'false'，统一转为布尔值
        form.partLifeReminderEnabled =
          form.partLifeReminderEnabled === true ||
          form.partLifeReminderEnabled === "true" ||
          form.partLifeReminderEnabled === 1 ||
          form.partLifeReminderEnabled === "1";

        // deviceRegion 兼容多种后端存储格式，统一转为数组
        const parsedRegion = parseDeviceRegion(form.deviceRegion);
        // deviceInstallDate 兼容多种日期格式，统一转为 YYYY-MM-DD 字符串
        const parsedDate = parseDate(form.deviceInstallDate);
        // 先清空，再用 nextTick 赋值，强制 el-cascader/el-date-picker 重新计算
        form.deviceRegion = [];
        form.deviceInstallDate = "";
        await nextTick();
        form.deviceRegion = parsedRegion;
        form.deviceInstallDate = parsedDate;

        // defaultLanguage 同步为当前界面语言，避免保存其他配置时语言被意外切换
        form.defaultLanguage = locale.value;
      }
    } else {
      // 加载失败：后端返回异常
      configStatus.value = "error";
      Message.error("配置加载失败，后端返回数据异常，请刷新页面重试");
    }
  } catch (err) {
    // 加载失败：网络或其他错误
    configStatus.value = "error";
    // eslint-disable-next-line no-console
    console.error("[参数配置] 加载配置失败:", err);
    Message.error("配置加载失败，请检查网络连接或联系管理员");
  } finally {
    loading.value = false;
  }
}

/**
 * 保存配置
 */
async function handleSave() {
  // 状态校验：只有 ready 状态才能保存
  if (configStatus.value !== "ready") {
    const statusMsg = {
      loading: "配置加载中，请稍候...",
      incomplete: "配置不完整，存在未初始化项，无法保存，请联系管理员",
      error: "配置加载失败，无法保存，请刷新页面重试",
    };
    Message.error(statusMsg[configStatus.value] || "配置状态异常，无法保存");
    return;
  }

  // 数据完整性校验
  const missingKeys = checkConfigCompleteness(form);
  if (missingKeys.length > 0) {
    Message.error(
      `存在 ${missingKeys.length} 个未配置项，无法保存：${missingKeys.join(
        ", "
      )}`
    );
    return;
  }

  loading.value = true;
  try {
    const res = await requestUpdateConfigsApi(form);
    if (res.code === 200) {
      // 实时生效配置（包含语言切换、心跳间隔、水印等）
      applyConfig(res.data || form);

      // 同步更新 device store 中的设备信息
      const cityInfo = getCoordsByValues(form.deviceRegion);
      store.commit("device/SET_DEVICE_INFO", {
        name: form.deviceName,
        code: form.deviceCode,
        location: cityInfo
          ? `${cityInfo.countryNameZh}·${cityInfo.nameZh}`
          : "",
        locationCode: form.deviceRegion, // [国家编码, 城市编码]
        locationCoords: cityInfo
          ? { lng: cityInfo.lng, lat: cityInfo.lat }
          : null,
        installDate: form.deviceInstallDate,
      });

      Message.success("保存成功");
    } else {
      Message.error("保存失败，请重试");
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[参数配置] 保存配置失败:", err);
    Message.error("保存失败，请检查网络连接");
  } finally {
    loading.value = false;
  }
}

/**
 * 重置配置
 */
function handleReset() {
  // 状态校验：只有 ready 状态才能重置
  if (configStatus.value !== "ready") {
    Message.warning("当前配置状态不允许重置，请刷新页面后重试");
    return;
  }

  // 确认重置逻辑
  requestResetConfigsApi()
    .then((res) => {
      if (res.code === 200 && res.data) {
        // 校验重置后的数据完整性
        const missingKeys = checkConfigCompleteness(res.data);
        if (missingKeys.length > 0) {
          configStatus.value = "incomplete";
          missingConfigKeys.value = missingKeys;
          Message.warning(
            `重置后检测到 ${missingKeys.length} 个未配置项，请联系管理员`
          );
          return;
        }

        // 数据完整，正常重置
        configStatus.value = "ready";
        // 逐个赋值（避免删除属性后再添加导致 Vue2 响应式丢失）
        assignFormData(res.data);
        // partLifeReminderEnabled 兼容数据库存储的字符串 'true'/'false'，统一转为布尔值
        form.partLifeReminderEnabled =
          form.partLifeReminderEnabled === true ||
          form.partLifeReminderEnabled === "true" ||
          form.partLifeReminderEnabled === 1 ||
          form.partLifeReminderEnabled === "1";
        // defaultLanguage 同步为当前界面语言，避免重置配置时语言被意外切换
        form.defaultLanguage = locale.value;
        applyConfig(form);
        Message.success("重置成功");
      } else {
        Message.error("重置失败，请重试");
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("[参数配置] 重置配置失败:", err);
      Message.error("重置失败，请检查网络连接");
    });
}

onMounted(() => {
  // 确保当前激活的菜单有权限访问（非管理员时，默认跳转到系统设置）
  const adminOnlyKeys = ["security", "plc", "export"];
  if (!isAdmin.value && adminOnlyKeys.includes(activeMenu.value)) {
    activeMenu.value = "system";
  }

  // 加载配置和授权数据（所有配置数据来自后端，不使用前端默认值）
  loadConfigs();
  loadLicenseData();
});
</script>

<style scoped lang="less">
.system-config-container {
  padding: 20px;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;
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
          ::v-deep .el-alert__description {
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

        ::v-deep .el-form-item {
          margin-bottom: 22px;
        }

        ::v-deep .el-form-item__label {
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
        ::v-deep .el-collapse-item__header {
          font-size: 13px;
          font-weight: 500;
          color: #606266;
          background: #f5f7fa;
          padding-left: 15px;
        }

        ::v-deep .el-collapse-item__content {
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
        font-family: "Courier New", monospace;
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
  ::v-deep .el-upload-dragger {
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
