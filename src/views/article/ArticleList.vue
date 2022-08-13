<template>
  <n-card>
    <n-form
      ref="searchFormRef"
      inline
      :label-width="80"
      :model="searchForm.formValue"
      :rules="searchForm.rules"
    >
      <n-form-item label="标题" path="title">
        <n-input v-model:value="searchForm.formValue.title" />
      </n-form-item>
      <n-form-item label="分类" path="category">
        <n-select 
          style="width: 194px;" 
          v-model:value="searchForm.formValue.category" 
          :options="searchForm.categoryOptions"
        ></n-select>
      </n-form-item>
      <n-form-item>
        <n-button style="margin-right: 18px;" @click="searchForm.reset">重置</n-button>
        <n-button :disabled="dataTable.loading.value" type="info" @click="searchClickHandle">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="goToCreateArticle">添加文章</n-button>
      </n-form-item>
    </n-form>
    
    <n-data-table 
      remote 
      :columns="dataTable.columns" 
      :data="dataTable.articleData" 
      :pagination="dataTable.pagination"
      :loading="dataTable.loading.value"
    ></n-data-table>
  </n-card>

  
</template>

<script setup>
import { ref } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NDataTable,
  useMessage,
  useDialog,
} from 'naive-ui';

import router from '../../router';
import useArticlesSearchForm from './hooks/useArticlesSearchForm';
import useArticlesDataTable from './hooks/useArticlesDataTable';

const nMessage = useMessage();
const nDialog = useDialog();

/**
 * 博客筛选表单
 */
const searchFormRef = ref(null);
const searchForm = useArticlesSearchForm(searchFormRef);
// 查询按钮点击
const searchClickHandle = () => {
  searchForm.search(async (title, categoryId) => {
    // 获取新数据
    await dataTable.getData(title, categoryId);
  });
}

/**
 * 博客列表
 */
const dataTable = useArticlesDataTable();

// 表格文章状态更新事件
dataTable.action.publish = async (id, value) => {
  const data = await dataTable.updatePublishState(id, value);
  if (data.code === 0) {
    nMessage.success(data.msg);
  }
}

// 表格编辑事件
dataTable.action.edit = (id) => {
  // 进入编辑页面
  router.push({
    name: 'UpdateArticle',
    query: { id }
  });
}

// 表格删除事件
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
        const data = await dataTable.deleteArticle(id);
        if (data.code === 0) {
          nMessage.success(data.msg);
          searchForm.search(async (title, categoryId) => {
            // 获取新数据
            await dataTable.getData(title, categoryId);
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
  searchForm.search(async (title, categoryId) => {
    // 获取新数据
    await dataTable.getData(title, categoryId);
  });
}

/**
 * 其他
 */
const goToCreateArticle = () => {
  router.push({ name: 'CreateArticle' });
}

</script>

<style lang="scss">

</style>