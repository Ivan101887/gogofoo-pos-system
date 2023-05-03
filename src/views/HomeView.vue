<!-- eslint-disable import/no-unresolved -->
<template>
  <div class="main">
    <section class="main__head cashier">
      <div class="cashier__head">
        <label for="ProductId" class="cashier__search">
          <font-awesome-icon class="cashier__icon" :icon="['fas', 'magnifying-glass']" size="sm" />
          <input name="ProductId"
            v-model="PDKeyword"
            class="cashier__input"
            type="text"
            placeholder="商品名稱或編號"
          >
        </label>
        <button
          class="btn py-0.5 px-3 bg-sky-100 hover:bg-sky-200"
          @click="handleKeyEvent"
        >
          輸入
        </button>
      </div>
      <SearchList
        class="cashier__result"
        :product-list="productList"
        @addToCart="addToCart"
      />
      <div class="cashier__body">
      </div>
      <div class="cashier__foot"></div>
    </section>
    <div class="main__body">
      <section class="container__head">
        這邊要放會員搜尋
      </section>
      <section class="container__body">
        這邊放常見商品
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watch,
} from 'vue';
import SearchList from '@/components/search/searchList.vue';
import {
  getSpecWithSerialNumber,
  getSpecListWithName,
} from '@/userRequest';
import {
  IProductSpec,
} from '../../entities';

const productSerialRegex = /^[a-zA-Z]{4}\d{7,}/;
export default defineComponent({
  setup() {
    const PDKeyword = ref<string>('');
    const timeout = ref<null | number>(null);
    const productList = reactive<IProductSpec[]>([]);
    const orderList = reactive<IProductSpec[]>([]);
    /**
     * 產品搜索
     * @param keyword 搜索商品關鍵字
     * @returns {void}
     */
    const getProductList = (): void => {
      // 搜尋前先清空陣列，以保證最終搜尋結果的正確性
      productList.splice(0, productList.length);
      // 如果沒有值就不搜尋了
      if (!PDKeyword.value) return;
      /**
       * 判斷是否為流水編號
       *  -如果是流水編號就直接拿指定的商品
       *  -反之就當成關鍵字搜尋相關商品
       */
      if (productSerialRegex.test(PDKeyword.value.trim())) {
        getSpecWithSerialNumber(PDKeyword.value.trim())
          .then((spec) => {
            productList.push(spec.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        getSpecListWithName({
          q: PDKeyword.value.trim(),
          limit: 10,
          page: 1,
        })
          .then((res) => {
            productList.push(...res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    const handleKeyEvent = () => {
      // 輸入後都重新計時
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      // 為了避免每次都觸發，這邊透過定時器限制api呼叫次數，減少效能負擔
      timeout.value = setTimeout(() => {
        getProductList();
      }, 500);
    };
    /** 監聽搜尋字串，有新的關鍵字就要重新搜尋 */
    watch(PDKeyword, () => {
      handleKeyEvent();
    });
    /**
     * 加入訂單
     * @param {IProductSpec} 欲加入訂單的商品資訊
     * @return {void}
     */
    const addToCart = (product: IProductSpec) => {
      orderList.push(product);
    };
    return {
      handleKeyEvent,
      productList,
      orderList,
      addToCart,
      PDKeyword,
    };
  },
});

</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  @apply flex flex-auto;
  &__head, &__body {
    @apply w-1/2;
  }
}
.cashier {
  @apply relative;
  &__head {
    @apply w-full p-2.5 bg-[#D9D9D9];
    @apply flex gap-3 items-end;
  }
  &__input, &__icon {
    display: block;
  }
  &__input {
    @apply bg-transparent grow border-b-2 border-neutral-400;
    outline: none;
  }
  &__search {
    display: block;
    @apply flex items-center gap-2 grow;
  }
  &__result {
    @apply absolute top-full;
  }
}
</style>
