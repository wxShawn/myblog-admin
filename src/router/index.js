import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '../layout/Layout.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    redirect: { name: 'Article' },
  },
  {
    path: '/article',
    name: 'Article',
    component: Layout,
    redirect: { name: 'ArticleList' },
    meta: { title: '文章管理' },
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: () => import('../views/article/ArticleList.vue'),
        meta: { title: '文章列表' },
        children: [
          {
            path: 'create-article',
            name: 'CreateArticle',
            component: () => import('../views/article/CreateArticle.vue'),
            meta: { title: '创建文章' },
          },
          {
            path: 'update-article',
            name: 'UpdateArticle',
            component: () => import('../views/article/UpdateArticle.vue'),
            meta: { title: '编辑文章' },
          },
        ]
      },
      {
        path: 'article-category',
        name: 'ArticleCategory',
        component: () => import('../views/article/ArticleCategory.vue'),
        meta: { title: '分类列表' },
      },
      
    ],
  },
  {
    path: '/media',
    name: 'Media',
    component: Layout,
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
      {
        path: 'sync-media-file',
        name: 'SyncMediaFile',
        component: () => import('../views/media/SyncMediaFile.vue'),
        meta: { title: '同步文件' },
      },
    ],
  },
  {
    path: '/project',
    name: 'Project',
    component: Layout,
    meta: { title: '项目Demo' },
    redirect: { name: 'ProjectList' },
    children: [
      {
        path: 'priject-list',
        name: 'ProjectList',
        component: () => import('../views/project/ProjectList.vue'),
        meta: { title: '项目列表' },
      }
    ]
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
});

// 导航守卫
router.beforeEach((to, from) => {
  // 检查 json web token 是否存在，否则跳转到 Login 页面
  const jwt = sessionStorage.getItem('jwt');
  if (!(to.name === 'Login' || to.name === 'Register') && !jwt) {
    return {name: 'Login'};
  }
});

export default router;