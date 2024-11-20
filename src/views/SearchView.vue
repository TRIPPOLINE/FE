<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">여행지 검색하기</h1>
      <p>여기에서 티맵과 함께 여행지 리스트를 확인할 수 있습니다.</p>
      <!-- 티맵과 여행지 리스트를 보여줄 컴포넌트를 추가할 수 있습니다 -->
      <iframe
        src="https://map.tmap.co.kr/"
        width="100%"
        height="600"
        frameborder="0"
        title="T-map"
      ></iframe>
      <!-- 여행지 리스트는 별도의 컴포넌트로 구현할 수 있습니다 -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchView',
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>