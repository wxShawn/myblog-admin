<template>
  <n-card>
    <n-form
      ref="searchFormRef"
      inline
      :model="searchFormValue"
    >
      <n-form-item label="项目名称">
        <n-input v-model:value="searchFormValue.name" />
      </n-form-item>
      <n-form-item>
        <n-button type="info" @click="handleSearch">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="addProjectModal = true">添加项目</n-button>
      </n-form-item>
    </n-form>

    <n-data-table
      remote
      :columns="columns"
      :data="projectList"
      :pagination="pagination"
    />
  </n-card>
  
  <!-- 模态框：添加项目 -->
  <n-modal v-model:show="addProjectModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <n-form
      style="margin-top: 30px;"
      ref="addProjectFormRef"
      :label-width="92"
      label-placement="left"
      :model="addProjectFormValue"
      :rules="addProjectFormRules"
    >
      <n-form-item label="项目名称" path="name">
        <n-input v-model:value="addProjectFormValue.name"></n-input>
      </n-form-item>
      <n-form-item label="项目简介" path="content">
        <n-input v-model:value="addProjectFormValue.content"></n-input>
      </n-form-item>
      <n-form-item label="Demo地址" path="url">
        <n-input v-model:value="addProjectFormValue.url"></n-input>
      </n-form-item>
      <n-form-item label="封面地址" path="cover">
        <n-input v-model:value="addProjectFormValue.cover"></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="addProjectModal = false">取消</n-button>
      <n-button type="primary" @click="handleAddClick">添加</n-button>
    </template>
  </n-modal>

  <!-- 模态框：编辑项目 -->
  <n-modal v-model:show="editProjectModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <n-form
      style="margin-top: 30px;"
      ref="editProjectFormRef"
      :label-width="92"
      label-placement="left"
      :model="editProjectFormValue"
      :rules="editProjectFormRules"
    >
      <n-form-item label="项目名称" path="name">
        <n-input v-model:value="editProjectFormValue.name"></n-input>
      </n-form-item>
      <n-form-item label="项目简介" path="content">
        <n-input v-model:value="editProjectFormValue.content"></n-input>
      </n-form-item>
      <n-form-item label="Demo地址" path="url">
        <n-input v-model:value="editProjectFormValue.url"></n-input>
      </n-form-item>
      <n-form-item label="封面地址" path="cover">
        <n-input v-model:value="editProjectFormValue.cover"></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="editProjectModal = false">取消</n-button>
      <n-button type="primary" @click="handleUpdateClick">更新</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { onBeforeMount, reactive, ref, h } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDataTable,
  NA,
  useDialog,
  useMessage,
  NModal,
  NSwitch,
} from 'naive-ui';
import api from '../../api';
import paramsValidator from '../../utils/paramsValidator';

const nDialog = useDialog();
const nMessage = useMessage();

/**
 * ********** search **********
 */
const searchFormRef = ref(null);
const searchFormValue = reactive({ name: '' });
const handleSearch = () => {
  pagination.page = 1;
  getData();
}

/**
 * ********** add project **********
 */
const addProjectModal = ref(false);
const addProjectFormRef = ref(null);
const addProjectFormValue = reactive({
  name: '',
  content: '',
  url: '',
  cover: '',
});
const addProjectFormRules = {
  name: { required: true, trigger: 'blur' },
  content: { required: true, trigger: 'blur' },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写Demo地址');
      }
      const errorList = paramsValidator.validate({ url: value });
      if (errorList.length > 0) {
        return new Error('url格式不正确');
      }
      return true;
    },
    trigger: 'blur',
  },
  cover: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写封面地址');
      }
      const errorList = paramsValidator.validate({ url: value });
      if (errorList.length > 0) {
        return new Error('cover格式不正确');
      }
      return true;
    },
    trigger: 'blur',
  }
}
let addDisabled = false; // 节流
// 处理添加按钮点击事件
const handleAddClick = async () => {
  // 表单校验
  try {
    await addProjectFormRef.value.validate();
  } catch (error) {
    console.warn(error);
    return false;
  }
  if (!addDisabled) {
    addDisabled = true;
    const msgReactive = nMessage.loading("添加中，请稍等...", {
      duration: 0
    });
    const { name, content, url, cover } = addProjectFormValue;
    const data = await api.project.create(name, content, url, cover);
    if (data.code === 0) {
      nMessage.success(data.msg);
      addProjectModal.value = false;
      getData();
    }
    msgReactive.destroy();
    addDisabled = false;
  }
}

/**
 * ********** edit project **********
 */
const editProjectModal = ref(false);
const editProjectFormRef = ref(null);
const editProjectFormValue = reactive({
  id: null,
  name: '',
  content: '',
  url: '',
  cover: '',
});
const editProjectFormRules = {
  name: { required: true, trigger: 'blur' },
  content: { required: true, trigger: 'blur' },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写Demo地址');
      }
      const errorList = paramsValidator.validate({ url: value });
      if (errorList.length > 0) {
        return new Error('url格式不正确');
      }
      return true;
    },
    trigger: 'blur',
  },
  cover: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写封面地址');
      }
      const errorList = paramsValidator.validate({ url: value });
      if (errorList.length > 0) {
        return new Error('cover格式不正确');
      }
      return true;
    },
    trigger: 'blur',
  }
}
let updateDisabled = false; // 节流
// 处理更新按钮点击事件
const handleUpdateClick = async () => {
  // 表单校验
  try {
    await editProjectFormRef.value.validate();
  } catch (error) {
    console.warn(error);
    return false;
  }
  if (!updateDisabled) {
    updateDisabled = true;
    const msgReactive = nMessage.loading("添加中，请稍等...", {
      duration: 0
    });
    const { id, name, content, url, cover } = editProjectFormValue;
    const data = await api.project.update(id, name, content, url, cover);
    if (data.code === 0) {
      nMessage.success(data.msg);
      editProjectModal.value = false;
      getData();
    }
    msgReactive.destroy();
    updateDisabled = false;
  }
}
// 处理编辑按钮点击事件
const handleEditClick = (id, name, content, url, cover) => {
  editProjectModal.value = true;
  Object.assign(editProjectFormValue, { id, name, content, url, cover });
}

/**
 * ********** delete project **********
 */
const handleDelete = (id) => {
  nDialog.warning({
    title: "警告",
    content: "该操作不可逆，确认删除？",
    positiveText: "确认删除",
    negativeText: "考虑一下",
    onPositiveClick: async () => {
      const msgReactive = nMessage.loading("删除中，请稍等...", {
        duration: 0
      });
      const data = await api.project.delete(id);
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
 * ********** Datatable **********
 */
// 表格结构
const columns = reactive([
  { title: '#', key: 'index' },
  {
    title: '项目名称',
    key: 'name',
    render(row) {
      return h(NA, {
        href: row.url,
        target: '_blank',
        title: row.name
      }, { default: () => row.name })
    }
  },
  {
    title: '发布',
    key: 'publish',
    render(row) {
      return h(NSwitch, {
        value: row.isPublish,
        // NSwitch 值改变时触发的回调
        "onUpdate:value": async (value) => {
          row.isPublish = value;
          const data = await api.project.updatePublish(row.id, row.isPublish);
          if (data.code === 0) {
            nMessage.success(data.msg);
          } else {
            row.isPublish = !value;
          }
        }
      });
    }
  },
  { title: '创建日期', key: 'createdAt' },
  { title: '更新日期', key: 'updatedAt' },
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
          onclick: () => handleEditClick(row.id, row.name, row.content, row.url, row.cover)
        }, { default: () => '编辑' }),
        h(NButton, {
          ghost: true,
          type: 'error',
          size: 'small',
          onClick: () => handleDelete(row.id)
        }, { default: () => '删除' }),
      ]
    }
  }
]);
// 表格数据
const projectList = reactive([]);
// 获取数据
const getData = async () => {
  const { page, pageSize } = pagination;
  const { name } = searchFormValue;
  const data = await api.project.findAll(page, pageSize, name);
  if (data.code === 0) {
    const { count, rows } = data.result;
    projectList.length = 0;
    pagination.itemCount = count;
    for (let i = 0, len = rows.length; i < len; i++) {
      projectList.push({
        index: i + 1,
        id: rows[i].id,
        name: rows[i].name,
        content: rows[i].content,
        url: rows[i].url,
        cover: rows[i].cover,
        isPublish: rows[i].isPublish,
        createdAt: new Date(rows[i].createdAt).toLocaleString(),
        updatedAt: new Date(rows[i].updatedAt).toLocaleString(),
      });
    }
  }
}

onBeforeMount(() => {
  getData();
});

/**
 * ********** navigation **********
 */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [{ label: '10/页', value: 10 }, { label: '20/页', value: 20 }, { label: '30/页', value: 30 }],
  // slot 分页前缀
  prefix() {
    return `共 ${pagination.itemCount} 个项目`;
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