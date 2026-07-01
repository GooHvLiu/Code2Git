// 1. 引入依赖包
const bcrypt = require("bcryptjs");

class bcryptjsSalted {
  /**
   * 加密密码
   * @param {String} password 用户输入的需要加密的密码
   * @returns
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * 校验密码
   * @param {String} inputValue  用户输入的需要比对的密码
   * @param {String} hashValue  存储在数据库中加密的密码
   * @returns
   */
  async comparePassword(inputValue, hashValue) {
    return bcrypt.compare(inputValue, hashValue);
  }
}

module.exports = new bcryptjsSalted();
