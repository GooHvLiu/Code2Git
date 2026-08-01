/**
 * 用户模块 - 数据库功能测试脚本
 * 用法：node test/user.test.js
 */
require('dotenv').config();

const userModel = require('../src/modules/user/user.model');
const { hashPassword } = require('../src/utils/password');

// 测试统计
let passed = 0;
let failed = 0;
const testResults = [];

// 颜色输出
const green = text => `\x1b[32m${text}\x1b[0m`;
const red = text => `\x1b[31m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const cyan = text => `\x1b[36m${text}\x1b[0m`;

/**
 * 执行单个测试
 */
async function runTest(name, testFn) {
  console.log(`\n📝 测试: ${name}`);
  try {
    const result = await testFn();
    console.log(`   ${green('✅ 通过')}`);
    if (result) console.log(`   结果: ${JSON.stringify(result).slice(0, 100)}...`);
    passed++;
    testResults.push({ name, status: 'PASS' });
    return result;
  } catch (err) {
    console.log(`   ${red('❌ 失败')}: ${err.message}`);
    failed++;
    testResults.push({ name, status: 'FAIL', error: err.message });
    return null;
  }
}

/**
 * 主测试流程
 */
async function main() {
  console.log(cyan('\n========================================'));
  console.log(cyan('  🧪 用户模块数据库功能测试'));
  console.log(cyan('========================================'));

  // ==================== 1. 查询测试 ====================
  console.log(yellow('\n--- 查询类测试 ---'));

  // 测试1：分页查询
  await runTest('分页查询用户列表', async () => {
    const result = await userModel.getPageList({ page: 1, pageSize: 10 });
    if (!result.list || !result.total) throw new Error('返回格式不正确');
    return { total: result.total, count: result.list.length };
  });

  // 测试2：根据ID查询
  await runTest('根据ID查询用户（admin）', async () => {
    const user = await userModel.getById(1);
    if (!user) throw new Error('用户不存在');
    if (user.username !== 'admin') throw new Error('用户名不匹配');
    return { id: user.id, username: user.username };
  });

  // 测试3：根据用户名查询（自定义方法）
  await runTest('根据用户名查询（自定义方法）', async () => {
    const user = await userModel.getByUsername('admin');
    if (!user) throw new Error('用户不存在');
    return { username: user.username, role: user.role };
  });

  // 测试4：findOne 条件查询
  await runTest('条件查询（findOne）', async () => {
    const user = await userModel.findOne({ role: 1 });
    if (!user) throw new Error('未找到管理员用户');
    return { username: user.username, role: user.role };
  });

  // 测试5：findAll 查询所有
  await runTest('查询所有用户（findAll）', async () => {
    const list = await userModel.findAll();
    if (!Array.isArray(list)) throw new Error('返回不是数组');
    return { count: list.length };
  });

  // 测试6：count 统计
  await runTest('统计用户数量（count）', async () => {
    const count = await userModel.count();
    if (typeof count !== 'number') throw new Error('返回不是数字');
    return { count };
  });

  // ==================== 2. 新增测试 ====================
  console.log(yellow('\n--- 新增类测试 ---'));

  let testUserId = null;

  // 测试7：新增用户
  await runTest('新增用户', async () => {
    const result = await userModel.create({
      username: 'test_user_' + Date.now(),
      password: await hashPassword('123456'),
      real_name: '测试用户',
      phone: '13800138000',
      email: 'test@example.com',
      role: 3,
      status: 1
    });
    if (!result.insertId) throw new Error('新增失败，无返回ID');
    testUserId = result.insertId;
    return { insertId: result.insertId };
  });

  // 测试8：验证新增成功
  await runTest('验证新增用户是否存在', async () => {
    if (!testUserId) throw new Error('上一步新增失败，跳过此测试');
    const user = await userModel.getById(testUserId);
    if (!user) throw new Error('新增用户不存在');
    return { username: user.username, real_name: user.real_name };
  });

  // ==================== 3. 修改测试 ====================
  console.log(yellow('\n--- 修改类测试 ---'));

  // 测试9：更新用户
  await runTest('更新用户信息', async () => {
    if (!testUserId) throw new Error('无测试用户，跳过此测试');
    const result = await userModel.update(testUserId, {
      real_name: '测试用户-已修改',
      phone: '13900139000'
    });
    if (result.affectedRows !== 1) throw new Error('更新失败，影响行数不对');
    return { affectedRows: result.affectedRows };
  });

  // 测试10：验证更新成功
  await runTest('验证更新是否生效', async () => {
    if (!testUserId) throw new Error('无测试用户，跳过此测试');
    const user = await userModel.getById(testUserId);
    if (user.real_name !== '测试用户-已修改') throw new Error('更新未生效');
    return { real_name: user.real_name, phone: user.phone };
  });

  // 测试11：更新登录信息（自定义方法）
  await runTest('更新登录信息（自定义方法）', async () => {
    if (!testUserId) throw new Error('无测试用户，跳过此测试');
    const result = await userModel.updateLoginInfo(testUserId, '127.0.0.1');
    return { affectedRows: result.affectedRows };
  });

  // ==================== 4. 删除测试 ====================
  console.log(yellow('\n--- 删除类测试 ---'));

  // 测试12：删除用户
  await runTest('删除测试用户', async () => {
    if (!testUserId) throw new Error('无测试用户，跳过此测试');
    const result = await userModel.delete(testUserId);
    if (result.affectedRows !== 1) throw new Error('删除失败');
    return { affectedRows: result.affectedRows };
  });

  // 测试13：验证删除成功
  await runTest('验证删除是否生效', async () => {
    if (!testUserId) throw new Error('无测试用户，跳过此测试');
    const user = await userModel.getById(testUserId);
    if (user) throw new Error('删除失败，用户仍存在');
    return { message: '用户已删除' };
  });

  // 测试14：批量删除（先创建两个再删）
  await runTest('批量删除用户', async () => {
    // 先创建两个测试用户
    const u1 = await userModel.create({
      username: 'test_batch_1_' + Date.now(),
      password: await hashPassword('123456'),
      real_name: '批量测试1',
      role: 3,
      status: 1
    });
    const u2 = await userModel.create({
      username: 'test_batch_2_' + Date.now(),
      password: await hashPassword('123456'),
      real_name: '批量测试2',
      role: 3,
      status: 1
    });

    const result = await userModel.batchDelete([u1.insertId, u2.insertId]);
    if (result.affectedRows !== 2) throw new Error('批量删除数量不对');
    return { deletedCount: result.affectedRows };
  });

  // ==================== 5. 安全测试 ====================
  console.log(yellow('\n--- 安全防护测试 ---'));

  // 测试15：字段白名单过滤
  await runTest('字段白名单过滤（防止超量赋值）', async () => {
    const safeData = userModel.filterFields({
      username: 'hacker',
      password: '123456',
      id: 999,          // 不在白名单，应该被过滤
      is_admin: true,   // 不在白名单，应该被过滤
      created_at: '2099-01-01' // 不在白名单，应该被过滤
    });

    if (safeData.id !== undefined) throw new Error('id字段未被过滤');
    if (safeData.is_admin !== undefined) throw new Error('is_admin字段未被过滤');
    if (safeData.created_at !== undefined) throw new Error('created_at字段未被过滤');
    if (!safeData.username || !safeData.password) throw new Error('合法字段被误删');
    return { filteredFields: ['id', 'is_admin', 'created_at'], keptFields: ['username', 'password'] };
  });

  // ==================== 测试汇总 ====================
  console.log(cyan('\n========================================'));
  console.log(cyan('  📊 测试结果汇总'));
  console.log(cyan('========================================'));
  console.log(`   总测试数: ${passed + failed}`);
  console.log(`   ${green('✅ 通过: ' + passed)}`);
  console.log(`   ${red('❌ 失败: ' + failed)}`);
  console.log(`   通过率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log(red('\n   失败的测试用例:'));
    testResults.filter(t => t.status === 'FAIL').forEach(t => {
      console.log(`   - ${t.name}: ${t.error}`);
    });
  } else {
    console.log(green('\n   🎉 所有测试全部通过！'));
  }

  console.log(cyan('========================================\n'));

  // 退出进程
  process.exit(failed > 0 ? 1 : 0);
}

// 启动测试
main().catch(err => {
  console.error(red('测试运行出错:'), err);
  process.exit(1);
});
