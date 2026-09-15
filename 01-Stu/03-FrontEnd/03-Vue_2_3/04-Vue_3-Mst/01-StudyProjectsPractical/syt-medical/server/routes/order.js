/**
 * 订单路由 - /api/order/orderInfo/...
 * 对应尚医通 service_order
 */

const express = require("express");
const router = express.Router();
const { orders } = require("../data/orders");
const { success, fail } = require("../utils/response");
const { auth } = require("../middlewares/auth");

/**
 * GET /api/order/orderInfo/auth/{page}/{limit}
 * 分页查询当前用户订单
 */
router.get("/auth/:page/:limit", auth, (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;
  const userId = req.userId;

  const list = orders.filter((o) => o.userId === userId && o.isDeleted === 0);
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / limit);
  const start = (page - 1) * limit;
  const content = list.slice(start, start + limit);

  // 附加状态文字
  const result = content.map((o) => ({
    ...o,
    orderStatusString: getOrderStatusString(o.orderStatus),
  }));

  return success(res, {
    totalElements,
    content: result,
    totalPages,
    size: limit,
    number: page,
  });
});

/**
 * GET /api/order/orderInfo/getOrders/{orderId}
 * 订单详情
 */
router.get("/getOrders/:orderId", auth, (req, res) => {
  const o = orders.find(
    (x) => x.id == req.params.orderId && x.userId === req.userId && x.isDeleted === 0
  );
  if (!o) return fail(res, "订单不存在");
  return success(res, {
    ...o,
    orderStatusString: getOrderStatusString(o.orderStatus),
  });
});

/**
 * GET /api/order/orderInfo/auth/getOrderStatus/{orderId}
 * 查询订单状态
 */
router.get("/auth/getOrderStatus/:orderId", auth, (req, res) => {
  const o = orders.find(
    (x) => x.id == req.params.orderId && x.userId === req.userId && x.isDeleted === 0
  );
  if (!o) return fail(res, "订单不存在");
  return success(res, o.orderStatus);
});

/**
 * PUT /api/order/orderInfo/auth/cancelOrder/{orderId}
 * 取消订单
 */
router.put("/auth/cancelOrder/:orderId", auth, (req, res) => {
  const o = orders.find(
    (x) => x.id == req.params.orderId && x.userId === req.userId && x.isDeleted === 0
  );
  if (!o) return fail(res, "订单不存在");
  if (o.orderStatus !== 1) {
    return fail(res, "当前状态不能取消");
  }
  o.orderStatus = 0; // 已取消
  return success(res, null, "取消成功");
});

function getOrderStatusString(status) {
  const map = { 0: "已取消", 1: "待支付", 2: "已支付", 3: "已取号" };
  return map[status] || status;
}

module.exports = router;
