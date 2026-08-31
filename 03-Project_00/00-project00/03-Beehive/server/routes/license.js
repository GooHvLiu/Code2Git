/**
 * 授权管理路由
 * 提供授权文件生成、列表、解析、删除等API
 */
const express = require('express');
const router = express.Router();
const licenseCore = require('../core/license');
const machineId = require('../core/machineId');
const cryptoCore = require('../core/crypto');
const { LICENSE_TYPE } = require('../core/license');

/**
 * 获取授权类型列表
 */
router.get('/types', (req, res) => {
  res.success({
    types: [
      { value: LICENSE_TYPE.TRIAL, label: '试用版' },
      { value: LICENSE_TYPE.STANDARD, label: '标准版' },
      { value: LICENSE_TYPE.ENTERPRISE, label: '企业版' },
      { value: LICENSE_TYPE.PERPETUAL, label: '永久版' }
    ]
  });
});

/**
 * 获取当前服务器机器ID（用于生成绑定本机的授权）
 */
router.get('/machine-id', (req, res) => {
  const id = machineId.getMachineId();
  const info = machineId.getMachineInfo();
  res.success({ machineId: id, machineInfo: info });
});

/**
 * 生成授权文件
 * POST /api/license/generate
 */
router.post('/generate', (req, res) => {
  try {
    const {
      projectId,
      projectName,
      licenseType,
      machineId: bindMachineId,
      validDays,
      features,
      maxUsers,
      maxDevices,
      customer
    } = req.body;

    if (!projectId || !projectName || !licenseType) {
      return res.error('项目ID、项目名称、授权类型不能为空');
    }

    if (!Object.values(LICENSE_TYPE).includes(licenseType)) {
      return res.error('无效的授权类型');
    }

    const result = licenseCore.generate({
      projectId,
      projectName,
      licenseType,
      machineId: bindMachineId || '',
      validDays: parseInt(validDays) || 365,
      features: features || [],
      maxUsers: parseInt(maxUsers) || 0,
      maxDevices: parseInt(maxDevices) || 0,
      customer: customer || {}
    });

    res.success({
      licenseId: result.licenseId,
      fileName: result.fileName,
      filePath: result.filePath,
      licenseData: result.licenseData
    }, '授权文件生成成功');
  } catch (e) {
    console.error('[License] 生成失败:', e);
    res.error(`生成失败: ${e.message}`);
  }
});

/**
 * 授权文件列表
 * GET /api/license/list
 */
router.get('/list', (req, res) => {
  const list = licenseCore.listLicenses();
  res.success({ list, total: list.length });
});

/**
 * 解析授权文件（验证授权内容）
 * POST /api/license/parse
 * body: { content: "加密内容字符串" } 或 { filePath: "文件路径" }
 */
router.post('/parse', (req, res) => {
  try {
    const { content, filePath } = req.body;
    const input = content || filePath;
    if (!input) {
      return res.error('请提供授权文件内容或路径');
    }
    const data = licenseCore.parse(input);
    if (!data) {
      return res.error('授权文件解析失败或签名验证不通过');
    }
    res.success(data, '授权文件解析成功');
  } catch (e) {
    res.error(`解析失败: ${e.message}`);
  }
});

/**
 * 验证授权有效性
 * POST /api/license/validate
 */
router.post('/validate', (req, res) => {
  try {
    const { content, filePath, projectId, machineId: checkMachineId, requiredFeatures } = req.body;
    const input = content || filePath;
    if (!input) {
      return res.error('请提供授权文件内容或路径');
    }
    const licenseData = licenseCore.parse(input);
    if (!licenseData) {
      return res.error('授权文件解析失败或签名验证不通过');
    }
    const result = licenseCore.validate(licenseData, {
      projectId,
      machineId: checkMachineId,
      requiredFeatures
    });
    res.success(result);
  } catch (e) {
    res.error(`验证失败: ${e.message}`);
  }
});

/**
 * 删除授权文件
 * DELETE /api/license/:fileName
 */
router.delete('/:fileName', (req, res) => {
  const { fileName } = req.params;
  if (!fileName.endsWith('.lic')) {
    return res.error('只能删除.lic授权文件');
  }
  const ok = licenseCore.deleteLicense(fileName);
  if (ok) {
    res.success(null, '删除成功');
  } else {
    res.error('文件不存在');
  }
});

/**
 * 下载公钥（供被保护项目集成）
 * GET /api/license/public-key
 */
router.get('/public-key', (req, res) => {
  const publicKey = cryptoCore.getPublicKey();
  res.success({ publicKey });
});

module.exports = router;
