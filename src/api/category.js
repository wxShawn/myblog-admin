import request from "./request";

const prefix = '/categories';
export default {
  // 创建分类
  create(name) {
    return request({
      method: 'post',
      url: `${prefix}`,
      data: { name },
    });
  },

  // 删除分类
  delete(id) {
    return request({
      method: 'delete',
      url: `${prefix}/${id}`,
    });
  },

  // 更新分类
  update(id, name) {
    return request({
      method: 'put',
      url: `${prefix}/${id}`,
      data: { name },
    });
  },

  // 查询单个分类
  findOne(id) {
    return request({
      method: 'get',
      url: `${prefix}/${id}`,
    });
  },

  // 查询所有分类
  findAll(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { page, pageSize, name },
    });
  },
}