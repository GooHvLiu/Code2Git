import server from "../../interceptors/index.js";

// 获取客户管理/客户档案
export async function requestGetCustomerListApi(params) {
  const userInfoRes = await server.get("/customer", { params });
  return userInfoRes;
}
