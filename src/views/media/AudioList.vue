<template>
  <n-card>
    <n-form
      inline
    >
      <n-form-item>
        <n-input></n-input>
      </n-form-item>
      <n-form-item>
        <n-button type="info">查询</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary">添加音频</n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :columns="columns"
      :data="data"
    />
  </n-card>
</template>

<script setup>
import { h } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NCard,
  NDataTable,
  NA,
  NButton,
} from 'naive-ui';

const columns = [
  {
    title: '名称',
    key: 'name',
    render(row) {
      return h(NA, {
        href: row.name
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
          style: 'margin-right: 12px;'
        }, { default: () => '编辑' }),
        h(NButton, {
          ghost: true,
          type: 'error',
          size: 'small',
        }, { default: () => '删除' }),
      ]
    }
  }
];

const data = [
  { name: '测试音频1', size: '2.3m', createdAt: '2022-01-01', updatedAt: '2022-01-01' },
  { name: '测试音频2', size: '2.5m', createdAt: '2022-01-01', updatedAt: '2022-01-01' },
  { name: '测试音频3', size: '1.9m', createdAt: '2022-01-01', updatedAt: '2022-01-01' },
  { name: '测试音频4', size: '3m', createdAt: '2022-01-01', updatedAt: '2022-01-01' },
  { name: '测试音频5', size: '2.6m', createdAt: '2022-01-01', updatedAt: '2022-01-01' },
]

</script>

<style>

</style>