import request from "../request";

const prefix = '/articles';
export default {
  // 创建文章
  create(title, content, categoryId) {
    return request({
      method: 'post',
      url: `${prefix}`,
      data: { title, content, categoryId },
    });
  },

  // 删除文章
  delete(id) {
    return request({
      method: 'delete',
      url: `${prefix}/${id}`,
    });
  },

  // 更新文章
  update(id, title, content, categoryId) {
    return request({
      method: 'put',
      url: `${prefix}/${id}`,
      data: { title, content, categoryId },
    });
  },

  // 更新文章发布状态
  updatePublishState(id, isPublish) {
    return request({
      method: 'patch',
      url: `${prefix}/${id}/isPublish`,
      data: { isPublish }
    });
  },

  // 查询一个文章，根据id查询
  findOne(id) {
    return request({
      method: 'get',
      url: `${prefix}/${id}`,
    });
  },

  // 查询所有文章，title模糊查询
  findAll(page, pageSize, title, categoryId) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { page, pageSize, title, categoryId },
    });
  },
}