/**
 * 异步错误处理包装器
 * 自动捕获 async 函数中的错误并传递给 Express 的 next()
 * 避免未处理的 Promise rejection 导致进程崩溃
 *
 * 用法：
 *   router.get('/', asyncHandler(controller.getList))
 *   或在 BaseController 构造函数中自动包装所有方法
 *
 * @param {Function} fn - 异步处理函数 (req, res, next) => Promise
 * @returns {Function} 包装后的函数
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = {
  asyncHandler
}
