<template>
  <n-space vertical :size="12">
    <n-card>
      <n-form
        inline
      >
        <n-form-item label="图片标题">
          <n-input></n-input>
        </n-form-item>
        <n-form-item>
          <n-button type="info">查询</n-button>
        </n-form-item>
        <n-form-item>
          <n-button type="primary">添加图片</n-button>
        </n-form-item>
      </n-form>
    </n-card>

    <n-grid x-gap="12" y-gap="12" cols="m:3 l:4 xl:6" responsive="screen">
      <n-gi v-for="img in tempList" :key="img">
        <n-card class="image-card" content-style="padding: 5px" hoverable>
          <img class="cover" :src="img.url" :alt="img.title">
          <n-checkbox class="checkbox"></n-checkbox>
          <div class="info">
            <div><b>{{ img.title }}</b></div>
            <div>{{ img.size }}</div>
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<script setup>
import {
  NGrid,
  NGi,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
} from 'naive-ui';

const tempList = [
  {
    url: 'http://101.34.29.143:1337/uploads/thumbnail_cities_skylines_screenshot_10_d5e47748d0.jpg?width=1920&height=1080',
    title: '测试图片1',
    size: '2.3m',
  },
  {
    url: 'http://101.34.29.143:1337/uploads/thumbnail_cities_skylines_screenshot_10_d5e47748d0.jpg?width=1920&height=1080',
    title: '测试图片2',
    size: '5m',
  },
  {
    url: 'http://101.34.29.143:1337/uploads/thumbnail_cities_skylines_screenshot_10_d5e47748d0.jpg?width=1920&height=1080',
    title: '测试图片3',
    size: '0.9m',
  },
  {
    url: 'http://101.34.29.143:1337/uploads/thumbnail_cities_skylines_screenshot_10_d5e47748d0.jpg?width=1920&height=1080',
    title: '测试图片4',
    size: '3.5m',
  },
  {
    url: 'http://101.34.29.143:1337/uploads/thumbnail_cities_skylines_screenshot_10_d5e47748d0.jpg?width=1920&height=1080',
    title: '测试图片5',
    size: '1.1m',
  },
  {
    url: 'http://101.34.29.143:1337/uploads/thumbnail_cities_skylines_screenshot_10_d5e47748d0.jpg?width=1920&height=1080',
    title: '测试图片6',
    size: '1.5m',
  },
]

</script>

<style lang="scss" scoped>
.image-card {
  position: relative;
  overflow: hidden;
  .cover {
    aspect-ratio: 16/9;
    width: 100%;
    object-fit: cover;
  }
  .checkbox {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .info {
    padding: 0 5px;
  }
}
</style>