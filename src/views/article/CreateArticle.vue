<template>
  <n-card>
    <n-form
      ref="formRef"
      inline
      :model="formValue"
      :rules="rules"
    >
      <n-form-item label="选择分类" path="categoryId">
        <n-select
          v-model:value="formValue.categoryId"
          :options="categoryOptions"
          style="width: 200px;"
        ></n-select>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="create">上传</n-button>
      </n-form-item>
    </n-form>
    <markdown-editor style="height: 600px;" @data-change="handleDataChange" />
  </n-card>
</template>

<script setup>
import {
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NButton,
  useMessage,
  useDialog,
} from 'naive-ui';
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import api from '../../api';
import router from '../../router';
import MarkdownEditor from '../../components/MarkdownEditor.vue';

// naive ui 消息API
const nMessage = useMessage();
// naive ui 对话框API
const nDialog = useDialog();

// 是否已提交数据
let isChanged = true;
// 离开路由前检测是否弹出对话框提醒
onBeforeRouteLeave((to, from, next) => {
  if (from.name === 'CreateArticle' && !isChanged) {
    nDialog.warning({
      title: "警告",
      content: "离开页面后数据将不会保存，确认离开？",
      positiveText: "离开",
      negativeText: "不离开",
      onPositiveClick: () => {
        next();
      },
      onNegativeClick: () => {
        next(false);
      }
    });
  } else {
    next();
  }
});

// 文章数据
const article = reactive({
  title: '',
  content: '',
});

// 监听文章数据, 判断是否有内容
watch(article, () => {
  isChanged = article.content.length === 0 ? true : false;
});

// 编辑器数据改变事件处理
const handleDataChange = (emitData) => {
  article.title = emitData.title;
  article.content = emitData.text;
}

// 表单标识
const formRef = ref(null);

// 表单数据
const formValue = reactive({
  categoryId: null,
});

// 表单规则
const rules = {
  categoryId: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请选择分类');
      }
      return true;
    },
    trigger: 'blur'
  }
}

// 选择器选项
const categoryOptions = reactive([]);

// 获取分类列表
const getCategoryList = async () => {
  const data = await api.category.findAll();
  if (data.code === 0) {
    const { rows } = data.result;
    for (let i = 0, len = rows.length; i < len; i++) {
      categoryOptions.push({ label: rows[i].name, value: rows[i].id });
    }
  }
}

// 组件挂载前获取分类列表
onBeforeMount(() => {
  getCategoryList();
});

// 创建文章
const create = async () => {
  try {
    await formRef.value.validate();
  } catch (error) {
    console.warn(error);
    return false;
  }
  const data = await api.article.create(article.title, article.content, formValue.categoryId);
  if (data.code === 0) {
    nMessage.success(data.msg);
    isChanged = true;
    router.push({ name: 'ArticleList' });
  }
}

</script>

<style>

</style>