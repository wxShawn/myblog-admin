<template>
  <n-layout has-sider style="height: 100%;">
    <n-layout-sider bordered :width="220">
      <n-menu accordion :options="menuOptions"></n-menu>
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered style="height: 60px;"></n-layout-header>
      <n-layout-content
        position="absolute"
        embedded
        style="top: 60px; bottom: 60px;"
        content-style="padding: 24px;"
      >
        <router-view></router-view>
      </n-layout-content>
      <n-layout-footer position="absolute" bordered style="height: 60px; background: #efeff5;"></n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutFooter,
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

// 渲染 router-link
const renderLink = (linkTitle, routerName) => {
  return () => h(RouterLink, {
    to: {
      name: routerName,
    }
  }, { default: () => linkTitle });
}

// 菜单
const menuOptions = [
  {
    label: '文章管理',
    key: 'articles',
    icon: renderIcon(ArticleOutlined),
    children: [
      {
        label: renderLink('文章列表', 'ArticleList'),
        key: 'articleList',
      },
      {
        label: renderLink('文章分类', 'ArticleCategory'),
        key: 'articleCategory',
      }
    ]
  },
  {
    label: '媒体管理',
    key: 'media',
    icon: renderIcon(PermMediaOutlined),
    children: [
      {
        label: '图片列表',
        key: 'beverage',
      },
      {
        label: '音频列表',
        key: 'beverage',
      }
    ]
  }
];

</script>

<style lang="scss">

</style>