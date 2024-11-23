<template>
  <div class="my-page-view container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">마이페이지</h1>
    
    <!-- 프로필 섹션 -->
    <div class="mb-12">
      <ProfileView />
    </div>
    
    <!-- 하단 섹션 -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- 왼쪽 메뉴 -->
      <div class="w-full md:w-1/4">
        <nav class="flex flex-col space-y-2">
          <button @click="activeSection = 'updateUser'" class="text-left py-2 px-4 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'bg-blue-100': activeSection === 'updateUser' }">
            내 정보 수정하기
          </button>
          <button @click="activeSection = 'myPlan'" class="text-left py-2 px-4 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'bg-blue-100': activeSection === 'myPlan' }">
            내 Plan 보기
          </button>
          <button @click="activeSection = 'myReview'" class="text-left py-2 px-4 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'bg-blue-100': activeSection === 'myReview' }">
            내 리뷰 보기
          </button>
        </nav>
      </div>
      
      <!-- 오른쪽 컨텐츠 -->
      <div class="w-full md:w-3/4">
        <UpdateUserView v-if="activeSection === 'updateUser'" />
        <MyPlanView v-if="activeSection === 'myPlan'" />
        <MyReviewView v-if="activeSection === 'myReview'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProfileView from './ProfileView.vue';
import UpdateUserView from './UpdateUserView.vue';
import MyPlanView from './MyPlanView.vue';
import MyReviewView from './MyReviewView.vue';

const activeSection = ref('updateUser');
</script>