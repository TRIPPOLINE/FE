<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen w-full">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col sm:flex-row items-center justify-between mb-6">
        <!-- 로고 섹션 -->
        <div class="flex items-center mb-4 sm:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 transform rotate-45">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
          <h1 class="text-3xl sm:text-5xl font-bold ml-2 text-[#2C3E50]">TRIPPOLINE</h1>
        </div>
        
        <!-- 회원가입/로그인 버튼 -->
        <div class="flex space-x-4">
          <router-link to="/user/join" class="login-button text-sm sm:text-base">회원가입</router-link>
          <router-link to="/user/login" class="login-button text-sm sm:text-base">로그인</router-link>
        </div>
      </div>
      
      <nav class="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-6">
        <router-link to="/plan" class="banner-button text-sm sm:text-base mb-2">여행 계획하기</router-link>
        <router-link to="/spot" class="banner-button text-sm sm:text-base mb-2">여행지 검색하기</router-link>
        <router-link to="/notice" class="banner-button text-sm sm:text-base mb-2">공지사항</router-link>
      </nav>

      <div class="relative h-[300px] sm:h-[600px]">
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <h2 class="text-white text-xl sm:text-3xl font-semibold p-2 rounded text-center">당신의 다음 여행을 계획하세요!</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>

<style scoped>
.banner-button {
  padding: 10px 20px;
  background-color: #4f46e5;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.banner-button:hover {
  background-color: #4338ca;
}

.login-button {
  padding: 8px 16px;
  border: 2px solid #4f46e5;
  color: #4f46e5;
  border-radius: 5px;
  transition: all 0.3s;
}

.login-button:hover {
  background-color: #4f46e5;
  color: white;
}
</style>