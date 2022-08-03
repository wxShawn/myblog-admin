<template>
  <div class="profile-container">
    <n-avatar
      round
      src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
    <n-dropdown :options="options">
      <n-button type="text">Shawn</n-button>
    </n-dropdown>
  </div>
</template>

<script setup>
import { h } from 'vue';
import {
  NAvatar,
  NDropdown,
  NButton,
  NIcon,
} from 'naive-ui';
import {
  PersonPinOutlined,
  EditNoteOutlined,
  LogOutOutlined,
} from '@vicons/material';

// 渲染 n-icon
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const options = [
  {
    label: "个人资料",
    key: "profile",
    icon: renderIcon(PersonPinOutlined),
    props: {
      onclick: () => {
        console.log('click 个人资料');
      }
    }
  },
  {
    label: "编辑资料",
    key: "editProfile",
    icon: renderIcon(EditNoteOutlined),
    props: {
      onclick: () => {
        console.log('click 编辑资料');
      }
    }
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogOutOutlined),
    props: {
      onclick: () => {
        console.log('click 退出登录');
      }
    }
  }
]

</script>

<style lang="scss" scoped>
.profile-container {
  display: flex;
  align-items: center;
}
</style>