<template>
  <n-card>
    <n-form
      ref="searchFormRef"
      inline
      :model="searchFormValue"
    >
      <n-form-item label="音频名称">
        <n-input v-model:value="searchFormValue.name"></n-input>
      </n-form-item>
      <n-form-item>
        <n-button type="info" @click="handleSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="showUploadMedia = true">添加音频</n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      remote
      :columns="columns"
      :data="audioList"
      :pagination="pagination"
    />
  </n-card>

  <!-- 上传音频文件 -->
  <n-modal
    v-model:show="showUploadMedia"
    class="custom-card"
    preset="card"
    style="width: 500px;"
    title="上传音频"
  >
    <upload-media
      accept="audio/*"
      @success="handleUploadSuccess"
    />
  </n-modal>

  <!-- 编辑 -->
  <n-modal v-model:show="showEditModal" preset="dialog" title="音频">
    <n-form
      ref="editFormRef"
      style="margin-top: 30px;"
      label-placement="left"
      :model="editFormValue"
    >
      <n-form-item label="音频名称">
        <n-input v-model:value="editFormValue.name" />
      </n-form-item>
      <n-form-item label="音频地址">
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
import { h, ref, reactive, onBeforeMount } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NCard,
  NDataTable,
  NA,
  NButton,
  NModal,
  useMessage,
useDialog,
} from 'naive-ui';
import api from '../../api';
import UploadMedia from '../../components/UploadMedia.vue';
import constants from '../../constants';

const nMessage = useMessage();
const nDialog = useDialog();

/**
 * ********** 查询表单 **********
 */
const searchFormRef = ref(null);
const searchFormValue = reactive({ name: '' });
const handleSearch = () => {
  pagination.page = 1;
  getData();
}

/**
 * ********** 上传音频 **********
 */
const showUploadMedia = ref(false);
// 上传成功时
const handleUploadSuccess = () => {
  getData(); // 刷新数据
  showUploadMedia.value = false;
}

/**
 * ********** 编辑音频 **********
 */
const showEditModal = ref(false);
const editFormRef = ref(null);
const editFormValue = reactive({
  id: null,
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
  const msgReactive = nMessage.loading("更新中，请稍等...", {
    duration: 0
  });
  const data = await api.media.update(editFormValue.id, editFormValue.name);
  if (data.code === 0) {
    nMessage.success(data.msg);
    // 刷新数据
    getData();
  }
  msgReactive.destroy();
  showEditModal.value = false;
}

/**
 * ********** 删除音频 **********
 */
const handleDeleteMedia = (id) => {
  nDialog.warning({
    title: "警告",
    content: "该操作不可逆，确认删除？",
    positiveText: "确认删除",
    negativeText: "考虑一下",
    onPositiveClick: async () => {
      const msgReactive = nMessage.loading("删除中，请稍等...", {
        duration: 0
      });
      const data = await api.media.delete(id);
      if (data.code === 0) {
        nMessage.success('删除成功');
        getData(); // 刷新数据
      }
      msgReactive.destroy();
    },
    onNegativeClick: () => {
      // do nothing
    }
  });
}

/**
 * ********** 数据列表 **********
 */
// 列表结构
const columns = [
  {
    title: '名称',
    key: 'name',
    ellipsis: true,
    width: 250,
    render(row) {
      return h(NA, {
        href: row.url,
        target: '_blank',
        title: row.name
      }, { default: () => row.name })
    }
  },
  { title: '大小', key: 'size' },
  { title: '创建时间', key: 'createdAt' },
  { title: '更新时间', key: 'updatedAt' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h(NButton, {
          ghost: true,
          type: 'info',
          size: 'small',
          style: 'margin-right: 12px;',
          onclick: () => handleEditOpen(row.id, row.name, row.url)
        }, { default: () => '编辑' }),
        h(NButton, {
          ghost: true,
          type: 'error',
          size: 'small',
          onClick: () => handleDeleteMedia(row.id)
        }, { default: () => '删除' }),
      ]
    }
  }
];
// 数据列表
const audioList = reactive([]);
// 获取数据
const getData = async () => {
  const { page, pageSize } = pagination;
  const { name } = searchFormValue;
  const data = await api.media.findAllAudio(page, pageSize, name);
  if (data.code === 0) {
    const { count, rows } = data.result;
    audioList.length = 0;
    pagination.itemCount = count;
    for (let i = 0, len = rows.length; i < len; i++) {
      const id = rows[i].id;
      const name = rows[i].name;
      const url = `${constants.REQUEST_URL}/${rows[i].path.split('uploads/', 2)[1]}`;
      const size = rows[i].size > 1024*1024 ? (rows[i].size/1024/1024).toFixed(2) + ' MB' : (rows[i].size/1024).toFixed(2) + ' KB';
      const createdAt = new Date(rows[i].createdAt).toLocaleString();
      const updatedAt = new Date(rows[i].updatedAt).toLocaleString();
      audioList.push({
        id,
        name,
        url,
        size,
        createdAt,
        updatedAt,
      });
    }
  }
}
onBeforeMount(() => {
  getData();
});

/**
 * ********** 分页 **********
 */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [{ label: '10/页', value: 10 }, { label: '20/页', value: 20 }, { label: '30/页', value: 30 }],
  // slot 分页前缀
  prefix() {
    return `共 ${pagination.itemCount} 个音频文件`;
  },
  // 切换页时触发
  onChange(page) {
    pagination.page = page;
    getData();
  },
  // 更改分页大小时触发
  onUpdatePageSize(pageSize) {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    getData();
  }
});

</script>

<style>

</style>