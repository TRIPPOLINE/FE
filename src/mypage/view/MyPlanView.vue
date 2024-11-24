<template>
  <div class="my-plan-view">
    <h2 class="text-2xl font-bold mb-4">내 여행 계획</h2>
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">에러 발생: {{ error }}</div>
    <div v-else>
      
      <ul v-if="plans.length" class="space-y-4">
        <li v-for="plan in plans" :key="plan.planId" class="border p-4 rounded">
          <div class="flex justify-between items-center">
            <span>여행 날짜: {{ formatDate(plan.tripAt) }}</span>
            <div>
              <button @click="viewPlanDetails(plan.planId)" class="text-blue-500 mr-2">상세 보기</button>
              <button @click="deletePlan(plan.planId)" class="text-red-500">삭제</button>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>아직 여행 계획이 없습니다.</p>
    </div>
    
    <!-- 플랜 상세 모달 -->
<div v-if="showPlanDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
    <h3 class="text-xl font-bold mb-4">여행 계획 상세</h3>
    <div v-if="mypageStore.isLoading">로딩 중...</div>
    <div v-else-if="mypageStore.error">에러 발생: {{ mypageStore.error }}</div>
    <div v-else>
      <ul v-if="planDetails.length" class="space-y-4">
        <li v-for="(place, index) in planDetails" 
            :key="place.spotId" 
            class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-32">
              <img 
                :src="place.imagePath1 || defaultImageUrl" 
                :alt="place.title"
                class="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl font-bold text-indigo-600">{{ place.visitOrder }}</span>
                <h4 class="text-xl font-semibold">{{ place.title }}</h4>
              </div>
              <p class="text-gray-600">{{ place.frontAddress }} {{ place.rearAddress }}</p>
            </div>
          </div>
        </li>
      </ul>
      <p v-else class="text-center text-gray-500 py-4">이 여행 계획에 등록된 장소가 없습니다.</p>
    </div>
    <div class="mt-6 flex justify-end">
      <button @click="showPlanDetails = false" 
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
        닫기
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMypageStore } from '@/mypage/myPageStore';
const defaultImageUrl = '/src/assets/spot_default.jpg';
import { storeToRefs } from 'pinia';
import { jwtDecode } from 'jwt-decode';

const mypageStore = useMypageStore();
const { plans, currentPlan, isLoading, error } = storeToRefs(mypageStore);

const showCreatePlanForm = ref(false);
const showPlanDetails = ref(false);
const newPlan = ref({ tripAt: '' });

onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = jwtDecode(token);
    console.log(`check`, decoded);
    await mypageStore.fetchPlans(decoded.userId);
  }
});

const deletePlan = async (planId) => {
  if (confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) {
    try {
      await mypageStore.deletePlan(planId);
    } catch (error) {
      console.error('플랜 삭제 실패:', error);
    }
  }
};
const planDetails = ref([]);

const viewPlanDetails = async (planId) => {
  showPlanDetails.value = true;
  const response = await mypageStore.fetchPlanDetails(planId);
  console.log(`보자`,response);
  if (response) {
    planDetails.value = [];
    for (const place of response) {
      const spotInfo = await mypageStore.fetchSpotById(place.spotId);
      if (spotInfo) {
        planDetails.value.push({
          ...spotInfo,
          visitOrder: place.visitOrder
        });
      }
    }
    // 방문 순서대로 정렬
    planDetails.value.sort((a, b) => a.visitOrder - b.visitOrder);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
};
const showSpotDetails = async (spotId) => {
  const spotInfo = await mypageStore.fetchSpotInfo(spotId);
  if (spotInfo) {
    // 여행지 정보를 보여주는 로직 추가
    console.log('Spot Info:', spotInfo);
  }
};
</script>