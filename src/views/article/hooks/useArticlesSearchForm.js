import { reactive } from "vue";

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
        // if (!value) {
        //   return new Error('请输入邮箱');
        // }
        if (typeof value != 'number') {
          return new Error('分类ID格式错误');
        }
        return true;
      },
      trigger: 'blur'
    }
  };

  // 选择器选项
  const categoryOptions = [
    { label: '全部', value: 0 },
    { label: '前端', value: 1 },
    { label: '服务端', value: 2 },
    { label: '数据库', value: 3 },
  ];

  // 重置表单
  const reset = () => {
    Object.assign(formValue, {
      title: '',
      category: 0,
    });
  };

  // 查询
  const search = async (callback) => {
    // 发送 ajax 请求
    /** ajax... */
    callback('服务器返回的数据');
  }

  return {
    formValue,
    rules,
    categoryOptions,
    reset,
    search,
  }
}