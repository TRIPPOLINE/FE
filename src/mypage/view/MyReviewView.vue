<template>
  <div class="container mx-auto px-4 py-8">

    <!-- 로딩 상태 표시 -->
    <div v-if="mypageStore.isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="mypageStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ mypageStore.error }}
    </div>

    <!-- 리뷰 목록 -->
    <div v-if="mypageStore.reviews && mypageStore.reviews.length > 0" 
         class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div class="mt-2"> 
            <div class="flex space-x-5"> 
              <span v-for="i in 5" :key="i"
                    :class="{ 'text-yellow-400': i <= review.score, 'text-gray-300': i > review.score }">★</span>
            </div>
            <span class="text-sm text-gray-500">{{ formatDate(review.writeAt) }}</span> 
          </div>

          <!-- 여행지 정보 -->
          <div class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-600 flex items-center">
              <i class="fas fa-map-marker-alt mr-2"></i>{{ review.spotTitle || '여행지 정보 없음' }}
            </p>
          </div>

          <!-- 수정 및 삭제 버튼 -->
          <div class="flex justify-between mt-4">
            <button @click="openModal(review)" class="text-blue-500 hover:underline">수정</button>
            <button @click="deleteReview(review.reviewNo)" class="text-red-500 hover:underline">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 리뷰가 없는 경우 -->
    <div v-if="!mypageStore.isLoading && (!mypageStore.reviews || mypageStore.reviews.length === 0)" 
     class="text-center py-8 text-gray-500">
  작성한 리뷰가 없습니다.
</div>


    <!-- Edit Review Modal -->
    <ReviewEditModal 
      :review='selectedReview' 
      :isVisible='isModalVisible' 
      @close='closeModal' 
      @update='updateReview' />
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMypageStore } from '@/mypage/myPageStore';
import { useAuthStore } from '@/Auth/components/auth';
import ReviewEditModal from '@/mypage/view/ReviewEditModal.vue'; // Import your modal component

const mypageStore = useMypageStore();
const authStore = useAuthStore();

const selectedReview = ref(null);
const isModalVisible = ref(false);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getReviewImage = (review) => {
  return review.photoUrls && review.photoUrls.length > 0 
    ? review.photoUrls[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';
};

const deleteReview = async (reviewNo) => {
  const confirmed = confirm("정말로 이 리뷰를 삭제하시겠습니까?");
  if (confirmed) {
    try {
      await mypageStore.deleteUserReview(reviewNo);
      await mypageStore.fetchUserReviews(authStore.user.id);
      alert("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert("리뷰 삭제에 실패했습니다: " + error.message);
    }
  }
};

const openModal = (review) => {
  selectedReview.value = { ...review }; // Copy the review data to prevent direct mutation
  isModalVisible.value = true; // Show the modal
};

const closeModal = () => {
  isModalVisible.value = false; // Hide the modal
};

const updateReview = async (updatedReview) => {
  try {
    await mypageStore.modifyReview(updatedReview); // Call your store action to update the review
    await mypageStore.fetchUserReviews(authStore.user.id); // Refresh reviews
    alert("리뷰가 수정되었습니다.");
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    alert("리뷰 수정에 실패했습니다.");
  }
};

// onMounted 호출 부분 수정
onMounted(async () => {
  if (authStore.user && authStore.user.id) {
    await mypageStore.fetchUserReviews(authStore.user.id);
  }
});
</script>

