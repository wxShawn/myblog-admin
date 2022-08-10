import { reactive, h } from "vue";
import { NButton } from "naive-ui";

export default () => {
  const columns = [
    { title: '分类名称', key: 'name' },
    { title: '文章数量', key: 'articleCount' },
    { title: '创建时间', key: 'createdAt' },
    { title: '更新时间', key: 'updatedAt' },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return [
          h(NButton, {
            ghost: true,
            style: 'margin-right: 12px',
            type: 'info',
            size: 'small',
            onClick: () => console.log('click 编辑')
          }, { default:() => '编辑' }),
          h(NButton, {
            ghost: true,
            type: 'error',
            size: 'small',
            onClick: () => console.log('click 删除')
          }, { default:() => '删除' }),
        ];
      }
    }
  ];
  
  const data = [
    { name: '前端', articleCount: 10, createdAt: '2022-01-01', updatedAt: '2022-01-01' },
    { name: '服务端', articleCount: 5, createdAt: '2022-01-01', updatedAt: '2022-01-01' },
    { name: '数据库', articleCount: 3, createdAt: '2022-01-01', updatedAt: '2022-01-01' },
  ];

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 10,
    showSizePicker: true,
    pageSizes: [{ label: '10/页', value: 10 }, { label: '20/页', value: 20 }, { label: '30/页', value: 30 }],
    prefix() {
      return `共 ${pagination.itemCount} 个分类`
    },
    // 切换页时触发
    onChange(page) {
      pagination.page = page;
    },
    // 更改分页大小时触发
    onUpdatePageSize(pageSize) {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    }
  });

  return {
    columns,
    data,
    pagination,
  }
}