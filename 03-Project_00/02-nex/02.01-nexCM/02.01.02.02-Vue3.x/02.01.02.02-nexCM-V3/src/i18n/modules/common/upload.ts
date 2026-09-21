/**
 * 通用上传组件国际化（命名空间挂载：common.upload.*）
 * 无兜底，缺 key 直接显示 key。
 */
export default {
  /** 上传提示文字 */
  tip: '上传图片',
  /** 上传结果 */
  success: '上传成功',
  failed: '上传失败，请重试',
  noUrl: '上传成功但未获取到图片地址',
  /** 校验 */
  typeInvalid: '仅支持上传图片文件',
  sizeExceed: '图片大小不能超过 {size}MB',
  exceed: '最多只能上传 {count} 张图片'
}
