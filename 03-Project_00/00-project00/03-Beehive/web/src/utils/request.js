import axios from 'axios';
import { Message } from 'element-ui';

const service = axios.create({
  baseURL: '/api',
  timeout: 15000
});

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      Message.error(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  error => {
    Message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
