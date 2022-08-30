import request from "../request";

const prefix = '/admins';
export default {
  // 注册
  register(name, email, password, roleId) {
    return request({
      method: 'post',
      url: `${prefix}/register`,
      data: { name, email, password, roleId },
    });
  },

  // 密码登录
  loginByPassword(email, password) {
    return request({
      method: 'post',
      url: `${prefix}/login`,
      data: { email, password },
    });
  },

  // 验证码登录
  loginByVerifyCode(email, verifyCode) {
    return request({
      method: 'post',
      url: `${prefix}/login/email-code`,
      data: { email, verifyCode },
    });
  },

  // 获取登录验证码
  getLoginVerifyCode(email) {
    return request({
      method: 'get',
      url: `${prefix}/login/email-code`,
      params: { email },
    });
  },

  // 获取个人信息
  getPersonalInfo() {
    return request({
      method: 'get',
      url: `${prefix}`,
    });
  },

  // 更新个人信息
  updatePersonalInfo(name, email) {
    return request({
      method: 'put',
      url: `${prefix}`,
      data: { name, email },
    });
  },
}