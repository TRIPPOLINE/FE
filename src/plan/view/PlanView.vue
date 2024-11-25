<template>
  <div class="container mx-auto p-4 mt-16">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">여행 계획</h1>

      <div class="flex gap-2">
        <button @click="getOptimizedRoute"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
          추천 경로
        </button>
        <button @click="getRecommendations"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          :disabled="!planStore.selectedSpots.length">
          주변 명소 추천
        </button>
        <button @click="goToSearch"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          여행지 추가하기
        </button>

      </div>
    </div>

    <div class="flex gap-4">
      <!-- 좌측: 선택된 여행지 목록 -->
      <div class="w-1/4">

        <draggable v-model="planStore.selectedSpots" @end="handleDragEnd" item-key="spotId" class="space-y-4">
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


      <!-- 중앙: 지도 -->
      <div :class="{ 'w-2/4': showChat, 'w-3/4': !showChat }" class="transition-all duration-300">
        <div id="map" class="w-full h-[600px] rounded-lg shadow-md"></div>
      </div>

      <!-- 우측: 추천 채팅창 -->
      <div v-if="showChat" class="w-1/4 transition-all duration-300">
        <div class="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
          <div class="flex justify-between items-center p-4 border-b">
            <div class="flex items-center gap-2">
              <h3 class="font-bold">여행지 추천</h3>
              <span class="beta-tag">Beta</span>
            </div>
            <button @click="closeChat" class="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4" ref="chatContainer">
            <div v-for="(message, index) in messages" :key="index" class="mb-4">
              <div class="p-3 rounded-lg bg-gray-100">
                <div v-if="message.loading" class="flex gap-1">
                  <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
                <div v-else v-html="message.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->

    <div class="mt-6 flex justify-end space-x-4">
      <button @click="deleteCurrentPlan"
        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">계획 삭제</button>
      <button @click="savePlan"
        class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        계획 완료
      </button>
    </div>
  </div>
</template>

<script>
import { usePlanStore } from "@/plan/planStore";
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import axios from 'axios';
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
    const showChat = ref(false);
    const messages = ref([]);
    const socket = ref(null);
    const chatContainer = ref(null);
    const polyline = ref(null);
    const kakaoApiKey = '40b33645cf352fca947afb475d364b6b';
    const infoWindow = ref(null);

    const getOptimizedRoute = async () => {
      if (planStore.selectedSpots.length < 2) {
        alert('최소 2개 이상의 여행지를 선택해주세요.');
        return;
      }

      const origin = planStore.selectedSpots[0];
      const destination = planStore.selectedSpots[planStore.selectedSpots.length - 1];
      const waypoints = planStore.selectedSpots.slice(1, -1).map(spot => ({
        name: spot.title,
        x: spot.longitude,
        y: spot.latitude
      }));

      try {
        const response = await axios.post('https://apis-navi.kakaomobility.com/v1/waypoints/directions', {
          origin: { x: origin.longitude, y: origin.latitude },
          destination: { x: destination.longitude, y: destination.latitude },
          waypoints: waypoints,
          priority: 'RECOMMEND'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `KakaoAK ${kakaoApiKey}`

          }
        });

        drawOptimizedRoute(response.data);
      } catch (error) {
        console.error('경로 최적화 요청 실패:', error);
        alert('경로 최적화 중 오류가 발생했습니다.');
      }
    };

    // const drawOptimizedRoute = (data) => {
    //   if (!map.value || !window.kakao) return;

    //   // 기존 폴리라인 제거
    //   if (polyline.value) {
    //     polyline.value.setMap(null);
    //   }

    //   const path = [];
    //   data.routes[0].sections.forEach(section => {
    //     section.roads.forEach(road => {
    //       for (let i = 0; i < road.vertexes.length; i += 2) {
    //         path.push(new window.kakao.maps.LatLng(road.vertexes[i + 1], road.vertexes[i]));
    //       }
    //     });
    //   });

    //   polyline.value = new window.kakao.maps.Polyline({
    //     path: path,
    //     strokeWeight: 5,
    //     strokeColor: '#3B82F6',
    //     strokeOpacity: 0.8,
    //     strokeStyle: 'solid',
    //     strokeLineCap: 'round',
    //     strokeLineJoin: 'round'
    //   });

    //   // 라인 애니메이션 효과 추가
    //   const linePath = polyline.value.getPath();
    //   const distanceOverlay = new window.kakao.maps.CustomOverlay({
    //     content: '<div class="dotOverlay">총 거리 <span class="number"></span>km</div>',
    //     position: linePath[linePath.length - 1],
    //     yAnchor: 1,
    //     zIndex: 2
    //   });

    //   let drawLine;
    //   const drawAnim = () => {
    //     drawLine = new window.kakao.maps.Polyline({
    //       path: [linePath[0]],
    //       strokeWeight: 5,
    //       strokeColor: '#4CAF50',
    //       strokeOpacity: 0.9,
    //       strokeStyle: 'solid',
    //       strokeLineCap: 'round',
    //       strokeLineJoin: 'round'
    //     });

    //     drawLine.setMap(map.value);

    //     let i = 1;
    //     const timer = setInterval(() => {
    //       if (i < linePath.length) {
    //         drawLine.getPath().push(linePath[i]);
    //         i++;
    //       } else {
    //         clearInterval(timer);
    //         distanceOverlay.setMap(map.value);
    //       }
    //     }, 30);
    //   };

    //   polyline.value.setMap(map.value);
    //   drawAnim();

    //   // 지도 범위 재설정
    //   const bounds = new window.kakao.maps.LatLngBounds();
    //   path.forEach(position => bounds.extend(position));
    //   map.value.setBounds(bounds);
    // };

    const createInfoWindow = (content, position) => {
      if (infoWindow.value && typeof infoWindow.value.close === 'function') {
        infoWindow.value.close();
      }

      infoWindow.value = new kakao.maps.InfoWindow({
        content: content,
        position: position,
        removable: true
      });

      infoWindow.value.open(map.value);
    };

    const drawOptimizedRoute = (data) => {
      if (!map.value || !window.kakao) return;

      // 기존 폴리라인 제거
      if (polyline.value) {
        polyline.value.setMap(null);
      }

      const path = [];
      data.routes[0].sections.forEach(section => {
        section.roads.forEach(road => {
          for (let i = 0; i < road.vertexes.length; i += 2) {
            path.push(new window.kakao.maps.LatLng(road.vertexes[i + 1], road.vertexes[i]));
          }
        });
      });

      polyline.value = new window.kakao.maps.Polyline({
        path: path,
        strokeWeight: 5,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        strokeLineCap: 'round',
        strokeLineJoin: 'round'
      });

      polyline.value.setMap(map.value);

      // 지도 범위 재설정
      const bounds = new window.kakao.maps.LatLngBounds();
      path.forEach(position => bounds.extend(position));
      map.value.setBounds(bounds);

      // 말풍선 내용 생성
      const { duration, distance } = data.routes[0].summary;
      const content = `
    <div style="padding:10px; background:white; border-radius:5px;">
      <h4 style="margin-bottom:5px;">경로 정보</h4>
      <p>총 거리: ${(distance / 1000).toFixed(1)} km</p>
      <p>예상 소요 시간: ${Math.round(duration / 60)} 분</p>
    </div>
  `;

      // 인포윈도우 생성 및 표시
      createInfoWindow(content, path[Math.floor(path.length / 2)]);
    };



    const initWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8080/trip-recommendation');

      ws.onopen = () => {
        console.log('WebSocket 연결 성공');
        const spots = planStore.selectedSpots.map(spot => spot.title);
        ws.send(JSON.stringify({ spots }));
      };

      ws.onmessage = (event) => {
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage && lastMessage.loading) {
          lastMessage.loading = false;
          lastMessage.content = event.data.replace(/\n/g, '<br>');
        }
        scrollToBottom();
      };

      ws.onclose = () => {
        console.log('WebSocket 연결 종료');
      };

      ws.onerror = (error) => {
        console.error('WebSocket 에러:', error);
        alert('서버 연결에 실패했습니다.');
      };

      return ws;
    };

    const getRecommendations = () => {
      if (!planStore.selectedSpots.length) {
        alert('최소 한 개 이상의 여행지를 선택해주세요.');
        return;
      }

      showChat.value = true;
      messages.value.push({
        content: '',
        loading: true
      });

      if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
        socket.value = initWebSocket();
      } else {
        const spots = planStore.selectedSpots.map(spot => spot.title);
        socket.value.send(JSON.stringify({ spots }));
      }

      scrollToBottom();
    };

    const scrollToBottom = async () => {
      await nextTick();
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    };

    const closeChat = () => {
      showChat.value = false;
      messages.value = [];
      if (socket.value) {
        socket.value.close();
        socket.value = null;
      }
    };

    const removeSpot = (spotId) => {
      planStore.removeSelectedSpot(spotId);
      updateMarkers();
    };

    const handleDragEnd = () => {
      updateMarkers();
    };

    const updateMarkers = () => {
      if (!map.value || !window.kakao) return;

      // 기존 마커와 오버레이 제거
      markers.value.forEach(marker => marker.setMap(null));
      markers.value = [];

      // 기존 Polyline 제거
      if (polyline.value) {
        polyline.value.setMap(null);
      }

      const path = [];

      planStore.selectedSpots.forEach((spot, index) => {
        const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);
        path.push(position);

        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map.value
        });

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          //content: `< div class= "marker-label" > ${index + 1}</div > `,

          map: map.value,
          yAnchor: 0
        });

        markers.value.push(marker);
        markers.value.push(customOverlay);
      });

      // Polyline 그리기
      polyline.value = new window.kakao.maps.Polyline({
        path: path,
        strokeWeight: 3,
        strokeColor: '#db4040',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
      });

      polyline.value.setMap(map.value);
      if (path.length > 0) {
        const bounds = new window.kakao.maps.LatLngBounds();
        path.forEach(position => bounds.extend(position));
        map.value.setBounds(bounds);
      }
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
            level: 9
          };
          map.value = new window.kakao.maps.Map(container, options);

          // 줌 컨트롤
          const zoomControl = new window.kakao.maps.ZoomControl();
          map.value.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          updateMarkers();
        });
      };
      document.head.appendChild(script);
    });
    onUnmounted(() => {
      if (socket.value) {
        socket.value.close();
      }
    });

    const goToSearch = () => {
      router.push({
        name: 'SearchView',
        query: { planId: route.params.planId }
      });
    };


    const savePlan = async () => {
      try {
        if (planStore.selectedSpots.length === 0) {
          alert('최소 한 개 이상의 여행지를 선택해주세요.');
          return;
        }

        for (let i = 0; i < planStore.selectedSpots.length; i++) {
          const spot = planStore.selectedSpots[i];
          await planStore.selectPlace({
            spotId: spot.spotId,
            planId: route.params.planId,
            visitOrder: i + 1
          });
        }

        alert('여행 계획이 저장되었습니다.');

        planStore.clearSelectedSpots();

        router.push('/');
      } catch (error) {
        console.error('계획 저장 실패:', error);
        alert('계획 저장 중 오류가 발생했습니다.');
      }
    };
    const deleteCurrentPlan = async () => {
      try {
        if (!planStore.currentPlanId) {
          alert('삭제할 계획이 없습니다.');
          return;
        }

        if (confirm('정말로 이 계획을 삭제하시겠습니까?')) {
          await planStore.deletePlan({ planId: planStore.currentPlanId });
          alert('계획이 삭제되었습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('계획 삭제 실패:', error);
        alert('계획 삭제 중 오류가 발생했습니다.');
      }
    };

    return {
      planStore,
      removeSpot,
      handleDragEnd,
      goToSearch,

      savePlan,
      showChat,
      messages,
      getRecommendations,
      closeChat,
      chatContainer,
      deleteCurrentPlan,
      getOptimizedRoute,
      drawOptimizedRoute
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

.beta-tag {
  font-family: 'Nunito', sans-serif;
  font-size: 0.7rem;
  font-weight: bold;
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  animation: pulse 2s infinite;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
