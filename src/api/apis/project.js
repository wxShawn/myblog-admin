import request from '../request';

const prefix = '/projects';
export default {
  async create(name, content, url, cover) {
    return request({
      method: 'post',
      url: `${prefix}`,
      data: { name, content, url, cover }
    });
  },

  async delete(id) {
    return request({
      method: 'delete',
      url: `${prefix}/${id}`,
    });
  },

  async update(id, name, content, url, cover) {
    return request({
      method: 'put',
      url: `${prefix}/${id}`,
      data: { name, content, url, cover }
    });
  },

  async updatePublish(id, isPublish) {
    return request({
      method: 'patch',
      url: `${prefix}/${id}/isPublish`,
      data: { isPublish },
    });
  },

  async findAll(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { page, pageSize, name, includeUnpublished: true }
    });
  },
}