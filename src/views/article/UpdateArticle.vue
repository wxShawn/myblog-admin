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
        <n-button type="primary" @click="update">更新</n-button>
      </n-form-item>
    </n-form>
    <markdown-editor :data="originData" style="height: 600px;" @data-change="handleDataChange" />
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
import { onBeforeMount, reactive, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

import api from '../../api';
import router from '../../router';
import MarkdownEditor from '../../components/MarkdownEditor.vue';

// naive ui 消息API
const nMessage = useMessage();
// naive ui 对话框API
const nDialog = useDialog();

// 当前文章数据是否与原始数据相同
let isChanged = true;
// 离开路由前检测是否弹出对话框提醒
onBeforeRouteLeave((to, from, next) => {
  if (from.name === 'UpdateArticle' && !isChanged) {
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

// 文章id
const articleId = useRoute().query.id;

// 原始文章数据
const originData = reactive({
  text: '',
});

// 当前文章数据
const article = reactive({
  title: '',
  content: originData.text,
});

// 监听文章数据,判断其内容是否与原始数据相同
watch(article, (newValue, oldValue) => {
  isChanged = originData.text === article.content ? true : false;
})

// 编辑器数据改变事件处理
const handleDataChange = (emitData) => {
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

// 组件挂载前执行
onBeforeMount(async () => {
  // 获取分类列表
  getCategoryList();
  // 获取文章信息
  const data = await api.article.findOne(articleId);
  if (data.code === 0) {
    // 文章内容
    originData.text = data.result.content;
    // 文章分类ID
    formValue.categoryId = data.result.blog_category.id;
  }
});

// 更新文章
const update = async () => {
  const data = await api.article.update(articleId, article.title, article.content, formValue.categoryId);
  if (data.code === 0) {
    nMessage.success(data.msg);
    isChanged = true;
    router.push({ name: 'ArticleList' });
  }
}

</script>

<style>

</style>