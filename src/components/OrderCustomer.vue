<template>
  <div class="relative resultContainer h-full flex flex-col px-5 py-2.5 bg-white gap-y-2
        shadow-lg shadow-[#35385a1f] rounded-2xl">
    <ul
      class="flex flex-wrap items-baseline gap-x-0 gap-y-4 text-lg"
    >
      <li class="flex basis-1/2 flex-col">
        <span class="block">姓名：</span>
        <span class="block">{{ props.customer.name || '-' }}</span>
      </li>
      <li class="flex basis-1/2 flex-col">
        <span class="block">電話：</span>
        <span class="block">{{ props.customer.mobile || '-' }}</span>
      </li>
      <li class="flex grow gap-2 justify-between">
        <div class="flex shrink-0">
          <span class="block text-rose-600">現有回饋金：</span>
          <span class="block">{{ props.customer.e_money }}</span>
        </div>
        <p class="text-orange-500">
          （回饋金：滿
          <span class="px-2">{{ props.customer.emoney_denominator }}</span>
          享
          <span class="px-2">{{ props.customer.emoney_numerator }}</span>
          元折扣）
        </p>
      </li>
      <li class="flex grow gap-2 justify-between">
        <div class="flex">
          <span class="block text-rose-600">現有獎金：</span>
          <span class="block">{{ props.customer.sales_bonus || 0 }}</span>
        </div>
      </li>
    </ul>
    <SearchUser v-bind="$attrs"/>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Customer } from '../../entities';

const props = defineProps({
  /** @params {Customer} customer - 訂單會員資訊 */
  customer: {
    type: Customer,
    default: () => new Customer(),
  },
});

</script>

<style lang="scss" scoped></style>
