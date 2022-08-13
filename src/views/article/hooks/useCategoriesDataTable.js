import { reactive, ref, h, onBeforeMount } from "vue";
import { NButton } from "naive-ui";
import api from "../../../api";

export default () => {
  const columns = [
    { title: '#', key: 'index' },
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
            onClick: () => action.edit(row.id, row.name)
          }, { default:() => '编辑' }),
          h(NButton, {
            ghost: true,
            type: 'error',
            size: 'small',
            disabled: row.articleCount != 0,
            onClick: () => action.delete(row.id)
          }, { default:() => '删除' }),
        ];
      }
    }
  ];

  // 列表事件
  const action = {
    edit: (id, name) => console.log('click edit', { id, name }),
    delete: (id) => console.log('click delete', { id }),
  }
  
  // 分类列表数据
  const categoryData = reactive([]);

  // 文章总数
  const articleTotalCount = ref(0);
  
  // 列表加载状态
  const loading = ref(false);

  // 更新分类
  const updateCategory = async (id, name) => {
    return await api.category.update(id, name);
  }

  // 删除分类
  const deleteCategory = async (id) => {
    return await api.category.delete(id);
  }

  // 获取文章数据
  const getData = async (title) => {
    if (!loading.value) {
      loading.value = true;
      const { page, pageSize } = pagination;
      const data = await api.category.findAll(page, pageSize, title);
      if (data.code === 0) {
        const { count, rows } = data.result;
        pagination.itemCount = count; // 给分页总数赋值
        categoryData.length = 0; // 分类列表数据清零
        articleTotalCount.value = 0; // 文章总数清零
        for (let i = 0, len = rows.length; i < len; i++) {
          articleTotalCount.value += rows[i].blog_articles.length; // 文章总数
          const createdAt = new Date(rows[i].createdAt).toLocaleString();
          const updatedAt = new Date(rows[i].updatedAt).toLocaleString();
          categoryData.push({
            index: (page - 1) * pageSize + i + 1, 
            id: rows[i].id,
            name: rows[i].name,
            articleCount: rows[i].blog_articles.length,
            createdAt,
            updatedAt,
          });
        }
      }
      loading.value = false;
    }
  }

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
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [{ label: '10/页', value: 10 }, { label: '20/页', value: 20 }, { label: '30/页', value: 30 }],
    prefix() {
      return `共 ${pagination.itemCount} 个分类, 包含${articleTotalCount.value} 篇文章`;
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
    columns,
    categoryData,
    pagination,
    getData,
    updateCategory,
    deleteCategory,
    action,
    paginationAction,
    loading,
  }
}