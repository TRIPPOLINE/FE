// src/stores/myPageStore.js
import { defineStore } from 'pinia';
import api from "@/Auth/api/AuthIndex";

export const useMypageStore = defineStore('mypage', {
  state: () => ({
    profile: null,
    user: null,
    plans: [],
    reviews: [], // 빈 배열로 초기화
    totalCount: 0, // 페이지네이션을 위한 총 개수 추가
    isLoading: false,
    error: null
  }),

  getters: {
    hasProfile: (state) => !!state.profile,
    hasUser: (state) => !!state.user,
  },

  actions: {
    // 프로필 조회
    async fetchProfile(userId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/profile/select/${userId}`);
        this.profile = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('프로필 조회 실패:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 프로필 생성
    async createProfile(formData) {
      this.isLoading = true;
      try {
        const response = await api.post('/profile/insert', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.profile = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('프로필 생성 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 프로필 수정
    async modifyProfile(formData) {
      this.isLoading = true;
      try {
        const response = await api.post('/profile/modify', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.profile = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('프로필 수정 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 사용자 정보 조회
    async fetchUserInfo(userId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/user/select/${userId}`);
        this.user = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 사용자 정보 수정
    async updateUserInfo(userData) {
      this.isLoading = true;
      try {
        const response = await api.post(`/user/update/${userData.id}`, userData);
        this.user = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('사용자 정보 수정 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 사용자 plan 조회
    async fetchPlans(userId) {
      this.isLoading = true;
      try {
        console.log('user:', userId);
        const response = await api.get(`/plan/listplan`, {
          params: { userId },
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        console.log('Plans response:', response);
        this.plans = response.data;
      } catch (error) {
        console.error('플랜 조회 실패:', error.response || error);
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // 사용자 plan 삭제
    async deletePlan(planId) {
      this.isLoading = true;
      try {
        await api.post('/plan/deletePlan', { planId });
        this.plans = this.plans.filter(plan => plan.planId !== planId);
      } catch (error) {
        this.error = error.message;
        console.error('플랜 삭제 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 여행 계획의 여행지 조회
    async fetchSpotById(spotId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/spot/${spotId}`);
        return response.data;
      } catch (error) {
        console.error('여행지 상세 정보 조회 실패:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // 여행지 정보 조회
    async fetchSpotInfo(spotId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/spot/sigungu/${spotId}/attraction`);
        return response.data;
      } catch (error) {
        console.error('여행지 정보 조회 실패:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // plan 상세 조회
    async fetchPlanDetails(planId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/plan/list`, {
          params: { planId }
        });
        this.currentPlan = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('플랜 상세 조회 실패:', error);
      } finally {
        this.isLoading = false;
      }
    },
    // 내 리뷰 보기
    async fetchUserReviews(userId, page = 1, size = 5) {
      this.isLoading = true;
      try {
        const response = await api.get('/review/userlist', {
          params: {
            userId,
            page,
            size
          }
        });
        this.reviews = response.data || []; // 응답이 없을 경우 빈 배열 할당
        this.totalCount = response.data?.length || 0;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('사용자 리뷰 조회 실패:', error);
        this.reviews = []; // 에러 발생 시 빈 배열로 초기화
      } finally {
        this.isLoading = false;
      }
    }
  }
});