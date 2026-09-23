/**
 * Layout Module - Home Page Internationalization Fields (English)
 * Home page, data view related text
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // [Submodule] Data view
  dataview: {
    // [Submodule] Alarm
    alarm: {
      // [Label] Alarm title
      title: 'Alarm Information'
    },
    // [Submodule] OEE
    oee: {
      // [Label] OEE title
      title: 'Overall Equipment Effectiveness'
    },
    // [Submodule] Output
    output: {
      // [Label] Output title
      title: 'Output Statistics'
    },
    // [Submodule] Production
    production: {
      // [Label] Production title
      title: 'Production Information'
    }
  },
  // [Submodule] Overview
  overview: {
    // [Label] Default title
    default: 'Home Overview',
    // [Device status] Running duration text, {duration} is the duration
    runningDuration: 'Running for {duration}',
    // [Duration] {h} hours {m} minutes
    durationFormat: '{h}h {m}m',
    // [Speed] Target speed, {speed} is the value
    targetSpeed: 'Target: {speed} bph',
    // [Today output] Completion rate, {rate} is the percentage
    todayRate: 'Completion {rate}%',
    // [Shift output] Shift and target, {shift} is the shift name, {target} the target
    shiftTarget: '{shift} · Target {target} btls',
    // [Trend] 24h output trend title
    trendTitle: '24h Output Trend',
    // [Trend] Bar tooltip, {hour} is the hour and {value} the output
    trendTooltip: '{hour}:00 · {value} btls',
    // [Trend] Today's total
    todayTotal: "Today's total: {value} btls",
    // [Trend] Peak output
    peak: 'Peak: {value} bph',
    // [Trend] Empty data tip
    trendEmpty: 'No output trend data',
    // [Alarm] Real-time alarms title
    alarmTitle: 'Real-time Alarms',
    // [Alarm] Alarm count, {count} is the number
    alarmCount: '{count} alerts',
    // [Alarm] Alarm code, {code} is the code
    alarmCode: 'Code: {code}',
    // [Alarm] No alarms tip
    noAlarm: 'Device running normally, no alarms'
  },

  // [Submodule] Dashboard (large screen)
  dashboard: {
    // [Label] Header title
    title: 'Production Dashboard',
    // [Label] Fullscreen / Exit
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    // [Panel] Device distribution map
    worldMap: {
      title: 'Global Device Distribution',
      onlineDevice: 'Online Devices',
      alarm: 'Alarms'
    },
    // [Panel] Device info
    deviceInfo: {
      title: 'Device Info',
      name: 'Device Name',
      region: 'Region',
      location: 'Coordinates',
      ip: 'Device IP',
      runtime: 'Runtime',
      hours: 'h'
    },
    // [Panel] Output trend
    outputTrend: {
      title: 'Output Trend'
    },
    // [Panel] Device running status
    deviceStatus: {
      title: 'Device Running Status',
      runningRate: 'Running Rate'
    },
    // [Panel] Batch completion
    batch: {
      title: 'Batch Completion',
      progress: 'Production Progress',
      bottle: 'pcs'
    },
    // [Panel] Real-time production data
    realtime: {
      title: 'Real-time Production Data',
      live: 'LIVE',
      colTime: 'Time',
      colSpeed: 'Speed',
      colOutput: 'Cumulative',
      colFill: 'Fill Volume',
      colStatus: 'Status',
      statusNormal: 'Normal',
      statusFluctuate: 'Fluctuating'
    },
    // [Panel] Today alarm stats
    alarmStats: {
      title: "Today's Alarm Stats",
      times: 'times'
    },
    // [Panel] Quality inspection
    quality: {
      title: 'Quality Inspection',
      qualifiedRate: 'Qualified Rate',
      total: 'Total Inspected',
      qualified: 'Qualified',
      unqualified: 'Unqualified',
      scrapRate: 'Scrap Rate'
    },
    // [Metric cards]
    metrics: {
      todayOutput: "Today's Output",
      shiftOutput: 'Shift Output',
      speed: 'Running Speed',
      oee: 'Overall OEE',
      target: 'Target',
      completion: 'Completion',
      efficiency: 'Efficiency',
      available: 'Availability',
      performance: 'Performance',
      bottle: 'pcs',
      bottlePerHour: 'pcs/h',
      qualified: 'Qualified'
    },
    // [Runtime status]
    runtime: {
      running: 'Running',
      idle: 'Idle',
      fault: 'Fault'
    },
    // [Batch info]
    batchInfo: {
      productName: 'Product Name',
      fillVolume: 'Fill Volume',
      startTime: 'Start Time',
      estimatedEnd: 'Estimated End',
      produced: 'Produced',
      remaining: 'Remaining',
      estimatedRemaining: 'Estimated Remaining'
    },
    // [Map tooltip]
    mapTooltip: {
      location: 'Location',
      coordinates: 'Coordinates',
      status: 'Status',
      online: 'Online',
      loading: 'Loading map data...'
    },
    // [Time period]
    period: {
      hour: 'Hour',
      day: 'Day',
      month: 'Month'
    },
    // [Week days]
    weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    // [Alarm types]
    alarmTypes: {
      position: 'Position Alarm',
      vacuum: 'Vacuum Alarm',
      servo: 'Servo Alarm',
      timeout: 'Timeout Alarm',
      temperature: 'Temperature Alarm',
      other: 'Other Alarm'
    },
    // [Tips]
    tip: {
      mapLoadFailed: 'Failed to load map data',
      fullscreenFailed: 'Fullscreen failed, please check browser permissions',
      fullscreenNotSupport: 'Current browser does not support fullscreen',
      mapInitFailed: 'Map initialization failed'
    }
  },

  // [Submodule] Detailed data query (home/data)
  data: {
    // [Tab titles]
    tabs: {
      output: 'Output Data',
      oee: 'OEE Data',
      production: 'Production Data',
      alarm: 'Alarm Data'
    },
    // [Form labels]
    label: {
      type: 'Statistics Type',
      dateRange: 'Time Range',
      productName: 'Product Name',
      batchNo: 'Batch No.',
      status: 'Production Status',
      productionTime: 'Production Time',
      alarmCode: 'Alarm Code',
      alarmType: 'Alarm Type',
      alarmLevel: 'Alarm Level'
    },
    // [Placeholders]
    placeholder: {
      select: 'Please select',
      inputBatchNo: 'Please enter batch no.',
      inputAlarmCode: 'Please enter alarm code',
      startDate: 'Start Date',
      endDate: 'End Date',
      to: 'To'
    },
    // [Buttons]
    button: {
      search: 'Search',
      reset: 'Reset',
      refresh: 'Refresh',
      detail: 'Detail',
      export: 'Export',
      close: 'Close'
    },
    // [Period options]
    period: {
      byHour: 'Hourly',
      byDay: 'Daily',
      byWeek: 'Weekly',
      byMonth: 'Monthly',
      byShift: 'By Shift'
    },
    // [Product options]
    product: {
      cartridge: 'Cartridge Filling',
      vial: 'Vial Filling',
      ampoule: 'Ampoule Filling'
    },
    // [Production status]
    status: {
      completed: 'Completed',
      running: 'Running',
      paused: 'Paused',
      fault: 'Abnormal',
      producing: 'Running'
    },
    // [Alarm type options]
    alarmType: {
      position: 'Position Shift',
      vacuum: 'Vacuum Abnormal',
      servo: 'Servo Enabled',
      timeout: 'Timeout Alarm',
      limit: 'Limit Alarm'
    },
    // [Alarm level]
    alarmLevel: {
      critical: 'Critical',
      warning: 'Warning',
      info: 'Info'
    },
    // [Table columns]
    column: {
      index: 'No.',
      period: 'Period',
      productName: 'Product Name',
      targetQty: 'Target Qty',
      actualQty: 'Actual Output',
      qualifiedQty: 'Qualified Qty',
      completionRate: 'Completion Rate(%)',
      qualifiedRate: 'Qualified Rate(%)',
      avgSpeed: 'Avg Speed(pcs/h)',
      startTime: 'Start Time',
      endTime: 'End Time',
      planTime: 'Plan Time(h)',
      runTime: 'Run Time(h)',
      idleTime: 'Idle Time(h)',
      faultTime: 'Fault Time(h)',
      availability: 'Availability(%)',
      performance: 'Performance(%)',
      oee: 'OEE(%)',
      faultCount: 'Fault Count',
      remark: 'Remark',
      batchNo: 'Batch No.',
      fillVolume: 'Fill Volume(ml)',
      producedQty: 'Produced',
      status: 'Status',
      action: 'Action',
      alarmCode: 'Alarm Code',
      alarmName: 'Alarm Name',
      alarmType: 'Alarm Type',
      alarmLevel: 'Alarm Level',
      occurTime: 'Occur Time',
      recoverTime: 'Recover Time',
      duration: 'Duration',
      operator: 'Handler',
      handleRemark: 'Handling Remark'
    },
    // [Other text]
    total: '{total} records in total',
    detailTitle: 'Production Detail',
    exportBatch: 'Export batch: {batchNo}',
    searchApplied: 'Search criteria applied',
    refreshed: 'Data refreshed'
  }
}
