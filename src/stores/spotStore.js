// stores/spotStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/spot',
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
      try {
        const response = await apiClient.get(`/sigungus/${sidoCode}`);
        this.sigungus = response.data;
      } catch (error) {
        console.error('시군구 목록 조회 실패:', error);
        throw error;
      }
    },

    async fetchSpotTypes() {
      try {
        const response = await apiClient.get('/contenttypes');
        this.spotTypes = response.data;
      } catch (error) {
        console.error('관광지 타입 조회 실패:', error);
        throw error;
      }
    },

    async searchSpots() {
      try {
        const response = await apiClient.get('/search', {
          params: {
            sidoCode: this.selectedSido,
            sigunguCode: this.selectedSigungu,
            contentTypeId: this.selectedSpotType
          }
        });
        this.spots = response.data;
      } catch (error) {
        console.error('관광지 검색 실패:', error);
        throw error;
      }
    }
  }
});