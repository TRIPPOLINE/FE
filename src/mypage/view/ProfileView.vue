<template>
        <!-- 프로필 섹션 -->
        <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
          <!-- 프로필이 없는 경우 -->
          <div v-if="!hasProfile && !showProfileForm" class="text-center py-8">
            <p class="text-gray-500 mb-4">아직 프로필이 없습니다</p>
            <button 
              @click="showProfileForm = true" 
              class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              프로필 만들기
            </button>
          </div>
  
          <!-- 프로필 생성/수정 폼 -->
          <div v-if="showProfileForm" class="bg-white p-6">
            <h3 class="text-xl font-bold mb-6">{{ hasProfile ? '프로필 수정' : '프로필 만들기' }}</h3>
            <form @submit.prevent="submitProfile" class="space-y-6">
                <!-- 이미지 업로드 -->
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">프로필 이미지</label>
                <div class="flex items-center space-x-4">
                    <img 
                    :src="previewImage || (hasProfile ? mypageStore.profile.photo : defaultImageUrl)" 
                    class="w-24 h-24 rounded-full object-cover"
                    />
                    <div class="flex flex-col space-y-2">
                    <div class="relative">
                        <input 
                        type="file" 
                        @change="handleImageUpload" 
                        accept="image/*"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button 
                        type="button"
                        class="px-4 py-2 text-sm text-indigo-700 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                        이미지 선택
                        </button>
                    </div>
                    <!-- 현재 이미지가 기본 이미지가 아닐 때만 버튼 표시 -->
                    <button 
                        v-if="(previewImage && previewImage !== defaultImageUrl) || (hasProfile && mypageStore.profile.photo)"
                        type="button"
                        @click="resetProfileImage"
                        class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        기본 이미지로 변경
                    </button>
                    </div>
                </div>
                </div>
                <!-- 닉네임 입력 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                    <input 
                    v-model="profileForm.nickName" 
                    type="text" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
  
              <!-- 소개글 입력 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">소개글</label>
                <textarea 
                  v-model="profileForm.body" 
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
  
              <!-- 버튼 영역 -->
              <div class="flex justify-end space-x-3">
                <button 
                  type="button" 
                  @click="showProfileForm = false" 
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
  
          <!-- 프로필 내용 표시 -->
          <div v-if="hasProfile && !showProfileForm">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="w-40 h-40">
                <img 
                  :src="mypageStore.profile.photo || defaultImageUrl" 
                  alt="프로필 이미지"
                  class="w-full h-full object-cover rounded-full"
                  @error="handleImageError"
                />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold mb-2 text-left">{{ mypageStore.profile.nickName }}</h2>
                <p class="text-gray-600 text-left">{{ mypageStore.profile.body }}</p>
              </div>
            </div>
            <!-- 수정 버튼 -->
            <div class="flex justify-end mt-4">
              <button @click="startEditProfile" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                프로필 수정
              </button>
            </div>
          </div>
        </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useMypageStore } from "@/mypage/myPageStore";
  import { jwtDecode } from 'jwt-decode';
  
  const mypageStore = useMypageStore();
  const defaultImageUrl = '/src/assets/profile_default.jpg';
  const showProfileForm = ref(false);
  const previewImage = ref(null);
  const profileForm = ref({
    nickName: '',
    body: '',
    photo: null
  });
  
  const hasProfile = computed(() => {
    return mypageStore.profile && mypageStore.profile.nickName;
  });
  
  const handleImageError = (e) => {
    e.target.src = defaultImageUrl;
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      profileForm.value.photo = file;
      previewImage.value = URL.createObjectURL(file);
    }
  };
  
  const resetProfileImage = () => {
    profileForm.value.photo = null;
    previewImage.value = defaultImageUrl;
  };
  
  const startEditProfile = () => {
    profileForm.value = {
      nickName: mypageStore.profile.nickName,
      body: mypageStore.profile.body,
      photo: null
    };
    previewImage.value = mypageStore.profile.photo || defaultImageUrl;
    showProfileForm.value = true;
  };
  
  const submitProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    
    const formData = new FormData();
    const profileData = {
      userId: decoded.userId,
      nickName: profileForm.value.nickName,
      body: profileForm.value.body
    };

    formData.append('profile', new Blob([JSON.stringify(profileData)], {
      type: 'application/json'
    }));
    
    if (profileForm.value.photo) {
      formData.append('photo', profileForm.value.photo);
    }

    if (hasProfile.value) {
      // 프로필 수정
      await mypageStore.modifyProfile(formData);
      alert('프로필이 수정되었습니다.');
    } else {
      // 프로필 생성
      await mypageStore.createProfile(formData);
      alert('프로필이 생성되었습니다.');
    }
    
    showProfileForm.value = false;
    await mypageStore.fetchProfile(decoded.userId);
  } catch (error) {
    console.error('프로필 저장 실패:', error);
    alert('프로필 저장에 실패했습니다.');
  }
};
  
  onMounted(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      await mypageStore.fetchProfile(decoded.userId);
    }
  });
  </script>