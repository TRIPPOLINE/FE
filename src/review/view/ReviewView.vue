<template>
  <div>
    <h1>리뷰 게시판</h1>

    <!-- 정렬 옵션 -->
    <select v-model="sortBy" @change="loadReviews">
      <option value="likes">좋아요 순</option>
      <option value="latest">최신순</option>
    </select>

    <!-- 검색 옵션 -->
    <div>
      <input v-model="searchKeyword" placeholder="검색어 입력">
      <select v-model="searchType">
        <option value="all">제목과 내용</option>
        <option value="title">제목</option>
        <option value="content">내용</option>
      </select>
      <button @click="searchReviews">검색</button>
    </div>

    <!-- 리뷰 목록 -->
    <div v-for="review in reviews" :key="review.reviewNo">
      <h2>{{ review.title }}</h2>
      <p>{{ review.content }}</p>
      <p>작성자: {{ review.userName }}</p>
      <p>작성일: {{ review.writeAt }}</p>
      <p>평점: {{ review.score }}</p>
    </div>

    <!-- 페이지네이션 -->
    <div>
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }}</span>
      <button @click="nextPage">다음</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const reviews = ref([]);
    const sortBy = ref('likes');
    const searchKeyword = ref('');
    const searchType = ref('all');
    const currentPage = ref(1);
    const pageSize = 10;

    const loadReviews = async () => {
      try {
        const response = await axios.get('/api/reviews', {
          params: {
            sortBy: sortBy.value,
            page: currentPage.value,
            size: pageSize
          }
        });
        reviews.value = response.data;
      } catch (error) {
        console.error('리뷰 로딩 실패:', error);
      }
    };

    const searchReviews = async () => {
      try {
        const response = await axios.get('/api/search', {
          params: {
            keyword: searchKeyword.value,
            searchType: searchType.value,
            page: currentPage.value,
            size: pageSize
          }
        });
        reviews.value = response.data;
      } catch (error) {
        console.error('리뷰 검색 실패:', error);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        loadReviews();
      }
    };

    const nextPage = () => {
      currentPage.value++;
      loadReviews();
    };

    onMounted(loadReviews);

    return {
      reviews,
      sortBy,
      searchKeyword,
      searchType,
      currentPage,
      loadReviews,
      searchReviews,
      prevPage,
      nextPage
    };
  }
}
</script>
