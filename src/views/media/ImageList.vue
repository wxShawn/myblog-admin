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
          <n-button type="primary" @click="showUploadMedia = true">上传图片</n-button>
        </n-form-item>
      </n-form>
    </n-card>
    <n-spin v-if="imageList.length > 0" size="large" :show="loading">
      <n-grid x-gap="12" y-gap="12" cols="m:3 l:4 xl:6" responsive="screen">
        <n-gi v-for="img in imageList" :key="img">
          <n-card class="image-card" content-style="padding: 5px" hoverable>
            <img class="cover" :src="img.url" :alt="img.title" />
            <!-- 删除 -->
            <n-button
              class="delete-btn"
              size="tiny"
              @click="handleDeleteMedia(img.id)"
            >
              <n-icon><delete-forever-filled /></n-icon>
            </n-button>
            <!-- 编辑 -->
            <n-button 
              class="edit-btn"
              size="tiny"
              @click="handleEditOpen(img.id, img.name, img.url)"
            >
              <n-icon><edit-round /></n-icon>
            </n-button>
            <div class="info">
              <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><b>{{ img.name }}</b></div>
              <div style="color: #aaa; font-size: 12px">{{ img.size }}</div>
            </div>
          </n-card>
        </n-gi>
      </n-grid>
    </n-spin>
    <!-- 无数据时显示 -->
    <div v-else style="text-align: center;">
      <n-icon :depth="5" :size="40"><image-search-filled /></n-icon>
      <div style="color: #ccc;">No Image</div>
    </div>
    <!-- 分页 -->
    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <n-pagination
        :disabled="loading"
        v-model:page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-count="pagination.pageCount"
        show-size-picker
        :page-sizes="pagination.sizeOptions"
        @update-page="handlePageChange"
        @update-page-size="handlePageSizeChange"
      >
        <template #prefix>
          共 {{ pagination.total }} 张图片
        </template>
      </n-pagination>
    </div>
  </n-space>

  <!-- 上传图片 -->
  <n-modal
    v-model:show="showUploadMedia"
    class="custom-card"
    preset="card"
    style="width: 500px;"
    title="上传图片"
  >
    <upload-media
      accept=".gif,.jpg,.png,.jpeg"
      @success="handleUploadSuccess"
    />
  </n-modal>

  <!-- 编辑 -->
  <n-modal v-model:show="showEditModal" preset="dialog" title="图片">
    <n-form
      ref="editFormRef"
      style="margin-top: 30px;"
      label-placement="left"
      :model="editFormValue"
    >
      <n-form-item label="图片名称">
        <n-input v-model:value="editFormValue.name" />
      </n-form-item>
      <n-form-item label="图片地址">
        <n-input :value="editFormValue.url" disabled />
        <n-button style="margin-left: 20px;" @click="handleCopeUrl">复制</n-button>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="showEditModal = false">返回</n-button>
      <n-button type="primary" @click="handleUpdateMedia">更新</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import {
  NGrid,
  NGi,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NIcon,
  NModal,
  useMessage,
  useDialog,
  NPagination,
  NSpin,
} from 'naive-ui';
import {
  EditRound,
  DeleteForeverFilled,
  ImageSearchFilled,
} from '@vicons/material';
import { onBeforeMount, reactive, ref } from 'vue';

import UploadMedia from '../../components/UploadMedia.vue';
import api from '../../api';
import constants from '../../constants';

const nMessage = useMessage();
const nDialog = useDialog();

/**
 * search表单
 */
const searchFormRef = ref(null);
const searchFormValue = reactive({ name: '' });
// 查询
const handelSearchClick = () => {
  console.log(pagination.page, pagination.pageSize);
  getData(); // 刷新数据
}

/**
 * 上传文件
 */
const showUploadMedia = ref(false);
// 上传成功时
const handleUploadSuccess = () => {
  getData(); // 刷新数据
  showUploadMedia.value = false;
}

/**
 * 删除文件
 */
const handleDeleteMedia = (id) => {
  nDialog.warning({
    title: "警告",
    content: "该操作不可逆，确认删除？",
    positiveText: "确认删除",
    negativeText: "考虑一下",
    onPositiveClick: async () => {
      const data = await api.media.delete(id);
      if (data.code === 0) {
        nMessage.success('删除成功');
        getData(); // 刷新数据
      }
    },
    onNegativeClick: () => {
      // do nothing
    }
  });
}

/**
 * edit表单
 */
const showEditModal = ref(false);
const editFormRef = ref(null);
const editFormValue = reactive({
  id: '',
  name: '',
  url: '',
});
// 打开编辑界面
const handleEditOpen = (id, name, url) => {
  showEditModal.value = true;
  Object.assign(editFormValue, { id, name, url });
}
// 复制URL
const handleCopeUrl = async () => {
  try {
    await navigator.clipboard.writeText(editFormValue.url);
    nMessage.info('已复制URL');
  } catch (error) {
    console.warn(error);
    nMessage.info('复制失败');
  }
}
// 更新
const handleUpdateMedia = async () => {
  const data = await api.media.update(editFormValue.id, editFormValue.name);
  if (data.code === 0) {
    nMessage.success(data.msg);
    // 刷新数据
    getData();
  }
  showEditModal.value = false;
}

/**
 * 图片数据列表
 */
// 图片列表
const imageList = reactive([]);
// 加载中
const loading = ref(false);
// 获取图片列表
const getData = async () => {
  loading.value = true;
  const { page, pageSize } = pagination;
  const { name } = searchFormValue;
  const data = await api.media.findAllImage(page, pageSize, name);
  if (data.code === 0) {
    imageList.length = 0;
    // 刷新分页
    updatePagination(data.result.count);
    const { rows } = data.result
    for (let i = 0, len = rows.length; i < len; i++) {
      const id = rows[i].id;
      const url = `${constants.REQUEST_URL}/${rows[i].path.split('uploads/', 2)[1]}`;
      const name = rows[i].name;
      const size = rows[i].size > 1024*1024 ? (rows[i].size/1024/1024).toFixed(2) + ' MB' : (rows[i].size/1024).toFixed(2) + ' KB';
      imageList.push({ id, url, name, size });
    }
  }
  loading.value = false;
}
onBeforeMount(() => {
  // 刷新数据
  getData();
});

/**
 * 分页
 */
const pagination = reactive({
  page: 1, // 当前页
  pageSize: 10, // 分页大小
  sizeOptions: [ // 自定义分页选项
    { label: '10/页', value: 10 },
    { label: '20/页', value: 20 }, 
    { label: '30/页', value: 30 },
  ],
  pageCount: 0, // 分页总数
  total: 0, // 图片总数
});
// 刷新分页
const updatePagination = (total) => {
  // 总数为零时终止函数，防止后面会发送一个page=0的错误请求
  if (total === 0) {
    return false;
  }
  pagination.total = total;
  pagination.pageCount = Math.ceil(total / pagination.pageSize);
  // 分页总数小于当前页时，将当前页设置为最后一页，并刷新数据
  if (pagination.page > pagination.pageCount){
    pagination.page = pagination.pageCount;
    // 刷新数据
    getData();
  }
}
// 分页改变时
const handlePageChange = () => {
  // 刷新数据
  getData();
}
// 分页大小改变时
const handlePageSizeChange = () => {
  // 刷新数据
  getData();
}


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
  .delete-btn {
    position: absolute;
    top: 10px;
    right: 40px;
    background: #fff;
    color: #d03050;
  }
  .edit-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #fff;
    color: #2080f0;
  }
  .info {
    padding: 0 5px;
  }
}
</style>