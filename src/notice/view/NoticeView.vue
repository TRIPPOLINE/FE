<!-- src/views/NoticeView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- 헤더 영역 -->
      <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">공지사항</h2>
          
          <!-- 검색 폼 -->
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <select 
              v-model="searchKey" 
              class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full sm:w-32"
            >
              <option value="">선택</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="user_id">작성자</option>
            </select>
            
            <input 
              v-model="searchWord" 
              type="text" 
              placeholder="검색어를 입력하세요"
              class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 flex-1 min-w-0"
              @keyup.enter="handleSearch"
            >
            
            <button 
              @click="handleSearch"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
            >
              검색
            </button>
            
            <button 
              @click="resetSearch"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors w-full sm:w-auto"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    
      <!-- 테이블 영역 -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">내용</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">작성일</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="notice in notices" 
                :key="notice.noticeNo" 
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                @click="goToDetail(notice.noticeNo)"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ notice.title }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate hidden sm:table-cell">{{ notice.contents }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ notice.userId }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{{ formatDate(notice.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 페이지네이션 -->
      <!--<div v-if="totalPages > 0" class="flex justify-center mt-4 sm:mt-6 gap-2">
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 border rounded-md transition-colors text-sm"
          :class="currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-700 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
      </div>-->
<div v-if="totalPages > 0" class="flex justify-center mt-4 sm:mt-6 gap-2">
  <!-- 이전 화살표 -->
  <button 
    v-if="currentPageGroup > 1"
    @click="changePage((currentPageGroup - 1) * 5)"
    class="px-3 py-1 border rounded-md transition-colors text-sm text-gray-700 hover:bg-gray-50"
  >
    &lt;
  </button>

  <!-- 페이지 번호 -->
  <button 
    v-for="page in displayedPages" 
    :key="page"
    @click="changePage(page)"
    class="px-3 py-1 border rounded-md transition-colors text-sm"
    :class="currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-700 hover:bg-gray-50'"
  >
    {{ page }}
  </button>

  <!-- 다음 화살표 -->
  <button 
    v-if="currentPageGroup * 5 < totalPages"
    @click="changePage(currentPageGroup * 5 + 1)"
    class="px-3 py-1 border rounded-md transition-colors text-sm text-gray-700 hover:bg-gray-50"
  >
    &gt;
  </button>
</div>
  
      <!-- 글쓰기 버튼 -->
      <!-- <div class="fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
        <button 
          @click="goToWritePage"
          class="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <span>글쓰기</span>
        </button>
      </div> -->
      <div v-if="isAdmin" class="fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
  <button 
    @click="goToWritePage"
    class="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
  >
    <span>글쓰기</span>
  </button>
</div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
import { useNoticeStore } from "@/notice/noticeStore";
  import { useRouter } from 'vue-router';
  import { jwtDecode } from 'jwt-decode';
  
  const router = useRouter();
  const noticeStore = useNoticeStore();
  const searchKey = ref('');
  const searchWord = ref('');
  
  const notices = computed(() => noticeStore.notices);
  const totalPages = computed(() => Math.ceil(noticeStore.totalCount / noticeStore.sizePerPage));
  const currentPage = computed(() => noticeStore.currentPage);
  
  const handleSearch = async () => {
    if (!searchKey.value) {
      alert('검색 기준을 선택해주세요.');
      return;
    }
    noticeStore.setSearchParams({
      key: searchKey.value,
      word: searchWord.value
    });
    await noticeStore.fetchNotices(1);
};
const goToDetail = (noticeNo) => {
  router.push({ 
    name: 'NoticeDetail', 
    params: { noticeNo: noticeNo }
  });
};

// 초기화 함수 추가
const resetSearch = async () => {
  searchKey.value = '';
  searchWord.value = '';
  noticeStore.setSearchParams({
    key: '',
    word: ''
  });
  await noticeStore.fetchNotices(1);
};
// 수정 페이지로 이동하는 함수 추가
const goToModifyPage = (noticeNo) => {
  router.push({ 
    name: 'NoticeModify', 
    params: { noticeNo: noticeNo }
  });
};

// 삭제 처리 함수 추가
const handleDelete = async (noticeNo) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
        try {
            await noticeStore.deleteNotice(noticeNo);
            alert('공지사항이 삭제되었습니다.');
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    }
};
  
  const changePage = async (page) => {
    try {
      await noticeStore.fetchNotices(page);
    } catch (error) {
      console.error('페이지 변경 실패:', error);
      alert('페이지 변경 중 오류가 발생했습니다.');
    }
  };
  
  const goToWritePage = () => {
  if (!isAdmin.value) {
    alert('관리자만 글을 작성할 수 있습니다.');
    return;
  }
  router.push({ name: 'NoticeWrite' });
};
  
  onMounted(async () => {
  try {
    console.log('Fetching notices...');
    await noticeStore.fetchNotices(1);
    console.log('Notices fetched:', noticeStore.notices);
  } catch (error) {
    console.error('공지사항 목록 로드 실패:', error);
    alert('공지사항 목록을 불러오는데 실패했습니다.');
  }
});
  
  watch([searchKey, searchWord], () => {
    noticeStore.setSearchParams({
      key: searchKey.value,
      word: searchWord.value
    });
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 관리자만 글쓰기 버튼 보임
  const isAdmin = computed(() => {
  const token = localStorage.getItem('accessToken');
  console.log('Current token:', token);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      console.log('user ID:', decoded.userId);
      console.log('Role ID:', decoded.role);
      return decoded.role === 1;
    } catch (error) {
      console.error('Token decode error:', error);
      return false;
    }
  }
  return false;
});
// 현재 페이지 그룹 계산 (1-10: 1, 11-20: 2, ...)
const currentPageGroup = computed(() => Math.ceil(currentPage.value / 5));

// 화면에 표시할 페이지 번호 배열
const displayedPages = computed(() => {
  const start = (currentPageGroup.value - 1) * 5 + 1;
  const end = Math.min(currentPageGroup.value * 5, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});


  
  </script>

<style>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>