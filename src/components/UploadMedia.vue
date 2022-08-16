<template>
  <n-upload
    ref="uploadRef"
    multiple
    :show-file-list="false"
    @click="handleClick"
    @change="handleChange"
    @before-upload="handleBeforeUpload"
  >
    <n-button type="primary">上传图片</n-button>
  </n-upload>
</template>

<script setup>
import {
  NUpload,
  NButton,
} from 'naive-ui';
import { ref } from 'vue';

const uploadRef = ref(null);

const uploadFileList = [];

const handleClick = () => {
  uploadFileList.length = 0;
  uploadRef.value.clear();
}

const handleChange = ({ file, fileList }) => {
  console.log({ file, fileList });
}

const handleBeforeUpload = ({ file, fileList }) => {
  // console.log({ file, fileList });
}

const upload = () => {

}
</script>