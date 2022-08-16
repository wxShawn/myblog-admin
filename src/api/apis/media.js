import request from "../request";

const prefix = '/media';
export default {
  findAll(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { type: 'image', page, pageSize, name }
    });
  }
}