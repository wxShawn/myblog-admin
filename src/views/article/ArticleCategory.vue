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
        <n-button type="primary" @click="">添加分类</n-button>
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
</template>

<script setup>
import { ref } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDataTable,
} from 'naive-ui';

import useCategoriesSearchForm from './hooks/useCategoriesSearchForm'
import useCategoriesDataTable from './hooks/useCategoriesDataTable';

/**
 * 分类查询表单
 */
const searchFormRef = ref(null);
const searchForm = useCategoriesSearchForm(searchFormRef);
const searchClickHandle = () => {
  searchForm.search(async (categoryName) => {
    dataTable.getData(categoryName);
  });
}

/**
 * 分类列表
 */
const dataTable = useCategoriesDataTable();
dataTable.paginationAction.change = () => {
  searchForm.search(async (categoryName) => {
    dataTable.getData(categoryName);
  });
}
</script>

<style lang="scss">

</style>