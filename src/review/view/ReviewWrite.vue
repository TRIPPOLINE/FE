<template>
    <div class="container mx-auto p-4 flex">
      <!-- Left Panel: Search Form -->
      <div class="w-1/3 bg-white shadow-lg rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">여행지 검색</h2>
        <!-- Search Form -->
        <div class="mb-4">
          <select v-model="selectedSido" @change="handleSidoChange" class="w-full p-2 border rounded-md">
            <option value="">시/도 선택</option>
            <option v-for="sido in sidos" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}</option>
          </select>
        </div>
        <div class="mb-4">
          <select v-model="selectedSigungu" :disabled="!selectedSido" @change="handleSigunguChange" class="w-full p-2 border rounded-md">
            <option value="">시/군/구 선택</option>
            <option v-for="sigungu in sigungus" :key="sigungu.gugunCode" :value="sigungu.gugunCode">{{ sigungu.gugunName }}</option>
          </select>
        </div>
        <div class="mb-4">
          <select v-model="selectedSpotType" @change="handleSpotTypeChange" class="w-full p-2 border rounded-md">
            <option value="">관광지 타입 전체</option>
            <option v-for="type in spotTypes" :key="type.spotTypeId" :value="type.spotTypeId">{{ type.spotTypeName }}</option>
          </select>
        </div>
        <div class="mb-4">
          <input v-model="searchKeyword" type="text" placeholder="검색어를 입력하세요" class="w-full p-2 border rounded-md">
        </div>
        <button @click="searchSpots" class="w-full bg-blue-500 text-white p-2 rounded-md">검색</button>
  
        <!-- Search Results -->
        <div class="mt-4 overflow-y-auto h-64">
          <ul v-if="spots.length > 0">
            <li v-for="spot in spots" :key="spot.spotId" @click="selectSpot(spot)" class="p-2 border-b cursor-pointer hover:bg-gray-100">
              {{ spot.title }}
            </li>
          </ul>
          <p v-else>검색 결과가 없습니다.</p>
        </div>
      </div>
  
      <!-- Right Panel: Review Form -->
      <div class="w-2/3 ml-4 bg-white shadow-lg rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">리뷰 작성</h2>
        <!-- Selected Spot Info -->
        <div class="mb-4 p-2 bg-gray-100 rounded-md">
  {{ selectedSpot ? `${selectedSpot.title}` : '여행지를 선택해주세요' }}
</div>
  
        <!-- Review Form -->
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <input v-model.trim="reviewTitle" type="text" placeholder="리뷰 제목을 입력하세요" required class="w-full p-2 border rounded-md">
        </div>
        <div class="mb-4">
          <textarea v-model.trim="reviewContent" placeholder="리뷰 내용을 입력하세요" required rows="5" class="w-full p-2 border rounded-md"></textarea>
        </div>
        <div class="mb-4">
    <EditableStarRating v-model="reviewScore" />
  </div>
        <!-- <div class="mb-4">
          <input type="file" multiple @change="handleFileUpload" accept=".jpg,.jpeg,.png"/>
        </div> -->
        <!-- 파일 업로드 부분 수정 -->
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2">
    사진 첨부 (여러 장 선택 가능)
  </label>
  <input 
    type="file" 
    multiple 
    @change="handleFileUpload" 
    accept="image/*"
    class="w-full p-2 border rounded-md"
  />
  <!-- 선택된 파일 미리보기 -->
  <div v-if="previewUrls.length > 0" class="grid grid-cols-3 gap-4 mt-4">
    <div v-for="(url, index) in previewUrls" :key="index" class="relative">
      <img :src="url" class="w-full h-32 object-cover rounded-md">
      <button 
        @click="removePhoto(index)" 
        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
      >
        ×
      </button>
    </div>
  </div>
</div>
        <button type="submit" class="bg-green-500 text-white p-2 rounded-md">리뷰 저장</button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { useSpotStore } from '@/plan/spotStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/Auth/components/auth';
import { useReviewStore } from "@/review/reviewStore";
import EditableStarRating from '@/review/component/EditableStarRating.vue';
  
const spotStore = useSpotStore();
const reviewStore = useReviewStore();
const router = useRouter();
const authStore = useAuthStore();
  
  const sidos = ref([]);
  const sigungus = ref([]);
  const spotTypes = ref([]);
  const spots = ref([]);
  const selectedSido = ref('');
  const selectedSigungu = ref('');
  const selectedSpotType = ref('');
  const searchKeyword = ref('');
  const selectedSpot = ref(null);
  
  const reviewTitle = ref('');
const reviewContent = ref('');
const reviewScore = ref('');
  //let photos = [];
  const photos = ref([]);
const previewUrls = ref([]);
  const handleSidoChange = async () => {
    sigungus.value = await spotStore.fetchSigungus(selectedSido.value);
  };
  
  const handleSigunguChange = async () => {
    spotTypes.value = await spotStore.fetchSpotTypes();
  };
  
  const handleSpotTypeChange = () => {};
  
  const searchSpots = async () => {
    spots.value = await spotStore.searchSpots({
      areaCode: selectedSido.value,
      siGunGuCode: selectedSigungu.value,
      contentTypeId: selectedSpotType.value,
      keyword: searchKeyword.value,
    });
  };
  
  const selectSpot = (spot) => {
      selectedSpot.value = spot;
      console.log(`선택한 여행지`,spot);
  };
  
  // const handleFileUpload = (event) => {
  //   photos = Array.from(event.target.files);
  // };
  const handleFileUpload = (event) => {
  const newFiles = Array.from(event.target.files);
  
  // 기존 파일들과 새로운 파일들을 합침
  photos.value = [...photos.value, ...newFiles];
  
  // 새로운 파일들의 미리보기 URL 생성
  const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
  
  // 기존 미리보기와 새로운 미리보기를 합침
  previewUrls.value = [...previewUrls.value, ...newPreviewUrls];
};
  // 사진 삭제 함수 추가
const removePhoto = (index) => {
  photos.value = photos.value.filter((_, i) => i !== index);
  URL.revokeObjectURL(previewUrls.value[index]);
  previewUrls.value = previewUrls.value.filter((_, i) => i !== index);
};

  const submitReview = async () => {
    if (!selectedSpot.value) {
      alert('여행지를 선택해주세요.');
      return;
    }

    if (!reviewScore.value) {
      alert('평점을 선택해주세요.');
      return;
    }

    const userId = authStore.userId; // Assuming userId is stored here

    // Log the userId to verify
    console.log('User ID:', userId);

    const reviewData = {
      userId: userId,
      spotId: selectedSpot.value.spotId,
      title: reviewTitle.value,
      content: reviewContent.value,
      score: parseFloat(reviewScore.value)
    };
    console.log(reviewData);

    const formData = new FormData();
    formData.append('requestReviewJson', JSON.stringify(reviewData));

  //     photos.forEach((photo, index) => {
  //   formData.append('photos', photo);
  //   console.log(`File ${index + 1}:`, photo.name, photo.size, photo.type);
      // });
    //   photos.value.forEach((photo, index) => {
    //   formData.append('photos', photo);
    //   console.log(`File ${index + 1}:`, photo.name, photo.size, photo.type);
    // });
// 여러 파일을 각각 append
if (photos.value && photos.value.length > 0) {
    photos.value.forEach(photo => {
      formData.append('photos', photo);
    });
  }

      await reviewStore.writeReview(formData);

      alert('리뷰가 저장되었습니다.');
      router.push('/review');
  };
  
  // Fetch initial data
  (async () => {
    sidos.value = await spotStore.fetchSidos();
    spotTypes.value = await spotStore.fetchSpotTypes();
  })();
  </script>
  
  <style scoped>
  </style>