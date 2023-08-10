<template>
  <table class="w-full mx-auto">
    <thead class="thead w-full">
      <tr class="w-full bg-cyan-500">
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="12%">訂單編號</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="20%">購買項目編號</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="10%">數量</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="15%">訂單時間</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="10%">結帳方式</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="13%">訂單金額</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="order in orderList"
        :key="order.order_number"
        class="hover:bg-cyan-50 even:bg-sky-50 odd:bg-white cursor-pointer"
      >
        <td
          class="p-2 align-middle"
          valign="middle"
          align="center"
        >
          {{ order.order_number }}
        </td>
        <td class="p-2 align-middle" valign="middle" align="center">
          <template
            v-for="item in order.items"
            :key="item.serial_number"
          >
            <span class="block">
              {{ item.product_name }}
            </span>
          </template>
        </td>
        <td class="p-2 align-middle" valign="middle" align="center">
          <template
            v-for="item in order.items"
            :key="item.serial_number"
          >
            <span class="block">{{ item.purchase_count }}</span>
          </template>
        </td>
        <td
          class="p-2 align-middle"
          valign="middle"
          align="center"
        >
          {{ order.date }}
        </td>
        <td
          class="p-2 align-middle"
          valign="middle"
          align="center"
        >
          {{ order.payment_method }}
        </td>
        <td
          class="p-2 align-middle"
          valign="middle"
          align="center"
        >
          {{ order.final_price}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IOrderDetailed } from '../../../entities';

export default defineComponent({
  props: {
    orderList: {
      type: Array as PropType<IOrderDetailed[]>,
      default: () => [] as IOrderDetailed[],
    },
  },
});
</script>
