<template>
  <n-layout has-sider>
    <n-layout-sider>
      <n-menu :options="menuOptions"></n-menu>
    </n-layout-sider>
    <n-layout-content content-style="padding: 24px;">
      <router-view></router-view>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { h } from 'vue';
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NIcon,
} from 'naive-ui';
import {
  ArticleOutlined,
  PermMediaOutlined,
} from '@vicons/material';

// 渲染 n-icon
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  // {
  //   label: "寻羊冒险记",
  //   key: "a-wild-sheep-chase",
  //   icon: renderIcon(BookIcon),
  // },
  {
    label: "博客管理",
    key: "articles",
    icon: renderIcon(ArticleOutlined),
    children: [
      {
        label: "博客列表",
        key: "beverage",
      },
      {
        label: "博客分类",
        key: "beverage",
      }
    ]
  },
  {
    label: "媒体管理",
    key: "media",
    icon: renderIcon(PermMediaOutlined),
    children: [
      {
        label: "图片列表",
        key: "beverage",
      },
      {
        label: "音频列表",
        key: "beverage",
      }
    ]
  }
];

</script>

<style lang="scss">

</style>