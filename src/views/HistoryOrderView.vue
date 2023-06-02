<template>
  <div class="title">
    <h1 class="text-center text-4xl py-4">歷史訂單</h1>
  </div>
  <section class="orderTable mt-5">
    <OrderList :order-list="orders"/>
  </section>

</template>

<script lang="ts">
import OrderList from '@/components/order/OrderList.vue';
import {
  defineComponent, reactive, ref, computed,
} from 'vue';

export default defineComponent({
  setup() {
    const orders = reactive([]);
    // ^pagination related
    const nowPage = ref(1);
    const limit = 15;
    const paginationLength = computed(() => orders.length / limit || 1);
    return {
      orders,
      nowPage,
      paginationLength,
    };
  },
  components: { OrderList },
});
</script>

<style lang="scss" scoped>
</style>
