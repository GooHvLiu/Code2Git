const UserService = require('../user/user.service')

/**
 * 将客户表格中查询到的Object.Array[N].id通过用户表格匹配，在原有数据中增加键值
 * @param {Object} result 是一个对象，但内含 list 数组
 * @returns {Promise<Object|null>} 查询结果数组
 */
async function idToNameMap(result) {
  // 1. result.list 可能undefined，转为空数组，防止for...of/map报错
  const customerList = result.list || [];

  // 2. 提取所有录入人ID，set不允许有重复项，所以可以去重，减少数据库查询
  const userIdArray = [...new Set(
    customerList.map(item => item.input_user_id).filter(id => id != null)
  )];

  // 3. 批量查询所有相关用户信息
  const userList = await UserService.getUserByIdArray(userIdArray);

  // 4. 构建映射表 { id: username }
  const userMap = {};
  userList.forEach(user => {
    userMap[user.id] = user.username;
  });

  // 5. 遍历客户数组，新增 agentName 字段
  const newCustomerList = customerList.map(item => {
    return {
      ...item, // 保留客户原有全部字段
      // 根据id匹配名称，找不到显示“未知人员”
      agentName: userMap[item.input_user_id] ?? "未知人员"
    };
  });

  // 6. 返回数据
  return {
    list: newCustomerList,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize
  };
}

module.exports = {
  idToNameMap
}