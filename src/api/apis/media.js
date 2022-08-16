import request from "../request";

const prefix = '/media';
export default {
  upload(fileList) {
    return request({
      headers: { "Content-Type": "multipart/form-data" },
      method: 'post',
      url: `${prefix}`,
      data: fileList,
    });
  },

  findAll(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { type: 'image', page, pageSize, name }
    });
  }
}