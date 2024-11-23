<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">여행지 검색하기</h1>

    <!-- 검색 폼 -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 시도 선택 -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">시/도</label>
          <select v-model="selectedSido" @change="handleSidoChange"
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
            <option value="">선택하세요</option>
            <option v-for="sido in sidos" :key="sido.sidoCode" :value="sido.sidoCode">
              {{ sido.sidoName }}
            </option>
          </select>
        </div>

        <!-- 시군구 선택 -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">시/군/구</label>
          <select v-model="selectedSigungu" :disabled="!selectedSido" @change="handleSigunguChange"
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
            <option value="">선택하세요</option>
            <option v-for="sigungu in sigungus" :key="sigungu.gugunCode" :value="sigungu.gugunCode">
              {{ sigungu.gugunName }}
            </option>
          </select>
        </div>

        <!-- 관광지 타입 선택 -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">관광지 타입</label>
          <select v-model="selectedSpotType" @change="handleSpotTypeChange"
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
            <option value="">전체</option>
            <option v-for="type in spotTypes" :key="type.spotTypeId" :value="type.spotTypeId">
              {{ type.spotTypeName }}
            </option>
          </select>
        </div>
      </div>

      <!-- 키워드 검색 입력 필드 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">키워드 검색</label>
        <input v-model="searchKeyword" type="text" placeholder="검색어를 입력하세요"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
      </div>

      <!-- 버튼 그룹 -->
      <div class="mt-6 flex justify-end space-x-4">
        <button @click="resetSearch"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300">
          초기화
        </button>
        <button @click="searchSpots"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300">
          검색
        </button>
      </div>
    </div>

    <!-- 검색 결과 및 지도 영역 -->
    <div class="flex flex-col lg:flex-row">
      <!-- 검색 결과 -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden w-full lg:w-1/3 lg:mr-4 h-[500px] flex flex-col">
        <div v-if="spots.length > 0" class="flex-grow overflow-y-auto">
          <div class="grid grid-cols-1 gap-4 p-4">
            <div v-for="spot in filteredSpots" :key="spot.spotId"
                 class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-300"
                 @click="showSpotOnMap(spot)">
              <img :src="spot.imagePath1 || '../placeholder-image.png'" :alt="spot.title"
                   class="w-full h-40 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">{{ spot.title }}</h3>
                <p class="text-sm text-gray-600">{{ spot.frontAddress }}</p>
                <button @click.stop="toggleSpotSelection(spot)"
                        class="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                  {{ isSpotSelected(spot) ? '선택 취소' : '선택하기' }}
                </button>
              </div>
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

      <!-- 지도 영역 -->
      <div id="map" class="w-full h-[500px] lg:w-2/3 rounded-lg shadow-lg relative mt-4 lg:mt-0">
        <div class="absolute top-4 right-4 z-10 flex flex-col">
          <button @click="zoomIn" class="bg-white p-2 rounded-t-md shadow hover:bg-gray-100 transition-colors duration-300">+</button>
          <button @click="zoomOut" class="bg-white p-2 rounded-b-md shadow hover:bg-gray-100 transition-colors duration-300">-</button>
        </div>
      </div>
    </div>

    <!-- 여행 계획 버튼 -->
    <div class="mt-8 text-center">
      <button v-if="!route.query.planId" @click="showModal = true"
              class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105">
        여행 계획 생성하기
      </button>
      <button v-else @click="continuePlan"
              class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
        선택 완료
      </button>
    </div>

    <!-- 모달 컴포넌트 -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl relative max-w-md w-full">
          <h2 class="text-2xl font-bold mb-6">새 여행 계획 생성</h2>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">사용자 ID</label>
            <p class="px-3 py-2 border rounded-md bg-gray-100">{{ getUserId }}</p>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">여행 날짜</label>
            <input v-model="newPlanTripAt" type="date"
                   class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="flex justify-end space-x-4">
            <button @click="cancelNewPlan"
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-300">
              취소
            </button>
            <button @click="confirmNewPlan"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
              생성
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

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



    const showModal = ref(false);
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

  //   const searchSpots = async () => {
  // if (!selectedSido.value || !selectedSigungu.value) return;
  // hasSearched.value = true;
  // const contentTypeId = selectedSpotType.value || null;

  // await spotStore.searchSpots({
  //   areaCode: selectedSido.value,
  //   siGunGuCode: selectedSigungu.value,
  //   contentTypeId: contentTypeId
  // });

  // spots.value = spotStore.spots;

  // if (map && window.kakao && window.kakao.maps) {
  //   clearMarkers(); // 기존 마커 제거
  //   spots.value.forEach(spot => addMarker(spot));
  //   if (spots.value.length > 0) {
  //     showSpotOnMap(spots.value[0]);
  //   }
  // }
    //   };

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
  window.kakao.maps.event.addListener(marker, 'mouseover', function() {
    infowindow.open(map, marker);
  });

  // 마우스 아웃 시 정보창 제거
  window.kakao.maps.event.addListener(marker, 'mouseout', function() {
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

// const confirmNewPlan = async () => {
//   if (!newPlanUserId.value || !newPlanTripAt.value) {
//     alert('사용자 ID와 여행 날짜를 모두 입력해주세요.');
//     return;
//   }

//   try {
//     const planData = {
//       userId: newPlanUserId.value,
//       tripAt: newPlanTripAt.value // input type="date"에서 받은 'YYYY-MM-DD' 형식의 문자열
//     };

//     const response = await planStore.insertPlan(planData);
//     currentPlanId.value = response.planId;
//     showModal.value = false;
//     alert('새 여행 계획이 생성되었습니다.');
//   } catch (error) {
//     console.error('여행 계획 생성 실패:', error);
//     alert('여행 계획 생성 중 오류가 발생했습니다.');
//   }
    // };
// const confirmNewPlan = async () => {
//   if (!newPlanUserId.value || !newPlanTripAt.value) {
//     alert('사용자 ID와 여행 날짜를 모두 입력해주세요.');
//     return;
//   }

//   try {
//     const planData = {
//       userId: newPlanUserId.value,
//       tripAt: newPlanTripAt.value
//     };

//     console.log('전송할 데이터:', planData); // 디버깅용
//     const response = await planStore.insertPlan(planData);
//     showModal.value = false;
//     alert('새 여행 계획이 생성되었습니다.');
//   } catch (error) {
//     console.error('여행 계획 생성 실패 상세:', error.response?.data);
//     alert('여행 계획 생성 중 오류가 발생했습니다.');
//   }
    // };
    const router = useRouter();
//     const confirmNewPlan = async () => {
//   if (!newPlanUserId.value || !newPlanTripAt.value) {
//     alert('사용자 ID와 여행 날짜를 모두 입력해주세요.');
//     return;
//   }

//   try {
//     const planData = {
//       userId: newPlanUserId.value,
//       tripAt: newPlanTripAt.value
//     };

//     const result = await planStore.insertPlan(planData);
//     showModal.value = false;

//     // planId를 사용하여 PlanView 페이지로 이동
//     router.push({
//       name: 'PlanView',
//       params: { planId: result.planId }
//     });
//   } catch (error) {
//     console.error('여행 계획 생성 실패:', error);
//     alert('여행 계획 생성 중 오류가 발생했습니다.');
//   }
    // };


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
    console.log(`사용자 아이디`,planData.userId);
    const result = await planStore.insertPlan(planData);
    showModal.value = false;

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
//     const handleImageError = (e) => {
//   e.target.src = '../placeholder-image.png';
// };


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
      showModal,
  newPlanUserId,
  newPlanTripAt,
  cancelNewPlan,
  confirmNewPlan,
  addAndReturnToPlan,
      continuePlan,
      route,
      addMarker,
      getUserId
      //handleImageError
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
scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: 500px;
  overflow-y: auto;
}

/* Webkit 브라우저 (Chrome, Safari, Edge) 용 스타일 */
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

/* Firefox 용 스타일 */
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>
