<!-- EditableStarRating.vue -->
<template>
    <div class="flex items-center">
      <div 
        class="flex space-x-1"
        @mousedown="startDragging"
        @mousemove="handleMouseMove"
        @mouseup="stopDragging"
        @mouseleave="handleMouseLeave"
      >
        <div 
          v-for="i in 5" 
          :key="i"
          class="text-2xl cursor-pointer relative"
        >
          <!-- 배경 별 -->
          <span class="text-gray-300">★</span>
          <!-- 채워진 별 -->
          <span 
            class="absolute top-0 left-0 text-yellow-400 overflow-hidden"
            :style="{ width: getStarWidth(i) + '%' }"
          >★</span>
        </div>
      </div>
      <span class="ml-2 text-sm text-gray-600">{{ (rating || 0).toFixed(1) }}</span>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const rating = ref(props.modelValue);
  const isDragging = ref(false);
  
  const startDragging = (event) => {
    isDragging.value = true;
    updateRating(event);
  };
  
  const stopDragging = () => {
    if (isDragging.value) {
      isDragging.value = false;
      emit('update:modelValue', rating.value);
    }
  };
  
  const handleMouseMove = (event) => {
    if (isDragging.value) {
      updateRating(event);
    }
  };
  
  const updateRating = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const score = (x / width) * 5;
    rating.value = Math.round(score * 2) / 2; // 0.5 단위로 반올림
  };
  
  const handleMouseLeave = () => {
    if (isDragging.value) {
      isDragging.value = false;
      emit('update:modelValue', rating.value);
    } else {
      rating.value = props.modelValue;
    }
  };
  
  const getStarWidth = (index) => {
    const fullStars = Math.floor(rating.value);
    const decimal = rating.value - fullStars;
    
    if (index <= fullStars) return 100;
    if (index === fullStars + 1) return decimal * 100;
    return 0;
  };
  </script>