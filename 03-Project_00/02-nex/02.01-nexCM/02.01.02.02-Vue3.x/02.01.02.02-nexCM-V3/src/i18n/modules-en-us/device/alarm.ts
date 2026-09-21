/**
 * Device module - Alarm management i18n (en-US)
 * No fallback; missing keys render the key itself.
 * Author: GooHv
 */
export default {
  all: 'All',
  unitTimes: 'times',
  vsYesterday: 'vs yesterday',
  dashboard: {
    title: 'Alarm dashboard'
  },
  list: {
    title: 'Alarm list'
  },

  statToday: "Today's alarms",
  statCritical: 'Critical alarms',
  statPending: 'Pending',
  statAvgHandle: 'Avg. handling time',

  categoryDist: 'Alarm category',
  totalAlarms: 'Total',
  trend7d: 'Last 7 days trend',
  levelDist: 'Alarm level',
  top5Title: 'Top 5 alarm types',
  top5Subtitle: 'Last 30 days',

  categoryPosition: 'Position drift',
  categoryVacuum: 'Vacuum abnormal',
  categoryServo: 'Servo enable',
  categoryTimeout: 'Action timeout',
  categoryTemperature: 'Temperature abnormal',
  categoryPressure: 'Pressure abnormal',
  categoryOther: 'Other',

  levelCritical: 'Critical',
  levelMajor: 'Major',
  levelMinor: 'Minor',
  levelInfo: 'Info',

  statusPending: 'Pending',
  statusProcessing: 'Processing',
  statusResolved: 'Resolved',

  weekMon: 'Mon',
  weekTue: 'Tue',
  weekWed: 'Wed',
  weekThu: 'Thu',
  weekFri: 'Fri',
  weekSat: 'Sat',
  weekSun: 'Sun',

  top1Name: 'Position drift alarm',
  top1Desc: 'Fill station position deviation exceeds threshold',
  top2Name: 'Vacuum abnormal',
  top2Desc: 'Vacuum system pressure out of spec',
  top3Name: 'Servo enable failed',
  top3Desc: 'Servo drive cannot be enabled',
  top4Name: 'Action timeout',
  top4Desc: 'Mechanism action time exceeded',
  top5Name: 'Temperature abnormal',
  top5Desc: 'Fill temperature out of range',

  desc1: 'Fill station position deviation exceeds threshold',
  desc2: 'Vacuum system pressure out of spec',
  desc3: 'Servo drive cannot be enabled',
  desc4: 'Mechanism action time exceeded',
  desc5: 'Fill temperature out of range',
  desc6: 'Stopper pressure abnormal',
  desc7: 'Machine vibration exceeds limit',
  desc8: 'Air supply pressure insufficient',

  colLevel: 'Level',
  colCategory: 'Category',
  colStatus: 'Status',
  colIndex: '#',
  colAlarmNo: 'Alarm No.',
  colAlarmTime: 'Alarm time',
  colAlarmCode: 'Code',
  colDescription: 'Description',
  colDeviceCode: 'Device code',
  colHandler: 'Handler',
  colResolveTime: 'Resolved time',
  colAction: 'Action',

  keyword: 'Keyword',
  keywordPlaceholder: 'Description / device code',
  search: 'Search',
  reset: 'Reset',
  refresh: 'Refresh',
  export: 'Export',
  detail: 'Detail',
  handle: 'Handle',
  totalPrefix: 'Total',
  totalSuffix: 'records',
  selected: '{count} selected',
  searchTodo: 'Search not yet wired to backend',
  refreshSuccess: 'Refreshed',
  detailTodo: 'View alarm detail: {no}',
  handleTodo: 'Handle alarm: {no}'
}
