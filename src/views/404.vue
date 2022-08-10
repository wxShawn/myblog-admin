<template>
  <div style="height: 100%; display: flex; justify-content: center; align-items: center;">
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #icon>
        <img src="../assets/Page_Not_Found_Outline.svg" alt="404图片">
      </template>
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
  router.push({ name: 'Home' });
}
</script>

<style>

</style>