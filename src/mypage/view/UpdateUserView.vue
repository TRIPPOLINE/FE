<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6">내 정보 수정</h2>
    <form @submit.prevent="updateUserInfo" class="space-y-4">
      <div>
        <label for="id" class="block text-sm font-medium text-gray-700">아이디</label>
        <input v-model="userForm.id" id="id" type="text" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-not-allowed">
      </div>
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
        <input v-model="userForm.name" id="name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
        <input v-model="userForm.email" id="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div v-if="!isChangingPassword">
        <button @click.prevent="startChangingPassword" type="button" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          비밀번호 변경
        </button>
      </div>
      <div v-if="isChangingPassword" class="space-y-2">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700">현재 비밀번호</label>
          <input v-model="currentPassword" id="currentPassword" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700">새 비밀번호</label>
          <input v-model="newPassword" id="newPassword" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
      </div>
      <div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          정보 수정
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import api from "@/Auth/api/AuthIndex";
import { useMypageStore } from '@/mypage/myPageStore';

const router = useRouter();
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

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      await mypageStore.fetchUserInfo(decoded.userId);
      userForm.value = { ...mypageStore.user };
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    alert('사용자 정보를 불러오는데 실패했습니다.');
  }
};

const startChangingPassword = () => {
  isChangingPassword.value = true;
};

const updateUserInfo = async () => {
  try {
    const updatedUser = { ...userForm.value };
    
    if (isChangingPassword.value) {
      if (newPassword.value !== confirmPassword.value) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      
      // 비밀번호 변경 로직
      const passwordChangeResponse = await api.post('/user/change-password', {
        userId: userForm.value.id,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      
      if (!passwordChangeResponse.data.success) {
        alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
        return;
      }
    }

    await mypageStore.updateUserInfo(updatedUser);
    alert('사용자 정보가 성공적으로 수정되었습니다.');
    await fetchUserInfo();
    isChangingPassword.value = false;
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error);
    alert('사용자 정보 수정에 실패했습니다.');
  }
};

onMounted(fetchUserInfo);
</script>