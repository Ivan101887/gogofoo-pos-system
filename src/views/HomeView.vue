<!-- eslint-disable import/no-unresolved -->
<template>
  <!-- 主畫面 -->
  <div class="main">
    <!-- 主畫面右半邊 -->
    <section class="main__head cashier">
      <div class="cashier__head">
        <!-- 商品檢索的入框 -->
        <label for="Product" class="cashier__search">
          <font-awesome-icon class="cashier__icon" :icon="['fas', 'magnifying-glass']" size="sm" />
          <input
            name="Product"
            ref="SearchProduct"
            class="cashier__input"
            type="text"
            placeholder="商品名稱或編號"
            @input="onInput"
            @focus="focusOnEl"
          >
        </label>
        <!-- 商品檢索結果 -->
        <div class="result">
          <SearchList
            v-show="searchController.Product.isShowResult"
            class="cashier__result"
            :product-list="productList"
            :is-show-loading="searchController.Product.isShowLoading"
            :is-search-error="searchController.Product.isSearchError"
            @addToCart="addToCart"
          />
        </div>
      </div>
      <!-- 當筆訂單的所購商品 -->
      <div class="cashier__body">
        <ShoppingList
          :shopping-list="shoppingList"
        />
      </div>
      <!-- 結帳相關操作項 -->
      <div class="cashier__foot">
      </div>
    </section>
    <!-- 主畫面右半邊 -->
    <div class="main__body container">
      <section class="container__head">
        <label for="User" class="container__search">
          <font-awesome-icon
            class="container__icon"
            :icon="['fas', 'magnifying-glass']"
            size="sm"
          />
          <input
            name="User"
            ref="SearchUser"
            class="cashier__input"
            type="text"
            placeholder="商品名稱或編號"
            @keyup="onInput"
            @focus="focusOnEl"
          >
        </label>
      </section>
      <section class="container__body">
        <Calculator />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watch, Events,
} from 'vue';
import {
  getSpecWithSerialNumber,
  getSpecListWithName,
} from '@/userRequest';
import {
  IProductSpec,
  IShoppingItem,
} from '../../entities';

type controller = {
  isShowLoading: boolean,
  isShowResult: boolean,
  isSearchError: boolean,
};
type searchItem = {
  Product: controller,
  User: controller,
}
const productSerialRegex = /^[a-zA-Z]{4}\d{7,}/;
export default defineComponent({
  // const text = ref<string>('');
  setup() {
    /** @param {HTMLInputElement | null} ele 正在輸入的元素 */
    const ele = ref<HTMLInputElement | null>(null);
    /** @param {HTMLInputElement} SearchProduct 商品搜尋框的virtual dom */
    const SearchProduct = ref();
    /** @param {HTMLInputElement} SearchUser 會員搜尋框的virtual dom */
    const SearchUser = ref();
    /** 搜尋結果的控制項 */
    const searchController = reactive<searchItem>({
      Product: {
        isShowResult: false,
        isShowLoading: false,
        isSearchError: false,
      },
      User: {
        isShowResult: false,
        isShowLoading: false,
        isSearchError: false,
      },
    });
    /** @param {string} PDKeyword 產品搜尋關鍵字 */
    const PDKeyword = ref<string>('');
    const productList = reactive<IProductSpec[]>([]);
    /** @param {number | null} 輸入事件的debounce定時器 */
    const timeout = ref<null | number>(null);
    /**
     * 紀錄當前要輸入的元素
     * @param {Event} e 事件
     */
    const focusOnEl = (e: Event): void => {
      ele.value = e.target as HTMLInputElement;
    };
    /** 傳入計算機元件，透過面板更新輸入 */
    const inputFromPanel = () => {
      console.log('rrrrr');
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
        searchController.Product.isShowLoading = false;
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
              searchController.Product.isSearchError = true;
            }
            productList.push(spec.data);
          })
          .catch((err) => {
            console.log(err);
            searchController.Product.isSearchError = true;
          });
      } else {
        await getSpecListWithName({
          q: PDKeyword.value.trim(),
          limit: 10,
          page: 1,
        })
          .then((res) => {
            if (!res.data.length) {
              searchController.Product.isSearchError = true;
            }
            productList.push(...res.data);
          })
          .catch((err) => {
            console.log(err);
            searchController.Product.isSearchError = true;
          });
      }
      searchController.Product.isShowLoading = false;
    };
    /** 控制搜尋的api以及各項狀態的更新 */
    const apiHandler = (content: string) => {
      if (ele.value) {
        searchController[ele.value.name].isSearchError = false;
        if (content) {
          searchController[ele.value.name].isShowLoading = true;
        }
      }
      // 輸入後都重新計時
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      // 為了避免每次都觸發，這邊透過定時器限制api呼叫次數，減少效能負擔
      timeout.value = setTimeout(() => {
        getProductList();
      }, 100);
      switch (ele.value) {
        case SearchProduct.value:
          if (content) {
            searchController.Product.isShowLoading = true;
          }
          break;
        case SearchUser.value:
          if (content) {
            searchController.User.isShowLoading = true;
          }
          break;
        default:
          break;
      }
    };
    /** 鍵盤輸入呼叫指定api */
    const onInput = (e) => {
      console.log(e.target.value);
      // apiHandler(e.target.value);
    };
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
      // data
      searchController,
      productList,
      shoppingList,
      PDKeyword,
      SearchProduct,
      SearchUser,
      ele,
      // methods
      focusOnEl,
      addToCart,
      onInput,
      inputFromPanel,
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
