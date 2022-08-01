<template>
  <div class="login-container">
    <n-grid class="login" :cols="5">
      <n-gi :span="3">image</n-gi>
      <n-gi :span="2">
        <n-tabs
          type="line"
          default-value="vcLogin"
          size="large"
          animated
        >
          <!-- 验证码登录 -->
          <n-tab-pane name="vcLogin" tab="验证码登录">
            <n-form
              ref="vcFormRef"
              :label-width="80"
              :model="vcForm.formValue"
              :rules="vcForm.rules"
              size="large"
            >
              <n-form-item ref="vcFormEmailRef" label="邮箱" path="email">
                <n-input v-model:value="vcForm.formValue.email" placeholder="请输入邮箱" />
              </n-form-item>
              <n-form-item label="验证码" path="verifyCode">
                <div style="display: flex; width: 100%;">
                  <n-input
                    style="flex: 1; margin-right: 20px;"
                    v-model:value="vcForm.formValue.verifyCode"
                    placeholder="请输入验证码"
                  />
                  <n-button
                    :disabled="verifyCodeBtnDisabled"
                    @click="getVerifyCode"
                    style="width: 66px;"
                  >
                    <span v-if="!verifyCodeBtnDisabled">获取</span>
                    <n-countdown
                      v-else
                      :render="renderCountdown"
                      :duration="59000"
                      :active="verifyCodeBtnDisabled"
                      @finish="verifyCodeBtnDisabled = false"
                    />
                  </n-button>
                </div>
              </n-form-item>
              <n-form-item>
                <n-button attr-type="button" @click="vcLoginHandle">
                  登录
                </n-button>
              </n-form-item>
            </n-form>
          </n-tab-pane>

          <!-- 密码登录 -->
          <n-tab-pane name="pwdLogin" tab="密码登录">
            <n-form
              ref="pwdFormRef"
              :label-width="80"
              :model="pwdForm.formValue"
              :rules="pwdForm.rules"
              size="large"
            >
              <n-form-item label="邮箱" path="email">
                <n-input v-model:value="pwdForm.formValue.email" placeholder="请输入邮箱" />
              </n-form-item>
              <n-form-item label="密码" path="password">
                <n-input v-model:value="pwdForm.formValue.password" placeholder="请输入密码" />
              </n-form-item>
              <n-form-item>
                <n-button attr-type="button" @click="pwdLoginHandle">
                  登录
                </n-button>
              </n-form-item>
            </n-form>
          </n-tab-pane>

        </n-tabs>
      </n-gi>
    </n-grid>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import {
  NGrid,
  NGi,
  NTabs,
  NTabPane,
  NForm,
  NFormItem,
  NButton,
  NInput,
  NCountdown,
} from 'naive-ui';

import { pwdLoginForm, vcLoginForm } from './useLoginForm';
 
/**
 * 密码登录
 */
const pwdFormRef = ref(null);
const pwdForm = pwdLoginForm(pwdFormRef);
const pwdLoginHandle = () => {
  // 登录成功将会执行回调函数
  pwdForm.login(data => {

  });
}

/**
 * 验证码登录
 */
const vcFormRef = ref(null);
const vcForm = vcLoginForm(vcFormRef);
const vcLoginHandle = () => {
  // 登录成功将会执行回调函数
  vcForm.login(data => {

  });
}

// 邮箱表单项的表示
const vcFormEmailRef = ref(null);
// 是否禁用“获取”按钮
const verifyCodeBtnDisabled = ref(false);
// 请求验证码
const getVerifyCode = async () => {
  // 请求前验证邮箱是否合法
  try {
    await vcFormEmailRef.value.validate();
  } catch (error) {
    console.log(error);
    return false;
  }
  verifyCodeBtnDisabled.value = true;
  // 发送请求
  // const { data } = await api.admin.getLoginVerifyCode({ email: vcUser.email });
  // if (data.code === 0) {
  //   nMessage.success(data.message);
  //   verifyCodeBtnDisabled.value = true;
  // }
};
// 验证码获取按钮的倒计时渲染
const renderCountdown = ({ hours, minutes, seconds }) => {
  return `${String(seconds).padStart(2, "0")}`;
};
</script>

<style lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  
  .login {
    position: relative;
    max-width: 1000px;
    min-width: 800px;
  }
}

</style>