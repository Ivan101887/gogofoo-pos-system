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
          :can-modify="canModify"
          @add-to-cart="addToCart"
        >
          <template #operate>
            <button class="bg-blue-800 px-1 text-white" @click="checkAuthorization">
              修改單價
            </button>
          </template>
        </SearchInput>
      </div>
      <!-- 當筆訂單的所購商品 -->
      <div class="cashier__body h-4/5">
        <ShoppingList
          :shopping-list="shoppingList"
          :focus-on-el="setCurrentChange"
          @removeItem="removeFromCart"
        />
      </div>
      <div class="cashier__foot">
        <label for="totalPercentage">
          打折
          <input
            type="number"
            value="0"
            max="100"
            min="0"
            step="10"
            name="totalPercentage"
            inputmode="none"
          />
        </label>
        <label for="totalPercentage">
          折價
          <input
            type="number"
            value="0"
            max="100"
            min="0"
            step="10"
            name="totalPercentage"
            inputmode="none"
          />
        </label>
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
        <Calculator :now-value="nowValueForPanel" :update-value="inputFromPanel" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, computed, onMounted, PropType,
} from 'vue';
import {
  getSpecWithSerialNumber,
  getSpecListWithName,
  getMember,
  getAuthorization,
} from '@/userRequest';
import {
  IProductSpec, IShoppingItem, Customer, permission,
} from '../../entities';

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
  props: {
    /** @params {Array} permissionList - 權限包 */
    permissionList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
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
    const nowValueForPanel = computed(
      () => currentSearch.value.value || currentChange.value[currentKey.value] || '',
    );
    const handleClick = (event) => {
      if (event.target.tagName.toLowerCase() === 'input') return;
      recoverCurrentSearch();
      recoverCurrentChange();
    };
    /** 是否有權限修改價格 */
    const canModify = ref(false);
    onMounted(() => {
      console.log('hello');
      window.addEventListener('click', handleClick, false);
    });
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
        const idx = shoppingList.findIndex((item) => item.id === currentChange.value.id);
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
      const shoppingItem: IShoppingItem = {
        id: product.id,
        product_name: product.product_name + product.spec_name,
        serial_number: product.serial_number,
        purchase_count: 1,
        price_per_unit: product.price_per_unit,
        percentage_discount: 100,
        amount_discount: 0,
      };
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
      memberInfo.value = member;
      recoverCurrentSearch();
      searchUserErrorMessage.value = noticeText;
      searchMember.value = new Customer();
    };
    const orderAuthorizedId = ref();
    const checkAuthorization = () => {
      if (props.permissionList.includes(permission.changePrice)) {
        canModify.value = true;
        return;
      }
      const code = prompt('輸入驗證碼以授權');
      console.log(typeof code);
      if (code === null) return;
      getAuthorization({ code })
        .then((res) => {
          canModify.value = true;
          emit('updatePermissionList', permission.changePrice);
        })
        .catch((err) => {
          console.log(err);
          alert('取得權限失敗，請重新確認');
        });
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
      canModify,
      // methods
      apiHandler,
      addToCart,
      checkAuthorization,
      inputFromPanel,
      setOrderMember,
      removeFromCart,
      setCurrentSearch,
      setCurrentChange,
      nowValueForPanel,
    };
  },
});
</script>
