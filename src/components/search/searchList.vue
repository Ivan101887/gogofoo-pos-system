<template>
  <div v-if="isShowLoading" class="load">
    <Loading />
  </div>
  <ul  v-else-if="productList.length" class="list">
    <li v-for="item in productList" :key="item.id" class="item">
      <SearchItem :product="item" @click="addToCart(item)"/>
    </li>
  </ul>
  <div v-else class="notify">
    {{ isSearchError ? '找不到此商品' : '掃描或輸入欲結帳的商品'}}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { IProductSpec } from '../../../entities';

export default defineComponent({
  props: {
    productList: {
      type: Array as PropType<IProductSpec[]>,
      default: () => [],
    },
    isShowLoading: {
      type: Boolean,
      default: true,
    },
    isSearchError: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const addToCart = (product: IProductSpec) => {
      emit('addToCart', product);
    };
    return {
      emit,
      addToCart,
    };
  },
});
</script>

<style lang="scss" scoped>
.list, .load {
  @apply bg-gray-50/50 w-full;
}
.load {
  @apply h-full flex items-center justify-center ;
}
.notify {
  @apply text-center w-full mt-3;
}
</style>
