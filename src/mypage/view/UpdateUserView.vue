<!--UpdateUserView.vue-->
<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import api from "@/Auth/api/AuthIndex";
import { useMypageStore } from '@/mypage/myPageStore';

const mypageStore = useMypageStore();

const userForm = ref({
  id: '',
  name: '',
  email: '',
});
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isChangingPassword = ref(false);

// 사용자 정보 가져오기
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      await mypageStore.fetchUserInfo(decoded.userId);
      userForm.value = { ...mypageStore.user };
    }

  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    alert('사용자 정보를 불러오는데 실패했습니다.');
  }
};

// 비밀번호 변경 폼 토글
const startChangingPassword = () => {
  isChangingPassword.value = true;
};

// 사용자 정보 업데이트
const updateUserInfo = async () => {

    const updatedUser = { ...userForm.value };

    if (isChangingPassword.value) {
      if (newPassword.value !== confirmPassword.value) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      // // 비밀번호 변경
      // const passwordChangeResponse = await api.post('/user/change-password', {
      //   userId: userForm.value.id,
      //   currentPassword: currentPassword.value,
      //   newPassword: newPassword.value
      // });

      // if (!passwordChangeResponse.data.success) {
      //   alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
      //   return;
      // }
    }

    await mypageStore.updateUserInfo(updatedUser);
    alert('사용자 정보가 성공적으로 수정되었습니다.');
    await fetchUserInfo();
    isChangingPassword.value = false;
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

};

// 컴포넌트 마운트 시 사용자 정보 가져오기
onMounted(fetchUserInfo);
</script>

<template>
  <div class="max-w-md ml-0 mt-5 p-6 bg-white rounded-lg">
    <form @submit.prevent="updateUserInfo" class="space-y-8">
      <!-- 사용자 ID (읽기 전용) -->
      <div class="flex items-center space-x-4"> <!-- Flexbox 사용 -->
        <label for="id" class="block text-base font-medium text-gray-700 w-[300px]">아이디</label> <!-- 레이블 너비 설정 -->
        <input v-model="userForm.id" id="id" type="text" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-not-allowed">
      </div>
      <!-- 사용자 이름 -->
      <div class="flex items-center space-x-4"> <!-- Flexbox 사용 -->
        <label for="name" class="block text-base font-medium text-gray-700 w-[300px]">이름</label> <!-- 레이블 너비 설정 -->
        <input v-model="userForm.name" id="name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <!-- 사용자 이메일 -->
      <div class="flex items-center space-x-4"> <!-- Flexbox 사용 -->
        <label for="email" class="block text-base font-medium text-gray-700 w-[300px]">이메일</label> <!-- 레이블 너비 설정 -->
        <input v-model="userForm.email" id="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <!-- 비밀번호 변경 버튼 -->
      <div v-if="!isChangingPassword" class="flex justify-start mt-4">
        <button @click.prevent="startChangingPassword" type="button" class="mt-2 px-4 py-2 text-red-500 rounded-md ">
          비밀번호 변경
        </button>
      </div>
      <!-- 비밀번호 변경 폼 -->
      <div v-if="isChangingPassword" class="space-y-8">
        <div class="flex items-center space-x-4"> <!-- Flexbox 사용 -->
          <label for="currentPassword" class="block text-base font-medium text-gray-700 w-[300px]">현재 비밀번호</label> <!-- 레이블 너비 설정 -->
          <input v-model="currentPassword" id="currentPassword" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="flex items-center space-x-4"> <!-- Flexbox 사용 -->
          <label for="newPassword" class="block text-base font-medium text-gray-700 w-[300px]">새 비밀번호</label> <!-- 레이블 너비 설정 -->
          <input v-model="newPassword" id="newPassword" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="flex items-center space-x-4"> <!-- Flexbox 사용 -->
          <label for="confirmPassword" class="block text-base font-medium text-gray-700 w-[300px]">새 비밀번호 확인</label> <!-- 레이블 너비 설정 -->
          <input v-model="confirmPassword" id="confirmPassword" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
      </div>
    </form>

    <!-- 제출 버튼을 오른쪽 하단에 위치시키기 -->
    <div class="flex justify-end mt-4">
      <button type="submit" @click.prevent="updateUserInfo"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
        수정
      </button>
    </div>

  </div>
</template>
