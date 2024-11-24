<!-- src/App.vue -->
<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from "@/Auth/components/auth";
import NavigationBar from "@/global/view/NavigationBar.vue";
import FooterBar from "@/global/view/FooterBar.vue";
import { onMounted, computed } from 'vue';

const route = useRoute();
const authStore = useAuthStore();
const isHomePage = computed(() => route.path === '/');

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <div class="min-w-[450px] flex flex-col min-h-screen">
    <!-- 네비게이션 바 -->
    <header :class="[
      'w-full z-50 bg-white',
      isHomePage ? 'absolute' : 'sticky top-0'
    ]">
      <NavigationBar />
    </header>

    <!-- 라우터 뷰 -->
    <main class="flex-1">
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
