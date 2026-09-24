/**
 * ==========================================
 * 鑿滃崟绠＄悊鎺ュ彛
 * ==========================================
 * 鍚庣璺敱鍓嶇紑 /prod-api/v2/menu
 */
import request from '@/utils/request/request'

/** 鑾峰彇鐧诲綍鐢ㄦ埛鐨勮彍鍗曡矾鐢憋紙鏀寔鐗堟湰鍙风紦瀛橈級 */
export function requestGetRoutersApi(version: string, lang: string) {
  return request({
    url: '/menu/routers',
    method: 'get',
    params: { version, lang }
  })
}

/** 鑾峰彇鑿滃崟鏈€鏂扮増鏈彿 */
export function requestGetMenuVersionApi() {
  return request({ url: '/menu/version', method: 'get' })
}

// ==================== 鑿滃崟閰嶇疆绠＄悊鐩稿叧鎺ュ彛 ====================

/** 鑾峰彇鎵€鏈夎彍鍗曟爲锛堢敤浜庤彍鍗曢厤缃〉闈級 */
export function requestGetAdminMenuTreeApi() {
  return request({ url: '/menu/admin/tree', method: 'get' })
}

/** 鍒涘缓鑿滃崟 */
export function requestCreateMenuApi(data: Record<string, unknown>) {
  return request({ url: '/menu/admin', method: 'post', data })
}

/** 鏇存柊鑿滃崟 */
export function requestUpdateMenuApi(id: string, data: Record<string, unknown>) {
  return request({ url: `/menu/admin/${id}`, method: 'put', data })
}

/** 鍒犻櫎鑿滃崟 */
export function requestDeleteMenuApi(id: string) {
  return request({ url: `/menu/admin/${id}`, method: 'delete' })
}

/** 鎷栨嫿鑿滃崟 */
export function requestDragMenuApi(id: string, parentId: string, sort: number) {
  return request({
    url: `/menu/admin/${id}/drag`,
    method: 'put',
    data: { parentId, sort }
  })
}

/** 鎵归噺淇濆瓨鑿滃崟淇敼 */
export function requestBatchSaveMenuApi(changes: (string | number)[]) {
  return request({
    url: '/menu/admin/batch-save',
    method: 'post',
    data: { changes }
  })
}

// ==================== 澶囦唤绠＄悊鐩稿叧鎺ュ彛 ====================

/** 鑾峰彇澶囦唤鐩綍閰嶇疆 */
export function requestGetMenuBackupDirApi() {
  return request({ url: '/menu/admin/backup/dir', method: 'get' })
}

/** 璁剧疆澶囦唤鐩綍 */
export function requestSetMenuBackupDirApi(backupDir: string) {
  return request({
    url: '/menu/admin/backup/dir',
    method: 'put',
    data: { backupDir }
  })
}

/** 鍒涘缓澶囦唤 */
export function requestCreateMenuBackupApi(remark: string) {
  return request({
    url: '/menu/admin/backup',
    method: 'post',
    data: { remark }
  })
}

/** 鑾峰彇澶囦唤鍒楄〃 */
export function requestGetMenuBackupListApi() {
  return request({ url: '/menu/admin/backup/list', method: 'get' })
}

/** 鎭㈠澶囦唤 */
export function requestRestoreMenuBackupApi(fileName: string) {
  return request({
    url: '/menu/admin/backup/restore',
    method: 'post',
    data: { fileName }
  })
}

/** 鍒犻櫎澶囦唤 */
export function requestDeleteMenuBackupApi(fileName: string) {
  return request({
    url: `/menu/admin/backup/${fileName}`,
    method: 'delete'
  })
}
