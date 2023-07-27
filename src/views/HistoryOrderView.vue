<template>
  <div class="head">
    <h1 class="text-center text-4xl py-4 bg-sky-50 caret-transparent">歷史訂單</h1>
    <div class="operate">
        <!-- :labels="{
          name: 'name',
          salary: 'salary',
          hours: 'Hours/week',
        }" -->
        <downloadCsv
          :data="orders"
          :separator-excel="true"
          :name="`${start} - ${end}訂單明細`"
        >
          <button class="teal button__custom">
            <b>下載訂單明細</b>
          </button>
        </downloadCsv>

      <!-- <downloadCsv
        :data="orders"
        :separator-excel="true"
        :name="`${start} - ${end}訂單明細`"
      >
        <button class="teal button__custom">
          <b>下載訂單明細</b>
        </button>
      </downloadCsv> -->
      <div class="operate__timeSelector">
        <label for="start">
          <input type="date" v-model="start" name="start" />
        </label>
        <label for="end">
          <input
            type="date"
            name="end"
            v-model="end"
            inputmode="none"
            :max="new Date().toISOString().slice(0, 10)"
          />
        </label>
        <button type="button" @click="getOrderList">確定</button>
      </div>
    </div>
  </div>
  <section class="body orderTable mb-2 h-[83vh] overflow-y-auto">
    <OrderList class="caret-transparent" :order-list="orders" />
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
import {
  defineComponent, reactive, ref, computed, watch,
} from 'vue';
import OrderList from '@/components/order/OrderList.vue';
import { getHistoryOrders } from '@/userRequest';
import { IOrderDetailed } from '../../entities';

export default defineComponent({
  setup() {
    const start = ref(new Date().toISOString().slice(0, 10));
    const end = ref(new Date().toISOString().slice(0, 10));
    const orders = reactive<IOrderDetailed[]>([]);
    // ^pagination related
    const nowPage = ref(1);
    const limit = 15;
    const totalOrders = ref(0);
    const paginationLength = computed(
      () => (totalOrders.value > limit ? totalOrders.value : limit) / limit,
    );
    const options = reactive({
      start: start.value,
      end: end.value,
      source_platform: 'pos_machine',
      limit,
      offset: limit * (nowPage.value - 1),
    });
    const pageNum = computed(() => Array.from(Array(paginationLength.value), (v, k) => k + 1));
    const getOrderList = () => {
      if (start.value > end.value) {
        alert('你輸入的時間有誤');
        return;
      }
      getHistoryOrders(options)
        .then((res) => {
          orders.push(...res.data.items);
          totalOrders.value = res.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    watch(nowPage, () => {
      getOrderList();
    });
    return {
      orders,
      nowPage,
      paginationLength,
      getOrderList,
      pageNum,
      start,
      end,
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
