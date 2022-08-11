import { reactive } from "vue";

export default (formRef) => {
  // 表单数据
  const formValue = reactive({
    name: '',
  });

  // 查询
  const search = async (callback) => {
    callback(formValue.name);
  }

  return {
    formValue,
    search,
  }
}