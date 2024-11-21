<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">여행 계획</h1>
      <div v-if="planStore.places.length > 0">
        <div v-for="(place, index) in planStore.places" :key="place.placeId" class="mb-4 p-4 border rounded-lg">
          <h2 class="text-xl font-semibold">{{ index + 1 }}. {{ place.title }}</h2>
          <p>{{ place.frontAddress }}</p>
          <button @click="removePlace(place)" class="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            삭제
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        선택된 여행지가 없습니다.
      </div>
    </div>
  </template>
  
  <script>
  import { usePlanStore } from '@/stores/planStore';
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
      const planStore = usePlanStore();
      const route = useRoute();
  
      onMounted(async () => {
        const planId = route.params.planId;
        await planStore.listPlaces(planId);
      });
  
      const removePlace = async (place) => {
        await planStore.deletePlace({
          planId: route.params.planId,
          placeId: place.placeId
        });
      };
  
      return {
        planStore,
        removePlace
      };
    }
  };
  </script>