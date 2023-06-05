// eslint-disable-next-line vuejs-accessibility/click-events-have-key-events
<template>
  <div class="head">
    <h1 class="text-center text-4xl py-4">歷史訂單</h1>
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
    <!-- @success="val => handleSuccess(val)"
    @error="val => handleError(val)" -->
    <button class="teal button__custom">
      <b>My custom button</b>
    </button>
</downloadCsv>
  <section class="body orderTable h-[83vh]">
    <OrderList :order-list="orders"/>
  </section>
  <div class="foot">
    <ul class="ls flex justify-center gap-2">
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
  defineComponent, reactive, ref, computed,
} from 'vue';

export default defineComponent({
  setup() {
    const orders = reactive([]);
    // ^pagination related
    const nowPage = ref(1);
    const limit = 15;
    const paginationLength = computed(
      () => (orders.length / limit >= 1 ? orders.length / limit : 10),
    );
    console.log(paginationLength.value);
    const pageNum = computed(() => Array.from(Array(paginationLength.value), (v, k) => k + 1));
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
