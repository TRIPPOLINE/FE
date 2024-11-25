<template>
  <div class="my-page-view w-2/4 mx-auto px-4 py-8">
    
    <!-- 프로필 -->
    <div class="mb-5">
      <ProfileView />
    </div>
    
    <div class="flex flex-col md:flex-row gap-8">
      <!-- 메뉴 -->
      <div class="w-full md:w-1/4">
        <nav class="flex flex-col space-y-2">
          <button @click="activeSection = 'myPlan'" class="text-left py-2 px-4 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'bg-blue-100': activeSection === 'myPlan' }">
            내 Plan 보기
          </button>
          <button @click="activeSection = 'myReview'" class="text-left py-2 px-4 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'bg-blue-100': activeSection === 'myReview' }">
            내 리뷰 보기
          </button>
          <button @click="activeSection = 'updateUser'" class="text-left py-2 px-4 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'bg-blue-100': activeSection === 'updateUser' }">
            내 정보 수정하기
          </button>
        </nav>
      </div>
      
      <!-- 내용 -->
      <div class="w-full md:w-3/4">
        <MyPlanView v-if="activeSection === 'myPlan'" />
        <MyReviewView v-if="activeSection === 'myReview'" />
        <UpdateUserView v-if="activeSection === 'updateUser'" />
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

const activeSection = ref('myPlan');
</script>