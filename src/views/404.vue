<template>
  <div style="height: 100%; display: flex; justify-content: center; align-items: center;">
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button @click="gotoHome">前往首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import {
  NResult,
  NButton,
} from 'naive-ui';
import router from '../router';

const gotoHome = () => {
  router.push({ name: 'Articles' });
}
</script>

<style>

</style>