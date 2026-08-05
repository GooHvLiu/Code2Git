import server from "../../interceptors/axios.js";

// 获取客户管理/客户档案/所有 客户资料
export async function requestGetCustomerListApi(params) {
  const userInfoRes = await server.get("/customer", { params });
  return userInfoRes;
}

// 获取客户管理/客户档案/更新 客户资料
export async function requestUpdateCustomerApi(id, userInfo) {
  const userInfoRes = await server.put(`/customer/${id}`, userInfo);
  return userInfoRes;
}

// 获取客户管理/客户档案/增加 客户资料
export async function requestAddCustomerApi(userInfo) {
  const userInfoRes = await server.post("/customer", userInfo);
  return userInfoRes;
}

// 获取客户管理/客户档案/删除 客户资料
export async function requestDeleteCustomerApi() {
}

// 获取客户管理/客户档案/导入 客户资料
export async function requestImportCustomerApi() {
}

// 获取客户管理/客户档案/导出 客户资料
export async function requestExportCustomerApi() {
}