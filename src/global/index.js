import { createRouter, createWebHistory } from 'vue-router'

import NoticeView from "@/notice/view/NoticeView.vue"
import SearchView from "@/plan/view/SearchView.vue"
import HomeView from "@/global/view/HomeView.vue"
import UserJoinView from "@/Auth/view/UserJoinView.vue"
import UserLoginView from "@/Auth/view/UserLoginView.vue"
import NoticeWriteView from "@/notice/view/NoticeWriteView.vue"
import PlanView from "@/plan/view/PlanView.vue"
import ReviewView from "@/review/view/ReviewView.vue"

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
      component: () => import('@/notice/view/NoticeDetailView.vue'),
      props: true
    },
    {
      path: '/notice/modify/:noticeNo',
      name: 'NoticeModify',
      component: NoticeWriteView,
      props: true
    },
    {
      path: '/spot',
      name: 'spot',
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
    },
    {
      path: '/plan/:planId',
      name: 'PlanView',
      component: PlanView,
      props: true
    },
    {
      path: '/search',
      name: 'SearchView',
      component: SearchView
    },
    {
      path: '/plan/:planId',
      name: 'PlanView',
      component: PlanView
    },
    {
      path: '/review',
      name: 'ReviewList',
      component: ReviewView
      
    },
  ]
})


export default router