/**
 * ==========================================
 * 授权状态守卫（路由门控）
 * ==========================================
 * 独立于 router/permission.ts，供路由守卫与授权导入逻辑共用，
 * 避免 composable 直接引用 permission.ts 产生循环依赖。
 *
 * 判定原则：
 * 1. 后端明确返回 valid=true / false：缓存结果。
 *    - false（授权确实无效）会一直停留在导入页，直到导入成功后调用 resetLicenseCache()。
 * 2. 网络异常 / 服务暂不可用（无法确认授权状态）：有限重试；
 *    重试仍失败时本次判定为无效并导向导入页，但【不写缓存】，
 *    下次路由跳转重新校验——后端恢复后自动放行，
 *    避免后端启动 / 重启 / 瞬时抖动时把“异常”误当“有效”而永久放行。
 *
 * 作者：GooHv
 */
import { getLicenseStatus } from '@/api'

/** 授权缓存：null 表示尚未确认，true/false 为后端明确结论 */
let licenseCache: boolean | null = null

/** 网络异常时的最大重试次数 */
const LICENSE_MAX_RETRY = 2
/** 重试间隔（毫秒） */
const LICENSE_RETRY_DELAY = 600

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 重置授权缓存（导入授权成功、或需要强制重新校验时调用） */
export function resetLicenseCache(): void {
  licenseCache = null
}

/**
 * 校验当前授权是否有效
 * @returns 是否放行（有效）
 */
export async function checkLicense(): Promise<boolean> {
  if (licenseCache !== null) return licenseCache

  for (let attempt = 0; attempt <= LICENSE_MAX_RETRY; attempt++) {
    try {
      const res = await getLicenseStatus()
      // 后端明确结论（true / false）才缓存
      licenseCache = (res.data as { valid?: boolean })?.valid === true
      return licenseCache
    } catch {
      // 网络 / 服务异常：未到重试上限则等待后重试
      if (attempt < LICENSE_MAX_RETRY) {
        await sleep(LICENSE_RETRY_DELAY)
        continue
      }
      // 重试用尽仍无法确认：本次按无效处理，但不写缓存，下次导航重新校验
      return false
    }
  }
  return false
}
