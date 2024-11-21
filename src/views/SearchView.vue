<!--searchView.vue-->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4">여행지 검색하기</h1>
    
    <!-- 검색 폼 -->
    <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            @change="handleSigunguChange"
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
            @change="handleSpotTypeChange"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">전체</option>
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

      <!-- 버튼 그룹 -->
      <div class="mt-4 sm:mt-6 flex justify-end space-x-2">
        <!-- 검색 버튼 -->
        <button 
          @click="searchSpots"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          검색
        </button>

        <!-- 초기화 버튼 -->
        <button 
          @click="resetSearch"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>

    <!-- 검색 결과 및 지도 영역 -->
    <div class="flex">
      <!-- 검색 결과 -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden w-full lg:w-1/3 mr-4">
        <div v-if="spots.length > 0" class="grid grid-cols-1 gap-4 p-4">
          <div 
            v-for="spot in spots" 
            :key="spot.spotId"
            class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="showSpotOnMap(spot)"
          >
            <img 
              :src="spot.imagePath1 || '/placeholder-image.jpg'" 
              :alt="spot.title"
              class="w-full h-40 object-cover"
            >
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">{{ spot.title }}</h3>
              <p class="text-sm text-gray-600">{{ spot.frontAddress }}</p>
            </div>
          </div>
        </div>

        <!-- 검색 결과 없음 -->
        <div v-if="hasSearched && spots.length === 0" class="p-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>

        <!-- 초기 상태 메시지 -->
        <div v-if="!hasSearched" class="p-4 text-center text-gray-500">
          검색 조건을 선택하고 검색 버튼을 눌러주세요.
        </div>
      </div>

      <!-- 지도 영역 -->
      <div id="map" class="w-full h-auto lg:h-auto lg:w-full rounded-lg shadow-sm relative">
  <div class="absolute top-4 right-4 z-10">
    <button @click="zoomIn" class="bg-white p-2 rounded-t-md shadow">+</button>
    <button @click="zoomOut" class="bg-white p-2 rounded-b-md shadow">-</button>
  </div>
</div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
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
    const mapZoomLevel = ref(13);

    let map = null;

    const handleSidoChange = async (e) => {
      const value = e.target.value
      selectedSigungu.value = '';
      if (value) {
        const data = await spotStore.fetchSigungus(value);
        sigungus.value = data;
        console.log(sigungus)
      }
    };

    const handleSigunguChange = async (e) => {
      const value = e.target.value
      selectedSpotType.value = '';
      if (value) {
        const data = await spotStore.fetchSpotTypes(value);
        spotTypes.value = data;
        console.log(spotTypes)
      }
    };

    const handleSpotTypeChange = async (e) => {
      const value = e.target.value
      selectedSpotType.value = value;
      console.log(selectedSpotType)
    };

    const searchSpots = async () => {
      // 시/도와 시/군/구가 선택되어야 검색을 수행
      if (!selectedSido.value || !selectedSigungu.value) return;
        
        hasSearched.value = true;
      
        // 관광지 타입이 선택되지 않은 경우 모든 관광지를 검색
      const contentTypeId = selectedSpotType.value || null;

      

        // 선택된 조건에 따라 관광지 검색
        await spotStore.searchSpots({
          areaCode: selectedSido.value,
          siGunGuCode: selectedSigungu.value,
          contentTypeId: contentTypeId
        });

        spots.value = spotStore.spots;
        //지도에 마커 표시
        if (map && window.kakao && window.kakao.maps) {
          spots.value.forEach(spot => addMarker(spot));
          
          // 첫 번째 스팟으로 지도 중심 이동
          if (spots.value.length > 0) {
            showSpotOnMap(spots.value[0]);
          }
        }
    };

    const resetSearch = () => {
      selectedSido.value = '';
      selectedSigungu.value = '';
      selectedSpotType.value = '';
      spots.value = [];
      hasSearched.value = false;
      sigungus.value = [];
      
      // 지도 초기화
      if (map && window.kakao && window.kakao.maps) {
        map.setCenter(new window.kakao.maps.LatLng(36.2683, 127.6358)); // 대한민국 중심점으로 이동
        map.setLevel(13); // 기본 줌 레벨로 설정
      }
    };

    const addMarker = (spot) => {
      if (!window.kakao || !window.kakao.maps) return;
      
      const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);
      new window.kakao.maps.Marker({
        position: position,
        map: map
      });
    };
    

    const showSpotOnMap = (spot) => {
      if (!window.kakao || !window.kakao.maps) return;
      const moveLatLon = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);
      map.setCenter(moveLatLon);
      map.setLevel(3); // 스팟 선택 시 줌 레벨을 3으로 설정
      mapZoomLevel.value = 3;
    };

    const zoomIn = () => {
      if (map) {
        map.setLevel(map.getLevel() - 1);
      }
    };

    const zoomOut = () => {
      if (map) {
        map.setLevel(map.getLevel() + 1);
      }
    };
    // 줌 레벨 변경 감지
    watch(mapZoomLevel, (newLevel) => {
      if (map) {
        map.setLevel(newLevel);
      }
    });

    onMounted(() => {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2bd4f83bc7309d38194a5a7f96c884e0&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        window.kakao.maps.load(() => {
          initMap();
        });
      };
      
      document.head.appendChild(script);
      
      loadInitialData();
    });

    const initMap = () => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(36.2683, 127.6358),
        level: mapZoomLevel.value
      };
      map = new window.kakao.maps.Map(container, options);

      // 줌 변경 이벤트 리스너 추가
      window.kakao.maps.event.addListener(map, 'zoom_changed', function() {
        mapZoomLevel.value = map.getLevel();
      });
    };

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
     handleSigunguChange,
     handleSpotTypeChange,
     searchSpots,
     resetSearch,
      showSpotOnMap,
      mapZoomLevel,
      zoomIn,
      zoomOut
   };
 }
};
</script>

<style scoped>
.container {
 max-width: 1200px;
}
#map {
 height: 500px; /* 지도 높이를 설정합니다 */
}
</style>
