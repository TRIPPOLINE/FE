import { createRouter, createWebHistory } from 'vue-router'


import NoticeView from "@/notice/view/NoticeView.vue"
import SearchView from "@/plan/view/SearchView.vue"
import HomeView from "@/global/view/HomeView.vue"
import UserJoinView from "@/Auth/view/UserJoinView.vue"
import UserLoginView from "@/Auth/view/UserLoginView.vue"
import NoticeWriteView from "@/notice/view/NoticeWriteView.vue"
import PlanView from "@/plan/view/PlanView.vue"
import ReviewView from "@/review/view/ReviewView.vue"
import MyPageView from "@/mypage/view/MyPageView.vue"
import ReviewWrite from "@/review/view/ReviewWrite.vue"
import UserPasswordReset from "@/Auth/view/UserPasswordReset.vue"

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
      props: true,
      meta: { requiresAuth: true } //페이지 이동 전 beforeEach에서 meta 확인 하고 로그인 안되어 있으면 로그인 페이지로 이동
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
      component: PlanView
    },
    {
      path: '/review',
      name: 'ReviewList',
      component: ReviewView
    },
    {
      path: '/review/write',
      name: 'ReviewWrite',
      component: ReviewWrite
    },
    {
      path: '/search',
      name: 'SearchView',
      component: SearchView
    },
    // 마이페이지
    {
      path: '/user/mypage',
      name: 'MyPage',
      component: MyPageView
    },

    {
      path: '/user/password-reset',
      name: 'UserPasswordReset',
      component: UserPasswordReset
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
});


export default router
