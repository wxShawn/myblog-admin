<template>
  <div class="register-container">
    <n-card style="width: 500px;">
      <n-form
        ref="registerFormRef"
        :model="registerFormValue"
        :rules="registerFormRules"
      >
        <n-form-item label="name" path="name">
          <n-input v-model:value="registerFormValue.name" />
        </n-form-item>
        <n-form-item label="email" path="email">
          <n-input v-model:value="registerFormValue.email" />
        </n-form-item>
        <n-form-item label="password" path="password">
          <n-input type="password" v-model:value="registerFormValue.password" />
        </n-form-item>
        <n-form-item label="level" path="level">
          <n-input-number
            style="width: 100%"
            :show-button="false"
            v-model:value="registerFormValue.level"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            style="width: 100%"
            type="primary"
            @click="handleRegister"
          >Register</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
  
</template>

<script setup>
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
  useMessage,
} from "naive-ui";
import { reactive, ref } from "vue";
import api from "../api";
import router from "../router";
import paramsValidator from "../utils/paramsValidator";

// naive ui 消息组件
const nMessage = useMessage();
window.$message = nMessage;

const registerFormRef = ref(null);
const registerFormValue = reactive({
  name: '',
  email: '',
  password: '',
  level: 1,
});
const registerFormRules = {
  name: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写name');
      }
      const errorList = paramsValidator.validate({ adminName: value });
      if (errorList.length > 0) {
        return new Error('name格式错误');
      }
      return true;
    },
    trigger: 'blur'
  },
  email: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写email');
      }
      const errorList = paramsValidator.validate({ email: value });
      if (errorList.length > 0) {
        return new Error('email格式错误');
      }
      return true;
    },
    trigger: 'blur'
  },
  password: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写password');
      }
      const errorList = paramsValidator.validate({ password: value });
      if (errorList.length > 0) {
        return new Error('password格式错误');
      }
      return true;
    },
    trigger: 'blur'
  },
  level: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写level');
      }
      if (typeof value != 'number') {
        return new Error('level格式错误');
      }
      return true;
    },
    trigger: 'blur'
  }
}

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
  } catch (error) {
    console.log(error);
    return false;
  }
  const { name, email, password, level } = registerFormValue;
  const data = await api.admin.register(name, email, password, level);
  if (data.code === 0) {
    nMessage.success(data.msg);
    router.push({ name: 'Login' });
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>