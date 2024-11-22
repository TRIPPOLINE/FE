<template>
  <div class="container mx-auto p-4 mt-16">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">여행 계획</h1>
      <button @click="goToSearch" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        여행지 추가하기
      </button>
    </div>
    <div class="flex gap-4">
      <!-- 좌측: 선택된 여행지 목록 -->
      <div class="w-1/3">
        <draggable 
          v-model="planStore.selectedSpots"
          @end="handleDragEnd"
          item-key="spotId"
          class="space-y-4"
        >
          <template #item="{ element, index }">
            <div class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-move">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold">{{ index + 1 }}. {{ element.title }}</h3>
                  <p class="text-sm text-gray-600">{{ element.frontAddress }}</p>
                </div>
                <button @click="removeSpot(element.spotId)" 
                        class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                  삭제
                </button>
              </div>
            </div>
          </template>
        </draggable>
        <div v-if="!planStore.selectedSpots.length" class="text-center text-gray-500 p-4">
          선택된 여행지가 없습니다.
        </div>
      </div>

      <!-- 우측: 지도 -->
      <div class="w-2/3">
        <div id="map" class="w-full h-[600px] rounded-lg shadow-md"></div>
      </div>
    </div>
    <div class="mt-6 flex justify-end space-x-4">
      <button @click="savePlan" 
              class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        계획 완료
      </button>
    </div>
  </div>
  
</template>

<script>
import { usePlanStore } from '@/stores/planStore';
import { onMounted, ref } from 'vue';
import draggable from 'vuedraggable';
import { useRouter, useRoute } from 'vue-router';

export default {
  components: {
    draggable
  },

  setup() {
    const planStore = usePlanStore();
    const map = ref(null);
    const markers = ref([]);
    const router = useRouter();
    const route = useRoute();

    const removeSpot = (spotId) => {
      planStore.removeSelectedSpot(spotId);
      updateMarkers();
    };

    const handleDragEnd = () => {
      updateMarkers();
    };

    const updateMarkers = () => {
      if (!map.value || !window.kakao) return;
      
      // 기존 마커 제거
      markers.value.forEach(marker => marker.setMap(null));
      markers.value = [];

      // 새 마커 추가
      planStore.selectedSpots.forEach((spot, index) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(spot.latitude, spot.longitude),
          map: map.value
        });

        // 마커에 순서 표시
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(spot.latitude, spot.longitude),
          content: `<div class="marker-label">${index + 1}</div>`,
          map: map.value,
          yAnchor: 0
        });

        markers.value.push(marker);
        markers.value.push(customOverlay);
      });
    };

    onMounted(() => {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2bd4f83bc7309d38194a5a7f96c884e0&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(36.2683, 127.6358),
            level: 13
          };
          map.value = new window.kakao.maps.Map(container, options);
          updateMarkers();
        });
      };
      
      document.head.appendChild(script);
    });
    const goToSearch = () => {
      router.push({
        name: 'SearchView',
        query: { planId: route.params.planId }  // 현재 planId를 쿼리 파라미터로 전달
      });
    };
    // 계획 완료 처리 함수
    const savePlan = async () => {
      try {
        if (planStore.selectedSpots.length === 0) {
          alert('최소 한 개 이상의 여행지를 선택해주세요.');
          return;
        }

        // 선택된 여행지들을 순서대로 저장
        for (let i = 0; i < planStore.selectedSpots.length; i++) {
          const spot = planStore.selectedSpots[i];
          await planStore.selectPlace({
            spotId: spot.spotId,
            planId: route.params.planId,
            visitOrder: i + 1
          });
        }

        alert('여행 계획이 저장되었습니다.');
        // 선택된 여행지 목록 초기화
        planStore.clearSelectedSpots();
        
        // 메인 페이지나 다른 페이지로 이동
        router.push('/');
      } catch (error) {
        console.error('계획 저장 실패:', error);
        alert('계획 저장 중 오류가 발생했습니다.');
      }
    };

    return {
      planStore,
      removeSpot,
      handleDragEnd,
      goToSearch,
      savePlan
    };
  }
};
</script>

<style>
.marker-label {
  padding: 2px 8px;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  font-weight: bold;
  color: #3b82f6;
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.sortable-drag {
  opacity: 0.9;
  background: #ffffff;
}
</style>