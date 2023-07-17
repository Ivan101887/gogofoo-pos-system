<template>
  <ul>
    <li>姓名: {{ customer.name }}</li>
    <li>電話: {{ customer.mobile }}</li>
    <li>購物金: {{ customer.e_money }}</li>
    <li>購物金滿{{ customer.emoney_denominator }}享{{ customer.emoney_numerator }}元折扣</li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Customer } from '../../entities';

export default defineComponent({
  props: {
    /** @params {Customer} customer - 訂單會員資訊 */
    customer: {
      type: Customer,
      default: () => new Customer(),
    },
  },
});
</script>

<style lang="scss" scoped></style>
