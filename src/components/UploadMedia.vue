<template>
    <n-upload
      abstract
      multiple
      @change="handleChange"
      :accept="accept"
    >
      <n-button-group>
        <n-upload-trigger #="{ handleClick }" abstract>
          <n-button @click="handleClick">点击添加文件</n-button>
        </n-upload-trigger>
        <n-button @click="handleUpload">上传</n-button>
      </n-button-group>
      <div v-show="showPercentage" style="margin-top: 20px;">
        <n-progress
          type="line"
          status="success"
          :percentage="uploadPercentage"
          indicator-placement="inside"
        />
        <div>上传中...请勿关闭此页面</div>
      </div>
      <n-scrollbar
        style="
          margin-top: 10px;
          padding: 10px;
          height: 200px;
          border: 1px solid #eee;
          border-radius: 3px;
          box-sizing: border-box;
        "
      >
        <n-upload-file-list />
      </n-scrollbar>
    </n-upload>
</template>

<script setup>
import {
  NUpload,
  NUploadFileList,
  NUploadTrigger,
  NButton,
  NButtonGroup,
  useMessage,
  NScrollbar,
  NProgress,
} from 'naive-ui';
import { ref } from 'vue';
import api from '../api';

// 消息
const nMessage = useMessage();

defineProps(['accept']);
const emit = defineEmits(['success']);

// 将要上传的文件列表
const uploadFileList = new FormData();

// 上传进度
const showPercentage = ref(false);
const uploadPercentage = ref(0);

// 文件变化时
const handleChange = (() => {
  let keyList = [];
  return ({ fileList }) => {
    // 初始化文件列表
    for (const key of keyList) {
      uploadFileList.delete(key);
    }
    keyList.length = 0;
    // 加入新的文件
    for (let i = 0; i < fileList.length; i++) {
      uploadFileList.append(`file${i}`, fileList[i].file);
      keyList.push(`file${i}`);
    }
  }
})();

// 上传文件
const handleUpload = async () => {
  showPercentage.value = true;
  const data = await api.media.upload(uploadFileList, (progressEvent) => {
    const persent = progressEvent.loaded / progressEvent.total * 100 || 0;
    uploadPercentage.value = persent;
  });
  if (data.code === 0) {
    nMessage.success(data.msg);
    emit('success', '上传成功');
  }
  showPercentage.value = false;
}

</script>

<style lang="scss" scoped>
</style>