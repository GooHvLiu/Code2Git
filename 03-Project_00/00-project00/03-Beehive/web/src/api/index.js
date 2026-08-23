import request from '@/utils/request';

// 授权相关
export const getLicenseTypes = () => request.get('/license/types');
export const getMachineId = () => request.get('/license/machine-id');
export const generateLicense = (data) => request.post('/license/generate', data);
export const getLicenseList = () => request.get('/license/list');
export const parseLicense = (data) => request.post('/license/parse', data);
export const validateLicense = (data) => request.post('/license/validate', data);
export const deleteLicense = (fileName) => request.delete(`/license/${fileName}`);
export const getPublicKey = () => request.get('/license/public-key');

// 时间相关
export const getServerTime = () => request.get('/time');

// 项目相关
export const getProjects = () => request.get('/project');
export const addProject = (data) => request.post('/project', data);
export const updateProject = (id, data) => request.put(`/project/${id}`, data);
export const deleteProject = (id) => request.delete(`/project/${id}`);

// 健康检查
export const healthCheck = () => request.get('/health');
