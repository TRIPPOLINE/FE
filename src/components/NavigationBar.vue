<!-- src/components/NavigationBar.vue -->
<template>
    <div class="top-0 left-0 right-0 bg-white shadow-md z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col sm:flex-row items-center justify-between">
          <!-- 로고 섹션 -->
          <div class="flex items-center mb-2 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 transform rotate-45">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <h1 class="text-2xl sm:text-3xl font-bold ml-2 text-[#2C3E50]">TRIPPOLINE</h1>
          </div>
          
          <!-- 네비게이션 링크 -->
          <nav class="flex space-x-2 sm:space-x-4 mb-2 sm:mb-0">
            <router-link to="/spot" class="banner-button text-sm">여행지 검색하기</router-link>
            <router-link to="/notice" class="banner-button text-sm">공지사항</router-link>
          </nav>
          
          <!-- 회원가입/로그인 버튼 -->
          <div class="flex space-x-2">
            <router-link to="/user/join" class="login-button text-sm">회원가입</router-link>
            <router-link to="/user/login" class="login-button text-sm">로그인</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: 'NavigationBar'
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