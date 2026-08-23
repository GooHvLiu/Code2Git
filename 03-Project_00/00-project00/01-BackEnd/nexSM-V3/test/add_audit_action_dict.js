/**
 * 执行 SQL 脚本，添加缺失的审计操作类型字典项
 */
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'nexsm_v2_dev',
    multipleStatements: true
  })

  try {
    // 查询 audit_action 字典类型的 ID
    const [typeRows] = await connection.execute(
      "SELECT id FROM nex_dict_type WHERE dict_code = 'audit_action'"
    )
    if (typeRows.length === 0) {
      console.error('未找到 audit_action 字典类型')
      return
    }
    const typeId = typeRows[0].id
    console.log('audit_action 字典类型 ID:', typeId)

    // 要插入的操作类型列表
    const actions = [
      { value: 'USER_LOGIN_FAILED', zh: '用户登录失败', en: 'User Login Failed', css: 'danger', sort: 8 },
      { value: 'USER_LOGOUT', zh: '用户登出', en: 'User Logout', css: 'info', sort: 9 },
      { value: 'USER_BATCH_DELETE', zh: '批量删除用户', en: 'Batch Delete User', css: 'danger', sort: 10 },
      { value: 'USER_STATUS_CHANGE', zh: '修改用户状态', en: 'Change User Status', css: 'warning', sort: 11 },
      { value: 'USER_RESET_PASSWORD', zh: '重置密码', en: 'Reset Password', css: 'warning', sort: 12 },
      { value: 'PLC_READ', zh: 'PLC参数读取', en: 'PLC Parameter Read', css: 'primary', sort: 13 },
      { value: 'PLC_CONNECT', zh: 'PLC连接', en: 'PLC Connect', css: 'success', sort: 14 },
      { value: 'PLC_DISCONNECT', zh: 'PLC断开', en: 'PLC Disconnect', css: 'danger', sort: 15 },
      { value: 'PLC_RECONNECT', zh: 'PLC重连', en: 'PLC Reconnect', css: 'warning', sort: 16 },
      { value: 'SYSTEM_CONFIG_CHANGE', zh: '系统配置修改', en: 'System Config Change', css: 'warning', sort: 17 },
      { value: 'SYSTEM_IMPORT', zh: '数据导入', en: 'Data Import', css: 'info', sort: 18 },
      { value: 'AUDIT_VERIFY', zh: '审计哈希链校验', en: 'Audit Hash Verify', css: 'primary', sort: 19 }
    ]

    let inserted = 0
    for (const action of actions) {
      // 检查是否已存在
      const [existRows] = await connection.execute(
        'SELECT id FROM nex_dict_item WHERE type_id = ? AND value = ?',
        [typeId, action.value]
      )
      if (existRows.length > 0) {
        console.log(`已存在: ${action.value}`)
        continue
      }

      // 插入新的字典项
      const label = JSON.stringify({ 'zh-CN': action.zh, 'en-US': action.en })
      await connection.execute(
        `INSERT INTO nex_dict_item (type_id, label, value, css_class, list_class, is_default, status, sort, remark)
         VALUES (?, ?, ?, ?, '', 0, 1, ?, '')`,
        [typeId, label, action.value, action.css, action.sort]
      )
      console.log(`已插入: ${action.value}`)
      inserted++
    }

    console.log(`\n完成！共插入 ${inserted} 条字典项`)
  } catch (err) {
    console.error('执行失败:', err.message)
  } finally {
    await connection.end()
  }
}

main()
