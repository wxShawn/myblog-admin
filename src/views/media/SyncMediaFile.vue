<template>
  <n-card>
    <div>同步服务器媒体文件和数据库中对应的媒体信息</div>
    <n-button type="primary" @click="handleSync">立即同步</n-button>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NButton,
  useMessage,
} from 'naive-ui';
import api from '../../api';

const nMessage = useMessage();

const handleSync = async () => {
  const data = await api.media.syncMediaFile();
  if (data.code === 0) {
    nMessage.success(data.nMessage);
  }
}
</script>