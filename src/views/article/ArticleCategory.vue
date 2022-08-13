<template>
  <n-card>
    <n-form
      ref="searchFormRef"
      inline
      :label-width="80"
      :model="searchForm.formValue"
    >
      <n-form-item label="分类名称" path="name">
        <n-input v-model:value="searchForm.formValue.name" />
      </n-form-item>
      <n-form-item>
        <n-button type="info" @click="searchClickHandle">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="addCategoryModal = true">添加分类</n-button>
      </n-form-item>
    </n-form>
    <n-data-table 
      remote 
      :columns="dataTable.columns" 
      :data="dataTable.categoryData"
      :pagination="dataTable.pagination"
      :loading="dataTable.loading.value"
    ></n-data-table>
  </n-card>

  <!-- 模态框：编辑分类 -->
  <n-modal v-model:show="editCategoryModal" preset="dialog" title="Dialog">
    <template #header>
      <div>编辑分类</div>
    </template>
    <n-form
      style="margin-top: 30px;"
      ref="editCategoryFormRef"
      label-placement="left"
      :model="editCategoryFormValue"
      :rules="editCategoryFormRules"
    >
      <n-form-item label="分类名称" path="name">
        <n-input v-model:value="editCategoryFormValue.name"></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="editCategoryModal = false">取消</n-button>
      <n-button type="primary" @click="handleUpdateClick">更新</n-button>
    </template>
  </n-modal>

  <!-- 模态框：添加分类 -->
  <n-modal v-model:show="addCategoryModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <n-form
      style="margin-top: 30px;"
      ref="addCategoryFormRef"
      label-placement="left"
      :model="addCategoryFormValue"
      :rules="addCategoryFormRules"
    >
      <n-form-item label="分类名称" path="name">
        <n-input v-model:value="addCategoryFormValue.name"></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="addCategoryModal = false">取消</n-button>
      <n-button type="primary" @click="handleAddClick">添加</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDataTable,
  useDialog,
  useMessage,
  NModal,
} from 'naive-ui';

import api from '../../api';
import useCategoriesSearchForm from './hooks/useCategoriesSearchForm';
import useCategoriesDataTable from './hooks/useCategoriesDataTable';

const nDialog = useDialog();
const nMessage = useMessage();

/**
 * "分类查询"表单
 */
const searchFormRef = ref(null);
const searchForm = useCategoriesSearchForm(searchFormRef);
const searchClickHandle = () => {
  searchForm.search(async (categoryName) => {
    dataTable.getData(categoryName);
  });
}

/**
 * "添加分类"表单
 */
const addCategoryModal = ref(false);
const addCategoryFormRef = ref(null);
const addCategoryFormValue = reactive({ name: '' });
const addCategoryFormRules = {
  name: { required: true, trigger: 'blur' }
}
let addDisabled = false; // 节流
// 处理添加按钮点击事件
const handleAddClick = async () => {
  // 表单校验
  try {
    await addCategoryFormRef.value.validate();
  } catch (error) {
    console.warn(error);
    return false;
  }
  if (!addDisabled) {
    addDisabled = true;
    const msgReactive = nMessage.loading("添加中，请稍等...", {
      duration: 0
    });
    const { name } = addCategoryFormValue;
    const data = await api.category.create(name);
    if (data.code === 0) {
      nMessage.success(data.msg);
      addCategoryModal.value = false;
      searchForm.search(async (categoryName) => {
        dataTable.getData(categoryName);
      });
    }
    msgReactive.destroy();
    addDisabled = false;
  }
}

/**
 * "编辑分类"表单
 */
const editCategoryModal = ref(false);
const editCategoryFormRef = ref(null);
const editCategoryFormValue = reactive({ id: null, name: '' });
const editCategoryFormRules = {
  name: { required: true, trigger: 'blur' }
}
let updateDisabled = false; // 节流
// 处理更新按钮点击事件
const handleUpdateClick = async () => {
  try {
    await editCategoryFormRef.value.validate();
  } catch (error) {
    console.warn(error);
    return false;
  }
  if (!updateDisabled) {
    updateDisabled = true;
    const msgReactive = nMessage.loading("更新中，请稍等...", {
      duration: 0
    });
    const { id, name } = editCategoryFormValue
    const data = await dataTable.updateCategory(id, name);
    if (data.code === 0) {
      nMessage.success(data.msg);
      editCategoryModal.value = false;
      searchForm.search(async (categoryName) => {
        dataTable.getData(categoryName);
      });
    }
    msgReactive.destroy();
    updateDisabled = false;
  }
}

/**
 * 分类列表
 */
const dataTable = useCategoriesDataTable();

// 列表编辑事件
dataTable.action.edit = (id, name) => {
  Object.assign(editCategoryFormValue, { id, name });
  editCategoryModal.value = true;
}

// 列表删除事件
dataTable.action.delete = (id) => {
  let disabled = false; // 节流
  nDialog.warning({
    title: "警告",
    content: "该操作不可逆，确认删除？",
    positiveText: "确认删除",
    negativeText: "考虑一下",
    onPositiveClick: async () => {
      if (!disabled) {
        disabled = true;
        const msgReactive = nMessage.loading("删除中，请稍等...", {
          duration: 0
        });
        const data = await dataTable.deleteCategory(id);
        if (data.code === 0) {
          nMessage.success(data.msg);
          searchForm.search(async (categoryName) => {
            dataTable.getData(categoryName);
          });
        }
        msgReactive.destroy();
        disabled = false;
      }
    },
    onNegativeClick: () => {
      // nothing
    }
  });
}

// 分页改变事件
dataTable.paginationAction.change = () => {
  searchForm.search(async (categoryName) => {
    dataTable.getData(categoryName);
  });
}
</script>

<style lang="scss">

</style>