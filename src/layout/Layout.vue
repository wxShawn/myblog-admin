<template>
  <n-layout has-sider style="height: 100%;">
    <n-layout-sider
      bordered
      :width="220"
      collapse-mode="width"
      :collapsed-width="60"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <!-- 菜单 -->
      <n-menu
        accordion
        :options="menuOptions"
        :collapsed="collapsed"
        :collapsed-width="60"
        :collapsed-icon-size="22"
      ></n-menu>
    </n-layout-sider>
    <n-layout>
      <n-layout-header
        bordered
        style="position: relative; 
        padding: 0 24px;
        height: 60px;
        display: flex; align-items: center;"
      >
        <!-- 控制折叠菜单的按钮 -->
        <n-button
          @click="collapsed = !collapsed"
          text
          style="margin-right: 20px;
          font-size: 24px"
        >
          <n-icon><menu-filled /></n-icon>
        </n-button>
        <!-- 面包屑 -->
        <breadcrumb />
        <!-- 个人资料 -->
        <profile style="position: absolute; right: 40px; height: 100%;" />
      </n-layout-header>
      <n-layout-content
        position="absolute"
        embedded
        style="top: 60px; bottom: 60px;"
        content-style="padding: 24px;"
      >
        <router-view></router-view>
      </n-layout-content>
      <n-layout-footer
        position="absolute"
        bordered style="height: 60px; background: #efeff5;"
      >
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { h, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutFooter,
  NLayoutContent,
  NMenu,
  NIcon,
  NButton,
} from 'naive-ui';
import {
  ArticleOutlined,
  PermMediaOutlined,
  ListAltOutlined,
  ClassOutlined,
  ImageOutlined,
  AudioFileOutlined,
  VideoFileOutlined,
  MenuFilled,
} from '@vicons/material';

import Breadcrumb from './components/Breadcrumb.vue';
import Profile from './components/Profile.vue';

// 折叠菜单
const collapsed = ref(false);

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
        icon: renderIcon(ListAltOutlined),
      },
      {
        label: renderLink('文章分类', 'ArticleCategory'),
        key: 'articleCategory',
        icon: renderIcon(ClassOutlined),
      }
    ]
  },
  {
    label: '媒体管理',
    key: 'media',
    icon: renderIcon(PermMediaOutlined),
    children: [
      {
        label: renderLink('图片列表', 'ImageList'),
        key: 'imageList',
        icon: renderIcon(ImageOutlined),
      },
      {
        label: renderLink('音频列表', 'AudioList'),
        key: 'audioList',
        icon: renderIcon(AudioFileOutlined),
      },
      {
        label: renderLink('视频列表', 'VideoList'),
        key: 'videoList',
        icon: renderIcon(VideoFileOutlined),
      }
    ]
  }
];

</script>

<style lang="scss">
</style>