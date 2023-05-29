<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>
<template>
  <tr>
    <td align="center" width="25%">{{ item['product_name'] }}</td>
    <td align="center" width="15%">{{ item['price_per_unit'] }}</td>
    <td align="center" width="13%">{{ item.buyCount }}</td>
    <td align="center" width="12%">
      <div contenteditable="true">{{ item['price_per_unit'] }}</div>
    </td>
    <td align="center" width="15%">
      <div contenteditable="true" @keyup.enter.prevent>100</div>
    </td>
    <td align="center" width="20%">{{ 300 * 2 * 0.8 - 100 }}</td>
  </tr>
</template>
<style lang="scss" scoped>

</style>
