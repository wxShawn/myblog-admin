import { reactive } from "vue";

export default (formRef) => {
  // 表单数据
  const formValue = reactive({
    name: '',
  });

  // 表单规则
  const rules = {
    
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
    search,
  }
}