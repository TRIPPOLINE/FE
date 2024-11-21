// stores/spotStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/spot',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useSpotStore = defineStore('spot', {
  state: () => ({
    sidos: [],
    sigungus: [],
    spotTypes: [],
    spots: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedSpotType: null,
  }),

  actions: {
    async fetchSidos() {
      try {
        const response = await apiClient.get('/sidos');
        this.sidos = response.data;
      } catch (error) {
        console.error('시도 목록 조회 실패:', error);
        throw error;
      }
    },

    async fetchSigungus(sidoCode) {
        const response = await apiClient.get(`/sigungus/${sidoCode}`);
        return response.data;
    },

    async fetchSpotTypes() {
      const response = await apiClient.get('/contenttypes');
      return response.data;
    },

    async searchSpots({ areaCode, siGunGuCode, contentTypeId }) {
      try {
        console.log('areaCode:', areaCode);
        console.log('siGunGuCode:', siGunGuCode);
        console.log('contentTypeId:', contentTypeId);
        
        const response = await apiClient.post('/search', {
          areaCode,
          siGunGuCode,
          contentTypeId: contentTypeId || null
        });
        
        this.spots = response.data;
        return response.data;
      } catch (error) {
        console.error('검색 실패:', error);
        throw error;
      }
    }
  }
});