const { UsersService } = require("@MySQL/services/index.js");
const { validateParams } = require("@MySQL/utils/validator.util.js");

/**
 * 用户控制器层 UserController
 * 分层规范职责：
 * 1. 仅处理HTTP请求相关逻辑：接收GET/POST参数、路径参数
 * 2. 统一参数格式校验、基础合法性校验
 * 3. 调用对应Service业务方法，只传递清洗后的干净参数
 * 4. 统一封装标准接口返回JSON格式（code/msg/data）
 * 5. 捕获所有同步/异步异常，交给全局错误中间件统一处理
 * 禁止：写业务逻辑、直接导入Model、手写SQL、复杂数据处理
 */
class UsersController {
  /**
   * findAll 分页查询用户列表接口
   * 接口地址：GET /api/user/list
   * 前端传参方式：URL Query参数（?username=xxx&status=1&page=1&pageSize=10&fields=id,username）
   * @param {Express.Request} req Express内置请求对象，存储前端所有请求信息
   * @param {Express.Response} res Express内置响应对象，用于向前端返回JSON数据
   * @param {Express.NextFunction} next Express错误中转函数，抛出异常交给全局错误中间件
   * @returns {Promise<void>} 无返回值，直接通过res.json向前端输出响应
   */
  async getUserPage(req, res, next) {
    try {
      // 1. 组装查询条件对象：从req.query提取前端所有筛选分页参数
      const query = {
        // 模糊/精确匹配用户名筛选，前端不传则为undefined，Service自动忽略该条件
        username: req.query.username,
        // 用户状态筛选 0禁用/1正常，不传为undefined，Service自动忽略该条件
        status: req.query.status,
        // 页码：前端传参转数字，为空/非数字则默认第1页
        page: Number(req.query.page) || 1,
        // 每页条数：前端传参转数字，为空/非数字则默认每页10条
        pageSize: Number(req.query.pageSize) || 10,
        // 自定义返回字段，不传默认查询id,username两个字段
        fields: req.query.fields || "id,username"
      };

      // 2. 调用通用工具校验页码必须是数字，非法直接抛出错误进入catch
      validateParams(query.page, "number", "页码必须为数字");

      // 3. 调用业务层Service分页查询方法，传入组装好的筛选参数
      const data = await UsersService.getUserPage(query);

      // 4. 统一标准成功返回格式，code=200代表业务正常
      return res.json({
        code: 200,
        msg: "查询成功",
        data
      });
    } catch (err) {
      // 捕获当前接口内所有异常（参数校验错误、数据库报错、业务自定义报错）
      // 交给全局统一错误处理中间件，统一返回500错误格式
      next(err);
    }
  }

  /**
   * findAll 不分页查询用户列表接口
   * 接口地址：GET /api/user/list
   * 前端传参方式：URL Query参数（?username=xxx&status=1&fields=id,username）
   * @param {Express.Request} req Express内置请求对象，存储前端所有请求信息
   * @param {Express.Response} res Express内置响应对象，用于向前端返回JSON数据
   * @param {Express.NextFunction} next Express错误中转函数，抛出异常交给全局错误中间件
   * @returns {Promise<void>} 无返回值，直接通过res.json向前端输出响应
   */
  async getUserAll(req, res, next) {
    try {
      // 1. 组装查询条件对象：从req.query提取前端所有筛选分页参数
      const query = {
        // 模糊/精确匹配用户名筛选，前端不传则为undefined，Service自动忽略该条件
        username: req.query.username,
        // 用户状态筛选 0禁用/1正常，不传为undefined，Service自动忽略该条件
        status: req.query.status,
        // 自定义返回字段，不传默认查询id,username两个字段
        fields: req.query.fields || "id,username"
      };

      // 3. 调用业务层Service分页查询方法，传入组装好的筛选参数
      const data = await UsersService.getUserAll(query);

      // 4. 统一标准成功返回格式，code=200代表业务正常
      return res.json({
        code: 200,
        msg: "查询成功",
        data
      });
    } catch (err) {
      // 捕获当前接口内所有异常（参数校验错误、数据库报错、业务自定义报错）
      // 交给全局统一错误处理中间件，统一返回500错误格式
      next(err);
    }
  }

  /**
   * findOne 根据主键ID查询单条用户详情接口
   * 接口地址：GET /api/user/:id
   * 前端传参方式：URL路径参数，例如 /api/user/1
   * @param {Express.Request} req Express内置请求对象
   * @param {Express.Response} res Express内置响应对象
   * @param {Express.NextFunction} next 错误中转函数
   * @returns {Promise<void>}
   */
  async getUserInfo(req, res, next) {
    try {
      // 1. 从路径参数中提取用户主键ID，并转为数字类型
      const id = Number(req.params.id);
      console.log("查询到的id为：", id);

      // 2. 校验ID必须为有效数字，空/字符串会直接抛出错误
      validateParams(id, "number", "用户ID不能为空");

      // 3. 调用业务层方法，根据ID查询单条用户数据
      const user = await UsersService.getUserInfo(id);

      // 4. 成功统一返回标准JSON
      res.json({
        code: 200,
        msg: "查询成功",
        data: user
      });
    } catch (err) {
      // 异常转发至全局错误中间件
      next(err);
    }
  }

  /**
   * addUser 新增用户接口
   * 接口地址：POST /api/user/add
   * 前端传参方式：请求体JSON（Body）提交表单数据
   * @param {Express.Request} req Express内置请求对象
   * @param {Express.Response} res Express内置响应对象
   * @param {Express.NextFunction} next 错误中转函数
   * @returns {Promise<void>}
   */
  async addUser(req, res, next) {
    try {
      // 1. 提取前端POST提交的完整表单数据对象
      const userData = req.body;

      // 2. 调用业务层新增用户方法，内部完成用户名重复校验、密码格式校验、默认字段填充
      const userId = await UsersService.addUser(userData);

      // 3. 新增成功返回自增主键ID，标准返回格式
      res.json({
        code: 200,
        msg: "新增成功",
        data: { userId }
      });
    } catch (err) {
      // 捕获业务层抛出的自定义错误（用户名重复、密码格式错误等）
      next(err);
    }
  }

  /**
   * update 更新用户信息 PUT /api/user/:id
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  async editUser(req, res, next) {
    try {
      // 1. 获取路径中的用户主键ID，并转为数字
      const id = Number(req.params.id);
      // 2. 基础参数校验：ID必须是有效数字
      validateParams(id, "number", "用户ID不能为空且必须为数字");
      // 3. 前端提交的更新表单数据
      const updateFormData = req.body;

      // 4. 调用业务层执行更新逻辑
      const affectedRows = await UsersService.editUser(id, updateFormData);
      res.json({
        code: 200,
        msg: affectedRows > 0 ? "用户信息更新成功" : "未修改任何数据",
        data: { affectedRows }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * delete 物理删除用户 DELETE /api/user/remove/:id
   * 直接从数据库删除数据，谨慎调用
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  async removeUser(req, res, next) {
    try {
      const id = Number(req.params.id);
      validateParams(id, "number", "删除用户ID不能为空且必须为数字");
      const affectedRows = await UsersService.removeUser(id);

      res.json({
        code: 200,
        msg: affectedRows > 0 ? "物理删除用户成功" : "目标用户不存在，删除失败",
        data: { affectedRows }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * updateDelete 软删除用户（逻辑删除） PATCH /api/user/softRemove/:id
   * 仅修改isDelete=1，保留原始数据，推荐线上使用
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   */
  async softRemoveUser(req, res, next) {
    try {
      const id = Number(req.params.id);
      validateParams(id, "number", "软删除用户ID不能为空且必须为数字");
      const affectedRows = await UsersService.softRemoveUser(id);

      res.json({
        code: 200,
        msg: affectedRows > 0 ? "用户已软删除" : "目标用户不存在，操作失败",
        data: { affectedRows }
      });
    } catch (err) {
      next(err);
    }
  }
}

// 控制器全局单例导出，路由层直接导入使用，无需重复实例化
module.exports = new UsersController();
