import { onBeforeMount, reactive } from "vue";
import api from '../../../api';

export default (formRef) => {
  // 表单数据
  const formValue = reactive({
    title: '',
    category: 0,
  });

  // 表单规则
  const rules = {
    category: {
      validator(rule, value) {
        if (typeof value != 'number') {
          return new Error('分类ID格式错误');
        }
        return true;
      },
      trigger: 'blur'
    }
  };

  // 选择器选项
  const categoryOptions = reactive([
    { label: '全部', value: 0 },
  ]);

  // 重置表单
  const reset = () => {
    Object.assign(formValue, {
      title: '',
      category: 0,
    });
  };

  // 查询
  const search = async (callback) => {
    try {
      await formRef.value.validate();
    } catch (error) {
      console.log(error);
      return false;
    }
    callback(formValue.title, formValue.category);
  }

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

  onBeforeMount(() => {
    getCategoryList();
  });

  return {
    formValue,
    rules,
    categoryOptions,
    reset,
    search,
  }
}