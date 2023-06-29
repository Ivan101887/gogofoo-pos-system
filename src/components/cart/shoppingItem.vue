<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

// eslint-disable-next-line no-shadow
const enum editField {
  discount = 'percentage_discount',
  price = 'price_per_unit',
  coupon = 'amount_discount',
  count = 'purchase__count',
}
export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isModifying: {
      type: Boolean,
      default: false,
    },
    canModify: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const order = reactive(props.item);
    const total = computed(
      () => order.price_per_unit * order.purchase_count * (order.percentage_discount / 100)
        - order.amount_discount,
    );
    const changeValue = (e, key) => {
      const discountBase = 100;
      const value = parseInt(e.target.innerHTML, 10);
      console.log(value < discountBase && value > 0);
      switch (key) {
        case editField.discount:
          if (value < discountBase && value > 0) {
            order[key] = value;
          } else {
            e.target.innerHTML = order[key];
            alert('打折請輸入0-100之間');
          }
          break;
          // 折讓修改
        case editField.coupon:
          if (value > total.value) {
            e.target.innerHTML = order[key];
            window.alert('折扣金額不能低於總金額喔!!');
          } else {
            order[key] = value;
          }
          break;
        // no default
      }
      order[key] = e.target.innerHTML;
    };
    return {
      order,
      total,
      changeValue,
    };
  },
});
</script>
<template>
  <tr>
    <td align="center" width="25%">{{ order['product_name'] }}</td>
    <td align="center" width="15%">
      <div
        contenteditable="true"
        @blur="changeValue($event, 'price_per_unit')"
        v-html="order['price_per_unit']"
      />
    </td>
    <td align="center" width="13%">{{ order['purchase_count'] }}</td>
    <td align="center" width="12%">
      <div
        contenteditable="true"
        @blur="changeValue($event, 'percentage_discount')"
        v-html="order['percentage_discount']"
      />
    </td>
    <td align="center" valign="middle" width="15%">
      <div
        contenteditable="true"
        @blur="changeValue($event, 'amount_discount')"
        v-html="order['amount_discount']"
      />
    </td>
    <td align="center" width="20%">{{ total }}</td>
  </tr>
</template>
<style lang="scss" scoped></style>
