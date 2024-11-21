<template>
  <div class="min-h-screen bg-gray-50 flex items-start justify-center pt-32 sm:px-20">
    <div class="max-w-xl w-full mx-auto">
      <!-- 로고 섹션 -->
      <div class="text-center mb-10">
        <router-link to="/" class="flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-20 h-20 text-indigo-600 transform rotate-45">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </router-link>
      </div>

           <!-- 로그인 폼 -->
           <div class="bg-transparent shadow-none sm:rounded-xl sm:px-20">
        <form class="space-y-8" @submit.prevent="handleLogin">
          <!-- 아이디 입력 -->
          <div>
            <label for="id" class="block text-base font-medium text-gray-700 text-left">아이디</label>
            <div class="mt-2">
              <input 
                v-model="formData.id" 
                id="id" 
                name="id" 
                type="text" 
                required 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                placeholder="아이디를 입력하세요"
              >
            </div>
          </div>

          <!-- 비밀번호 입력 -->
          <div>
            <label for="password" class="block text-base font-medium text-gray-700 text-left">비밀번호</label>
            <div class="mt-2">
              <input 
                v-model="formData.password" 
                id="password" 
                name="password" 
                type="password" 
                required 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                placeholder="비밀번호를 입력하세요"
              >
            </div>
          </div>

          <!-- 로그인 유지 체크박스 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                v-model="formData.remember" 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-3 block text-base text-gray-900">
                로그인 유지
              </label>
            </div>

            <div class="text-base">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </div>

          <!-- 로그인 버튼 -->
          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          </div>
        </form>

        <!-- 회원가입 링크 -->
        <div class="mt-8">
          <div class="relative">
            <div class="relative flex justify-center text-base">
              <span class="px-2 bg-transparent text-gray-500">
                계정이 없으신가요? 
                <router-link to="/user/join" class="font-medium text-indigo-600 hover:text-indigo-500">
                  회원가입
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  id: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  try {
    await userStore.login({
      id: formData.value.id,
      password: formData.value.password
    })
    router.push('/')
  } catch (error) {
    console.error('로그인 실패:', error)
    alert('아이디 또는 비밀번호가 올바르지 않습니다.')
  }
}
</script>

<style scoped>
html, body {
    overflow: hidden;
}
</style>