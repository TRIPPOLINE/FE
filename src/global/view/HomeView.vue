<!-- src/views/HomeView.vue -->
<template>
  <div class="relative h-screen">
    <!-- 배경 이미지 섹션 -->
    <div class="absolute inset-0">
      <img 
        src="@/assets/back.jpg" 
        alt="Paris Background"
        class="w-full h-full object-cover opacity-60"
      />
      <!-- 어두운 오버레이 -->
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>

    <!-- 텍스트 콘텐츠 -->
    <div class="absolute inset-0 flex flex-col justify-center pl-16 sm:pl-32">
      <div class="text-white flex flex-col items-start text-slide-in">
        <p class="text-lg sm:text-xl font-light tracking-wider mb-2">
          Fall into Trip.
        </p>
        <h2 class="text-4xl sm:text-6xl font-bold">
          TRIPPOLINE
        </h2>
      </div>
    </div>
    
  </div>
</template>

<script>
import NavigationBar from "@/global/view/NavigationBar.vue";
export default {
  name: 'HomeView',
  components: {
    NavigationBar
  }
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px);  
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-slide-in p {
  animation: slideIn 1s ease-out forwards;
}

.text-slide-in h2 {
  animation: slideIn 1s ease-out 0.5s forwards;
  opacity: 0;
}

/* 기존 스타일 유지 */
.banner-button {
  padding: 10px 20px;
  background-color: transparent;
  color: white;
  border-radius: 5px;
  transition: all 0.3s;
}

.banner-button:hover {
  background-color: rgba(79, 70, 229, 0.1);
}

.login-button {
  padding: 8px 16px;
  border: 2px solid white;
  color: white;
  border-radius: 5px;
  transition: all 0.3s;
  background-color: transparent;
}

.login-button:hover {
  background-color: rgba(79, 70, 229, 0.1);
  border-color: #4f46e5;
  color: #4f46e5;
}
</style>