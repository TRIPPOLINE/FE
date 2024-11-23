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

      <!-- 회원가입 폼 -->
      <div class="bg-transparent shadow-none sm:rounded-xl sm:px-20">
        <form class="space-y-8" @submit.prevent="handleSubmit">
          <!-- 아이디 입력 -->
          <div>
            <label for="id" class="block text-base font-medium text-gray-700">아이디</label>
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
              <p v-if="errors.id" class="mt-2 text-sm text-red-600">{{ errors.id }}</p>
            </div>
          </div>

          <!-- 비밀번호 입력 -->
          <div>
            <label for="password" class="block text-base font-medium text-gray-700">비밀번호</label>
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
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <!-- 이름 입력 -->
          <div>
            <label for="name" class="block text-base font-medium text-gray-700">이름</label>
            <div class="mt-2">
              <input
                v-model="formData.name"
                id="name"
                name="name"
                type="text"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                placeholder="이름을 입력하세요"
              >
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
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
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <!-- 회원가입 버튼 -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="!isFormValid"
            >
              회원가입
            </button>
          </div>
        </form>

        <!-- 로그인 링크 -->
        <div class="mt-8">
          <div class="relative">
            <div class="relative flex justify-center text-base">
              <span class="px-2 bg-transparent text-gray-500">
                이미 계정이 있으신가요?
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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const formData = ref({
  id: '',
  password: '',
  name: '',
  email: ''
});

const errors = ref({
  id: '',
  password: '',
  name: '',
  email: ''
});

const validateField = (field) => {
  errors.value[field] = '';

  switch (field) {
    case 'id':
      if (formData.value.id.length < 4) {
        errors.value.id = '아이디는 4자 이상이어야 합니다.';
      }
      break;
    case 'password':
      const passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.value.password)) {
        errors.value.password = '비밀번호는 영문자와 숫자를 포함하여 8자 이상이어야 합니다.';
      }
      break;
    case 'name':
      const nameRegex = /^[가-힣a-zA-Z]+$/;
      if (!nameRegex.test(formData.value.name)) {
        errors.value.name = '이름은 한글 또는 영문만 사용 가능합니다.';
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      if (!emailRegex.test(formData.value.email)) {
        errors.value.email = '유효한 이메일 주소를 입력해주세요.';
      }
      break;
  }
};

watch(() => formData.value.id, () => validateField('id'));
watch(() => formData.value.password, () => validateField('password'));
watch(() => formData.value.name, () => validateField('name'));
watch(() => formData.value.email, () => validateField('email'));

const isFormValid = computed(() => {
  return Object.values(errors.value).every(error => error === '') &&
         Object.values(formData.value).every(value => value !== '');
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/user/join', formData.value);
    if (response.status === 201) {
      alert('회원가입이 완료되었습니다.');
      router.push('/login');
    }
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
};
</script>


<style scoped>
html, body {
  overflow: hidden;
}
</style>