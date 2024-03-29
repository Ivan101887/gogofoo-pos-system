<template>
  <div class="head">
    <h1 class="text-center text-4xl py-4 bg-sky-50 caret-transparent">歷史訂單</h1>
    <div class="operate flex justify-between my-2 px-2 items-center">
      <div class="operate__timeSelector flex gap-2 items-center">
        <label for="start">
          <span>
            開始時間：
          </span>
          <input type="date" inputmode="none" v-model="start" name="start" :max="end" />
        </label>
        <span>～</span>
        <label for="end">
          <span>
            結束時間：
          </span>
          <input
            type="date"
            name="end"
            v-model="end"
            inputmode="none"
            :max="new Date().toISOString().slice(0, 10)"
          />
        </label>
        <button type="button"
          @click="fetchDataFromDate"
          class=" btn bg-cyan-500 teal button__custom text-white px-2 py-1"
        >
          確定
        </button>
      </div>
    </div>
  </div>
  <section class="body orderTable mb-2 h-[76vh] overflow-y-auto">
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
  defineComponent, reactive, ref, computed, watch, onMounted,
} from 'vue';
import OrderList from '@/components/order/OrderList.vue';
import { getHistoryOrders } from '@/userRequest';
import dayjs from 'dayjs';
import { IOrderDetailed } from '../../entities';

export default defineComponent({
  setup() {
    const start = ref(dayjs().format('YYYY-MM-DD'));
    const end = ref(dayjs().add(1, 'day').format('YYYY-MM-DD'));
    const orders = reactive<IOrderDetailed[]>([]);
    // ^pagination related
    const nowPage = ref(1);
    const limit = 15;
    const totalOrders = ref(0);
    const paginationLength = computed(
      () => (totalOrders.value > limit ? totalOrders.value : limit) / limit,
    );
    const options = computed(() => ({
      start: start.value,
      end: end.value,
      source_platform: 'pos_machine',
      limit,
      offset: limit * (nowPage.value - 1),
    }));
    const pageNum = computed(() => Array.from(Array(paginationLength.value), (v, k) => k + 1));
    const getOrderList = async () => {
      if (start.value > end.value) {
        alert('你輸入的時間有誤');
        return;
      }
      const res:{items: IOrderDetailed[], count:number} = await getHistoryOrders(options.value);
      orders.push(...res.items);
      totalOrders.value = res.count;
    };
    const fetchDataFromDate = async () => {
      orders.splice(0);
      await getOrderList();
    };
    watch(nowPage, async () => {
      await getOrderList();
    });
    onMounted(async () => {
      await getOrderList();
    });
    return {
      orders,
      nowPage,
      paginationLength,
      getOrderList,
      pageNum,
      start,
      end,
      fetchDataFromDate,
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
