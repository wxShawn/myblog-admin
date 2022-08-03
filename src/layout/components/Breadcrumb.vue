<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="b in breadcrumbList"
      :key="b"
      @click="goto(b.name)"
    >{{ b.title }}</n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  NBreadcrumb,
  NBreadcrumbItem,
} from 'naive-ui';

import router from '../../router';

const route = useRoute();

// 路由跳转
const goto = (routeName) => {
  router.push({ name: routeName });
}

// 面包屑列表
const breadcrumbList = computed(() => {
  const bList = [];
  for (let i = 0; i < route.matched.length; i++) {
    bList.push({
      title: route.matched[i].meta.title,
      name: route.matched[i].name,
    });
  }
  return bList;
});

</script>

<style>

</style>