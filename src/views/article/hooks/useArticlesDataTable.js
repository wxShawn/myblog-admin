import { h, onBeforeMount, reactive, ref } from "vue";
import { NButton, NSwitch } from "naive-ui";
import api from '../../../api';

export default () => {

  /**
   * ********** 表格本体 **********
   */

  // 表格结构
  const columns = [
    { title: '#', key: 'index' },
    { title: '标题', key: 'title' },
    { title: '分类', key: 'category' },
    // { title: '浏览量', key: 'pageviews' },
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
            action.publish(row.id, value);
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
            onClick: () => action.edit(row.id)
          }, { default:() => '编辑' }),
          h(NButton, {
            ghost: true,
            type: 'error',
            size: 'small',
            onClick: () => action.delete(row.id)
          }, { default:() => '删除' }),
        ];
      }
    }
  ];

  // 表格数据
  const articleData = reactive([]);

  // 表格加载状态
  const loading = ref(false);

  // 表格操作事件，暴露给外部使用
  const action = reactive({
    publish: (id, value) => console.log('publish changed', { id, value }),
    edit: (id) => console.log('click edit', { id }),
    delete: (id) => console.log('click delete', { id }),
  });

  // 删除文章
  const deleteArticle = async (id) => {
    return await api.article.delete(id);
  }

  // 更新文章发布状态
  const updatePublishState = async (id, value) => {
    return await api.article.updatePublishState(id, value);
  }

  // 获取数据
  const getData = async (title, categoryId) => {
    if (!loading.value) {
      loading.value = true;
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
            // pageviews: 99,
            createdAt,
            updatedAt,
            isPublish: rows[i].isPublish,
          });
        }
      }
      loading.value = false;
    }
  }

  // 组件挂在前执行
  onBeforeMount(() => {
    getData();
  });

  /**
   * ********** 分页 **********
   */
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

  // 分页事件，暴露给外部使用
  const paginationAction = reactive({
    change() {},
  });



  return {
    columns,            // 表格结构
    articleData,        // 文章数据
    pagination,         // 分页
    getData,            // 获取文章数据
    deleteArticle,      // 删除文章
    updatePublishState, // 更新文章发布状态
    loading,            // 表格是否处于加载状态
    action,             // 表格事件
    paginationAction,   // 分页事件
  }
}