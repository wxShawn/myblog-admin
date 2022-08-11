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
        <n-button type="info" @click="searchClickHandle">查询</n-button>
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
} from 'naive-ui';

import router from '../../router';
import useArticlesSearchForm from './hooks/useArticlesSearchForm';
import useArticlesDataTable from './hooks/useArticlesDataTable';

const nMessage = useMessage();

/**
 * 博客筛选表单
 */
const searchFormRef = ref(null);
const searchForm = useArticlesSearchForm(searchFormRef);
// 查询按钮点击
const searchClickHandle = () => {
  if (!dataTable.loading.value) {
    dataTable.loading.value = true;
    searchForm.search(async (title, categoryId) => {
      // 获取新数据
      await dataTable.getData(title, categoryId);
      dataTable.loading.value = false;
    });
  }
}

/**
 * 博客列表
 */
const dataTable = useArticlesDataTable(nMessage);

// 分页事件触发
dataTable.paginationAction.change = () => {
  if (!dataTable.loading.value) {
    dataTable.loading.value = true;
    searchForm.search(async (title, categoryId) => {
      // 获取新数据
      await dataTable.getData(title, categoryId);
      dataTable.loading.value = false;
    });
  }
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