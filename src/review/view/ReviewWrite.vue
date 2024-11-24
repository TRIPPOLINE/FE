<template>
  <div class='review-write-container'>
    <div class='review-card'>
      <h2 class='text-xl font-bold mb-[4]'>리뷰 작성</h2>
      <p class='text-lg mb-[4]'>선택한 장소: {{ spotTitle }}</p>

      <!-- 장소 정보 표시 -->
      <div v-if='spot' class='spot-info'>
        <img :src='spot.imagePath1 || defaultImage' :alt='spot.title' class='spot-image'>
        <h2 class='spot-title'>{{ spot.title }}</h2>
        <p class='spot-address'>{{ spot.frontAddress }} {{ spot.rearAddress }}</p>
      </div>

      <!-- 리뷰 작성 폼 -->
      <form @submit.prevent='submitReview' class='review-form'>
        <!-- 제목 입력 -->
        <div class='form-group'>
          <label for='title' class='form-label'>제목</label>
          <input v-model='review.title' id='title' type='text' required class='form-input'>
        </div>

        <!-- 내용 입력 -->
        <div class='form-group'>
          <label for='content' class='form-label'>내용</label>
          <textarea v-model='review.content' id='content' rows='5' required class='form-textarea'></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">평점</label>
          <div class="star-rating"
               @mousedown="startRating"
               @mousemove="updateRating"
               @mouseup="stopRating"
               @mouseleave="stopRating">
            <div class="stars-outer">
              <div class="stars-inner" :style="{ width: `${ratingWidth}%` }"></div>
            </div>
          </div>
          <span class="rating-value">{{ review.score.toFixed(1) }}</span>
        </div>

        <!-- 사진 업로드 -->
        <div class='form-group'>
          <label for='photos' class='form-label'>사진 등록</label>
          <input type='file' id='photos' @change='handleFileUpload' multiple accept='image/*'
                 class='form-file-input'>
        </div>

        <!-- 제출 버튼 -->
        <button type='submit' class='submit-button'>리뷰 등록</button>
      </form>

    </div>
  </div>
</template>

<script>
// 필요한 모듈 및 패키지 import
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/Auth/components/auth';
import api from "@/Auth/api/AuthIndex.js";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 상태 변수 정의
    const authStore = useAuthStore();
    const spotId = ref(parseInt(route.params.spotId) || null);
    const spotTitle = ref(route.params.spotTitle || '');

    console.log('Received spotId:', spotId.value); // 디버깅용
    console.log('Received spotTitle:', spotTitle.value); // 디버깅용

    // 리뷰 데이터 객체 정의
    const review = ref({
      title: '',
      content: '',
      score: 0,
      userId: computed(() => authStore.userId),
      spotId: spotId, // 정수로 변환하여 저장
      userName: computed(() => authStore.user?.name || '')
    });

    const photos = ref([]);

    // 기본 이미지 경로 설정
    const defaultImage = 'path/to/default/image.jpg';

    // 평점 관련 상태 변수 정의
    const ratingWidth = ref(0);

    // 평점 드래그 상태 추적 변수 정의
    const isRating = ref(false);

   // 파일 업로드 처리 함수 정의
   const handleFileUpload = (event) => {
     photos.value = event.target.files;
   };

   // 리뷰 제출 처리 함수 정의
   const submitReview = async () => {
     try {
       if (!review.value.spotId) {
         alert('유효한 장소를 선택해주세요.');

       }

       // FormData 객체 생성 및 리뷰 데이터 추가
       const formData = new FormData();
       formData.append('requestReviewJson', JSON.stringify(review.value));

       for (let i = 0; i < photos.value.length; i++) {
         formData.append('photos', photos.value[i]);
       }

       // API 호출하여 리뷰 등록 요청
       await api.post('/review/write', formData, {
         headers: {
           'Content-Type': 'multipart/form-data'
         }
       });

       alert('리뷰가 성공적으로 등록되었습니다.');
       router.push({ name: 'ReviewList' });
     } catch (error) {
       console.error('리뷰 등록 중 오류 발생:', error);
       alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
     }
   };

   // 평점 관련 함수 정의
   const startRating = (event) => {
     isRating.value = true;
     updateRating(event);
   };

   const updateRating = (event) => {
     if (!isRating.value) return;

     const stars = event.currentTarget;
     const starWidth = stars.offsetWidth / 10;
     const starIndex = Math.floor((event.clientX - stars.getBoundingClientRect().left) / starWidth);
     review.value.score = (starIndex + 1) / 2;
     ratingWidth.value = (review.value.score / 5) * 100;
   };

   const stopRating = () => {
     isRating.value = false;
   };

   return {
     spotTitle,
     spotId,
     review,
     photos,
     defaultImage,
     handleFileUpload,
     submitReview,
     ratingWidth,
     startRating,
     updateRating,
     stopRating
   };
 }
};
</script>



<style scoped>
.review-write-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.review-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.5s ease forwards;
}

@keyframes slideUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.spot-info {
  text-align: center;
  margin-bottom: 2rem;
}

.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.spot-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.spot-address {
  color: #666;
  font-size: 0.9rem;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #4a90e2;
  outline: none;
}

.star-rating {
  display: inline-block;
  position: relative;
  height: 50px;
  line-height: 50px;
  font-size: 50px;
  cursor: pointer;
}

.stars-outer {
  position: relative;
  display: inline-block;
}

.stars-inner {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  width: 0;
}

.stars-outer::before {
  content: "\2606\2606\2606\2606\2606";
  color: #ccc;
}

.stars-inner::before {
  content: "\2605\2605\2605\2605\2605";
  color: #f8ce0b;
}

.rating-value {
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 10px;
}

.form-file-input {
  padding: 0.5rem;
  border: 1px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #357abd;
}
</style>
