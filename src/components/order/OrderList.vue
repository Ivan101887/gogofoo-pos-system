<template>
    <table class="w-full mx-auto">
      <thead class="thead w-full">
      <tr class="w-full bg-cyan-500">
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="12%">訂單編號</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="20%">購買項目</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="10%">數量</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="10%">訂單狀態</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="15%">訂單時間</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="10%">結帳方式</th>
        <th class="p-2.5 text-xl text-stone-50 font-bold" width="13%">訂單金額</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-cyan-50 even:bg-sky-50 odd:bg-white cursor-pointer">
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">3123213</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">
          嚴選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚選鮭魚
        </td>
        <td class="p-2" valign="middle" align="center">10</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">以結帳</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">2023/06/02 09:57</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">卡片</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">4000</td>
      </tr>
      <tr class="hover:bg-cyan-50 cursor-pointer even:bg-sky-50 odd:bg-white">
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">3123213</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">
          嚴選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚、選鮭魚選鮭魚
        </td>
        <td class="p-2" valign="middle" align="center">10</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">以結帳</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">2023/06/02 09:57</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">卡片</td>
        <td class="p-2 hover:bg-cyan-50" valign="middle" align="center">4000</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    orderList: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
td {
  vertical-align: middle;
}
</style>
