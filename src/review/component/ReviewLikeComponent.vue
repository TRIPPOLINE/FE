<template>
  <button @click="toggleLike" class="focus:outline-none relative">
    <svg class="w-6 h-6 transition-colors duration-300 ease-in-out"
         :class="[
           isLiked ? 'text-red-500' : 'text-gray-400',
           { 'animate-heart-burst': showAnimation }
         ]"
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <span class="text-sm font-medium ml-1">{{ likeCount }}</span>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from "@/Auth/api/AuthIndex";

const props = defineProps({
  reviewNo: Number,
  initialLikeCount: Number,
  initialIsLiked: Boolean,
  userId: String,
});

const likeCount = ref(props.initialLikeCount);
const isLiked = ref(props.initialIsLiked);
const showAnimation = ref(false);

watch(() => props.initialLikeCount, (newValue) => {
  likeCount.value = newValue;
});

watch(() => props.initialIsLiked, (newValue) => {
  isLiked.value = newValue;
});

const toggleLike = async () => {
  try {
    const response = await api.post('/review/like', {
      reviewNo: props.reviewNo,
      userId: props.userId,
    });
    likeCount.value = response.data.likeCount;
    isLiked.value = response.data.isLiked;
    showAnimation.value = true;
    setTimeout(() => {
      showAnimation.value = false;
    }, 300); // 애니메이션 지속 시간
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
  }
};
</script>

<style scoped>
@keyframes heart-burst {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.animate-heart-burst {
  animation: heart-burst 0.3s ease-in-out;
}
</style>
