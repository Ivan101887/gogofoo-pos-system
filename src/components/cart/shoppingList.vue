<script lang="ts">
import { defineComponent, reactive } from 'vue';
// import { defineComponent, PropType } from 'vue';
import { IShoppingItem } from '../../../entities';

export default defineComponent({
  // props: {
  //   shoppingList: {
  //     type: Array as PropType<IShoppingItem[]>,
  //     default: () => [],
  //   },
  // },
  setup() {
    const shoppingList = reactive<IShoppingItem[]>([
      {
        id: 670,
        product_name: '安格斯熟成牛肋條 美國﹙1855﹚ 300g±10%*20包/箱',
        serial_number: 'SFMT0110857-0',
        price_per_unit: 855,
        purchase_count: 1,
      },
      {
        id: 1410,
        product_name: '【嚴選】挪威薄鹽鯖魚片(盒) 192g±10%*18片(有紙板)',
        serial_number: 'AACA0140002',
        price_per_unit: 855,
        purchase_count: 1,
      },
      {
        id: 1415,
        product_name: '【嚴選】挪威薄鹽鯖魚片(捆) 192g±10%*18片*3盒(含紙板)',
        serial_number: 'AACA0140007',
        price_per_unit: 2265,
        purchase_count: 1,
      },
      {
        id: 9990,
        product_name: '透抽圈 300g 300g/盒* 48盒/箱',
        serial_number: 'SFSF0510017-0',
        price_per_unit: 3850,
        purchase_count: 1,
      },
      {
        id: 9997,
        product_name: '煙燻豬五花 160g/盒* 8盒/箱',
        serial_number: 'SFMT0210024-0',
        price_per_unit: 625,
        purchase_count: 1,
      },
      {
        id: 10000,
        product_name: '牛火鍋肉片 紐西蘭 PS 160g/盒* 8盒/箱',
        serial_number: 'SFMT0110027-0',
        price_per_unit: 785,
        purchase_count: 1,
      },
      {
        id: 10002,
        product_name: '豬松阪燒烤片 160g 160g/盒* 8盒/箱',
        serial_number: 'SFMT0210029-0',
        price_per_unit: 990,
        purchase_count: 1,
      },
      {
        id: 10005,
        product_name: '牛板腱燒烤片 巴拉圭 160g/盒* 8盒/箱',
        serial_number: 'SFMT0110032-0',
        price_per_unit: 710,
        purchase_count: 1,
      },
      {
        id: 10014,
        product_name: '【超值箱】牛五花肉片 美國 160g/盒* 8盒/箱',
        serial_number: 'SFMT0110041-0',
        price_per_unit: 620,
        purchase_count: 1,
      },
      {
        id: 10015,
        product_name: '【超值箱】豬五花火鍋片 160g/盒* 8盒/箱',
        serial_number: 'SFMT0210042-0',
        price_per_unit: 610,
        purchase_count: 1,
      },
    ]);
    shoppingList.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.purchase_count = 2;
      // eslint-disable-next-line no-param-reassign
      item.percentage_discount = 100;
      // eslint-disable-next-line no-param-reassign
      item.amount_discount = 0;
    });
    return {
      shoppingList,
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
        <th class="p-1" width="20%">小結</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in shoppingList" :key="item.id">
        <ShoppingItem :item="item" />
      </template>
    </tbody>
  </table>
</template>
<style lang="scss" scoped></style>
