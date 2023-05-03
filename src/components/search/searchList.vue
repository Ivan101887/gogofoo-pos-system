<template>
  <ul class="list">
    <li v-for="item in productList" :key="item.id" class="item">
      <SearchItem :product="item" @click="addToCart(item)"/>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { IProductSpec } from '../../../entities';
import SearchItem from './searchItem.vue';

export default defineComponent({
  props: {
    productList: {
      type: Array as PropType<IProductSpec[]>,
      default: () => [],
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
.list {
  @apply absolute top-full bg-gray-50/50 w-full;
}
</style>
