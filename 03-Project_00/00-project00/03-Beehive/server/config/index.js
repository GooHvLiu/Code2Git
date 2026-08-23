/**
 * 配置中心
 */
const path = require('path');

const config = {
  port: parseInt(process.env.PORT) || 3100,
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',
  timeApiSecret: process.env.TIME_API_SECRET || 'beehive-time-api-2024',

  dataDir: path.resolve(__dirname, '..', process.env.DATA_DIR || './data'),
  keysDir: path.resolve(__dirname, '..', process.env.DATA_DIR || './data', 'keys'),
  licensesDir: path.resolve(__dirname, '..', process.env.DATA_DIR || './data', 'licenses'),

  rsa: {
    keySize: 2048,
    publicKeyFile: 'public.pem',
    privateKeyFile: 'private.pem'
  },

  aesKey: process.env.AES_KEY || 'BeehiveTools@2024#AES256Key!',

  aesIv: process.env.AES_IV || 'BeehiveIV@2024!'
};
console.log("当前环境变量的aesKey：", process.env.AES_KEY, "使用的aesKey：", config.aesKey),
  console.log("当前环境变量的aesIv：", process.env.AES_IV, "使用的aesIv：", config.aesIv),
  module.exports = config;
