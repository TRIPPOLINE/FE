<template>
  <div class="my-plan-view">
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

          <!-- 상세 정보 패널 -->
          <transition 
            enter-active-class="transition-all duration-300 ease-in-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]"
            leave-active-class="transition-all duration-300 ease-in-out"
            leave-from-class="opacity-100 max-h-[500px]"
            leave-to-class="opacity-0 max-h-0">
            <div v-if="currentPlanId === plan.planId" class="mt-4 border-t pt-4 overflow-hidden">
              <ul class="space-y-2">
                <li v-for="(place, index) in planDetails" :key="place.spotId" class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 w-32">
                      <img :src="place.imagePath1 || defaultImageUrl" :alt="place.title" class="w-full h-32 object-cover rounded-lg"/>
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
              <p v-if="!planDetails.length" class="text-center text-gray-500 py-4">이 여행 계획에 등록된 장소가 없습니다.</p>
            </div>
          </transition>
        </li>
      </ul>
      <p v-else>아직 여행 계획이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMypageStore } from '@/mypage/myPageStore';
import { storeToRefs } from 'pinia';
import { jwtDecode } from 'jwt-decode';

const mypageStore = useMypageStore();
const defaultImageUrl = '/src/assets/spot_default.jpg';
const { plans, isLoading, error } = storeToRefs(mypageStore);

const currentPlanId = ref(null); // 현재 펼쳐진 플랜 ID
const planDetails = ref([]);

// 컴포넌트 마운트 시 여행 계획 목록 조회
onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = jwtDecode(token);
    console.log(`check`, decoded);
    await mypageStore.fetchPlans(decoded.userId);
  }
});

// 여행 계획 상세 보기
const viewPlanDetails = async (planId) => {
  if (currentPlanId.value === planId) {
    // 이미 펼쳐져 있으면 닫기
    currentPlanId.value = null;
    planDetails.value = [];
  } else {
    // 새로 펼치기
    currentPlanId.value = planId;
    const response = await mypageStore.fetchPlanDetails(planId);
    console.log(`보자`, response);
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
  }
};

// 여행 계획 삭제
const deletePlan = async (planId) => {
  if (confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) {
    try {
      await mypageStore.deletePlan(planId);
      // 삭제 후 플랜 목록 갱신 필요할 경우 여기에 추가
    } catch (error) {
      console.error('플랜 삭제 실패:', error);
    }
  }
};

// 날짜 포맷
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
};
</script>

<style scoped>
.my-plan-view {
  max-width: 800px;
  margin: auto;
}
</style>
