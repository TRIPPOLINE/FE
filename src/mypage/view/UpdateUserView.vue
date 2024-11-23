<template>
    <div class="update-user-view">
      <h2>내 정보 수정</h2>
      <form @submit.prevent="submitProfile">
        <input v-model="profileForm.nickName" placeholder="닉네임">
        <textarea v-model="profileForm.body" placeholder="소개"></textarea>
        <input type="file" @change="handleImageUpload" accept="image/*">
        <img v-if="previewImage" :src="previewImage" alt="프로필 미리보기">
        <button type="submit">저장</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useMypageStore } from "@/mypage/myPageStore";
  import { jwtDecode } from 'jwt-decode';
  
  const mypageStore = useMypageStore();
  const profileForm = ref({
    nickName: '',
    body: '',
    photo: null
  });
  const previewImage = ref(null);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      profileForm.value.photo = file;
      previewImage.value = URL.createObjectURL(file);
    }
  };
  
  const submitProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      
      const formData = new FormData();
      formData.append('profile', new Blob([JSON.stringify({
        userId: decoded.userId,
        nickName: profileForm.value.nickName,
        body: profileForm.value.body
      })], { type: 'application/json' }));
      
      if (profileForm.value.photo) {
        formData.append('photo', profileForm.value.photo);
      }
  
      await mypageStore.modifyProfile(formData);
      alert('프로필이 수정되었습니다.');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.');
    }
  };
  </script>