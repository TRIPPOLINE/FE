<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 검색 및 정렬 옵션 -->
    <div class="mb-8 flex flex-wrap justify-between items-center">
      <div class="flex flex-wrap space-x-2 space-y-2 md:space-y-0">
          <input v-model="searchKeyword" placeholder="검색어 입력" class="border p-2 rounded">
          <select v-model="searchType" class="border p-2 rounded">
            <option value="all">제목과 내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <button @click="searchReviews" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">검색</button>
        </div>
      <div class="flex border-b">
        <button
          @click="changeSortBy('likes')"
          class="px-6 py-2 font-medium transition-all duration-200"
          :class="sortBy === 'likes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          트렌딩
        </button>
        <button
          @click="changeSortBy('latest')"
          class="px-6 py-2 font-medium transition-all duration-200"
          :class="sortBy === 'latest' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          최신
        </button>
      </div>

    </div>

    <!-- 리뷰 그리드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="review in reviews" :key="review.reviewNo" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 리뷰 이미지 -->
        <img :src="getReviewImage(review)" :alt="review.title" class="w-full h-64 object-cover">
        <!-- 리뷰 정보 -->
        <div class="p-4">
          <div class="flex items-center mb-4">
            <img :src="getUserAvatar(review.userName)" alt="User Avatar" class="w-10 h-10 rounded-full mr-3">
            <div>
              <span class="font-bold">{{ review.userName }}</span>
              <p class="text-gray-500 text-sm">{{ formatDate(review.writeAt) }}</p>
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ review.title }}</h3>
          <div class="flex items-center justify-between mb-4">
            <StarRating :score="review.score" />
            <div class="flex items-center space-x-4">
              <LikeButton :reviewNo="review.reviewNo" :initialLikeCount="review.likeCount" :initialIsLiked="review.isLiked" :userId="userId" />
              <button class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-comment"></i>
              </button>
              <button class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-share"></i>
              </button>
            </div>
          </div>
          <button @click="openModal(review)" class="mt-2 text-blue-500 hover:underline flex items-center">
            <i class="fas fa-map-marker-alt mr-2"></i> {{ review.spotTitle || '' }} 리뷰 보기
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 표시기 -->
    <div v-if="isLoading" class="text-center mt-4">
      로딩 중...
    </div>

    <!-- 리뷰 작성 버튼 -->
    <div class="fixed bottom-8 right-8">
      <button @click="goToReviewWrite" class="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center">
        <i class="fas fa-pen mr-2"></i> 리뷰 작성
      </button>
    </div>

    <!-- 모달 -->
    <Transition name="modal">
      <div v-if="selectedReview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out"
             :class="{ 'translate-y-0 opacity-100 scale-100': selectedReview, 'translate-y-full opacity-0 scale-95': !selectedReview }">
          <div class="p-6">
            <!-- 모달 내용 -->
            <div class="flex items-center mb-4">
              <img :src="getUserAvatar(selectedReview.userName)" alt="User Avatar" class="w-12 h-12 rounded-full mr-3">
              <div>
                <span class="font-bold text-lg">{{ selectedReview.userName }}</span>
                <p class="text-gray-500">{{ formatDate(selectedReview.writeAt) }}</p>
              </div>
            </div>

            <h2 class="text-2xl font-bold mb-4">{{ selectedReview.title }}</h2>
            <p class="mb-4">{{ selectedReview.content }}</p>
            <div class="flex items-center justify-between mb-4">
              <StarRating :score="selectedReview.score" />
              <LikeButton :reviewNo="selectedReview.reviewNo" :initialLikeCount="selectedReview.likeCount" :initialIsLiked="selectedReview.isLiked" :userId="userId" />
            </div>
            <div class="bg-gray-100 p-4 rounded mb-4">
              <h3 class="font-bold mb-2">스팟 정보</h3>
              <p class="flex items-center"><i class="fas fa-map-marker-alt mr-2 text-red-500"></i> {{ selectedReview.spotTitle }} </p>
              <p class="mt-2">{{ selectedReview.spotAddr1 }}</p>
            </div>
            <div v-if="selectedReview.photoUrls && selectedReview.photoUrls.length > 0"
                class="grid grid-cols-2 gap-4 mb-4">
              <img v-for="(photo, index) in selectedReview.photoUrls"
                  :key="index"
                  :src="photo"
                  :alt="selectedReview.title"
                  class="w-full h-48 object-cover rounded">
            </div>
            <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">닫기</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from "@/Auth/api/AuthIndex";
import LikeButton from '@/review/component/ReviewLikeComponent.vue';
import StarRating from '@/review/component/StarRatingComponent.vue';
import { useAuthStore } from '@/Auth/components/auth.js';

const router = useRouter();
const defaultImageUrl = 'https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg';
const reviews = ref([]);
const sortBy = ref('likes');
const searchKeyword = ref('');
const searchType = ref('all');
const currentPage = ref(1);
const pageSize = 12;
const selectedReview = ref(null);
const authStore = useAuthStore();
const userId = computed(() => authStore.userId);
const isLoading = ref(false);
const hasMore = ref(true);

const changeSortBy = async (value) => {
  sortBy.value = value;
  currentPage.value = 1;
  hasMore.value = true;
  reviews.value = [];
  await loadReviews();
};

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading.value && hasMore.value) {
    loadMoreReviews();
  }
};

const loadMoreReviews = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  currentPage.value++;
  try {
    let response;
    if (searchKeyword.value) {
      response = await api.get('/review/search', {
        params: {
          keyword: searchKeyword.value,
          searchType: searchType.value,
          page: currentPage.value,
          size: pageSize
        }
      });
    } else {
      response = await api.get('/review', {
        params: {
          sortBy: sortBy.value,
          page: currentPage.value,
          size: pageSize
        }
      });
    }
    const newReviews = response.data.map(review => ({ ...review, isLiked: false }));
    reviews.value = [...reviews.value, ...newReviews];
    if (newReviews.length < pageSize) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('리뷰 로딩 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadReviews = async () => {
  try {
    const response = await api.get('/review', {
      params: { sortBy: sortBy.value, page: currentPage.value, size: pageSize }
    });
    reviews.value = response.data.map(review => ({ ...review, isLiked: false }));
  } catch (error) {
    console.error('리뷰 로딩 실패:', error);
  }
};

const searchReviews = async () => {
  currentPage.value = 1;
  hasMore.value = true;
  isLoading.value = true;
  try {
    const response = await api.get('/review/search', {
      params: {
        keyword: searchKeyword.value,
        searchType: searchType.value,
        page: currentPage.value,
        size: pageSize
      }
    });
    reviews.value = response.data.map(review => ({ ...review, isLiked: false }));
    if (response.data.length < pageSize) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('리뷰 검색 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

const getReviewImage = (review) => {
  return review.photoUrls && review.photoUrls.length > 0 ? review.photoUrls[0] : defaultImageUrl;
};

const getUserAvatar = (userName) => {
  return 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png';
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
};

const openModal = (review) => {
  selectedReview.value = review;
};

const closeModal = () => {
  selectedReview.value = null;
};

const goToReviewWrite = () => {
  router.push({ name: 'ReviewWrite' });
};

onMounted(() => {
  if (!userId.value) {
    console.error('사용자가 로그인하지 않았습니다.');
  }
  loadReviews();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
