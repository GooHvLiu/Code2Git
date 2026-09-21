/**
 * 布局模块 - 首页国际化字段
 * 首页、数据视图相关文案
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【子模块】数据视图
  dataview: {
    // 【子模块】报警
    alarm: {
      // 【标签】报警标题
      title: '报警信息'
    },
    // 【子模块】OEE
    oee: {
      // 【标签】OEE标题
      title: '设备综合效率'
    },
    // 【子模块】产量
    output: {
      // 【标签】产量标题
      title: '产量统计'
    },
    // 【子模块】生产
    production: {
      // 【标签】生产标题
      title: '生产信息'
    }
  },
  // 【子模块】概览
  overview: {
    // 【标签】默认标题
    default: '首页概览',
    // 【设备状态】已运行时长，{duration} 为时长文本
    runningDuration: '已运行 {duration}',
    // 【时长】{h} 小时 {m} 分钟
    durationFormat: '{h}小时{m}分钟',
    // 【运行速度】目标速度，{speed} 为数值
    targetSpeed: '目标：{speed} 瓶/h',
    // 【今日产能】完成率，{rate} 为百分比
    todayRate: '完成率 {rate}%',
    // 【本班产能】班次与目标，{shift} 为班次名、{target} 为目标产量
    shiftTarget: '{shift} · 目标 {target} 瓶',
    // 【趋势】24 小时产能趋势标题
    trendTitle: '24小时产能趋势',
    // 【趋势】柱条悬浮提示，{hour} 为小时、{value} 为产量
    trendTooltip: '{hour}时：{value}瓶',
    // 【趋势】今日总计
    todayTotal: '今日总计：{value} 瓶',
    // 【趋势】峰值产量
    peak: '峰值：{value} 瓶/小时',
    // 【趋势】无数据提示
    trendEmpty: '暂无产能趋势数据',
    // 【报警】实时报警标题
    alarmTitle: '实时报警',
    // 【报警】报警条数，{count} 为数量
    alarmCount: '{count} 条',
    // 【报警】报警代码，{code} 为代码
    alarmCode: '代码：{code}',
    // 【报警】无报警提示
    noAlarm: '设备运行正常，无报警'
  },

  // 【子模块】数据看板（大屏 dashboard）
  dashboard: {
    // 【标签】页头标题
    title: '生产数据看板',
    // 【标签】全屏 / 退出全屏
    fullscreen: '全屏展示',
    exitFullscreen: '退出全屏',
    // 【面板】世界设备分布
    worldMap: {
      title: '全球设备分布',
      onlineDevice: '在线设备',
      alarm: '告警'
    },
    // 【面板】设备信息
    deviceInfo: {
      title: '设备信息',
      name: '设备名称',
      region: '所在地区',
      location: '经纬度',
      ip: '设备IP',
      runtime: '运行时长',
      hours: '小时'
    },
    // 【面板】产能趋势
    outputTrend: {
      title: '产能趋势'
    },
    // 【面板】设备运行状态
    deviceStatus: {
      title: '设备运行状态',
      runningRate: '运行率'
    },
    // 【面板】批次完成情况
    batch: {
      title: '批次完成情况',
      progress: '生产进度',
      bottle: '瓶'
    },
    // 【面板】实时生产数据
    realtime: {
      title: '实时生产数据',
      live: '实时',
      colTime: '时间',
      colSpeed: '速度',
      colOutput: '累计',
      colFill: '填充量',
      colStatus: '状态',
      statusNormal: '正常',
      statusFluctuate: '波动'
    },
    // 【面板】今日报警统计
    alarmStats: {
      title: '今日报警统计',
      times: '次'
    },
    // 【面板】质量检测
    quality: {
      title: '质量检测',
      qualifiedRate: '合格率',
      total: '总检测',
      qualified: '合格数',
      unqualified: '不合格',
      scrapRate: '废品率'
    },
    // 【指标卡】核心指标
    metrics: {
      todayOutput: '今日产能',
      shiftOutput: '本班产能',
      speed: '运行速度',
      oee: '综合稼动率 OEE',
      target: '目标',
      completion: '完成率',
      efficiency: '效率',
      available: '可用',
      performance: '性能',
      bottle: '瓶',
      bottlePerHour: '瓶/h',
      qualified: '合格'
    },
    // 【运行状态】
    runtime: {
      running: '运行',
      idle: '空闲',
      fault: '故障'
    },
    // 【批次信息】
    batchInfo: {
      productName: '产品名称',
      fillVolume: '填充量',
      startTime: '开始时间',
      estimatedEnd: '预计完成',
      produced: '已生产',
      remaining: '剩余',
      estimatedRemaining: '预计剩余'
    },
    // 【地图浮层】
    mapTooltip: {
      location: '位置',
      coordinates: '经纬度',
      status: '状态',
      online: '在线',
      loading: '地图数据加载中...'
    },
    // 【时间粒度】
    period: {
      hour: '小时',
      day: '日',
      month: '月'
    },
    // 【星期】
    weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    // 【报警类型】
    alarmTypes: {
      position: '位置报警',
      vacuum: '真空报警',
      servo: '伺服报警',
      timeout: '超时报警',
      temperature: '温度报警',
      other: '其他报警'
    },
    // 【提示】
    tip: {
      mapLoadFailed: '地图数据加载失败',
      fullscreenFailed: '全屏失败，请检查浏览器权限',
      fullscreenNotSupport: '当前浏览器不支持全屏',
      mapInitFailed: '地图初始化失败'
    }
  },

  // 【子模块】详细数据查询（home/data）
  data: {
    // 【页签标题】
    tabs: {
      output: '产能数据',
      oee: '稼动率数据',
      production: '生产数据',
      alarm: '报警数据'
    },
    // 【表单标签】
    label: {
      type: '统计类型',
      dateRange: '时间范围',
      productName: '产品名称',
      batchNo: '批次号',
      status: '生产状态',
      productionTime: '生产时间',
      alarmCode: '报警代码',
      alarmType: '报警类型',
      alarmLevel: '报警级别'
    },
    // 【占位符】
    placeholder: {
      select: '请选择',
      inputBatchNo: '请输入批次号',
      inputAlarmCode: '请输入报警代码',
      startDate: '开始日期',
      endDate: '结束日期',
      to: '至'
    },
    // 【按钮】
    button: {
      search: '搜索',
      reset: '重置',
      refresh: '刷新',
      detail: '详情',
      export: '导出',
      close: '关闭'
    },
    // 【统计类型选项】
    period: {
      byHour: '按小时',
      byDay: '按日',
      byWeek: '按周',
      byMonth: '按月',
      byShift: '按班次'
    },
    // 【产品选项】
    product: {
      cartridge: '卡式瓶灌装',
      vial: '西林瓶灌装',
      ampoule: '安瓿瓶灌装'
    },
    // 【生产状态】
    status: {
      completed: '已完成',
      running: '生产中',
      paused: '已暂停',
      fault: '异常',
      producing: '生产中'
    },
    // 【报警类型选项】
    alarmType: {
      position: '位置异动',
      vacuum: '真空异常',
      servo: '伺服使能',
      timeout: '超时报警',
      limit: '限位报警'
    },
    // 【报警级别】
    alarmLevel: {
      critical: '紧急',
      warning: '警告',
      info: '提示'
    },
    // 【表格列】
    column: {
      index: '序号',
      period: '统计周期',
      productName: '产品名称',
      targetQty: '目标数量',
      actualQty: '实际产量',
      qualifiedQty: '合格数',
      completionRate: '完成率(%)',
      qualifiedRate: '合格率(%)',
      avgSpeed: '平均速度(瓶/h)',
      startTime: '开始时间',
      endTime: '结束时间',
      planTime: '计划时间(h)',
      runTime: '运行时间(h)',
      idleTime: '空闲时间(h)',
      faultTime: '故障时间(h)',
      availability: '可用率(%)',
      performance: '性能率(%)',
      oee: 'OEE(%)',
      faultCount: '故障次数',
      remark: '备注',
      batchNo: '批次号',
      fillVolume: '填充量(ml)',
      producedQty: '已生产',
      status: '状态',
      action: '操作',
      alarmCode: '报警代码',
      alarmName: '报警名称',
      alarmType: '报警类型',
      alarmLevel: '报警级别',
      occurTime: '发生时间',
      recoverTime: '恢复时间',
      duration: '持续时间',
      operator: '处理人',
      handleRemark: '处理备注'
    },
    // 【其他文案】
    total: '共 {total} 条记录',
    detailTitle: '生产详情',
    exportBatch: '导出批次：{batchNo}',
    searchApplied: '搜索条件已应用',
    refreshed: '数据已刷新'
  }
}
