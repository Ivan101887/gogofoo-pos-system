<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref,
} from 'vue';
import { IShoppingItem } from '../../../entities';

defineProps({
  shoppingList: {
    type: Array as PropType<IShoppingItem[]>,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['removeItem']);
const removeItem = (id: number) : void => {
  emit('removeItem', id);
};
const numberThousand = (number: number): string => {
  if (number === undefined || Number.isNaN(number)) {
    return '-';
  }
  const regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
  return `${number.toString().replace(regExpInfo, '$1,')}`;
};
const now = ref<number>(0);
const setNow = (index: number) : void => {
  now.value = index;
};

</script>
<template>
  <div class="tableContainer grow bg-white
      shadow-lg shadow-[#35385a1f] rounded-2xl
    "
    :style="{'max-height': 'calc(100% - 36px)', 'overflow-y': 'auto'}"
  >
    <table class="table table-fixed w-full">
      <thead class="thead w-full border-b border-solid border-b-stone-700">
        <tr class="w-full">
          <th class="p-2.5 text-lg font-semibold" width="25%">名稱</th>
          <th class="p-2.5 text-lg font-semibold" width="15%">售價<slot name="modify"></slot></th>
          <th class="p-2.5 text-lg font-semibold" width="12%">數量</th>
          <th class="p-2.5 text-lg font-semibold" width="12%">打折</th>
          <th class="p-2.5 text-lg font-semibold" width="15%">折扣金額</th>
          <th class="p-2.5 text-lg font-semibold" width="15%">小結</th>
          <th class="p-2.5 text-lg font-semibold" width="6%"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item, index in shoppingList" :key="item.id">
          <ShoppingItem
            v-bind="$attrs"
            :item="item"
            :now="now"
            :index="index"
            @setLine="setNow"
            @removeItem="removeItem"
          />
        </template>
      </tbody>
    </table>
  </div>
  <div class="total flex justify-between text-3xl font-bold px-5 text-right">
    <div class="total__title w-1/3">合計</div>
    <div class="total__amount grow pr-[30px]">
      {{ numberThousand(total) }}
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
