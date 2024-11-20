<!-- src/views/NoticeDetailView.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 헤더 영역 -->
        <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-bold text-gray-800">공지사항 상세</h2>
        </div>
  
        <!-- 상세 내용 -->
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="p-6">
            <!-- 제목 및 메타 정보 -->
            <div class="mb-6 border-b pb-4">
              <h3 class="text-xl font-bold mb-3">{{ notice.title }}</h3>
              <div class="flex justify-between text-sm text-gray-500">
                <div>
                  <span class="mr-4">작성자: {{ notice.userId }}</span>
                  <span>작성일: {{ formatDate(notice.createdAt) }}</span>
                </div>
              </div>
            </div>
  
            <!-- 내용 -->
            <div class="mb-6">
              <div class="whitespace-pre-line">{{ notice.contents }}</div>
            </div>
  
            <!-- 버튼 영역 -->
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="goToList"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                목록
              </button>
              <button 
                @click="modifyNotice"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                수정
              </button>
              <button 
                @click="deleteNotice"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useNoticeStore } from '@/stores/noticeStore';
  
  const router = useRouter();
  const route = useRoute();
  const noticeStore = useNoticeStore();
  const notice = ref({});
  
  onMounted(async () => {
    try {
      // 상세 정보 조회 API 호출
      const response = await noticeStore.fetchNotice(route.params.noticeNo);
      notice.value = response;
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
      router.push({ name: 'NoticeList' });
    }
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  const goToList = () => {
    router.push({ name: 'NoticeList' });
  };
  
  const modifyNotice = () => {
    router.push({ 
      name: 'NoticeModify', 
      params: { noticeNo: route.params.noticeNo }
    });
  };
  
  const deleteNotice = async () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        await noticeStore.deleteNotice(route.params.noticeNo);
        alert('공지사항이 삭제되었습니다.');
        router.push({ name: 'NoticeList' });
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };
  </script>