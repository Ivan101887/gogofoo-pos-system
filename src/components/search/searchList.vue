<template>
  <div v-if="isShowLoading" class="load">
    <Loading />
  </div>
  <ul  v-else-if="result.length" class="list">
    <li v-for="item in result" :key="item.id" class="item">
      <SearchItem :product="item" @click="addToCart(item)"/>
    </li>
  </ul>
  <div v-else class="notify">
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, PropType } from 'vue';
import type { IProductSpec } from '../../../entities';

const emit = defineEmits(['addToCart']);
/** 加入購物車 */
const addToCart = (product: IProductSpec) => {
  emit('addToCart', product);
};
const props = defineProps({
  /** @params {String} errorMessage - 錯誤訊息 */
  errorMessage: {
    type: String,
    default: '請掃描條碼或輸入商品名稱',
  },
  /** @params {Array} result -  搜尋結果 */
  result: {
    type: Array as PropType<IProductSpec[]>,
    default: () => [],
  },
  /** @params {Boolean} isShowLoading - 搜尋的loading畫面 */
  isShowLoading: {
    type: Boolean,
    default: true,
  },
  /** @params {Boolean} isSearchError - 搜尋失敗狀態 */
  isSearchError: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.list, .load {
  @apply  w-full;
}
.load {
  @apply h-full flex items-center justify-center bg-gray-50/50;
}
.notify {
  @apply text-center w-full mt-3;
}
</style>
