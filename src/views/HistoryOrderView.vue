<template>
  <div class="head">
    <h1 class="text-center text-4xl py-4 bg-sky-50 caret-transparent">歷史訂單</h1>
  </div>
  <downloadCsv
    :data="[
      {
        name: 'terry',
        salary: 'annual',
        hours: 'week',
      },
      {
        name: 'terry',
        salary: 'annual',
        hours: 'week',
      },
      {
        name: 'terry',
        salary: 'annual',
        hours: 'week',
      },
    ]"
    :labels="{
      name: 'name',
      salary: 'salary',
      hours: 'Hours/week'
    }"
    :separator-excel="true"
    :name="'My_Custom_CSV_test'"
  >
    <button class="teal button__custom">
      <b>My custom button</b>
    </button>
  </downloadCsv>
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
    const totalOrders = ref(0);
    const paginationLength = computed(
      () => ((totalOrders.value > limit ? totalOrders.value : limit) / limit),
    );
    const options = {
      start: null,
      end: null,
      limit,
      offset: limit * (nowPage.value - 1),
    };
    const pageNum = computed(() => Array.from(Array(paginationLength.value), (v, k) => k + 1));
    onMounted(() => {
      getHistoryOrders(options)
        .then((res) => {
          orders.push(...res.data.items);
          totalOrders.value = res.data.count;
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
