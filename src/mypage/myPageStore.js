// src/stores/myPageStore.js
import { defineStore } from 'pinia';
import api from "@/Auth/api/AuthIndex";

export const useMypageStore = defineStore('mypage', {
  state: () => ({
    profile: null,
    user: null,
    plans: [],
    reviews: [], // 빈 배열로 초기화
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
        console.log(`info`,response);
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
        this.user = userId;
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

async fetchUserReviews(userId) {
  this.isLoading = true;
  try {
    const response = await api.get('/review/userlist', {
      params: { userId }
    });

    // 서버에서 받은 데이터가 존재하는지 확인
    if (response.data && response.data.length > 0) {
      this.reviews = response.data; 
      this.totalCount = response.data.length; 
    } else {
      this.reviews = []; 
      this.totalCount = 0; 
    }
    
    return response.data;
  } catch (error) {
    this.error = error.message; 
    console.error('사용자 리뷰 조회 실패:', error);
    this.reviews = []; 
  } finally {
    this.isLoading = false; 
  }
},
    //리뷰 삭제
    async deleteUserReview(reviewNo) {
      this.isLoading = true; 
      console.log(this.user); 
      try {
        
        await api.post('/review/delete', { reviewNo, userId: this.user }); 
        
      } catch (error) {
        this.error = error.message; 
        console.error('리뷰 삭제 실패:', error);
        throw error; 
      } finally {
        this.isLoading = false; 
      }
    },
    async deleteReviewPhoto(reviewNo, photoUrl) {
      this.isLoading = true; 
      try {
        await api.post('/review/deletePhoto', { reviewNo, photoUrl });
      } catch (error) {
        this.error = error.message;
        console.error('사진 삭제 실패:', error);
        throw error; 
      } finally {
        this.isLoading = false;
      }
    },
    async modifyReview(reviewData) {
      this.isLoading = true;
      try {
        const formData = new FormData();
    
        // formData.append('reviewUpdateJson', JSON.stringify({
        //   reviewNo: reviewData.reviewNo,
        //   userId: this.user.id, 
        //   title: reviewData.title,
        //   content: reviewData.content,
        //   score: reviewData.score,
        //   deletePhotoUrls: reviewData.deletePhotoUrls || [] 
        // }));
        
        const reviewUpdateJson = {
          reviewNo: reviewData.reviewNo,
          userId: this.user, 
          title: reviewData.title,
          content: reviewData.content,
          score: reviewData.score,
          deletePhotoUrls: reviewData.deletePhotoUrls || []
        };
        //console.log(this.user);
    
        formData.append('reviewUpdateJson', JSON.stringify(reviewUpdateJson));
    
        // FormData 값 확인하기
        // console.log('reviewUpdateJson:', reviewUpdateJson);
        // console.log('FormData content:', formData.get('reviewUpdateJson'));

        // console.log(`formData::::`, formData.title);
       
        if (reviewData.newPhotos && reviewData.newPhotos.length > 0) {
          reviewData.newPhotos.forEach(photo => {
            formData.append('newPhotos', photo);
          });
        }
    
        const response = await api.post('/review/modify', formData, {
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
    
        console.log(response);
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('리뷰 수정 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  
  }
});