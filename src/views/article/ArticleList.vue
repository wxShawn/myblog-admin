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
        <n-button type="primary" @click="">添加文章</n-button>
      </n-form-item>
    </n-form>
    
    <n-data-table 
      remote 
      :columns="dataTable.columns" 
      :data="dataTable.articleData" 
      :pagination="dataTable.pagination"
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
  searchForm.search((title, categoryId) => {
    // 获取新数据
    dataTable.getData(title, categoryId);
  });
}

/**
 * 博客列表
 */
const dataTable = useArticlesDataTable(nMessage);

</script>

<style lang="scss">

</style>