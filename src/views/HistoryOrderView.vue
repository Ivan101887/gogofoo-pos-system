<template>
  <div class="head">
    <h1 class="text-center text-4xl py-4 bg-sky-50 caret-transparent">歷史訂單</h1>
  </div>
  <section class="body orderTable mb-2 h-[83vh] overflow-y-auto">
    <OrderList  class="caret-transparent" :order-list="orders"/>
  </section>
  <div class="foot">
    <ul class="ls flex justify-center gap-2 caret-transparent">
      <li
        v-for="item in pageNum"
        :key="item"
        class="ls__item py-1 px-2.5 cursor-pointer"
        :class="{ 'ls__item--active': item === nowPage }"
        @click="nowPage = item"
      >
      {{ item }}
    </li>
  </ul>
</div>

</template>

<script lang="ts">
import OrderList from '@/components/order/OrderList.vue';
import {
  defineComponent, reactive, ref, computed, onMounted,
} from 'vue';
import { getHistoryOrders } from '@/userRequest';
import { IOrderDetailed } from '../../entities';

export default defineComponent({
  setup() {
    const orders = reactive<IOrderDetailed[]>([]);
    // ^pagination related
    const nowPage = ref(1);
    const limit = 15;
    const paginationLength = computed(
      () => (orders.length / limit >= 1 ? orders.length / limit : 10),
    );
    const pageNum = computed(() => Array.from(Array(paginationLength.value), (v, k) => k + 1));
    onMounted(() => {
      console.log('fetching orders');
      getHistoryOrders()
        .then((res) => {
          orders.push(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return {
      orders,
      nowPage,
      paginationLength,
      pageNum,
    };
  },
  components: { OrderList },
});
</script>

<style lang="scss" scoped>
.ls {
  &__item {
    &--active {
      @apply bg-sky-600 text-white;
    }
  }
}
</style>
