import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    redirect: { name: 'Articles' },
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../layout/Layout.vue'),
    redirect: { name: 'ArticleList' },
    meta: { title: '文章管理' },
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: () => import('../views/articles/ArticleList.vue'),
        meta: { title: '文章列表' },
      },
      {
        path: 'article-category',
        name: 'ArticleCategory',
        component: () => import('../views/articles/ArticleCategory.vue'),
        meta: { title: '分类列表' },
      },
    ],
  },
  {
    path: '/media',
    name: 'Media',
    component: () => import('../layout/Layout.vue'),
    redirect: { name: 'ImageList' },
    meta: { title: '媒体管理' },
    children: [
      {
        path: 'image-list',
        name: 'ImageList',
        component: () => import('../views/media/ImageList.vue'),
        meta: { title: '图片列表' },
      },
      {
        path: 'audio-list',
        name: 'AudioList',
        component: () => import('../views/media/AudioList.vue'),
        meta: { title: '音频列表' },
      },
      {
        path: 'video-list',
        name: 'VideoList',
        component: () => import('../views/media/VideoList.vue'),
        meta: { title: '视频列表' },
      },
    ],
  },
  {
    path: '/404',
    name: 'PageNotFound',
    component: () => import('../views/404.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'PageNotFound' },
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;