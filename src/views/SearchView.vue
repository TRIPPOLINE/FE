<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">여행지 검색하기</h1>
    
    <!-- 검색 폼 -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 시도 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">시/도</label>
          <select 
            v-model="selectedSido"
            @change="handleSidoChange"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">선택하세요</option>
            <option 
              v-for="sido in sidos" 
              :key="sido.sidoCode" 
              :value="sido.sidoCode"
            >
              {{ sido.sidoName }}
            </option>
          </select>
        </div>

        <!-- 시군구 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">시/군/구</label>
          <select 
            v-model="selectedSigungu"
            :disabled="!selectedSido"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">선택하세요</option>
            <option 
              v-for="sigungu in sigungus" 
              :key="sigungu.gugunCode" 
              :value="sigungu.gugunCode"
            >
              {{ sigungu.gugunName }}
            </option>
          </select>
        </div>

        <!-- 관광지 타입 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">관광지 타입</label>
          <select 
            v-model="selectedSpotType"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">선택하세요</option>
            <option 
              v-for="type in spotTypes" 
              :key="type.spotTypeId" 
              :value="type.spotTypeId"
            >
              {{ type.spotTypeName }}
            </option>
          </select>
        </div>
      </div>

      <!-- 검색 버튼 -->
      <div class="mt-6 flex justify-end">
        <button 
          @click="searchSpots"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 지도 영역 -->
    <div id="map" style="width:100%;height:400px;" class="rounded-lg shadow-sm mb-6"></div>

    <!-- 검색 결과 -->
    <div v-if="spots.length > 0" class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div 
          v-for="spot in spots" 
          :key="spot.spotId"
          class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <img 
            :src="spot.imagePath1 || '/placeholder-image.jpg'" 
            :alt="spot.title"
            class="w-full h-48 object-cover"
          >
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ spot.title }}</h3>
            <p class="text-sm text-gray-600">{{ spot.frontAddress }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 검색 결과 없음 -->
    <div 
      v-else-if="hasSearched" 
      class="bg-white shadow-sm rounded-lg p-6 text-center text-gray-500"
    >
      검색 결과가 없습니다.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useSpotStore } from '@/stores/spotStore';

export default {
  name: 'SearchView',
  setup() {
    const spotStore = useSpotStore();
    const selectedSido = ref('');
    const selectedSigungu = ref('');
    const selectedSpotType = ref('');
    const hasSearched = ref(false);

    const sidos = ref([]);
    const sigungus = ref([]);
    const spotTypes = ref([]);
    const spots = ref([]);

    let map = null;

    const handleSidoChange = async () => {
      selectedSigungu.value = '';
      if (selectedSido.value) {
        await spotStore.fetchSigungus(selectedSido.value);
        sigungus.value = spotStore.sigungus;
      }
    };

    const searchSpots = async () => {
      try {
        hasSearched.value = true;
        await spotStore.searchSpots({
          sidoCode: selectedSido.value,
          sigunguCode: selectedSigungu.value,
          contentTypeId: selectedSpotType.value
        });
        spots.value = spotStore.spots;

        // 검색 결과가 있으면 첫 번째 결과의 위치로 지도 이동
        if (spots.value.length > 0) {
          const firstSpot = spots.value[0];
          const moveLatLon = new kakao.maps.LatLng(firstSpot.latitude, firstSpot.longitude);
          map.setCenter(moveLatLon);
        }
      } catch (error) {
        console.error('검색 실패:', error);
        alert('검색 중 오류가 발생했습니다.');
      }
    };

    onMounted(() => {
  // 카카오맵 API 스크립트 동적 로드
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2bd4f83bc7309d38194a5a7f96c884e0&autoload=false`;
  script.onload = () => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };
      map = new window.kakao.maps.Map(container, options);
    });
  };
  document.head.appendChild(script);

      //const initializeMap = () => {
      //  const container = document.getElementById('map');
      //  const options = {
      //    center: new kakao.maps.LatLng(33.450701, 126.570667),
      //    level: 3
      //  };
      //  map = new kakao.maps.Map(container, options);
      //};

      // 기존 데이터 로드
      loadInitialData();
    });

    const loadInitialData = async () => {
      try {
        await Promise.all([
          spotStore.fetchSidos(),
          spotStore.fetchSpotTypes()
        ]);
        sidos.value = spotStore.sidos;
        spotTypes.value = spotStore.spotTypes;
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
        alert('데이터 로드 중 오류가 발생했습니다.');
      }
    };

    return {
      selectedSido,
      selectedSigungu,
      selectedSpotType,
      sidos,
      sigungus,
      spotTypes,
      spots,
      hasSearched,
      handleSidoChange,
      searchSpots
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>