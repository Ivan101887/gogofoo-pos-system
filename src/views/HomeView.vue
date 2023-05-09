<!-- eslint-disable import/no-unresolved -->
<template>
  <div class="main">
    <section class="main__head cashier">
      <div class="cashier__head">
        <label for="ProductId" class="cashier__search">
          <font-awesome-icon class="cashier__icon" :icon="['fas', 'magnifying-glass']" size="sm" />
          <input name="ProductId"
            v-model="PDKeyword"
            ref="test"
            class="cashier__input"
            type="text"
            placeholder="商品名稱或編號"
            @focus="focusOnEl"
            @keyup="keyup"
          >
        </label>
        <div class="result">
          <!-- 有輸入內容或是控制顯示的變數為true -->
          <SearchList
            v-show="isShowResult"
            class="cashier__result"
            :product-list="productList"
            :is-show-loading="isShowLoading"
            :is-search-error="isSearchError"
            @addToCart="addToCart"
          />
        </div>
      </div>
      <div class="cashier__body">
        <ShoppingList
          :shopping-list="shoppingList"
        />
      </div>
      <div class="cashier__foot">
      </div>
    </section>
    <div class="main__body container">
      <section class="container__head">
        這邊要放會員搜尋
      </section>
      <section class="container__body">
        <Calculator :target="target" @searchProduct="searchProduct"/>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watch,
} from 'vue';
import {
  getSpecWithSerialNumber,
  getSpecListWithName,
} from '@/userRequest';
import {
  IProductSpec,
  IShoppingItem,
} from '../../entities';

const productSerialRegex = /^[a-zA-Z]{4}\d{7,}/;
export default defineComponent({
  setup() {
    const ele = ref<HTMLInputElement | null>(null);
    const text = ref<string>('');
    const test = ref();
    const target = ref<string>('');
    const isShowLoading = ref<boolean>(false);
    const isShowResult = ref<boolean>(false);
    /** @param {string} PDKeyword 產品搜尋關鍵字 */
    const PDKeyword = ref<string>('');
    const productList = reactive<IProductSpec[]>([]);
    /** @param {number | null} 輸入事件的debounce定時器 */
    const timeout = ref<null | number>(null);
    const isSearchError = ref<boolean>(false);
    const focusOnEl = (e) => {
      console.log(e.target);
      ele.value = e.target;
    };
    const callApi = (content: string) => {
      switch (key) {
        case value:
          
          break;
      
        default:
          break;
      }
      // function(ele.value.value);
    };
    const keyup = (e) => {
      callApi(e.target.value);
    };
    const searchProduct = (content: string) => {
      // text.value = content;
      // PDKeyword.value = content;
      // test.value.focus();'
      // if (ele.value) {
      //   ele.value.value = content;
      //   PDKeyword.value = content;
      // }
      callApi(content);
    };
    /**
     * 產品搜索
     * @param keyword 搜索商品關鍵字
     * @returns {void}
     */
    const getProductList = async () => {
      // 搜尋前先清空陣列，以保證最終搜尋結果的正確性
      productList.splice(0, productList.length);
      // 如果沒有值就不搜尋了
      if (!PDKeyword.value) {
        isShowLoading.value = false;
        return;
      }
      /**
       * 判斷是否為流水編號
       *  -如果是流水編號就直接拿指定的商品
       *  -反之就當成關鍵字搜尋相關商品
       */
      if (productSerialRegex.test(PDKeyword.value.trim())) {
        await getSpecWithSerialNumber(PDKeyword.value.trim())
          .then((spec) => {
            if (!spec.data.length) {
              isSearchError.value = true;
            }
            productList.push(spec.data);
          })
          .catch((err) => {
            console.log(err);
            isSearchError.value = true;
          });
      } else {
        await getSpecListWithName({
          q: PDKeyword.value.trim(),
          limit: 10,
          page: 1,
        })
          .then((res) => {
            if (!res.data.length) {
              isSearchError.value = true;
            }
            productList.push(...res.data);
          })
          .catch((err) => {
            console.log(err);
            isSearchError.value = true;
          });
      }
      isShowLoading.value = false;
    };
    /** 監聽搜尋字串，有新的關鍵字就要重新搜尋 */
    watch(PDKeyword, (value) => {
      isSearchError.value = false;
      if (value) {
        isShowLoading.value = true;
      }
      // 輸入後都重新計時
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      // 為了避免每次都觸發，這邊透過定時器限制api呼叫次數，減少效能負擔
      timeout.value = setTimeout(() => {
        // switch(ele.value){

        // }
        getProductList();
      }, 100);
    });
    const shoppingList = reactive<IShoppingItem[]>([]);
    /**
     * 加入訂單
     * @param {IProductSpec} 欲加入訂單的商品資訊
     * @return {void}
     */
    const addToCart = (product: IProductSpec) => {
      const shoppingItem: IShoppingItem = {
        ...product,
        buyCount: 1,
        pricePerUnit: product.price_per_unit,
      };
      const index = shoppingList.findIndex((item) => item.id === shoppingItem.id);
      if (index === -1) {
        shoppingList.push(shoppingItem);
      } else {
        shoppingList[index].buyCount += 1;
      }
      PDKeyword.value = '';
      productList.splice(0, productList.length);
    };
    return {
      isShowLoading,
      isShowResult,
      productList,
      shoppingList,
      addToCart,
      PDKeyword,
      isSearchError,
      target,
      searchProduct,
      focusOnEl,
      test,
      ele,
      keyup,
    };
  },
});

</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  @apply flex flex-auto;
  &__head{
    @apply w-3/5
  }
  &__body {
    @apply w-2/5;
  }
}
.cashier {
  @apply relative h-[calc(100vh-44px)];
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
  .result {
    @apply absolute overflow-y-auto h-80 w-full top-[48px] left-0;
  }
}
.container {
  &__head {
    @apply h-2/5;
  }
  &__body {
    @apply h-3/5;
  }
}
</style>
