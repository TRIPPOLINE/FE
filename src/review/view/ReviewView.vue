<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 고정 검색바 -->
    <div class="sticky top-0 z-10 bg-white shadow-md">
      <div class="container mx-auto px-4 py-3">
        <input
          v-model="searchQuery"
          @input="debounceSearch"
          type="text"
          placeholder="여행지나 리뷰를 검색해보세요"
          class="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- 필터링 옵션 -->
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-end space-x-4">
        <button
          @click="sortBy = 'latest'"
          :class="{ 'text-blue-600': sortBy === 'latest' }"
          class="font-semibold"
        >
          최신순
        </button>
        <button
          @click="sortBy = 'rating'"
          :class="{ 'text-blue-600': sortBy === 'rating' }"
          class="font-semibold"
        >
          평점순
        </button>
      </div>
    </div>

    <!-- 게시물 목록 -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <img :src="review.image" alt="Review image" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ review.title }}</h3>
            <p class="text-gray-600 mb-4">{{ review.content }}</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <img :src="review.userAvatar" alt="User avatar" class="w-8 h-8 rounded-full" />
                <span class="text-sm font-medium">{{ review.userName }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-yellow-500">★</span>
                <span class="font-semibold">{{ review.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 인디케이터 -->
    <div v-if="loading" class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'

export default {
  setup() {
    const reviews = ref([])
    const searchQuery = ref('')
    const sortBy = ref('latest')
    const loading = ref(false)
    const page = ref(1)

    const fetchReviews = async () => {
      if (loading.value) return
      loading.value = true
      try {
        const response = await axios.get('/api/reviews', {
          params: {
            query: searchQuery.value,
            sort: sortBy.value,
            page: page.value
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

    const debounceSearch = debounce(() => {
      reviews.value = []
      page.value = 1
      fetchReviews()
    }, 300)

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading.value) {
        fetchReviews()
      }
    }

    onMounted(() => {
      fetchReviews()
      window.addEventListener('scroll', handleScroll)
    })

    watch(sortBy, () => {
      reviews.value = []
      page.value = 1
      fetchReviews()
    })

    return {
      reviews,
      searchQuery,
      sortBy,
      loading,
      debounceSearch
    }
  }
}
</script>
