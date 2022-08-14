<template>
  <div class="profile-container">
    <n-dropdown :options="options">
      <n-button type="text">
        <n-avatar round>Admin</n-avatar>
        <div style="margin-left: 5px;">{{ info.name }}</div>
      </n-button>
    </n-dropdown>
  </div>

  <!-- 个人资料 modal -->
  <n-modal
    style="width: 600px"
    v-model:show="showPersonalInfoModal"
    class="custom-card"
    preset="card"
    title="个人资料"
  >
    <n-descriptions bordered label-placement="left" :columns="1">
      <n-descriptions-item label="管理员ID">{{ info.id }}</n-descriptions-item>
      <n-descriptions-item label="名称">{{ info.name }}</n-descriptions-item>
      <n-descriptions-item label="邮箱">{{ info.email }}</n-descriptions-item>
      <n-descriptions-item label="注册时间">{{ info.createdAt }}</n-descriptions-item>
    </n-descriptions>
  </n-modal>

  <!-- 编辑资料 modal -->
  <n-modal v-model:show="showEditFormModal" preset="dialog" title="编辑资料">
    <n-form
      ref="editFormRef"
      style="margin-top: 30px;"
      label-placement="left"
      :model="editFormValue"
      :rules="editFormRules"
    >
      <n-form-item label="名称" path="name">
        <n-input v-model:value="editFormValue.name"></n-input>
      </n-form-item>
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="editFormValue.email"></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="showEditFormModal = false">取消</n-button>
      <n-button type="primary" @click="handleUpdateClick">更新</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { h, onBeforeMount, reactive, ref } from 'vue';
import {
  NAvatar,
  NDropdown,
  NButton,
  NIcon,
  NModal,
  NDescriptions,
  NDescriptionsItem,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from 'naive-ui';
import {
  PersonPinOutlined,
  EditNoteOutlined,
  LogOutOutlined,
} from '@vicons/material';

import router from '../../router';
import api from '../../api';
import paramsValidator from '../../utils/paramsValidator';

const nMessage = useMessage();

// 渲染 n-icon
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// 下拉菜单
const options = [
  {
    label: "个人资料",
    key: "profile",
    icon: renderIcon(PersonPinOutlined),
    props: {
      onclick: () => showPersonalInfoModal.value = true
    }
  },
  {
    label: "编辑资料",
    key: "editProfile",
    icon: renderIcon(EditNoteOutlined),
    props: {
      onclick: () => {
        showEditFormModal.value = true;
        Object.assign(editFormValue, { name: info.name, email: info.email });
      }
    }
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogOutOutlined),
    props: {
      onclick: () => {
        sessionStorage.removeItem('jwt');
        router.push({ name: 'Login' });
      }
    }
  }
];

// 个人信息
const info = reactive({
  name: '未登录',
  id: null,
  email: null,
  roleId: null,
  createdAt: null,
  updatedAt: null,
});

// 获取个人信息
const getInfo = async () => {
  const data = await api.admin.getPersonalInfo();
  if (data.code === 0) {
    let { id, name, email, roleId, createdAt, updatedAt } = data.result;
    createdAt = new Date(createdAt).toLocaleString();
    Object.assign(info, { id, name, email, roleId, createdAt, updatedAt });
  }
}

onBeforeMount(() => {
  getInfo();
});

/**
 * 个人资料
 */
// 个人资料 modal
const showPersonalInfoModal = ref(false);

/**
 * 编辑资料
 */
const showEditFormModal = ref(false);
const editFormRef = ref(null);
const editFormValue = reactive({
  name: info.name,
  email: info.email,
});
const editFormRules = {
  name: {
    required: true,
    validator(rule, value) {
      if (!value) return new Error('请填写名称');
      if (typeof value != 'string') return new Error('名称格式错误');
      return true;
    },
    trigger: 'blur'
  },
  email: {
    required: true,
    validator(rule, value) {
      if (!value) return new Error('请填写名称');
      const errorList = paramsValidator.validate({ email: value });
      if (errorList.length > 0) return new Error('邮箱格式错误');
      return true;
    },
    trigger: 'blur'
  }
}
let updateDisabled = false; // 节流
// 处理更新按钮点击事件
const handleUpdateClick = async () => {
  // 校验表单
  try {
    await editFormRef.value.validate();
  } catch (error) {
    console.warn(error);
    return false;
  }
  if (!updateDisabled) {
    updateDisabled = true;
    const msgReactive = nMessage.loading("更新中，请稍等...", { duration: 0 });
    const { name, email } = editFormValue;
    const data = await api.admin.updatePersonalInfo(name, email);
    if (data.code === 0) {
      nMessage.success(data.msg);
      Object.assign(info, { name, email });
      showEditFormModal.value = false;
    }
    msgReactive.destroy();
    updateDisabled = false;
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  display: flex;
  align-items: center;
}
</style>