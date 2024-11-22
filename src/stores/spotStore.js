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
import api from '@/Auth/api/Index';

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
        console.log('Current headers:', api.defaults.headers.common);
        const response = await api.get('/spot/sidos');
        this.sidos = response.data;
      } catch (error) {
        console.error('시도 목록 조회 실패:', error);
        throw error;
      }
    },

    async fetchSigungus(sidoCode) {
      try {
        const response = await api.get(`/spot/sigungus/${sidoCode}`);
        return response.data;
      } catch (error) {
        console.error('시군구 목록 조회 실패:', error);
        throw error;
      }
    },

    async fetchSpotTypes() {
      try {
        const response = await api.get('/spot/contenttypes');
        return response.data;
      } catch (error) {
        console.error('관광지 유형 조회 실패:', error);
        throw error;
      }
    },

    async searchSpots({ areaCode, siGunGuCode, contentTypeId }) {
      try {
        console.log('areaCode:', areaCode);
        console.log('siGunGuCode:', siGunGuCode);
        console.log('contentTypeId:', contentTypeId);
        
        const response = await api.post('/spot/search', {
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