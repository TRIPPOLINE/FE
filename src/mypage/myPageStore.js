// src/stores/myPageStore.js
import { defineStore } from 'pinia';
import api from "@/Auth/api/AuthIndex";

export const useMypageStore = defineStore('mypage', {
  state: () => ({
    profile: null,
    user: null,
    plans: [],
    reviews: [],
    isLoading: false,
    error: null
  }),

  getters: {
    hasProfile: (state) => !!state.profile,
    hasUser: (state) => !!state.user,
  },

  actions: {
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

    async fetchPlans(userId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/plans/${userId}`);
        this.plans = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('플랜 조회 실패:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReviews(userId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/reviews/${userId}`);
        this.reviews = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('리뷰 조회 실패:', error);
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});