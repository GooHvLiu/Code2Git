const { success, fail } = require("@MongoDB/utils/response.js");
const { accountsService } = require("@MongoDB/services/index.service.js");

class AccountsController {
  // 【API接口用】获取所有账单列表（管理员）,返回JSON给前端ajax
  async getAccountsList(req, res) {
    try {
      const { page = 1, limit = 10, username } = req.query;
      const query = {};
      //下面是为了匹配有管理员的前提下
      // if (username) query.username = new RegExp(username, "i");
      const accountsListData = await accountsService.getAccountsList(
        query,
        page,
        limit,
      );
      return success(res, accountsListData);
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】获取所有账单列表（管理员）,只返回分页数据，不操作res
  async getAccountsListData(req) {
    try {
      const { page = 1, limit = 10, username } = req.query;

      const query = {};
      //下面是为了匹配有管理员的前提下
      // if (username) query.username = new RegExp(username, "i");
      const data = await accountsService.getAccountsList(query, page, limit);

      return {
        type: 1,
        msg: "获取账单列表成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "获取账单列表失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】创建单一账目信息,返回JSON给前端ajax
  async createAccount(req, res) {
    try {
      const createAccountData = await accountsService.createAccount(req.body);
      return success(res, createAccountData, "创建成功");
    } catch (err) {
      return fail(res, err);
    }
  }
  // 【页面模板渲染专用】创建唯一账目信息,返回结果
  async createAccountData(Object) {
    try {
      const data = await accountsService.createAccount(Object);
      return {
        type: 1,
        msg: "创建成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "账目创建失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】删除单一账目（软删）,返回JSON给前端ajax
  async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      const deleteAccountData = await accountsService.deleteById(id);
      return success(res, deleteAccountData, "删除成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】删除唯一账目（软删）,只处理，返回处理结果通知
  async deleteAccountData(req) {
    try {
      const { id } = req.params;
      const data = await accountsService.deleteById(id);
      return {
        type: 1,
        msg: "删除成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "删除账目失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】根据ID查询,返回JSON给前端ajax
  async getOneAccountById(req, res) {
    try {
      const getOneAccountData = await accountsService.findById(req.params.id);
      return success(res, getOneAccountData, "查找成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】根据ID查询,返回结果
  async getOneAccountByIdData(id) {
    try {
      const data = await accountsService.findById(id);
      return {
        type: 1,
        msg: "查询成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "根据ID查找失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【API接口用】更新单一账目，返回JSON给前端ajax
  async updateAccountById(req, res) {
    try {
      const { id } = req.params;
      const updateAccountData = await accountsService.updateById(id, req.body);
      return success(res, updateAccountData, "更新成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】更新唯一账目
  async updateAccountByIdData(id, updateObject) {
    try {
      const data = await accountsService.updateById(id, updateObject);
      return {
        type: 1,
        msg: "更新成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "更新账目失败，请检查填写数据",
        error: err,
      };
    }
  }
}

module.exports = new AccountsController();
