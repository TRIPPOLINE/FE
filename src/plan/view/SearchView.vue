<template>
  <div class="container mx-auto max-w-full p-4 h-[calc(100vh-150px)]">
    <div class="flex flex-row relative">
      <!-- 왼쪽 패널 (검색 폼 + 검색 결과) -->
      <div :class="['fixed left-0 top-10 z-50 transition-all duration-300 ease-in-out bg-white shadow-lg',
        isLeftPanelOpen ? 'translate-x-0' : '-translate-x-full']"
        style="width: 400px; margin-top: 100px; height: calc(100vh - 200px);">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden h-[calc(100vh-200px)]">
          <!-- 검색 폼 -->
          <div class="p-4">
            <!-- 시도/시군구 선택 그룹 -->
            <div class="flex space-x-2 mb-4">
              <!-- 시도 선택 -->
              <div class="flex-1">
                <select v-model="selectedSido" @change="handleSidoChange"
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
                  <option value="">시/도</option>
                  <option v-for="sido in sidos" :key="sido.sidoCode" :value="sido.sidoCode">
                    {{ sido.sidoName }}
                  </option>
                </select>
              </div>

              <!-- 시군구 선택 -->
              <div class="flex-1">
                <select v-model="selectedSigungu" :disabled="!selectedSido" @change="handleSigunguChange"
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
                  <option value="">시/군/구</option>
                  <option v-for="sigungu in sigungus" :key="sigungu.gugunCode" :value="sigungu.gugunCode">
                    {{ sigungu.gugunName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 관광지 타입 선택과 키워드 검색 입력 필드 그룹 -->
            <div class="flex space-x-2 mb-4">
              <!-- 관광지 타입 선택 -->
              <div class="flex-1">
                <select v-model="selectedSpotType" @change="handleSpotTypeChange"
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
                  <option value="">관광지 타입 전체</option>
                  <option v-for="type in spotTypes" :key="type.spotTypeId" :value="type.spotTypeId">
                    {{ type.spotTypeName }}
                  </option>
                </select>
              </div>

              <!-- 키워드 검색 입력 필드 -->
              <div class="flex-1">
                <input v-model="searchKeyword" type="text" placeholder="검색어를 입력하세요"
                  class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              </div>
            </div>

            <!-- 버튼 그룹 -->
            <div class="flex flex-col space-y-2">
              <div class="flex space-x-2">
                <button @click="searchSpots"
                  class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button @click="resetSearch"
                  class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 검색 결과 -->
          <div class="overflow-y-auto" style="height: calc(100% - 200px);">
            <div v-if="spots.length > 0" class="grid grid-cols-1 gap-4 p-4">
              <div v-for="spot in filteredSpots" :key="spot.spotId"
                class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-300"
                @click="showSpotOnMap(spot)">
                <img :src="spot.imagePath1 || defaultImage" :alt="spot.title" class="w-full h-32 object-cover">
                <div class="p-3">
                  <h3 class="text-base font-semibold mb-1">{{ spot.title }}</h3>
                  <p class="text-xs text-gray-600">{{ spot.frontAddress }}</p>
                  <div class="star-rating">
            <span v-for="n in 5" :key="n" :class="{ 'text-yellow-500': n <= Math.round(spot.avgScore), 'text-gray-300': n > Math.round(spot.avgScore) }">★</span>
        </div>
                  <button @click.stop="toggleSpotSelection(spot)"
                    class="mt-1 px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                    {{ isSpotSelected(spot) ? '선택 취소' : '선택하기' }}
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="hasSearched" class="p-4 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
            <div v-else class="p-4 text-center text-gray-500">
              검색 조건을 선택하고 검색 버튼을 눌러주세요.
            </div>
          </div>
        </div>
      </div>

      <!-- 패널 토글 버튼 -->
      <button @click="toggleLeftPanel" :class="['absolute top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-r-md p-2 z-10 transition-all duration-300',
        isLeftPanelOpen ? 'left-[380px]' : 'left-[-10px]']">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="{ 'rotate-180': !isLeftPanelOpen }" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- 지도 영역 -->
      <div class="w-full">
        <div id="map" class="w-full h-[calc(100vh-150px)] rounded-lg shadow-lg relative">
          <!-- 줌 컨트롤 -->
          <div class="absolute top-4 right-4 z-10 flex flex-col">
            <button @click="zoomIn" class="bg-white p-2 rounded-t-md shadow hover:bg-gray-100">+</button>
            <button @click="zoomOut" class="bg-white p-2 rounded-b-md shadow hover:bg-gray-100">-</button>
          </div>

          <!-- 하단 버튼 그룹 -->
          <div class="absolute bottom-4 left-0 right-0 flex justify-between px-4 z-10">
            <!-- 현재 지도 위치로 검색 버튼 -->
            <div class="flex-1 flex justify-center">
              <button @click="searchNearbySpots" class="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 hover:scale-105 flex items-center space-x-2">
                  <i class="fas fa-search text-lg group-hover:rotate-12 transition-transform duration-300"></i>
                  <span class="font-medium">지도 내 검색</span>
              </button>
            </div>
            <!-- 여행 계획 생성 버튼과 드롭다운 패널 -->
            <div class="relative">
                <!-- 여행 계획 생성 드롭다운 패널 -->
                <div v-if="showPlanPanel"
                    class="absolute right-0 bottom-full mb-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 z-50 w-80 border border-gray-100 transform transition-all duration-300">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">여행 날짜 선택</label>
                        <input v-model="newPlanTripAt" type="date"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button @click="togglePlanPanel"
                            class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300">
                            취소
                        </button>
                        <button @click="confirmNewPlan"
                            class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50">
                            일정 만들기
                        </button>
                    </div>
                </div>

                <!-- 여행 계획 생성 버튼 -->
                <button v-if="!route.query.planId" @click="togglePlanPanel"
                    class="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-200/50 hover:scale-105 flex items-center space-x-2">
                    <i class="fas fa-plus text-lg group-hover:rotate-180 transition-transform duration-500"></i>
                    <span class="font-medium">나만의 일정 만들기</span>
                </button>
            </div>

          </div>
        </div>
      </div>

    </div>



  </div>
</template>

<style scoped>
.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: 500px;
  overflow-y: auto;
}

/* Webkit 브라우저 스타일 */
.scroll-area::-webkit-scrollbar {
  width: 8px;
}

.scroll-area::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scroll-area::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scroll-area::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox 스타일 */
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>
<script>

import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSpotStore } from "@/plan/spotStore";
import { usePlanStore } from "@/plan/planStore";
import { useAuthStore } from "@/Auth/components/auth";
import { jwtDecode } from 'jwt-decode';


export default {
  name: 'SearchView',
  setup() {
    const defaultImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';
    const spotStore = useSpotStore();
    const planStore = usePlanStore();
    const authStore = useAuthStore();
    const selectedSido = ref('');
    const selectedSigungu = ref('');
    const selectedSpotType = ref('');
    const hasSearched = ref(false);
    const currentPlanId = ref('');
    const searchKeyword = ref('');

    const sidos = ref([]);
    const sigungus = ref([]);
    const spotTypes = ref([]);
    const spots = ref([]);
    const mapZoomLevel = ref(13);
    const route = useRoute();
    const router = useRouter();


    const showPlanPanel = ref(false);
    const newPlanUserId = ref('');
    const newPlanTripAt = ref('');

    let map = null;

    const filteredSpots = computed(() => {
      if (!searchKeyword.value) return spots.value;
      const keyword = searchKeyword.value.toLowerCase();
      return spots.value.filter(spot =>
        spot.title.toLowerCase().includes(keyword) ||
        spot.frontAddress.toLowerCase().includes(keyword)
      );
    });

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
      if (!selectedSido.value) {
        alert('시/도를 선택해주세요.');
        return;
      }

      hasSearched.value = true;
      try {
        const response = await spotStore.searchSpots({
          areaCode: selectedSido.value,
          siGunGuCode: selectedSigungu.value || null,  // 시군구가 선택되지 않았을 때 null로 설정
          contentTypeId: selectedSpotType.value || null,
          keyword: searchKeyword.value
        });

        spots.value = response;
        if (map && window.kakao && window.kakao.maps) {
          clearMarkers();
          const bounds = new window.kakao.maps.LatLngBounds();

          if (Array.isArray(spots.value)) {
            spots.value.forEach(spot => {
              const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);
              bounds.extend(position);
              addMarker(spot);
            });

            if (spots.value.length > 0) {
              map.setBounds(bounds);
              const level = map.getLevel();
              map.setLevel(level + 1);
            }
          } else {
            console.error('spots.value is not an array:', spots.value);
          }
        }
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        alert('검색 중 오류가 발생했습니다.');
        spots.value = [];
      }
    };

    const resetSearch = () => {
      selectedSido.value = '';
      selectedSigungu.value = '';
      selectedSpotType.value = '';
      spots.value = [];
      hasSearched.value = false;
      sigungus.value = [];
      clearMarkers(); // 마커 제거

      if (map && window.kakao && window.kakao.maps) {
        map.setCenter(new window.kakao.maps.LatLng(36.2683, 127.6358));
        map.setLevel(13);
      }
    };

    let markers = []; // 마커를 저장할 배열

    const clearMarkers = () => {
      markers.forEach(marker => marker.setMap(null));
      markers = [];
    };

    // const addMarker = (spot) => {
    //   if (!window.kakao || !window.kakao.maps) return;
    //   const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);
    //   const marker = new window.kakao.maps.Marker({
    //     position: position,
    //     map: map
    //   });
    //   markers.push(marker);
    // };

    const addMarker = (spot) => {
      if (!window.kakao || !window.kakao.maps) return;

      const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: map
      });

      // 정보창 내용 구성
      const content = `
    <div class="p-2 bg-white rounded shadow-md">
      <h3 class="font-bold">${spot.title}</h3>
      <p class="text-sm text-gray-600">${spot.frontAddress}</p>
    </div>
  `;

      // 정보창 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: content
      });

      // 마우스 오버 시 정보창 표시
      window.kakao.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
      });

      // 마우스 아웃 시 정보창 제거
      window.kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      markers.push(marker);
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
      window.kakao.maps.event.addListener(map, 'zoom_changed', function () {
        mapZoomLevel.value = map.getLevel();
      });
      //      window.kakao.maps.event.addListener(map, 'dragend', searchNearbySpots);
      // window.kakao.maps.event.addListener(map, 'zoom_changed', searchNearbySpots);
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
    const addToplan = async (spot) => {
      if (!currentPlanId.value) {
        alert('먼저 여행 계획을 시작해주세요.');
        return;
      }
      try {
        await planStore.selectPlace({
          spotId: spot.spotId,
          planId: currentPlanId.value,
          visitOrder: planStore.places.length + 1
        });
        alert('여행 계획에 추가되었습니다.');
      } catch (error) {
        console.error('여행지 추가 실패:', error);
        alert('여행 계획 추가 중 오류가 발생했습니다.');
      }
    };
    // const startNewPlan = async () => {
    //   try {
    //     const docRef = await planStore.insertPlan({
    //       userId: 'admin', // 실제 사용자 ID로 대체해야 함
    //       tripAt: new Date().toISOString().split('T')[0] // 오늘 날짜로 설정
    //     });

    //     currentPlanId.value = docRef.id;
    //     console.log(currentPlanId.value);
    //     alert('새 여행 계획이 생성되었습니다. 계획 ID: ' + currentPlanId.value);
    //   } catch (error) {
    //     console.error('여행 계획 생성 실패:', error);
    //     alert('여행 계획 생성 중 오류가 발생했습니다.');
    //   }
    //     };
    const createPlan = async () => {
      try {
        // 1. 새 계획 생성
        const newPlan = await planStore.insertPlan({
          userId: 'admin', // 실제 사용자 ID로 대체
          tripAt: new Date().toISOString().split('T')[0]
        });

        // 2. 선택한 여행지를 순서대로 추가
        for (let i = 0; i < planStore.selectedSpots.length; i++) {
          const spot = planStore.selectedSpots[i];
          await planStore.selectPlace({
            spotId: spot.spotId,
            planId: newPlan.id,
            visitOrder: i + 1
          });
        }

        // 3. 선택한 여행지 목록 초기화
        planStore.clearSelectedSpots();

        // 4. 계획 페이지로 이동
        router.push({ name: 'PlanView', params: { planId: newPlan.id } });
      } catch (error) {
        console.error('여행 계획 생성 실패:', error);
        alert('여행 계획 생성 중 오류가 발생했습니다.');
      }
    };

    const toggleSpotSelection = (spot) => {
      if (isSpotSelected(spot)) {
        planStore.removeSelectedSpot(spot.spotId);
      } else {
        planStore.addSelectedSpot(spot);
      }
    };

    const isSpotSelected = (spot) => {
      return planStore.selectedSpots.some(s => s.spotId === spot.spotId);
    };
    ;


    // const startNewPlan = () => {
    //   showModal.value = true;
    //   newPlanUserId.value = '';
    //   newPlanTripAt.value = new Date().toISOString().split('T')[0];
    // };
    //     const startNewPlan = () => {
    //   showModal.value = true;
    //   newPlanUserId.value = authStore.user?.id || ''; // 저장된 userId 사용
    //   newPlanTripAt.value = new Date().toISOString().split('T')[0];
    // };

    // const startNewPlan = () => {
    //   const token = localStorage.getItem('accessToken');
    //   if (!token) {
    //     alert('로그인이 필요합니다');
    //     return;
    //   }
    //   showModal.value = true;
    //   const decoded = jwtDecode(token);
    //   newPlanUserId.value = decoded.userId;
    //   newPlanTripAt.value = new Date().toISOString().split('T')[0];
    // };

    const startNewPlan = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다');
        return;
      }
      showModal.value = true;
      newPlanTripAt.value = new Date().toISOString().split('T')[0];
    };



    const cancelNewPlan = () => {
      showModal.value = false;
    };




    // 사용자 id 찾기
    const getUserId = computed(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.userId;
      }
      return '로그인이 필요합니다';
    });

    //   const confirmNewPlan = async () => {
    // if (!newPlanUserId.value || !newPlanTripAt.value) {
    //   alert('사용자 ID와 여행 날짜를 모두 입력해주세요.');
    //   return;
    // }

    // try {
    //   const planData = {
    //     //userId: newPlanUserId.value,
    //     userId: authStore.user?.id,
    //     tripAt: newPlanTripAt.value
    //   };
    //   console.log(planData.userId);
    //   const result = await planStore.insertPlan(planData);
    //   showModal.value = false;

    //   // PlanView로 이동
    //   router.push({
    //     name: 'PlanView',
    //     params: { planId: result.planId }
    //   });
    // } catch (error) {
    //   console.error('여행 계획 생성 실패:', error);
    //   alert('여행 계획 생성 중 오류가 발생했습니다.');
    // }
    //   };
    //
    const togglePlanPanel = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다');
        return;
      }
      showPlanPanel.value = !showPlanPanel.value;
      if (showPlanPanel.value) {
        newPlanTripAt.value = new Date().toISOString().split('T')[0];
      }
    };
    const confirmNewPlan = async () => {
      if (!newPlanTripAt.value) {
        alert('여행 날짜를 입력해주세요.');
        return;
      }
      try {
        const token = localStorage.getItem('accessToken');
        const decoded = jwtDecode(token);
        const planData = {
          userId: decoded.userId,
          tripAt: newPlanTripAt.value
        };
        const result = await planStore.insertPlan(planData);
        showPlanPanel.value = false;
        router.push({
          name: 'PlanView',
          params: { planId: result.planId }
        });
      } catch (error) {
        console.error('여행 계획 생성 실패:', error);
        alert('여행 계획 생성 중 오류가 발생했습니다.');
      }
    };





    // 기존 여행 계획에 추가하는 경우
    const addAndReturnToPlan = async () => {
      const planId = route.query.planId;
      if (planId) {
        router.push({
          name: 'PlanView',
          params: { planId }
        });
      }
    };
    // 계획 계속하기 함수
    const continuePlan = () => {
      router.push({
        name: 'PlanView',
        params: { planId: route.query.planId }
      });
    };

    const searchNearbySpots = async () => {
      if (!map) return;
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      try {
        const params = {
          minLatitude: sw.getLat(),
          maxLatitude: ne.getLat(),
          minLongitude: sw.getLng(),
          maxLongitude: ne.getLng()
        };

        if (selectedSpotType.value) {
          params.contentTypeId = selectedSpotType.value;
        }

        if (searchKeyword.value) {
          params.keyword = searchKeyword.value;
        }

        const response = await spotStore.searchNearbySpots(params);
        spots.value = response;
        clearMarkers();
        spots.value.forEach(spot => addMarker(spot));
      } catch (error) {
        console.error('주변 관광지 검색 실패:', error);
        alert('여행 명소가 없습니다');
      }
    };


    const isLeftPanelOpen = ref(true);

    const toggleLeftPanel = () => {
      isLeftPanelOpen.value = !isLeftPanelOpen.value;
    };

    return {
      searchKeyword,
      filteredSpots,
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
      zoomOut,
      currentPlanId,
      addToplan,
      startNewPlan,
      createPlan,
      isSpotSelected,
      toggleSpotSelection,
      //showModal,
      newPlanUserId,
      newPlanTripAt,
      cancelNewPlan,
      confirmNewPlan,
      addAndReturnToPlan,
      continuePlan,
      route,
      addMarker,
      getUserId,
      //handleImageError,
      searchNearbySpots,
      isLeftPanelOpen,
      toggleLeftPanel,
      showPlanPanel,
      togglePlanPanel,
      defaultImage
    };
  }
};
</script>
