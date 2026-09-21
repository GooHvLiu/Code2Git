/**
 * 鍥介檯鍖栫鐞?API锛堟ā鍧楀寲銆岀洰褰曟ā鍨嬨€嶇増锛? * 鍚庣璺敱鍓嶇紑 /prod-api/v2/i18n-manager
 * 涓€绉嶈瑷€ = 涓€涓ā鍧楃洰褰曪紝鎺ュ彛缁熶竴浠?langCode锛堝 zh-CN / en-US锛夋爣璇嗚瑷€銆? *
 * 鏉冮檺锛? *  - /languages銆?language/read 鐧诲綍鐢ㄦ埛鍗冲彲锛堣瑷€鍒囨崲銆佸姩鎬佸姞杞斤級
 *  - 鍏朵綑鎺ュ彛浠呰秴绾х鐞嗗憳
 */
import request from '@/utils/request/request'

// ========== 璇█鍒楄〃 / 璇诲彇 / 鎼滅储 ==========

/** 璇█鍒楄〃锛堢櫥褰曠敤鎴峰彲璁块棶锛岀敤浜庤瑷€鍒囨崲涓庣鐞嗛〉锛?*/
export function requestGetLanguagesApi() {
  return request({
    url: '/i18n-manager/languages',
    method: 'get'
  })
}

/**
 * 鑱氬悎璇诲彇鏁撮棬璇█锛堢櫥褰曠敤鎴峰彲璁块棶锛岀敤浜庡姩鎬佸姞杞借瑷€鍖咃級
 * @param {string} langCode - 璇█浠ｇ爜锛屽 zh-CN / en-US / ja-JP
 */
export function requestReadLanguageApi(langCode: string) {
  return request({
    url: '/i18n-manager/language/read',
    method: 'get',
    params: { langCode }
  })
}

/**
 * 鍦ㄤ竴闂ㄨ瑷€鍐呮寜 key / 鍊兼悳绱紙瓒呯锛? * @param {string} langCode 璇█浠ｇ爜
 * @param {string} keyword 鍏抽敭璇? */
export function requestSearchLanguageApi(langCode: string, keyword: string) {
  return request({
    url: '/i18n-manager/language/search',
    method: 'get',
    params: { langCode, keyword }
  })
}

// ========== 鑺傜偣绾у鍒犳敼 ==========

/** 淇敼鍗曚釜 key 鐨勫€?*/
export function requestSaveNodeApi(payload: Record<string, unknown>) {
  return request({
    url: '/i18n-manager/node/save',
    method: 'post',
    data: payload // { langCode, keyPath, value }
  })
}

/** 鏂板涓€涓?key锛坈ommon 骞抽摵鏂板闇€甯?spreadFile锛?*/
export function requestAddNodeApi(payload: Record<string, unknown>) {
  return request({
    url: '/i18n-manager/node/add',
    method: 'post',
    data: payload // { langCode, parentPath, key, value, spreadFile }
  })
}

/** 鍒犻櫎涓€涓?key */
export function requestDeleteNodeApi(payload: Record<string, unknown>) {
  return request({
    url: '/i18n-manager/node/delete',
    method: 'post',
    data: payload // { langCode, keyPath }
  })
}

/** 鏁磋瑷€鐏屽€硷紙鎵归噺缈昏瘧缁撴灉淇濆瓨锛?*/
export function requestSaveLanguageValuesApi(langCode: string, data: Record<string, unknown>) {
  return request({
    url: '/i18n-manager/language/save-values',
    method: 'post',
    data: { langCode, data }
  })
}

// ========== 鍒涘缓璇█ ==========

/**
 * 浠ユ簮璇█鐩綍涓烘ā鏉垮垱寤烘柊璇█锛堟柊璇█蹇呴』鍛戒腑鍚庣棰勮锛? * @param {Object} params
 * @param {string} params.sourceLangCode 婧愯瑷€浠ｇ爜
 * @param {string} params.newLangCode 鏂拌瑷€浠ｇ爜
 * @param {boolean} params.copyValues 鏄惁澶嶅埗璇戞枃锛坒alse=娓呯┖寰呯炕璇戯級
 */
export function requestCreateLanguageApi(params: Record<string, unknown>) {
  return request({
    url: '/i18n-manager/language/create',
    method: 'post',
    data: params
  })
}

// ========== zip 澶囦唤 / 鎭㈠ / 鍒犻櫎 ==========

/** 鍒涘缓鏁寸洰褰?zip 澶囦唤 */
export function requestBackupLanguageApi(langCode: string) {
  return request({
    url: '/i18n-manager/backup',
    method: 'post',
    data: { langCode }
  })
}

/** 澶囦唤娓呭崟锛堝彲鎸?langCode 杩囨护锛屼笉浼犺繑鍥炲叏閮級 */
export function requestGetLanguageBackupListApi(langCode: string) {
  return request({
    url: '/i18n-manager/backups',
    method: 'get',
    params: { langCode }
  })
}

/** 鎭㈠澶囦唤锛堟仮澶嶅墠鍚庣浼氳嚜鍔ㄥ浠藉綋鍓嶈瑷€锛?*/
export function requestRestoreLanguageBackupApi(backupFileName: string, langCode: string) {
  return request({
    url: '/i18n-manager/backup/restore',
    method: 'post',
    data: { backupFileName, langCode }
  })
}

/** 鍒犻櫎澶囦唤 */
export function requestDeleteLanguageBackupApi(backupFileName: string) {
  return request({
    url: '/i18n-manager/backup/delete',
    method: 'post',
    data: { backupFileName }
  })
}

// ========== 澶囦唤鐩綍閰嶇疆 ==========

/** 鑾峰彇澶囦唤鐩綍閰嶇疆 */
export function requestGetI18nBackupConfigApi() {
  return request({
    url: '/i18n-manager/backup-config',
    method: 'get'
  })
}

/** 璁剧疆澶囦唤鐩綍 */
export function requestSetI18nBackupDirApi(backupDir: string) {
  return request({
    url: '/i18n-manager/backup-dir',
    method: 'post',
    data: { backupDir }
  })
}

// ========== 棰勮璇█ ==========

/** 棰勮璇█鍒楄〃锛堟柊寤鸿瑷€鏃跺彧鑳戒粠涓€夋嫨锛?*/
export function requestGetPresetLanguagesApi() {
  return request({
    url: '/i18n-manager/preset-languages',
    method: 'get'
  })
}

/** 鑾峰彇棰勮璇█閰嶇疆鏂囦欢鍐呭锛堥珮绾х紪杈戯級 */
export function requestGetPresetLanguagesConfigApi() {
  return request({
    url: '/i18n-manager/preset-languages/config',
    method: 'get'
  })
}

/** 淇濆瓨棰勮璇█閰嶇疆鏂囦欢鍐呭 */
export function requestSavePresetLanguagesConfigApi(content: Record<string, unknown>) {
  return request({
    url: '/i18n-manager/preset-languages/config',
    method: 'post',
    data: { content }
  })
}
