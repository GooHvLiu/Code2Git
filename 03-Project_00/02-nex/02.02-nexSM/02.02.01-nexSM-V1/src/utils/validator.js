/**
 * 参数校验工具
 * 常用校验方法统一封装
 */

/**
 * 校验是否为空
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) {
  return value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);
}

/**
 * 校验手机号
 * @param {string} phone
 * @returns {boolean}
 */
function isPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 校验邮箱
 * @param {string} email
 * @returns {boolean}
 */
function isEmail(email) {
  return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
}

/**
 * 校验密码强度（6-20位，包含字母和数字）
 * @param {string} password
 * @returns {boolean}
 */
function isStrongPassword(password) {
  return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(password);
}

/**
 * 校验正整数
 * @param {number|string} num
 * @returns {boolean}
 */
function isPositiveInteger(num) {
  const n = Number(num);
  return Number.isInteger(n) && n > 0;
}

/**
 * 校验是否在枚举范围内
 * @param {any} value
 * @param {Array} enumList
 * @returns {boolean}
 */
function isInEnum(value, enumList) {
  return enumList.includes(value);
}

/**
 * 必填参数校验
 * @param {Object} data 校验数据
 * @param {string[]} requiredFields 必填字段
 * @returns {Object} { valid: boolean, message: string }
 */
function validateRequired(data, requiredFields) {
  for (const field of requiredFields) {
    if (isEmpty(data[field])) {
      return {
        valid: false,
        message: `参数 ${field} 不能为空`
      };
    }
  }
  return { valid: true, message: '' };
}

module.exports = {
  isEmpty,
  isPhone,
  isEmail,
  isStrongPassword,
  isPositiveInteger,
  isInEnum,
  validateRequired
};
