<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 검색 및 정렬 옵션 -->
    <div class="mb-6 flex justify-between items-center">
      <input
        v-model="keyword"
        @input="debounceSearch"
        placeholder="검색어를 입력하세요"
        class="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <select
        v-model="sortBy"
        @change="resetAndFetch"
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="weight">가중치순</option>
        <option value="latest">최신순</option>
        <option value="likes">좋아요순</option>
      </select>
    </div>

    <!-- 리뷰 목록 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="review in reviews"
        :key="review.reviewNo"
        class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
      >
        <img :src="review.imageUrl || 'default-image.jpg'" alt="Review image" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{{ review.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ review.content }}</p>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <img :src="review.userAvatar || 'default-avatar.jpg'" alt="User avatar" class="w-8 h-8 rounded-full">
              <span class="text-sm font-medium">{{ review.userName }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-yellow-500">★</span>
              <span class="font-semibold">{{ review.score.toFixed(1) }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">{{ formatDate(review.writeAt) }}</p>
        </div>
      </div>
    </div>

    <!-- 로딩 인디케이터 -->
    <div v-if="loading" class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- 무한 스크롤을 위한 관찰 요소 -->
    <div ref="infiniteScrollTrigger"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import api from "@/Auth/api/AuthIndex";


export default {
  setup() {
    const keyword = ref('')
    const reviews = ref([])
    const sortBy = ref('weight')
    const loading = ref(false)
    const page = ref(1)
    const infiniteScrollTrigger = ref(null)

    const fetchReviews = async () => {
      if (loading.value) return
      loading.value = true
      try {
        const response = await api.get('/review/search', {
          params: {
            keyword: keyword.value,
            page: page.value,
            size: 12,
            sortBy: sortBy.value
          }
        })
        reviews.value = [...reviews.value, ...response.data]
        page.value++
      } catch (error) {
        console.error('리뷰를 불러오는 중 오류가 발생했습니다:', error)
      } finally {
        loading.value = false
      }
    }

    const resetAndFetch = () => {
      reviews.value = []
      page.value = 1
      fetchReviews()
    }

    const debounceSearch = debounce(() => {
      resetAndFetch()
    }, 300)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // 무한 스크롤 설정
    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading.value) {
            fetchReviews()
          }
        },
        { threshold: 1.0 }
      )

      nextTick(() => {
        if (infiniteScrollTrigger.value) {
          observer.observe(infiniteScrollTrigger.value)
        }
      })

      // 초기 데이터 로드
      fetchReviews()
    })

    watch(sortBy, resetAndFetch)

    return {
      keyword,
      reviews,
      sortBy,
      loading,
      infiniteScrollTrigger,
      debounceSearch,
      formatDate
    }
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
