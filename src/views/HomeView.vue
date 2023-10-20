<template>
  <!-- 主畫面 -->
  <div class="main flex flex-auto w-full h-[calc(100vh-44px)]" @click="handleClick">
    <!-- 主畫面左半邊 -->
    <section class="main__head cashier flex flex-col w-3/5 bg-sky-200">
      <div class="cashier__head relative my-2.5 mx-5">
        <SearchInput
          :searchItem="searchItemProduct"
          :error-message="searchProductErrorMessage"
          :is-show-loading="currentSearch.isShowLoading"
          :is-search-error="currentSearch.isSearchError"
          placeholder="輸入產品編號或名稱"
          :result="productList"
          :fn-set-current="setCurrentSearch"
          :fn-search="apiHandler"
          :can-modify="canModify"
          @add-to-cart="addToCart"
        >
        </SearchInput>
      </div>
      <!-- 當筆訂單的所購商品 -->
      <div class="cashier__body h-4/5
          flex flex-col justify-between px-5 py-2.5 gap-3 overflow-y-auto
        "
      >
        <ShoppingList
          :shopping-list="shoppingList"
          :focus-on-el="setCurrentChange"
          :canModify="canModify"
          :total="totalBeforeDiscount"
          @removeItem="removeFromCart"
        >
        <template #modify>
          <button type="button" class="btn" @click="checkAuthorization">
            <font-awesome-icon :icon="['fas', 'file-pen']" size="lg" class="text-rose-700" />
          </button>
        </template>
        </ShoppingList>
      </div>
      <div :class="[
          'cashier__foot grow flex gap-2 px-5 py-3 shrink-0 flex-wrap justify-between',
          {'cashier__foot--modal': !shoppingList.length}
        ]
      ">
        <label for="totalPercentage" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            折扣:
          </p>
          <input
            type="number"
            v-model="percentageDiscount"
            max="100"
            min="0"
            step="10"
            class="block grow outline outline-1 p-2 rounded text-right"
            name="totalPercentage"
            inputmode="none"
          />
        </label>
        <label for="totalDiscount" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            折價:
          </p>
          <input
            type="number"
            v-model="amountDiscount"
            max="100"
            min="0"
            step="10"
            class="block grow outline outline-1 p-2 rounded text-right"
            name="totalDiscount"
            inputmode="none"
          />
        </label>
        <label for="totalEMoney" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            業務獎金:
          </p>
          <input
            type="number"
            v-model="usedEMoney"
            max="100"
            min="0"
            step="10"
            class="block grow outline outline-1 p-2 rounded text-right"
            name="totalEMoney"
            inputmode="none"
          />
        </label>
        <label for="totalBonus" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            購物金:
          </p>
          <input
            type="number"
            :disabled="!canUseBonus"
            v-model="usedBonus"
            max="100"
            min="0"
            step="10"
            class="block grow outline outline-1 p-2 rounded text-right"
            name="totalBonus"
            inputmode="none"
          />
        </label>
        <div class="flex gap-5 items-center grow text-2xl">
          <p class="">
            折扣後總金額:
          </p>
          <p class="grow p-2 pr-5 text-right"
          >
            {{ numberThousand(orderTotal) }}
          </p>
        </div>
        <div class="flex items-end justify-end w-full gap-2">
          <p class="text-xl">
            <button type="button"
              class="
              bg-gray-300 hover:bg-gray-400 text-gray-800
                font-bold py-4 px-6 border border-gray-300 rounded"
                @click="confirmCancelOrder"
              >
              取消
            </button>
          </p>
          <p class="text-xl">
            <button type="button"
              class="
                bg-blue-500
                hover:bg-blue-700
                text-white font-bold py-4 px-6 border border-blue-700 rounded"
                @click="isShowModal = true"
              >
              確認
            </button>
          </p>
        </div>
      </div>
    </section>
    <!-- 主畫面右半邊 -->
    <div class="main__body container flex flex-col w-2/5 bg-gray-50">
      <section class="container__head">
        <div class="cashier__head relative m-2">
          <SearchInput
            :searchItem="searchItemUser"
            placeholder="客戶編號"
            :fn-set-current="setCurrentSearch"
          >
            <template #prefix>
              <font-awesome-icon
                class="itemLabel__icon text-gray-600"
                :icon="['fas', 'magnifying-glass']"
                size="xl"
              />
            </template>
            <template #suffix>
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                @click.stop="apiHandler(searchItemUser)"
              >
                搜尋
            </button>
            </template>
          </SearchInput>
        </div>
      </section>
      <section
        class="container__body grow m-2"
      >
        <OrderCustomer
          :customer="memberInfo"
          :is-show-result="searchItemUser.isShowResult"
          :is-show-loading="currentSearch.isShowLoading"
          :is-search-error="currentSearch.isSearchError"
          :error-message="searchUserErrorMessage"
        />
      </section>
      <section class="container__foot h-3/5">
        <Keyboard :update-value="inputFromPanel" :fn-get-reset="setResetFunction" />
      </section>
    </div>
  </div>
  <div :class="
      ['modal fixed bottom-0 left-[-100%] h-1/2 w-[60%]',
        'bg-[#0002] transition-all duration-1000 ease-in-out translate-x-{-100%}',
      {'left-[0px]': isShowModal}]
    ">
    <div class="fixed bottom-0 h-1/2 w-[47%] bg-white shadow-lg shadow-cyan-500/50 opacity-100 p-3">
      <div class="">
        <p class="text-5xl flex">
          總金額:
          <span class="grow text-end">
            {{ numberThousand(orderTotal) }}
          </span>
        </p>
      </div>
      <div class="mt-3">
        <label for="paidCash" class="text-4xl flex gap-2 items-center">
          <span class="grow">
            實際支付金額:
          </span>
          <input
            v-model="payCash"
            name="payCash"
            placeholder="已付金額"
            type="number"
            class="p-3 w-[300px]"
          />
        </label>
      </div>
      <div class="">
        <p class="text-5xl flex">
          找零:
          <span class="grow text-end">
            {{ numberThousand(payCash > 0 ? orderTotal - payCash : 0) }}
          </span>
        </p>
      </div>
    </div>
    <div class="fixed bottom-0 flex gap-2 w-[45%] my-3">
      <p class="text-xl grow">
        <button type="button"
          class="
            w-full
          bg-orange-300 hover:bg-orange-400 text-gray-800
            font-bold py-4 px-6 border border-gray-300 rounded
          "
          @click="assignPayment('card')"
        >
            刷卡結帳
        </button>
      </p>
      <p class="text-xl grow">
        <button type="button"
          class="
            bg-blue-500
            hover:bg-blue-700
            w-full
            text-white font-bold py-4 px-6 border border-blue-700 rounded
          "
          @click="assignPayment('cash')"
        >
          現金結帳
        </button>
      </p>
    </div>
    <div
      class="
        bg-white rounded-[50%] absolute right-1 w-16 h-16 top-1
        leading-[64px] text-center tex-[20px] cursor-pointer
      "
      @click="isShowModal = false"
    >
      X
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, computed, PropType,
} from 'vue';
import {
  getSpecWithSerialNumber,
  getSpecListWithName,
  getMember,
  getAuthorization,
  createNewOrder,
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
    const isShowModal = ref(false);
    const resetKeyboardVal = ref<null |(() => void)>(null);
    const setResetFunction = (func: (() => void)) : void => {
      resetKeyboardVal.value = func;
    };
    const numberThousand = (number: number): string => {
      if (number === undefined || Number.isNaN(number)) {
        return '-';
      }
      const regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
      return `${number.toString().replace(regExpInfo, '$1,')}`;
    };
    const searchItemProduct = ref<SearchItem>(new SearchItem(searchKey.product));
    const searchItemUser = ref<SearchItem>(new SearchItem(searchKey.user, '09'));
    const currentChange = ref<IShoppingItem>(new IShoppingItem());
    const currentSearch = ref<SearchItem>(new SearchItem());
    const currentKey = ref<string>('');
    const recoverCurrentSearch = (): void => {
      currentSearch.value.value = currentSearch.value.key === searchKey.user ? '09' : '';
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
      if (
        event.target.classList.contains('van-key')
        || event.target.tagName.toLowerCase() === 'input'
      ) return;
      recoverCurrentSearch();
      recoverCurrentChange();
    };
    /** 是否有權限修改價格 */
    const canModify = ref(false);
    /** 訂單的會員資訊 */
    const memberInfo = ref<Customer>(new Customer());
    // ^元素操作
    // ^搜尋功能
    /** @param {IProduct[]} productList 商品的搜尋結果 */
    const productList = reactive<IProductSpec[]>([]);
    const searchMember = ref<Customer>(new Customer());
    const setCurrentSearch = (item) => {
      if (resetKeyboardVal.value) {
        resetKeyboardVal.value();
      }
      if (currentSearch.value.key !== item.key) {
        switch (item.key) {
          case searchKey.product:
            productList.splice(0, productList.length);
            break;
          case searchKey.user:
            searchMember.value = new Customer();
            break;
          // no default
          default:
            break;
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
    const setOrderMember = (member: Customer) => {
      memberInfo.value = member;
      recoverCurrentSearch();
      searchUserErrorMessage.value = noticeText;
      searchMember.value = new Customer();
    };
    const getCustomerData = (keyword) => {
      if (phoneRegex.test(keyword)) {
        getMember({ phone: keyword })
          .then((res) => {
            searchMember.value = res.data;
            searchUserErrorMessage.value = '';
            currentSearch.value.isSearchError = false;
            currentSearch.value.isShowLoading = false;
            setOrderMember(searchMember.value);
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
          currentSearch.value.isShowResult = true;
          currentSearch.value.isShowLoading = true;
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
      if (currentSearch.value.key === searchKey.product) return;
      if (currentSearch.value) {
        currentSearch.value.value = value as string;
      }
    };

    // ^訂單操作`
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
    const usedEMoney = ref(0);
    const amountDiscount = ref(0);
    const percentageDiscount = ref(100);
    const usedBonus = ref(0);
    const payCash = ref(0);
    const shoppingItemTotal = computed(() => shoppingList.map((order) => Math.round(
      order.price_per_unit * order.purchase_count * (order.percentage_discount / 100),
    ) - order.amount_discount));
    const totalBeforeDiscount = computed(
      () => shoppingItemTotal.value.reduce((acc, item) => acc + item, 0),
    );
    const orderTotal = computed(
      () => Math.round(
        totalBeforeDiscount.value * (percentageDiscount.value / 100),
      ) - amountDiscount.value - usedEMoney.value - usedBonus.value,
    );
    const canUseBonus = computed(
      () => totalBeforeDiscount.value > memberInfo.value.emoney_denominator,
    );
    const orderAuthorizedId = ref(0);
    const checkAuthorization = () => {
      if (props.permissionList.includes(permission.changePrice)) {
        canModify.value = true;
        return;
      }
      const code = prompt('輸入驗證碼以授權');
      if (code === null) return;
      getAuthorization({ code })
        .then((res) => {
          canModify.value = true;
          orderAuthorizedId.value = res.data.id;
          emit('updatePermissionList', permission.changePrice);
        })
        .catch((err) => {
          console.log(err);
          alert('取得權限失敗，請重新確認');
        });
    };
    const taxNumber = ref('');
    const payment = ref('');
    const resetData = () => {
      shoppingList.splice(0);
      usedBonus.value = 0;
      usedEMoney.value = 0;
      percentageDiscount.value = 100;
      amountDiscount.value = 0;
      payment.value = '';
      memberInfo.value = new Customer();
      taxNumber.value = '';
      payCash.value = 0;
      payment.value = '';
      isShowModal.value = false;
    };
    const createOrder = async () => {
      const apiData = {
        mobile: memberInfo.value.mobile,
        used_e_money: usedEMoney.value,
        used_bonus: usedBonus.value,
        payment_method: payment.value,
        tax_number: taxNumber.value,
        percentage_discount: percentageDiscount.value,
        amount_discount: amountDiscount.value,
        auth_event_id: orderAuthorizedId.value,
        items: [...shoppingList],
      };
      try {
        const res = await createNewOrder(apiData);
        window.alert(`成功建立訂單${res}`);
        resetData();
      } catch (e) {
        console.log(e);
      }
    };
    const confirmCancelOrder = () => {
      const confirm = window.confirm('message');
      if (!confirm) return;
      resetData();
    };
    const assignPayment = async (pay) => {
      if (!payCash.value) {
        payCash.value = orderTotal.value;
      }
      payment.value = pay;
      await createOrder();
    };
    return {
      // data
      isShowModal,
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
      usedEMoney,
      amountDiscount,
      percentageDiscount,
      usedBonus,
      orderTotal,
      nowValueForPanel,
      payment,
      canUseBonus,
      payCash,
      totalBeforeDiscount,
      // methods
      createOrder,
      apiHandler,
      addToCart,
      checkAuthorization,
      inputFromPanel,
      removeFromCart,
      setCurrentSearch,
      setCurrentChange,
      confirmCancelOrder,
      assignPayment,
      setResetFunction,
      numberThousand,
      getCustomerData,
      handleClick,
    };
  },
});
</script>
<style lang="scss" scoped>
  .cashier {
    &__foot--modal {
      position: relative;
      &::after {
        content: '加入訂單後操作...';
        display: block;
        color: #fff;
        font-size: 30px;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        top: 0;
        left: 0;
        align-items: center;
        justify-content: center;
        background-color: #0008;
      }
    }
  }
</style>
