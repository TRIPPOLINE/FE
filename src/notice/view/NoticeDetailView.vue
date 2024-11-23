<!-- src/views/NoticeDetailView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex justify-center items-center p-4">
    <div class="w-full max-w-3xl">
      <!-- 헤더 영역 -->
      <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">공지사항 상세</h2>
          <button
            @click="goToList"
            class="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>

      <!-- 상세 내용 -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="p-4 sm:p-6">
          <!-- 제목 및 메타 정보 -->
          <div class="mb-4 sm:mb-6 border-b pb-4">
            <h3 class="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{{ notice.title }}</h3>
            <div class="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
              <div class="mb-2 sm:mb-0">
                <span class="block sm:inline sm:mr-4">작성자: {{ notice.userId }}</span>
                <span class="block sm:inline">작성일: {{ formatDate(notice.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 내용 -->
          <div class="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line">
            {{ notice.contents }}
          </div>

          <!-- 버튼 영역 -->
          <!-- <div class="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
            <button
              @click="modifyNotice"
              class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              수정
            </button>
            <button
              @click="deleteNotice"
              class="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          </div> -->
          <div v-if="isAdmin" class="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
  <button
    @click="modifyNotice"
    class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
  >
    수정
  </button>
  <button
    @click="deleteNotice"
    class="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNoticeStore } from "@/notice/noticeStore";
import { jwtDecode } from 'jwt-decode';


const router = useRouter();
const route = useRoute();
const noticeStore = useNoticeStore();
const notice = ref({});

onMounted(async () => {
  try {
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
  return date.toLocaleDateString('ko-KR');
};

const goToList = () => {
  router.push({ name: 'NoticeList' });
};

const modifyNotice = () => {
  router.push({
    name: 'NoticeModify',
    params: { noticeNo: route.params.noticeNo },
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
// 관리자 권한 확인을 위한 computed 속성
const isAdmin = computed(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role === 1;
    } catch (error) {
      console.error('Token decode failed:', error);
      return false;
    }
  }
  return false;
});
</script>
