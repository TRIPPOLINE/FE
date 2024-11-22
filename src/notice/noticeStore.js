// stores/noticeStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    notices: [],
    totalCount: 0,
    currentPage: 1,
    sizePerPage: 10,
  }),

  actions: {
    async fetchNotices(page = 1) {
      try {
        const response = await apiClient.get('/notice/list', {
          params: {
            page,
            size: this.sizePerPage
          }
        });
        
        if (response.data) {
          this.notices = response.data.content || [];
          this.totalCount = response.data.totalElements || 0;
          this.currentPage = response.data.currentPage;
        }
      } catch (error) {
        console.error('공지사항 목록 조회 실패:', error);
        throw error;
      }
    },
    async fetchNotices(page = 1) {
      try {
        const response = await apiClient.get('/notice/search', {
          params: {
            page,
            size: this.sizePerPage,
            ...this.searchParams
          }
        });
        
        if (response.data) {
          this.notices = response.data.content || [];
          this.totalCount = response.data.totalElements || 0;
          this.currentPage = response.data.currentPage;
        }
      } catch (error) {
        console.error('공지사항 목록 조회 실패:', error);
        throw error;
      }
    },

    // 단일 공지사항 조회 액션 추가
    // async fetchNotice(noticeNo) {
    //   try {
    //     const response = await apiClient.get(`/notice/modify/${noticeNo}`);
    //     return response.data;
    //   } catch (error) {
    //     console.error('공지사항 조회 실패:', error);
    //     throw error;
    //   }
    // },
    

    // 공지사항 수정 액션 추가
    async modifyNotice(noticeData) {
      try {
        const response = await apiClient.post(`/notice/modify/${noticeData.noticeNo}`, noticeData);
        return response.data;
      } catch (error) {
        console.error('공지사항 수정 실패:', error);
        throw error;
      }
    },

    // 공지사항 삭제 액션 추가
    async deleteNotice(noticeNo) {
      try {
        await apiClient.post(`/notice/delete/${noticeNo}`);
        await this.fetchNotices(this.currentPage); // 목록 새로고침
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        throw error;
      }
    },

    setSearchParams(params) {
      this.searchParams = params;
    },

    async writeNotice(noticeData) {
      try {
        const response = await apiClient.post('/notice/write', noticeData);
        return response.data;
      } catch (error) {
        console.error('공지사항 작성 실패:', error);
        throw error;
      }
    },
    async fetchNotice(noticeNo) {
      try {
        const response = await apiClient.get(`/notice/modify/${noticeNo}`);
        return response.data;
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        throw error;
      }
    },

    async modifyNotice(noticeData) {
      try {
        await apiClient.post(`/notice/modify/${noticeData.noticeNo}`, noticeData);
        return true;
      } catch (error) {
        console.error('공지사항 수정 실패:', error);
        throw error;
      }
    },

    async deleteNotice(noticeNo) {
      try {
        await apiClient.post(`/notice/delete/${noticeNo}`);
        return true;
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        throw error;
      }
    },
  }
});