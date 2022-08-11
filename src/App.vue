<template>
  <n-dialog-provider>
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-dialog-provider>
</template>

<script setup>
import {
  NMessageProvider,
  NDialogProvider,
} from 'naive-ui';
</script>

<style>
html {
  height: 100%;
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
