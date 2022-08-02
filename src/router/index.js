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
    component: () => import('../layout/Layout.vue'),
    redirect: { name: 'ArticleList' },
    children: [
      {
        path: '/article-list',
        name: 'ArticleList',
        component: () => import('../views/articles/ArticleList.vue'),
      },
      {
        path: '/article-category',
        name: 'ArticleCategory',
        component: () => import('../views/articles/ArticleCategory.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;