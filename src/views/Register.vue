<template>
  <div class="register-container">
    <n-card style="width: 500px;">
      <n-form>
        <n-form-item label="name">
          <n-input  />
        </n-form-item>
        <n-form-item label="email">
          <n-input />
        </n-form-item>
        <n-form-item label="password">
          <n-input type="password" />
        </n-form-item>
        <n-form-item label="level">
          <n-input-number style="width: 100%" :show-button="false" />
        </n-form-item>
        <n-form-item>
          <n-button
            style="width: 100%"
            type="primary"
          >register</n-button>
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
} from "naive-ui";
import { reactive, ref } from "vue";

const registerFormRef = ref(null);
const registerFormValue = reactive({
  name: '',
  email: '',
  password: '',
  level: 1,
})
</script>

<style lang="scss" scoped>
.register-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>