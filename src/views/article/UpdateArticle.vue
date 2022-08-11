<template>
  <n-card>
    <n-form
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
    <markdown-editor :data="mdData" style="height: 600px;" @data-change="handleDataChange" />
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
import { onBeforeMount, reactive } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

import api from '../../api';
import router from '../../router';
import MarkdownEditor from '../../components/MarkdownEditor.vue';

const articleId = useRoute().query.id;

// naive ui 消息API
const nMessage = useMessage();
// naive ui 对话框API
const nDialog = useDialog();

// 是否已提交数据
let isPosted = false;
// 离开路由前检测是否弹出对话框提醒
onBeforeRouteLeave((to, from, next) => {
  if (from.name === 'UpdateArticle' && !isPosted) {
    nDialog.warning({
      title: "警告",
      content: "离开页面后数据将不会保存，确认离开？",
      positiveText: "离开",
      negativeText: "不离开",
      onPositiveClick: () => {
        next();
      },
      onNegativeClick: () => {
        // nothing
      }
    });
  }
});

const mdData = reactive({
  text: '',
});

onBeforeMount(async () => {
  const data = await api.article.findOne(articleId);
  if (data.code === 0) {
    mdData.text = data.result.content;
    console.log(mdData.text, data.result.content);
  }
});

// 文章数据
const article = {
  title: '',
  content: '',
};

// 编辑器数据改变事件处理
const handleDataChange = (emitData) => {
  console.log(emitData);
  article.title = emitData.title;
  article.content = emitData.text;
}

// 表单数据
const formValue = reactive({
  categoryId: null,
});

// 表单规则
const rules = {
  categoryId: {
    required: true,
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
  const data = await api.article.create(article.title, article.content, formValue.categoryId);
  if (data.code === 0) {
    nMessage.success(data.msg);
    isPosted = true;
    router.push({ name: 'ArticleList' });
  }
}

</script>

<style>

</style>