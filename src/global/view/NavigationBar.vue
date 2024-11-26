<!-- src/components/NavigationBar.vue -->
<template>
  <div :class="['top-0 left-0 right-0 z-20', isHome ? 'absolute' : 'relative bg-white shadow-md']">
    <div class="container mx-auto px-4 py-1">
      <div class="flex flex-col sm:flex-row items-center justify-between">
        <!-- 로고 섹션 -->
        <router-link to="/" class="flex items-center mb-2 sm:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
               :class="['w-8 h-8 sm:w-10 sm:h-10 transform rotate-45', isHome ? 'text-white' : 'text-indigo-600']">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
          <h1 :class="['text-2xl sm:text-3xl font-bold ml-2', isHome ? 'text-white' : 'text-[#2C3E50]']">
            TRIPPOLINE
          </h1>
        </router-link>

        <!-- 네비게이션 링크 -->
        <nav class="flex space-x-2 sm:space-x-4 mb-2 sm:mb-0">
          <router-link 
            to="/spot" 
            :class="['banner-button text-sm', isHome ? 'text-white' : 'text-gray-600']"
            active-class="active-text-indigo">
            플랜 만들기
          </router-link>
          <router-link 
            to="/review" 
            :class="['banner-button text-sm', isHome ? 'text-white' : 'text-gray-600']"
            active-class="active-text-indigo">
            리뷰
          </router-link>
          <router-link 
            to="/notice" 
            :class="['banner-button text-sm', isHome ? 'text-white' : 'text-gray-600']"
            active-class="active-text-indigo">
            공지사항
          </router-link>
        </nav>

        <div class="flex space-x-2">
          <!-- 회원가입/로그인 -->
          <template v-if="!isLoggedIn">
            <router-link to="/user/join" :class="['login-button text-sm', isHome ? 'text-white border-white' : 'text-gray-600 border-gray-600']">
              회원가입
            </router-link>
            <router-link to="/user/login" :class="['login-button text-sm', isHome ? 'text-white border-white' : 'text-gray-600 border-gray-600']">
              로그인
            </router-link>
          </template>
          <!-- 마이페이지/로그아웃 -->
          <template v-else>
            <router-link to="/user/mypage" :class="['login-button text-sm', isHome ? 'text-white border-white' : 'text-gray-600 border-gray-600']">
              마이페이지
            </router-link>
            <button @click="handleLogout" :class="['login-button text-sm', isHome ? 'text-white border-white' : 'text-gray-600 border-gray-600']">
              로그아웃
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed } from 'vue'
import { useAuthStore } from "@/Auth/components/auth";
//
export default {
  name: 'NavigationBar',
  computed: {
    isHome() {
      return this.$route.path === '/';
    }
  },
  setup() {
    const authStore = useAuthStore()

    const isLoggedIn = computed(() => authStore.isAuthenticated)

    // const isLoggedIn = computed(() => {
    //   return localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')
    // })

    const handleLogout = () => {
      authStore.logout()
      // 필요한 경우 로그아웃 후 홈으로 리다이렉트
      window.location.href = '/'
    }

    return {
      isLoggedIn,
      handleLogout
    }
  }
};
</script>

<style scoped>
.banner-button {
  padding: 10px 20px;
  font-size: 1rem; /* 글자 크기 키움 (16px) */
  background-color: transparent;
  border-radius: 5px; /* 기본 둥근 모서리 */
  transition: all 0.3s ease-in-out;
}

.banner-button:hover {
  background-color: rgba(156, 163, 175, 0.5); /* hover 색상 진하게 */
  border-radius: 20px; /* hover 상태에서 더 둥글게 */
}

.active-text-indigo {
  color: #6366F1; /* indigo 색상 */
  font-weight: bold; /* 활성화된 링크를 강조 */
}

.login-button {
  padding: 8px 16px;
  font-size: 1rem; /* 글자 크기 키움 (16px) */
  font-weight: bold; /* 글자 굵게 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 기본 둥근 모서리 */
  transition: all 0.3s ease-in-out;
  background-color: transparent;
}

.login-button:hover {
  background-color: rgba(156, 163, 175, 0.5); /* hover 색상 진하게 */
  border-radius: 20px; /* hover 상태에서 더 둥글게 */
}
</style>





