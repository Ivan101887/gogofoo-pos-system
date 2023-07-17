<template>
  <!-- 主畫面 -->
  <div class="main flex flex-auto w-full h-[calc(100vh-44px)]">
    <!-- 主畫面左半邊 -->
    <section class="main__head cashier relative flex flex-col w-3/5">
      <div class="cashier__head p-2.5 bg-[#D9D9D9]">
        <SearchInput
          :searchItem="searchItemProduct"
          :error-message="searchProductErrorMessage"
          :is-show-loading="currentSearch.isShowLoading"
          :is-search-error="currentSearch.isSearchError"
          placeholder="商品名稱或編號"
          :result="productList"
          :fn-set-current="setCurrentSearch"
          :fn-search="apiHandler"
          @add-to-cart="addToCart"
        >
          <template v-slot:operate>
            <button class="bg-blue-800 px-1 text-white" @click="checkAuthorization">
              修改單價
            </button>
          </template>
        </SearchInput>
      </div>
      <!-- 當筆訂單的所購商品 -->
      <div class="cashier__body">
        <ShoppingList
          :shopping-list="shoppingList"
          :focus-on-el="setCurrentChange"
          @removeItem="removeFromCart"
        />
      </div>
    </section>
    <!-- 主畫面右半邊 -->
    <div class="main__body container relative flex flex-col w-2/5">
      <section class="container__head bg-[#D9D9D9] p-2.5">
        <SearchInput
          :searchItem="searchItemUser"
          :result="searchMember"
          :is-show-loading="currentSearch.isShowLoading"
          :is-search-error="currentSearch.isSearchError"
          :error-message="searchUserErrorMessage"
          placeholder="輸入手機號碼查詢會員資料"
          :fn-set-current="setCurrentSearch"
          :fn-search="apiHandler"
          @set-order-member="setOrderMember"
        />
      </section>
      <section class="container__body grow">
        <OrderCustomer :customer="memberInfo" />
      </section>
      <section class="container__foot h-3/5">
        <Calculator :now-value="currentSearch?.value || ''" :update-value="inputFromPanel" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { getSpecWithSerialNumber, getSpecListWithName, getMember } from '@/userRequest';
import { IProductSpec, IShoppingItem, Customer } from '../../entities';

class SearchItem {
  key: string;

  value: string;

  isShowLoading: boolean;

  isShowResult: boolean;

  isSearchError: boolean;

  constructor(
    key = '',
    value = '',
    isShowLoading = false,
    isSearchError = false,
    isShowResult = false,
  ) {
    this.value = value;
    this.key = key;
    this.isSearchError = isSearchError;
    this.isShowResult = isShowResult;
    this.isShowLoading = isShowLoading;
  }
}
// eslint-disable-next-line no-shadow
enum searchKey {
  product = 'product',
  user = 'user',
}
const noticeText = '輸入完整手機以查詢';
const phoneRegex = /^09\d{8}$/;
const productSerialRegex = /^[a-zA-Z]{4}\d{7,}/;
export default defineComponent({
  setup() {
    /** 會員搜尋 */
    const searchItemProduct = ref<SearchItem>(new SearchItem(searchKey.product));
    const searchItemUser = ref<SearchItem>(new SearchItem(searchKey.user));
    const currentChange = ref<IShoppingItem>(new IShoppingItem());
    const currentSearch = ref<SearchItem>(new SearchItem());
    const currentKey = ref<string>('');
    const recoverCurrentSearch = (): void => {
      currentSearch.value.key = '';
      currentSearch.value.value = '';
      currentSearch.value.isShowResult = false;
      currentSearch.value.isShowLoading = false;
      currentSearch.value.isSearchError = false;
    };
    const recoverCurrentChange = (): void => {
      currentChange.value = new IShoppingItem();
      currentKey.value = '';
    };
    const handleClick = (event) => {
      // if (event.target.tagName.toLowerCase() === 'input') return;
      // if (ele.value) {
      //   ele.value.value = '';
      //   nowValue.value = '';
      // }
      // ele.value = null;
      // Object.keys(searchController).forEach((item) => {
      //   searchController[item].isShowResult = false;
      //   searchController[item].isShowLoading = false;
      //   searchController[item].isShowError = false;
      // });
    };
    // onMounted(() => {
    //   window.addEventListener('click', handleClick, false);
    // });
    /** 訂單的會員資訊 */
    const memberInfo = ref<Customer>(new Customer());
    // ^元素操作
    // ^搜尋功能
    /** @param {IProduct[]} productList 商品的搜尋結果 */
    const productList = reactive<IProductSpec[]>([]);
    const searchMember = ref<Customer>(new Customer());
    const setCurrentSearch = (item) => {
      if (currentSearch.value.key !== item.key) {
        switch (item.key) {
          case searchKey.product:
            productList.splice(0, productList.length);
            break;
          case searchKey.user:
            searchMember.value = new Customer();
            break;
          // no default
        }
        recoverCurrentSearch();
      }
      currentSearch.value = item as SearchItem;
    };
    const setCurrentChange = (item, key = ''): void => {
      console.log('set current change');
      currentChange.value = item as IShoppingItem;
      currentKey.value = key as string;
    };
    const searchProductErrorMessage = ref<string>('請掃描條碼或輸入商品名稱');
    /**
     * 產品搜索
     * @param keyword 搜索商品關鍵字
     * @returns {void}
     */
    const getProductList = (keyword: string) => {
      // 搜尋前先清空陣列，以保證最終搜尋結果的正確性
      productList.splice(0, productList.length);
      // 如果沒有值就不搜尋了
      if (!keyword) {
        currentSearch.value.isShowLoading = false;
        return;
      }
      /**
       * 判斷是否為流水編號
       *  -如果是流水編號就直接拿指定的商品
       *  -反之就當成關鍵字搜尋相關商品
       */
      if (productSerialRegex.test(keyword.trim())) {
        getSpecWithSerialNumber(keyword.trim())
          .then((spec) => {
            if (!spec.data.length) {
              searchProductErrorMessage.value = '找不到相關的商品';
              currentSearch.value.isSearchError = true;
            }
            productList.push(spec.data);
          })
          .catch((err) => {
            console.log(err);
            searchProductErrorMessage.value = '找不到相關的商品';
            currentSearch.value.isSearchError = true;
          });
      } else {
        getSpecListWithName({
          q: keyword.trim(),
          limit: 10,
          page: 1,
        })
          .then((res) => {
            if (!res.data.length) {
              searchProductErrorMessage.value = '找不到相關的商品';
              currentSearch.value.isSearchError = false;
              return;
            }
            productList.push(...res.data);
          })
          .catch((err) => {
            console.log(err);
            searchProductErrorMessage.value = '找不到相關的商品';
            currentSearch.value.isSearchError = true;
          });
      }
      currentSearch.value.isShowLoading = false;
    };
    const searchUserErrorMessage = ref<string>(noticeText);
    const getCustomerData = (keyword) => {
      if (phoneRegex.test(keyword)) {
        getMember({ phone: keyword })
          .then((res) => {
            searchMember.value = res.data;
            searchUserErrorMessage.value = '';
            currentSearch.value.isSearchError = false;
            currentSearch.value.isShowLoading = false;
          })
          .catch((err) => {
            searchUserErrorMessage.value = err.response.data;
            currentSearch.value.isShowLoading = false;
            currentSearch.value.isSearchError = true;
          });
      }
    };

    // ^控制api
    /** @param {number | null} 輸入事件的debounce定時器 */
    const timeout = ref<null | number>(null);
    /** 控制搜尋的api以及各項狀態的更新 */
    const apiHandler = (content: SearchItem) => {
      if (content.value) {
        if (content.key === searchKey.product) {
          searchProductErrorMessage.value = '請掃描條碼或輸入商品名稱';
        } else {
          searchUserErrorMessage.value = noticeText;
        }
      }
      // 輸入後都重新計時
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      timeout.value = setTimeout(() => {
        if (content.key === searchKey.product) {
          getProductList(content.value);
        } else {
          getCustomerData(content.value);
        }
      }, 500);
    };

    // ^控制輸入
    /** 傳入計算機元件，透過面板更新輸入 */
    const shoppingList = reactive<IShoppingItem[]>([]);
    const inputFromPanel = (value: string) => {
      if (currentKey.value) {
        console.log(1111);
        const idx = shoppingList.findIndex(
          (item) => item.id === currentChange.value.id,
        );
        console.log(idx);
        if (idx !== -1) {
          shoppingList[idx][currentKey.value] = value;
        }
        return;
      }
      if (currentSearch.value) {
        currentSearch.value.value = value as string;
      }
    };

    // ^訂單操作
    /**
     * 加入訂單
     * @param {IProductSpec} 欲加入訂單的商品資訊
     * @return {void}
     */
    const addToCart = (product: IProductSpec) => {
      console.log(product);
      const shoppingItem: IShoppingItem = {
        id: product.id,
        product_name: product.product_name + product.spec_name,
        serial_number: product.serial_number,
        purchase_count: 1,
        price_per_unit: product.price_per_unit,
        percentage_discount: 100,
        amount_discount: 0,
      };
      console.log(shoppingItem);
      const index = shoppingList.findIndex(
        (item) => item.serial_number === shoppingItem.serial_number,
      );
      if (index === -1) {
        shoppingList.push(shoppingItem);
      } else {
        shoppingList[index].purchase_count += 1;
      }
      recoverCurrentSearch();
    };
    const removeFromCart = (id: number) => {
      const index = shoppingList.findIndex((item) => item.id === id);
      if (index !== -1) {
        shoppingList.splice(index, 1);
      }
    };
    const setOrderMember = (member: Customer) => {
      console.log(member);
      memberInfo.value = member;
      recoverCurrentSearch();
      searchUserErrorMessage.value = noticeText;
      searchMember.value = new Customer();
    };
    const checkAuthorization = () => {
      console.log('這邊需要做權限驗證');
    };
    return {
      // data
      searchItemProduct,
      searchItemUser,
      productList,
      shoppingList,
      searchMember,
      searchProductErrorMessage,
      searchUserErrorMessage,
      memberInfo,
      currentSearch,
      currentChange,
      currentKey,
      // methods
      apiHandler,
      addToCart,
      checkAuthorization,
      inputFromPanel,
      setOrderMember,
      removeFromCart,
      setCurrentSearch,
      setCurrentChange,
    };
  },
});
</script>
