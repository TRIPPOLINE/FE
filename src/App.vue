<!-- src/App.vue -->
<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NavigationBar from '@/components/NavigationBar.vue'; 
import FooterBar from '@/components/FooterBar.vue';
import { onMounted } from 'vue'
const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  // 페이지 로드 시 인증 상태 초기화
  authStore.initializeAuth();
});
</script>

<template>
  <div class="min-w-[450px]">
    <!-- 네비게이션 바 -->
    <header >
      <NavigationBar />
    </header>

    <!-- 라우터 뷰 -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
    <FooterBar class="mt-auto" />
  </div>
</template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>