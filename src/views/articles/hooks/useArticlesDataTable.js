import { h, onBeforeMount, reactive } from "vue"
import { NButton, NSwitch } from "naive-ui"


export default () => {
  // 表头
  const columns = [
    { title: '标题', key: 'title' },
    { title: '类别', key: 'category' },
    { title: '浏览量', key: 'pageviews' },
    { title: '创建时间', key: 'createdAt' },
    { title: '更新时间', key: 'updatedAt' },
    {
      title: '发布',
      key: 'publish',
      render(row) {
        return h(NSwitch, {
          value: row.isPublish,
          // NSwitch 值改变时触发的回调
          "onUpdate:value": (value) => {
            row.isPublish = value;
          }
        });
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return [
          h(NButton, {
            style: 'margin-right: 14px',
            type: 'info',
            size: 'small',
            onClick: () => console.log('click 编辑')
          }, { default:() => '编辑' }),
          h(NButton, {
            type: 'error',
            size: 'small',
            onClick: () => console.log('click 删除')
          }, { default:() => '删除' }),
        ];
      }
    }
  ];

  // 数据
  const data = reactive([
    { title: '文章1', category: '前端', pageviews: '10', createdAt: '2022-01-01', updatedAt: '2022-01-01', isPublish: false },
    { title: '文章2', category: '前端', pageviews: '999', createdAt: '2022-01-02', updatedAt: '2022-01-02', isPublish: false },
    { title: '文章3', category: '前端', pageviews: '360', createdAt: '2022-01-03', updatedAt: '2022-01-03', isPublish: true },
  ]);

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 100,
    showSizePicker: true,
    pageSizes: [{ label: '10/页', value: 10 }, { label: '20/页', value: 20 }, { label: '30/页', value: 30 }],
    // slot 分页前缀
    prefix() {
      return `共 ${pagination.itemCount} 篇文章`
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