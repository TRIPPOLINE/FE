<template>
  <div class="flex items-center">
    <div v-for="i in 5" :key="i" class="text-xl relative">
      <span v-if="i <= Math.floor(score)" class="text-yellow-400">★</span>
      <span v-else-if="i - 0.5 <= score" class="relative">
        <span class="text-yellow-400 absolute overflow-hidden" style="width: 50%;">★</span>
        <span class="text-gray-300">★</span>
      </span>
      <span v-else class="text-gray-300">★</span>
    </div>
    <span class="ml-2 text-sm text-gray-600">{{ score.toFixed(1) }}</span>
  </div>
</template>

<script setup>
defineProps({
  score: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}
</style>
