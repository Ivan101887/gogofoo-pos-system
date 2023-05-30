<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const order = reactive(props.item);
    const total = computed(
      () => (order.price_per_unit * order.purchase_count * (order.percentage_discount / 100))
      - order.amount_discount,
    );
    return {
      order,
      total,
    };
  },
});
</script>
<template>
  <tr>
    <td align="center" width="25%">{{ order['product_name'] }}</td>
    <td align="center" width="15%">{{ order['price_per_unit'] }}</td>
    <td align="center" width="13%">{{ order['purchase_count'] }}</td>
    <td align="center" width="12%">
      <div contenteditable="true">{{ order['percentage_discount'] }}</div>
    </td>
    <td align="center" width="15%">
      <div contenteditable="true" @keyup.enter.prevent>{{ order['amount_discount'] }}</div>
    </td>
    <td align="center" width="20%">{{ total }}</td>
  </tr>
</template>
<style lang="scss" scoped>

</style>
