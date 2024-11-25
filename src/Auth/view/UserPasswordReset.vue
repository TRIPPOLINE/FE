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

      <!-- 비밀번호 재설정 폼 -->
      <div class="bg-transparent shadow-none sm:rounded-xl sm:px-20">
        <form class="space-y-8" @submit.prevent="handlePasswordReset">
          <!-- 아이디 입력 -->
          <div>
            <label for="userId" class="block text-base font-medium text-gray-700">아이디</label>
            <div class="mt-2">
              <input
                v-model="formData.userId"
                id="userId"
                name="userId"
                type="text"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                placeholder="아이디를 입력하세요"
              >
            </div>
          </div>

          <!-- 이름 입력 -->
          <div>
            <label for="userName" class="block text-base font-medium text-gray-700">이름</label>
            <div class="mt-2">
              <input
                v-model="formData.userName"
                id="userName"
                name="userName"
                type="text"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                placeholder="이름을 입력하세요"
              >
            </div>
          </div>

          <!-- 이메일 입력 -->
          <div>
            <label for="email" class="block text-base font-medium text-gray-700">이메일</label>
            <div class="mt-2">
              <input
                v-model="formData.email"
                id="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                placeholder="이메일을 입력하세요"
              >
            </div>
          </div>

          <!-- 비밀번호 재설정 버튼 -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              비밀번호 재설정
            </button>
          </div>
        </form>

        <!-- 임시 비밀번호 표시 -->
        <div v-if="temporaryPassword" class="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center space-x-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">임시 비밀번호가 생성되었습니다</h3>
          </div>
          <div class="bg-gray-50 p-4 rounded-md mb-4">
            <p class="text-lg font-mono text-gray-700">{{ temporaryPassword }}</p>
          </div>
          <p class="text-sm text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            보안을 위해 로그인 후 반드시 비밀번호를 변경해주세요.
          </p>
        </div>

        <!-- 로그인 링크 -->
        <div class="mt-8">
          <div class="relative">
            <div class="relative flex justify-center text-base">
              <span class="px-2 bg-transparent text-gray-500">
                로그인 페이지로 돌아가기
                <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                  로그인
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
import axios from 'axios'

const formData = ref({
  userId: '',
  userName: '',
  email: ''
})

const temporaryPassword = ref('')

const handlePasswordReset = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/user/password/reset', formData.value)
    temporaryPassword.value = response.data.temporaryPassword
    alert(response.data.message)
  } catch (error) {
    alert(error.response?.data?.error || '임시 비밀번호 생성에 실패했습니다.')
  }
}
</script>

<style scoped>
html, body {
  overflow: hidden;
}
</style>
