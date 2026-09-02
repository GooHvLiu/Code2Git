/**
 * 邮箱模块测试脚本
 * 测试系统默认邮箱能否正常发送邮件
 */

// 加载环境变量
require('dotenv-expand').expand(require('dotenv').config());

const email = require('./index');

async function testEmail() {
  console.log('📧 开始测试邮箱模块...\n');

  // 1. 测试加密工具
  console.log('1. 测试加密工具...');
  const originalText = 'test_password_123';
  const encrypted = email.utils.encrypt(originalText);
  const decrypted = email.utils.decrypt(encrypted);
  console.log('   原文:', originalText);
  console.log('   加密:', encrypted.substring(0, 30) + '...');
  console.log('   解密:', decrypted);
  console.log('   加密解密是否一致:', originalText === decrypted ? '✅ 是' : '❌ 否');
  console.log('   邮箱脱敏:', email.utils.maskEmail('879639340@qq.com'));
  console.log('');

  // 2. 测试服务商
  console.log('2. 测试服务商...');
  const providers = email.providers.getSupported();
  console.log('   支持的服务商:', providers.map(p => `${p.value}(${p.label})`).join(', '));
  const qqConfig = email.providers.getDefault('qq');
  console.log('   QQ邮箱默认配置:', JSON.stringify(qqConfig));
  console.log('');

  // 3. 测试模板
  console.log('3. 测试邮件模板...');
  const templates = email.templates.getAllNames();
  console.log('   已注册的模板:', templates.join(', '));
  const testRendered = email.templates.render('test', {
    configName: '测试配置',
    provider: 'qq',
    username: 'test@qq.com',
    testTime: new Date().toLocaleString()
  });
  console.log('   测试模板主题:', testRendered.subject);
  console.log('   测试模板HTML长度:', testRendered.html.length, '字符');
  console.log('');

  // 4. 测试发送邮件
  console.log('4. 测试发送邮件...');
  console.log('   正在发送测试邮件到 879639340@qq.com ...');
  try {
    const result = await email.sendTemplate('test', {
      configName: '系统默认配置',
      provider: 'qq',
      username: '879639340@qq.com',
      testTime: new Date().toLocaleString()
    }, {
      to: '879639340@qq.com'
    });

    if (result.success) {
      console.log('   ✅ 邮件发送成功！');
      console.log('   消息ID:', result.messageId);
      console.log('   使用配置:', result.configName);
      console.log('   配置来源:', result.source);
      console.log('   耗时:', result.duration, 'ms');
      console.log('   日志ID:', result.logId);
      if (result.degraded) {
        console.log('   ⚠️  已降级到系统默认配置');
      }
    } else {
      console.log('   ❌ 邮件发送失败');
      console.log('   错误信息:', result.error);
    }
  } catch (err) {
    console.log('   ❌ 邮件发送异常:', err.message);
    console.log('   错误堆栈:', err.stack);
  }

  console.log('\n🎉 邮箱模块测试完成！');
  process.exit(0);
}

testEmail().catch(err => {
  console.error('❌ 测试脚本执行失败:', err);
  process.exit(1);
});
