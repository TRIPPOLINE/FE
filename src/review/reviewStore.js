import { defineStore } from 'pinia';
import axios from "axios"; 

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [],
  }),

  actions: {
    async writeReview(formData) {
      try {
        const response = await axios.post('http://localhost:8080/api/review/write', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('리뷰 작성 실패:', error);
        throw error;
      }
    },

    // Other actions related to reviews can be added here
  },
});