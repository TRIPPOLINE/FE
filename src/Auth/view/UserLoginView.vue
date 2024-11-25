<template>
  <div class="min-h-screen bg-gray-50 flex items-start justify-center pt-32 sm:px-20">
    <div class="max-w-xl w-full mx-auto">
      <!-- Logo Section -->
      <div class="text-center mb-10">
        <router-link to="/" class="flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-20 h-20 text-indigo-600 transform rotate-45">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </router-link>
      </div>

      <!-- Login Form -->
      <div class="bg-transparent shadow-none sm:rounded-xl sm:px-20">
        <form class="space-y-8" @submit.prevent="handleLogin">
          <!-- User ID Input -->
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

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-base font-medium text-gray-700 text-left">비밀번호</label>
            <div class="mt-2 relative">
    <input
      v-model="formData.password"
      :type="showPassword ? 'text' : 'password'"
      id="password"
      name="password"
      required
      class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
      placeholder="비밀번호를 입력하세요"
    >
    <button
      type="button"
      @click="togglePasswordVisibility"
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      <svg
        v-if="showPassword"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="w-5 h-5 text-gray-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="w-5 h-5 text-gray-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    </button>
  </div>
          </div>

          <!-- Remember Me Checkbox -->
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
              <router-link
                to="/user/password-reset"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                비밀번호를 잊으셨나요?
              </router-link>
            </div>
          </div>

          <!-- Login Button -->
          <div>
            <button
              type='submit'
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-offset-indigo focus:ring-offset-indigo'
            >
              로그인
            </button>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div className='mt'>
          <div className='relative'>
            <div className='relative flex justify-center text-base'>
              <span className='px bg-transparent text-gray'>
                계정이 없으신가요?
                <router-link to='/user/join' className='font-medium text-indigo hover:text-indigo'>
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
import { useAuthStore } from "@/Auth/components/auth";

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
    id: '',
    password: '',
    remember: false,
})

const showPassword = ref(false)

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    try {
        await authStore.login({
            userId: formData.value.id,
            password: formData.value.password,
            remember: formData.value.remember,
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
