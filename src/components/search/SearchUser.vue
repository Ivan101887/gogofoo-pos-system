<template>
  <div
    v-if="isShowResult"
    class="
      absolute w-full bg-blue-300 z-[101]
      shadow-lg shadow-[#35385a1f] rounded-2xl h-full top-0 left-0
    "
  >
    <div v-if="isShowLoading" class="load">
      <Loading />
    </div>
    <div v-else-if="isSearchError" class="notify">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  isShowResult: {
    type: Boolean,
    default: false,
  },
  /** 是否搜尋中 */
  isShowLoading: {
    type: Boolean,
    default: false,
  },
  /** 搜尋是否錯誤 */
  isSearchError: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '輸入完整手機以查詢',
  },
});
</script>

<style lang="scss" scoped>
.result__list {
  @apply w-full text-lg font-medium cursor-pointer;
}
.load {
  @apply h-full flex items-center justify-center;
}
.notify {
  @apply text-center w-full mt-3;
}
</style>
