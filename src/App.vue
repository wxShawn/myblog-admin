<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<script setup>
import {
  NMessageProvider,
} from 'naive-ui';
</script>

<style>
html {
  height: 100%;
  max-width: 1920px;
  min-width: 1024px;
}

body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>
