<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IShoppingItem } from '../../../entities';

export default defineComponent({
  props: {
    shoppingList: {
      type: Array as PropType<IShoppingItem[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const removeItem = (id) => {
      emit('removeItem', id);
    };
    return {
      removeItem,
    };
  },
});
</script>
<template>
  <table class="table table-fixed w-full">
    <thead class="thead w-full">
      <tr class="w-full">
        <th class="p-1" width="25%">名稱</th>
        <th class="p-1" width="15%">售價</th>
        <th class="p-1" width="13%">數量</th>
        <th class="p-1" width="12%">打折</th>
        <th class="p-1" width="15%">折扣金額</th>
        <th class="p-1" width="15%">小結</th>
        <th class="p-1" width="5%"></th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in shoppingList" :key="item.id">
        <ShoppingItem :item="item" v-bind="$attrs" @removeItem="removeItem" />
      </template>
    </tbody>
  </table>
</template>
<style lang="scss" scoped></style>
