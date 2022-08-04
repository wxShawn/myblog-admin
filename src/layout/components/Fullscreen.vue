<template>
  <n-tooltip placement="left" trigger="hover">
    <template #trigger>
      <n-button
        text
        style="font-size: 30px;"
        @click="fullScreen.openOrClose"
      >
        <n-icon>
          <fullscreen-filled v-show="!fullScreen.isOpen.value" />
          <fullscreen-exit-filled v-show="fullScreen.isOpen.value" />
        </n-icon>
      </n-button>
    </template>
    {{ fullScreen.isOpen.value ? '关闭全屏显示' : '开启全屏显示' }}
  </n-tooltip>
</template>

<script setup>
import {
  NIcon,
  NButton,
  NTooltip,
} from 'naive-ui';
import {
  FullscreenFilled,
  FullscreenExitFilled,
} from '@vicons/material';

import useFullScreen from '../../hooks/useFullScreen';

const fullScreen = useFullScreen(document);
</script>