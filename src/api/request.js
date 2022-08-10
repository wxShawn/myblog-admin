import axios from 'axios';
import router from '../router';

const request = axios.create({
  baseURL: 'http://127.0.0.1:3001', // 请求地址
  timeout: 5000, // 请求最长时间，超时则失败
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 检测 sessionStorage 中是否有 jwt，如果有则将其设置到请求头（登录操作除外）
    const jwt = sessionStorage.getItem('jwt');
    if (jwt && config.url != '/admin/login') {
      config.headers.authorization = `Bearer ${jwt}`;
    }
    console.log(config.url)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const { status } = error.response;
    const { msg } = error.response.data;

    switch (status) {
      case 401: // 401 身份未认证或身份认证未通过
        router.push({ name: 'Login' });
        break;
      case 500: // 服务器错误
        console.error(msg);
        // window.$message.error(msg);
        break;
      default:
        console.warn(msg);
        // window.$message.error(msg);
        break;
    }
    return error.response;
  }
);

export default request;