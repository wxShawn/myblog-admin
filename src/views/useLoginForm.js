import { reactive } from 'vue';
import paramsValidator from '../utils/paramsValidator';
import { emailRegExp, passwordRegExp, verifyCodeRegexp } from '../utils/regexp';
import api from '../api';

// 密码登录表单
export const pwdLoginForm = (formRef) => {
  // 表单信息
  const formValue = reactive({
    email: '1806394760@qq.com',
    password: '12345678'
  });
  // 表单校验规则
  const rules = {
    email: {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入邮箱');
        }
        const errorList = paramsValidator.validate({ email: value });
        if (errorList.length > 0) {
          return new Error('邮箱格式错误');
        }
        return true;
      },
      trigger: 'blur'
    },
    password: {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入密码');
        }
        const errorList = paramsValidator.validate({ password: value });
        if (errorList.length > 0) {
          return new Error('密码格式错误: 支持8-15个 "数字 字母 _ . @"');
        }
        return true;
      },
      trigger: 'blur'
    }
  };
  // 登录
  const login = async (callback) => {
    // 发送登录请求前校验表格数据是否合法
    try {
      await formRef.value.validate()
    } catch (error) {
      console.log(error);
      return false;
    }
    // 发送登录请求
    const { data } = await api.admin.loginByPassword(formValue.email, formValue.password);
    if (data.code === 0) {
      callback(data);
    }
  }

  return {
    formValue,
    rules,
    login,
  }
}


// 验证码登录
export const vcLoginForm = (formRef) => {
  const formValue = reactive({
    email: '',
    verifyCode: '',
  });

  const rules = {
    email: {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入邮箱');
        }
        const errorList = paramsValidator.validate({ email: value });
        if (errorList.length > 0) {
          return new Error('邮箱格式错误');
        }
        return true;
      },
      trigger: 'blur'
    },
    verifyCode: {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入验证码');
        }
        const errorList = paramsValidator.validate({ verifyCode: value });
        if (errorList.length > 0) {
          return new Error('验证码格式错误');
        }
        return true;
      },
      trigger: 'blur'
    }
  };

  const login = async (callback) => {
    // 发送登录请求前校验表格数据是否合法
    try {
      await formRef.value.validate()
    } catch (error) {
      console.log(error);
      return false;
    }
    // 发送登录请求
    const { data } = await api.admin.loginByVerifyCode(formValue.email, formValue.verifyCode);
    if (data.code === 0) {
      callback(data);
    }
  }

  return {
    formValue,
    rules,
    login,
  }
}