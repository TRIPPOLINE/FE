// stores/planStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/plan',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('accessToken')
  },
});

export const usePlanStore = defineStore('plan', {
  state: () => ({
    places: [],
    currentPlan: null,
    selectedSpots: [],
    currentPlanId: null,
  }),

  actions: {
    // async listPlaces(planId) {
    //   try {
    //     const response = await apiClient.get('/list', { params: { planId } });
    //     this.places = response.data;
    //   } catch (error) {
    //     console.error('여행지 목록 조회 실패:', error);
    //     throw error;
    //   }
    // },
    async listPlaces(planId) {
      try {
        // planId를 정수로 변환
        const numericPlanId = parseInt(planId, 10);
        const response = await apiClient.get('/list', { 
          params: { 
            planId: numericPlanId 
          } 
        });
        this.places = response.data;
      } catch (error) {
        console.error('여행지 목록 조회 실패:', error.response?.data || error);
        throw error;
      }
    },
    async selectPlace(placeDto) {
      try {
        const response = await apiClient.post('/select', placeDto);
        await this.listPlaces(placeDto.planId);
        return response.data;
      } catch (error) {
        console.error('여행지 선택 실패:', error);
        throw error;
      }
    },

    async deletePlace(placeDto) {
      try {
        await apiClient.post('/delete', placeDto);
        await this.listPlaces(placeDto.planId);
      } catch (error) {
        console.error('여행지 삭제 실패:', error);
        throw error;
      }
    },

    async modifyOrder(placeDto) {
      try {
        await apiClient.post('/order', placeDto);
        await this.listPlaces(placeDto.planId);
      } catch (error) {
        console.error('여행지 순서 변경 실패:', error);
        throw error;
      }
    },

    async deletePlan(planDto) {
      try {
        await apiClient.post('/deletePlan', planDto);
        this.currentPlan = null;
      } catch (error) {
        console.error('여행 계획 삭제 실패:', error);
        throw error;
      }
    },
    // async insertPlan(planDto) {
    //   try {
    //     const response = await apiClient.post('/insert', planDto);
    //     this.currentPlan = response.data;
    //     return response.data;
    //   } catch (error) {
    //     console.error('여행 계획 생성 실패:', error);
    //     throw error;
    //   }
    // },
    // async insertPlan(planData) {
    //   try {
    //     // 데이터 형식 검증
    //     if (!planData.userId || !planData.tripAt) {
    //       throw new Error('필수 데이터가 누락되었습니다.');
    //     }
    
    //     // 날짜 형식을 서버가 기대하는 형식으로 변환
    //     const formattedData = {
    //       userId: planData.userId,
    //       tripAt: planData.tripAt
    //     };
    
    //     const response = await apiClient.post('/insert', formattedData);
    //     this.currentPlan = response.data;
    //     console.log('서버 응답:', response.data);
    //     console.log(currentPlan);
    //     return response.data;
    //   } catch (error) {
    //     console.error('Plan insertion error details:', error.response?.data);
    //     throw error;
    //   }
    // },

    async addSelectedSpot(spot) {
      this.selectedSpots.push(spot);
    },

    async removeSelectedSpot(spotId) {
      this.selectedSpots = this.selectedSpots.filter(spot => spot.spotId !== spotId);
    },

    async clearSelectedSpots() {
      this.selectedSpots = [];
    },
    async insertPlan(planData) {
      try {
        if (!planData.userId || !planData.tripAt) {
          throw new Error('필수 데이터가 누락되었습니다.');
        }

        const formattedData = {
          userId: planData.userId,
          tripAt: planData.tripAt
        };

        const response = await apiClient.post('/insert', formattedData);
        
        // 서버에서 반환된 데이터에서 planId 추출 및 저장
        const planDto = response.data;
        this.currentPlan = planDto;
        this.currentPlanId = planDto.planId;
        
        console.log('생성된 계획 ID:', this.currentPlanId);
        return planDto;
      } catch (error) {
        console.error('Plan insertion error:', error);
        throw error;
      }
    },

    // planId 조회를 위한 getter 메서드 추가
    getCurrentPlanId() {
      return this.currentPlanId;
    },

    // planId 초기화 메서드 추가
    clearCurrentPlan() {
      this.currentPlan = null;
      this.currentPlanId = null;
    }
  },
});