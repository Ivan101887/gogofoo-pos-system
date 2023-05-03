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
  getProductWithSerialNumber,
  getProductListWithName,
} from '@/userRequest';
import {
  IProduct,
  IProductSpec,
} from '../../entities';

const productSerialRegex = /^SFPF\d{7,}-\d{1,2}/;
export default defineComponent({
  setup() {
    const PDKeyword = ref<string>('');
    // const timeout = ref<null | number>(null);
    const productList = reactive<IProduct[]>([]);
    const orderList = reactive<IProductSpec[]>([]);
    /**
     * 產品搜索
     * @param keyword 搜索商品關鍵字
     * @returns {void}
     */
    const getProductList = (): void => {
      productList.splice(0, productList.length - 1);
      if (!PDKeyword.value) return;
      if (productSerialRegex.test(PDKeyword.value.trim())) {
        getProductWithSerialNumber(PDKeyword.value.trim());
      } else {
        getProductListWithName({
          q: PDKeyword.value.trim(),
          limit: 10,
          page: 1,
        })
          .then((res) => {
            productList.splice(0, productList.length - 1, ...res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    const handleKeyEvent = () => {
      productList.splice(0, productList.length - 1);
      // if (timeout.value) {
      //   clearTimeout(timeout.value);
      // }
      getProductList();
      // timeout.value = setTimeout(() => {
      // }, 100);
    };
    watch(PDKeyword, (newValue, oldValue) => {
      console.log(newValue);
      if (productList.length) {
        console.log(productList);
        productList.splice(0, productList.length - 1);
      }
      if (!newValue || newValue === oldValue) {
        return;
      }
      handleKeyEvent();
    });
    const addToCart = (product) => {
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
    @apply w-[50%];
  }
}
.cashier {
  @apply relative;
  &__head {
    @apply w-[100%] p-[10px] bg-[#D9D9D9];
    @apply flex gap-[12px] items-end;
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
    @apply flex items-center gap-[8px] grow;
  }
  &__result {
    @apply absolute top-[100%] bg-gray-50/50;
  }
}
</style>
