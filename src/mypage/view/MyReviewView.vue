<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">내 리뷰 목록</h1>

    <!-- 로딩 상태 표시 -->
    <div v-if="mypageStore.isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="mypageStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ mypageStore.error }}
    </div>

    <!-- 리뷰 목록 -->
    <div v-else-if="mypageStore.reviews && mypageStore.reviews.length > 0" 
      class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div v-for="review in mypageStore.reviews" 
       :key="review.reviewNo" 
       class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 리뷰 이미지 -->
        <img :src="getReviewImage(review)" :alt="review.title" class="w-full h-48 object-cover">
        
        <div class="p-4">
          <!-- 리뷰 제목과 내용 -->
          <h3 class="text-lg font-semibold mb-2">{{ review.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ review.content }}</p>
          
          <!-- 평점과 날짜 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex">
                <span v-for="i in 5" :key="i" 
                      :class="i <= review.score ? 'text-yellow-400' : 'text-gray-300'">
                  ★
                </span>
              </div>
              <span class="ml-2">{{ review.score }}</span>
            </div>
            <span class="text-sm text-gray-500">
              {{ formatDate(review.writeAt) }}
            </span>
          </div>

          <!-- 여행지 정보 -->
          <div class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-600 flex items-center">
              <i class="fas fa-map-marker-alt mr-2"></i>
              {{ review.spotTitle || '여행지 정보 없음' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 리뷰가 없는 경우 -->
    <div v-if="!mypageStore.isLoading && (!mypageStore.reviews || mypageStore.reviews.length === 0)" 
     class="text-center py-8 text-gray-500">
  작성한 리뷰가 없습니다.
</div>
<!-- 페이지네이션 추가 -->
<div v-if="totalPages > 0" class="flex justify-center mt-4 sm:mt-6 gap-2">
      <!-- 이전 화살표 -->
      <button 
        v-if="currentPageGroup > 1" 
        @click="changePage((currentPageGroup - 1) * 5)"
        class="px-3 py-1 border rounded-md transition-colors text-sm text-gray-700 hover:bg-gray-50"
      >
        &lt;
      </button>

      <!-- 페이지 번호 -->
      <button 
        v-for="page in displayedPages" 
        :key="page"
        @click="changePage(page)"
        class="px-3 py-1 border rounded-md transition-colors text-sm"
        :class="currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-700 hover:bg-gray-50'"
      >
        {{ page }}
      </button>

      <!-- 다음 화살표 -->
      <button 
        v-if="currentPageGroup * 5 < totalPages"
        @click="changePage(currentPageGroup * 5 + 1)"
        class="px-3 py-1 border rounded-md transition-colors text-sm text-gray-700 hover:bg-gray-50"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMypageStore } from '@/mypage/myPageStore';
import { useAuthStore } from '@/Auth/components/auth';

const mypageStore = useMypageStore();
const authStore = useAuthStore();


const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getReviewImage = (review) => {
  return review.photoUrls && review.photoUrls.length > 0 
    ? review.photoUrls[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';
};

onMounted(async () => {
  if (authStore.userId) {
    await mypageStore.fetchUserReviews(authStore.userId, 1, sizePerPage);
    // 전체 페이지 수 계산
    totalPages.value = Math.ceil(mypageStore.totalCount / sizePerPage);
  }
});

// 페이지네이션 관련 상태 추가
const currentPage = ref(1);
const totalPages = ref(0);
const sizePerPage = 4; // 한 페이지당 보여줄 리뷰 수

// 현재 페이지 그룹 계산
const currentPageGroup = computed(() => Math.ceil(currentPage.value / 5));

// 화면에 표시할 페이지 번호 배열
const displayedPages = computed(() => {
  const start = (currentPageGroup.value - 1) * 5 + 1;
  const end = Math.min(currentPageGroup.value * 5, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 페이지 변경 함수
const changePage = async (page) => {
  try {
    currentPage.value = page;
    await mypageStore.fetchUserReviews(authStore.userId, page, sizePerPage);
  } catch (error) {
    console.error('페이지 변경 실패:', error);
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>