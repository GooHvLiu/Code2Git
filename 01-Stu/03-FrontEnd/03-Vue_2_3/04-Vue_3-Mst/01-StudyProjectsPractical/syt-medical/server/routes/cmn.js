/**
 * 字典路由 - /api/cmn/dict/...
 * 对应尚医通 service_cmn
 */

const express = require("express");
const router = express.Router();
const { allDicts } = require("../data/dicts");
const { success, fail } = require("../utils/response");

/**
 * GET /api/cmn/dict/findByDictCode/{dictCode}
 * 根据 dictCode 查询顶级字典列表
 */
router.get("/findByDictCode/:dictCode", (req, res) => {
  const { dictCode } = req.params;
  const list = allDicts.filter((d) => d.dictCode === dictCode && d.parentId === 0);
  return success(res, list);
});

/**
 * GET /api/cmn/dict/findChildData/{dictCode}
 * 根据 dictCode 查询子节点列表
 * 用于：选择省份后查城市，选择城市后查区县
 */
router.get("/findChildData/:dictCode", (req, res) => {
  const { dictCode } = req.params;
  // 先根据 dictCode 找到父节点的 value
  const parent = allDicts.find((d) => d.value === dictCode);
  if (!parent) {
    return success(res, []);
  }
  const list = allDicts.filter((d) => d.parentId === parent.id);
  return success(res, list);
});

module.exports = router;
