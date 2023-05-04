<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { IShoppingItem } from '../../../entities';

defineProps({
  shoppingList: {
    type: Array as PropType<IShoppingItem[]>,
    default: () => [],
  },
});
</script>
<template>
  <div>

  </div>
</template>
<style lang="scss" scoped>

</style>
