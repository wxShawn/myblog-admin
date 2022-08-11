import { h, onBeforeMount, reactive, ref } from "vue";
import { NButton, NSwitch } from "naive-ui";
import router from '../../../router';
import api from '../../../api';

export default (nMessage) => {
  // 表头
  const columns = [
    { title: '#', key: 'index' },
    { title: '标题', key: 'title' },
    { title: '分类', key: 'category' },
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
          "onUpdate:value": async (value) => {
            row.isPublish = value;
            const data = await api.article.updatePublishState(row.id, value);
            if (data.code === 0) {
              nMessage.success(data.msg);
            }
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
            ghost: true,
            style: 'margin-right: 12px',
            type: 'info',
            size: 'small',
            onClick: () => {
              router.push({
                name: 'UpdateArticle',
                query: { id: row.id }
              });
            }
          }, { default:() => '编辑' }),
          h(NButton, {
            ghost: true,
            type: 'error',
            size: 'small',
            onClick: async () => {
              const data = await api.article.delete(row.id);
              if (data.code === 0) {
                nMessage.success(data.msg);
              }
            }
          }, { default:() => '删除' }),
        ];
      }
    }
  ];

  // 数据
  const articleData = reactive([]);

  const loading = ref(false);

  // 分页事件，暴露给外部使用
  const paginationAction = reactive({
    change() {},
  });

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
      paginationAction.change();
    },
    // 更改分页大小时触发
    onUpdatePageSize(pageSize) {
      pagination.pageSize = pageSize;
      pagination.page = 1;
      paginationAction.change();
    }
  });

  // 获取数据
  const getData = async (title, categoryId) => {
    const { page, pageSize } = pagination;
    const data = await api.article.findAll(page, pageSize, title, categoryId);
    if (data.code === 0) {
      const { count, rows } = data.result;
      pagination.itemCount = count;
      articleData.length = 0;
      for (let i = 0, len = rows.length; i < len; i++) {
        const createdAt = new Date(rows[i].createdAt).toLocaleString();
        const updatedAt = new Date(rows[i].updatedAt).toLocaleString();
        articleData.push({
          index: (page - 1) * pageSize + i + 1, 
          id: rows[i].id,
          title: rows[i].title,
          category: rows[i].blog_category.name,
          pageviews: 99,
          createdAt,
          updatedAt,
          isPublish: rows[i].isPublish,
        });
      }
    }
  }

  onBeforeMount(() => {
    getData();
  });

  return {
    columns,
    articleData,
    pagination,
    getData,
    paginationAction,
    loading,
  }
}