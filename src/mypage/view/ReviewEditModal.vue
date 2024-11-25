<template>
    <Transition name="modal">
      <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-xl font-bold mb-4">리뷰 수정</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">제목</label>
              <input type="text" id="title" v-model="review.title" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"/>
            </div>
  
            <div class="mb-4">
              <label for="content" class="block text-sm font-medium text-gray-700">내용</label>
              <textarea id="content" v-model="review.content" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"></textarea>
            </div>
  
            <div class="mb-4">
              <EditableStarRating v-model="review.score" />
            </div>
            <!-- 사진 업로드 영역 추가 -->
          <div class="mb-4">
            <div class="grid grid-cols-3 gap-2 mt-2">
              <div v-for="(photo, index) in review.photoUrls" :key="index" class="relative">
                <img :src="photo" class="w-full h-24 object-cover rounded">
                <button type="button" @click="removePhoto(index)" 
                        class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                  X
                </button>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <input type="file" multiple accept="image/*" @change="handleFileChange" 
                   class="mt-1 block w-full">
          </div>
  
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">수정 완료</button>
          </form>
          <button @click="handleClose" class="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">닫기</button>
        </div>
      </div>
    </Transition>
</template>
  
<script setup>
import { ref } from 'vue';
import EditableStarRating from '@/review/component/EditableStarRating.vue';
import { useMypageStore } from '@/mypage/myPageStore'; 
const mypageStore = useMypageStore(); 
const props = defineProps({
  review: Object,
  isVisible: Boolean,
});

const emit = defineEmits(['close', 'update']);
const newPhotos = ref([]);
const deletedPhotos = ref([]);

const handleClose = () => {
  emit('close');
};

const removePhoto = async (index) => {
  try {
    await mypageStore.deleteReviewPhoto(props.review.reviewNo, props.review.photoUrls[index]);
    props.review.photoUrls.splice(index, 1);
  } catch (error) {
    console.error('사진 삭제 실패:', error);
    alert('사진 삭제에 실패했습니다.');
  }
};

const handleFileChange = (event) => {
  newPhotos.value = Array.from(event.target.files);
};

// const handleSubmit = () => {
//   const formData = new FormData();

//   const reviewInfo = {
//     reviewNo: props.review.reviewNo,
//     userId: props.review.userId,
//     title: props.review.title,
//     content: props.review.content,
//     score: props.review.score,
//     deletePhotoUrls: deletedPhotos.value
//   };

//   formData.append('reviewUpdateJson', JSON.stringify(reviewInfo));

//   if (newPhotos.value.length > 0) {
//     newPhotos.value.forEach(photo => {
//       formData.append('newPhotos', photo);
//     });
//   }

//   emit('update', formData);
//   emit('close');
// };
const handleSubmit = () => {
  const reviewInfo = {
    reviewNo: props.review.reviewNo,
    userId: props.review.userId,
    title: props.review.title,
    content: props.review.content,
    score: props.review.score
  };
    console.log(reviewInfo);
  // 사진 관련 데이터 추가
  if (newPhotos.value.length > 0) {
    reviewInfo.newPhotos = newPhotos.value;
  }
  
  if (deletedPhotos.value.length > 0) {
    reviewInfo.deletePhotoUrls = deletedPhotos.value;
  }
  emit('update', reviewInfo);
  emit('close');
};
</script>
  
<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>