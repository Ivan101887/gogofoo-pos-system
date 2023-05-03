<template>
  <div class="flex item hover:bg-gray-100">
    <p class="id"> {{ product.serial_number }}</p>
    <p class="name"> {{ product.product_name }}</p>
    <p class="spec">{{ product.spec_name }}</p>
    <p class="price">{{ product.price_per_unit }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { IProductSpec } from '../../../entities';

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<IProductSpec>,
      default: () => ({}),
    },
  },
  setup() {
    return {

    };
  },
});
</script>

<style lang="scss" scoped>
  .item {
    @apply py-1 px-2 cursor-pointer;
  }
</style>
