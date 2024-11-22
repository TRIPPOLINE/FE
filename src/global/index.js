import { createRouter, createWebHistory } from 'vue-router'
import NoticeView from '@/views/notice/NoticeView.vue'
import SearchView from '@/views/SearchView.vue' 
import HomeView from '@/views/HomeView.vue'  
import UserJoinView from '@/views/UserJoinView.vue'
import UserLoginView from '@/views/UserLoginView.vue'
import NoticeWriteView from '../views/notice/NoticeWriteView.vue'
import PlanView from '@/views/PlanView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/notice',
      name: 'NoticeList',
      component: NoticeView
    },
    {
      path: '/notice/write',
      name: 'NoticeWrite',
      component: NoticeWriteView,
      meta: { requiresAuth: true }
    },
    {
      path: '/notice/:noticeNo',
      name: 'NoticeDetail',
      component: () => import('@/views/notice/NoticeDetailView.vue'),
      props: true
    },
    {
      path: '/notice/modify/:noticeNo',
      name: 'NoticeModify',
      component: NoticeWriteView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/spot',
      name: 'spot',
      component: SearchView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/join',
      name: 'userJoin',
      component: UserJoinView
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: UserLoginView
    },
    {
      path: '/plan/:planId',
      name: 'PlanView',
      component: PlanView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'SearchView',
      component: SearchView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'userLogin' });
  } else {
    next();
  }
})

export default router