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
        ref="menuRef"
        accordion
        :options="menuOptions"
        :collapsed="collapsed"
        :collapsed-width="60"
        :collapsed-icon-size="22"
        v-model:value="selectedKey"
        @update:value="saveMenuKey"
      ></n-menu>
    </n-layout-sider>
    <n-layout>
      <n-layout-header
        bordered
        style="position: relative; 
        padding: 0 24px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;"
      >
        <!-- header左侧 -->
        <div style="display: flex; align-items: center;">
          <!-- 控制折叠菜单的按钮 -->
          <n-button
            @click="collapsed = !collapsed"
            text
            style="margin-right: 20px;
            font-size: 24px"
          ><n-icon><menu-filled /></n-icon></n-button>
          <!-- 面包屑 -->
          <breadcrumb />
        </div>

        <!-- header右侧 -->
        <div style="display: flex; align-items: center;">
          <!-- 全屏显示 -->
          <div style="margin-right: 20px; height: 30px;"><fullscreen /></div>
          <!-- 个人资料 -->
          <profile />
        </div>
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
import { h, onBeforeMount, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutFooter,
  NLayoutContent,
  NMenu,
  NIcon,
  NButton,
  useMessage,
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
  AppsOutlined,
  AutoAwesomeMotionOutlined,
  SyncOutlined,
} from '@vicons/material';

import Breadcrumb from './components/Breadcrumb.vue';
import Profile from './components/Profile.vue';
import Fullscreen from './components/Fullscreen.vue';

window.$message = useMessage();

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
    key: 'Articles',
    icon: renderIcon(ArticleOutlined),
    children: [
      {
        label: renderLink('文章列表', 'ArticleList'),
        key: 'ArticleList',
        icon: renderIcon(ListAltOutlined),
      },
      {
        label: renderLink('文章分类', 'ArticleCategory'),
        key: 'ArticleCategory',
        icon: renderIcon(ClassOutlined),
      }
    ]
  },
  {
    label: '媒体管理',
    key: 'Media',
    icon: renderIcon(PermMediaOutlined),
    children: [
      {
        label: renderLink('图片列表', 'ImageList'),
        key: 'ImageList',
        icon: renderIcon(ImageOutlined),
      },
      {
        label: renderLink('音频列表', 'AudioList'),
        key: 'AudioList',
        icon: renderIcon(AudioFileOutlined),
      },
      {
        label: renderLink('视频列表', 'VideoList'),
        key: 'VideoList',
        icon: renderIcon(VideoFileOutlined),
      },
      {
        label: renderLink('同步文件', 'SyncMediaFile'),
        key: 'SyncMediaFile',
        icon: renderIcon(SyncOutlined),
      }
    ]
  },
  {
    label: '项目Demo',
    key: 'Project',
    icon: renderIcon(AppsOutlined),
    children: [
      {
        label: renderLink('项目列表', 'ProjectList'),
        key: 'ProjectList',
        icon: renderIcon(AutoAwesomeMotionOutlined),
      }
    ]
  }
];

// 菜单标识
const menuRef = ref(null);

// 菜单当前选中值
const selectedKey = ref('ArticleList');

// 保存菜单当前选中值
const saveMenuKey = (key) => {
  sessionStorage.setItem('menuKey', key);
}

// 设置菜单当前选中值
const setMenuKey = (key) => {
  selectedKey.value = key;
  menuRef.value?.showOption(key);
}

// 组件挂载前获取
onBeforeMount(() => {
  const key = sessionStorage.getItem('menuKey');
  if (key) setMenuKey(key);
});

// 路由改变时选中对应菜单选项
const route = useRoute();
watch(route, () => {
  if (route.name != 'Login') {
    const name = route.name;
    switch (name) {
      case 'CreateArticle': case 'UpdateArticle':
        setMenuKey('ArticleList');
        break;
      default:
        setMenuKey(name);
        break;
    }
  }
}, {deep: true})

</script>

<style lang="scss">
</style>