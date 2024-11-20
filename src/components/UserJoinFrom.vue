<!-- src/components/UserJoinFrom.vue -->
<template>
    <form @submit.prevent="handleSubmit" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="id">아이디</label>
        <input 
          v-model="formData.id"
          type="text"
          id="id"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          required
        >
      </div>
  
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">비밀번호</label>
        <input 
          v-model="formData.password"
          type="password"
          id="password"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          required
        >
      </div>
  
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">이름</label>
        <input 
          v-model="formData.name"
          type="text"
          id="name"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          required
        >
      </div>
  
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">이메일</label>
        <input 
          v-model="formData.email"
          type="email"
          id="email"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          required
        >
      </div>
  
      <button 
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        회원가입
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  const formData = ref({
    id: '',
    password: '',
    name: '',
    email: ''
  })
  
  const handleSubmit = async () => {
    try {
      await userStore.register(formData.value)
      router.push('/user/login')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }
  </script>