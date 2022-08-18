import request from "../request";

const prefix = '/media';
export default {
  upload(fileList, onUploadCallback) {
    return request({
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: progressEvent => { onUploadCallback(progressEvent) },
      method: 'post',
      url: `${prefix}`,
      data: fileList,
    });
  },

  delete(id) {
    return request({
      method: 'delete',
      url: `${prefix}/${id}`,
    });
  },

  update(id, name) {
    return request({
      method: 'put',
      url: `${prefix}/${id}`,
      data: { name },
    });
  },

  findAllImage(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { type: 'image', page, pageSize, name }
    });
  },

  findAllAudio(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { type: 'audio', page, pageSize, name }
    });
  },

  findAllVideo(page, pageSize, name) {
    return request({
      method: 'get',
      url: `${prefix}`,
      params: { type: 'video', page, pageSize, name }
    });
  },
}