/**
 * 设备管理模块 - 报警管理国际化字段
 * 注意：不使用兜底方案，缺失字段直接显示 key
 * 作者：GooHv
 */
export default {
  // 【通用】全部
  all: '全部',
  // 【单位】次
  unitTimes: '次',
  // 【标签】较昨日
  vsYesterday: '较昨日',
  // 【子模块】仪表盘
  dashboard: {
    title: '报警仪表盘'
  },
  // 【子模块】列表
  list: {
    title: '报警列表'
  },

  // 【统计卡片】今日报警
  statToday: '今日报警',
  // 【统计卡片】紧急报警
  statCritical: '紧急报警',
  // 【统计卡片】未处理
  statPending: '未处理',
  // 【统计卡片】平均处理时长
  statAvgHandle: '平均处理时长',

  // 【图表】报警类别分布
  categoryDist: '报警类别分布',
  // 【图表】总报警
  totalAlarms: '总报警',
  // 【图表】近7天报警趋势
  trend7d: '近7天报警趋势',
  // 【图表】报警级别
  levelDist: '报警级别分布',
  // 【图表】TOP5 报警类型
  top5Title: '报警类型 TOP5',
  // 【图表】TOP5 副标题
  top5Subtitle: '近30天',

  // 【类别】位置异动
  categoryPosition: '位置异动',
  // 【类别】真空异常
  categoryVacuum: '真空异常',
  // 【类别】伺服使能
  categoryServo: '伺服使能',
  // 【类别】超时报警
  categoryTimeout: '超时报警',
  // 【类别】温度异常
  categoryTemperature: '温度异常',
  // 【类别】压力异常
  categoryPressure: '压力异常',
  // 【类别】其他
  categoryOther: '其他',

  // 【级别】紧急
  levelCritical: '紧急',
  // 【级别】重要
  levelMajor: '重要',
  // 【级别】一般
  levelMinor: '一般',
  // 【级别】提示
  levelInfo: '提示',

  // 【状态】未处理
  statusPending: '未处理',
  // 【状态】处理中
  statusProcessing: '处理中',
  // 【状态】已处理
  statusResolved: '已处理',

  // 【周】周一…周日
  weekMon: '周一',
  weekTue: '周二',
  weekWed: '周三',
  weekThu: '周四',
  weekFri: '周五',
  weekSat: '周六',
  weekSun: '周日',

  // 【TOP5 名称】
  top1Name: '位置异动报警',
  top1Desc: '灌装工位位置偏差超过阈值',
  top2Name: '真空度异常',
  top2Desc: '真空系统压力不达标',
  top3Name: '伺服使能失败',
  top3Desc: '伺服驱动器无法正常使能',
  top4Name: '动作超时',
  top4Desc: '机构动作时间超过设定值',
  top5Name: '温度异常',
  top5Desc: '灌装温度超出允许范围',

  // 【描述】mock 描述库
  desc1: '灌装工位位置偏差超过阈值',
  desc2: '真空系统压力不达标',
  desc3: '伺服驱动器无法正常使能',
  desc4: '机构动作时间超过设定值',
  desc5: '灌装温度超出允许范围',
  desc6: '加塞压力异常',
  desc7: '设备振动超标',
  desc8: '气源压力不足',

  // 【列】报警级别
  colLevel: '报警级别',
  // 【列】报警类别
  colCategory: '报警类别',
  // 【列】处理状态
  colStatus: '处理状态',
  // 【列】序号
  colIndex: '序号',
  // 【列】报警编号
  colAlarmNo: '报警编号',
  // 【列】报警时间
  colAlarmTime: '报警时间',
  // 【列】报警代码
  colAlarmCode: '报警代码',
  // 【列】报警描述
  colDescription: '报警描述',
  // 【列】设备编号
  colDeviceCode: '设备编号',
  // 【列】处理人
  colHandler: '处理人',
  // 【列】处理时间
  colResolveTime: '处理时间',
  // 【列】操作
  colAction: '操作',

  // 【搜索】关键词
  keyword: '关键词',
  // 【搜索】关键词占位
  keywordPlaceholder: '报警描述/设备编号',
  // 【按钮】搜索
  search: '搜索',
  // 【按钮】重置
  reset: '重置',
  // 【按钮】刷新
  refresh: '刷新',
  // 【按钮】导出
  export: '导出',
  // 【按钮】详情
  detail: '详情',
  // 【按钮】处理
  handle: '处理',
  // 【文本】共
  totalPrefix: '共',
  // 【文本】条记录
  totalSuffix: '条记录',
  // 【文本】已选择 {count} 项
  selected: '已选择 {count} 项',
  // 【消息】搜索待对接
  searchTodo: '搜索功能待对接后端接口',
  // 【消息】刷新成功
  refreshSuccess: '刷新成功',
  // 【消息】查看详情 {no}
  detailTodo: '查看报警详情：{no}',
  // 【消息】处理报警 {no}
  handleTodo: '处理报警：{no}'
}
