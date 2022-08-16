<template>
  <n-space vertical :size="12">
    <n-card>
      <n-form
        ref="searchFormRef"
        inline
        :model="searchFormValue"
      >
        <n-form-item label="图片标题">
          <n-input v-model:value="searchFormValue.name"></n-input>
        </n-form-item>
        <n-form-item>
          <n-button type="info" @click="handelSearchClick">查询</n-button>
        </n-form-item>
        <n-form-item>
          <upload-media />
        </n-form-item>
        <n-form-item>
          <n-button type="error">删除</n-button>
        </n-form-item>
      </n-form>
    </n-card>

    <n-grid x-gap="12" y-gap="12" cols="m:3 l:4 xl:6" responsive="screen">
      <n-gi v-for="img in imageList" :key="img">
        <n-card class="image-card" content-style="padding: 5px" hoverable>
          <img class="cover" :src="img.url" :alt="img.title">
          <n-checkbox class="checkbox"></n-checkbox>
          <n-button class="edit-btn" size="tiny">
            <n-icon><edit-round /></n-icon>
          </n-button>
          <div class="info">
            <div><b>{{ img.name }}</b></div>
            <div>{{ img.size }}</div>
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </n-space>

  <!-- 编辑 -->
  <n-modal :show="false" preset="dialog" title="图片">
    <n-form
      style="margin-top: 30px;"
      label-placement="left"
    >
      <n-form-item label="图片名称">
        <n-input />
      </n-form-item>
      <n-form-item label="图片地址">
        <n-input value="http://www.xxx.yyy/abc.jpg" disabled />
        <n-button style="margin-left: 20px;">复制</n-button>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button>返回</n-button>
      <n-button type="primary">上传</n-button>
    </template>
  </n-modal>
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
  NIcon,
  NModal,
} from 'naive-ui';
import {
  EditRound,
} from '@vicons/material';
import { onBeforeMount, reactive, ref } from 'vue';

import UploadMedia from '../../components/UploadMedia.vue';
import api from '../../api';
import constants from '../../constants';

// search表单
const searchFormRef = ref(null);
const searchFormValue = reactive({ name: '' });
const handelSearchClick = () => {
  getData(null, null, searchFormValue.name);
}

// 图片列表
const imageList = reactive([]);

// 获取图片列表
const getData = async (page, pageSize, name) => {
  const data = await api.media.findAll(page, pageSize, name);
  if (data.code === 0) {
    imageList.length = 0;
    const { rows } = data.result
    for (let i = 0, len = rows.length; i < len; i++) {
      const url = `${constants.REQUEST_URL}/${rows[i].path.split('uploads\\', 2)[1]}`;
      const name = rows[i].name;
      const size = rows[i].size > 1024*1024 ? (rows[i].size/1024/1024).toFixed(2) + 'MB' : (rows[i].size/1024).toFixed(2) + 'KB';
      imageList.push({ url, name, size });
    }
  }
}

onBeforeMount(() => {
  getData();
});

</script>

<style lang="scss" scoped>
.image-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
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
  .edit-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #fff;
  }
  .info {
    padding: 0 5px;
  }
}
</style>