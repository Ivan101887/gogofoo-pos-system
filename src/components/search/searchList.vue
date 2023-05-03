<template>
  <ul class="list">
    <li v-for="item in productSpecs" :key="item.id" class="item">
      <SearchItem :product="item" @click="addToCart(item)"/>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import type { IProduct, IProductSpec } from '../../../entities';
import SearchItem from './searchItem.vue';

export default defineComponent({
  props: {
    productList: {
      type: Array as PropType<IProduct[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const productSpecs = computed((): IProductSpec[] => {
      const arr: IProductSpec[] = [];
      props.productList.forEach((prod: IProduct) => arr.push(...prod.specs));
      return arr;
    });
    const addToCart = (product: IProductSpec) => {
      emit('addToCart', product);
    };
    return {
      productSpecs,
      emit,
      addToCart,
    };
  },
});
</script>

<style lang="" scoped>

</style>
