var express = require("express");
var router = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     tags: [健康检查]
 *     summary: 服务连通性测试（根路径）
 *     description: 注意：此接口挂载在根路径，不在 /prod-api/v2 下，实际访问地址为 `http://localhost:3002/`。用于前端/网关探活。
 *     security: []
 *     responses:
 *       200:
 *         description: 服务连通
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         State: { type: string, example: 'Connected Success.' }
 */
// 测试连接状态路由
router.get("/", function (req, res, next) {
  return res.success({ State: "Connected Success." }, "成功连接服务器")

});

module.exports = router;
