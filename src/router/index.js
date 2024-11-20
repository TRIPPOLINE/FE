import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NoticeView from '@/views/notice/NoticeView.vue'
import SearchView from '@/views/SearchView.vue'  
import UserJoinView from '@/views/UserJoinView.vue'
import UserLoginView from '@/views/UserLoginView.vue'
import NoticeWriteView from '../views/notice/NoticeWriteView.vue'

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
      component: NoticeWriteView
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
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
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
    }
  ]
})

export default router