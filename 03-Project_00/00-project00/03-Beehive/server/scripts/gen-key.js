/**
 * RSA 密钥对生成脚本
 * 运行: npm run gen-key
 * 会在 data/keys/ 目录下生成 public.pem 和 private.pem
 *
 * 注意：
 * - 私钥(private.pem)必须妥善保管，绝不能泄露给客户端
 * - 公钥(public.pem)需要分发给被保护项目，用于验证授权签名
 * - 重新生成密钥后，之前签发的所有授权文件将全部失效
 */
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
const config = require('../config');

console.log('========================================');
console.log('  BeehiveTools RSA 密钥对生成工具');
console.log('========================================\n');

// 检查是否已有密钥
const pubPath = path.join(config.keysDir, config.rsa.publicKeyFile);
const privPath = path.join(config.keysDir, config.rsa.privateKeyFile);

if (fs.existsSync(pubPath) && fs.existsSync(privPath)) {
  console.log('⚠️  检测到已存在的密钥对：');
  console.log(`   公钥: ${pubPath}`);
  console.log(`   私钥: ${privPath}`);
  console.log('\n   重新生成将导致之前所有授权文件失效！');
  console.log('   如需继续，请手动删除现有密钥文件后重新运行。\n');
  process.exit(0);
}

console.log(`正在生成 ${config.rsa.keySize} 位 RSA 密钥对...`);
console.log('（这可能需要几秒钟，请稍候...）\n');

const keys = forge.pki.rsa.generateKeyPair(config.rsa.keySize);
const publicKey = forge.pki.publicKeyToPem(keys.publicKey);
const privateKey = forge.pki.privateKeyToPem(keys.privateKey);

// 确保目录存在
if (!fs.existsSync(config.keysDir)) {
  fs.mkdirSync(config.keysDir, { recursive: true });
}

fs.writeFileSync(pubPath, publicKey);
fs.writeFileSync(privPath, privateKey);

console.log('✅ 密钥对生成成功！\n');
console.log(`📄 公钥文件: ${pubPath}`);
console.log(`🔑 私钥文件: ${privPath}\n`);
console.log('⚠️  重要提示：');
console.log('   1. 私钥必须妥善保管，绝不能泄露或分发给客户端');
console.log('   2. 公钥需要分发给被保护项目，用于验证授权签名');
console.log('   3. 丢失私钥后将无法签发新的授权文件');
console.log('   4. 重新生成密钥将导致之前所有授权文件失效\n');
