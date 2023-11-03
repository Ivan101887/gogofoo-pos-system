<template>
  <!-- 主畫面 -->
  <div
    class="main flex flex-auto w-full h-[calc(100vh-44px)]"
    @click="handleClick"
  >
    <!-- 主畫面左半邊 -->
    <section class="main__head cashier flex flex-col w-3/5 bg-sky-200">
      <div class="cashier__head relative my-2.5 mx-5">
        <SearchInput
          :searchItem="searchItemProduct"
          :error-message="searchProductErrorMessage"
          :is-show-loading="searchItemProduct.isShowLoading"
          :is-search-error="searchItemProduct.isSearchError"
          placeholder="輸入產品編號或名稱"
          :result="productList"
          :fn-search="apiHandler"
          :can-modify="canModify"
          @add-to-cart="addToCart"
          @focus="resetLoading"
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
          :canModify="canModify"
          :total="totalBeforeDiscount"
          @removeItem="removeFromCart"
          @focus="resetLoading"
        >
        <template #modify>
          <button type="button" class="btn px-3" @click="checkAuthorization">
            <font-awesome-icon :icon="['fas', 'exclamation']" size="lg" class="text-yellow-400" />
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
            v-model.number="orderVal.totalPercentage"
            max="100"
            min="0"
            step="10"
            ref="totalPercentage"
            class="operateInput
            block grow  p-2 rounded text-right"
            :class="{'active-operate': el === totalPercentage}"
            name="totalPercentage"
            inputmode="none"
            @input="input($event as InputEvent)"
            @keyup.enter="() => totalDiscount?.focus()"
            @focus="assignEl"
          />
        </label>
        <label for="totalDiscount" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            折價:
          </p>
          <input
            type="number"
            v-model.number="orderVal.totalDiscount"
            max="100"
            min="0"
            step="10"
            ref="totalDiscount"
            class="operateInput
            block grow  p-2 rounded text-right"
            :class="{'active-operate': el === totalDiscount}"
            name="totalDiscount"
            inputmode="none"
            @input="input($event as InputEvent)"
            @keyup.enter="() => totalEMoney?.focus()"
            @focus="assignEl"
          />
        </label>
        <label for="totalEMoney" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            回饋金:
          </p>
          <input
            type="number"
            v-model="orderVal.totalEMoney"
            max="100"
            min="0"
            step="10"
            ref="totalEMoney"
            class="operateInput
            block grow  p-2 rounded text-right"
            :class="{'active-operate': el === totalEMoney}"
            name="totalEMoney"
            inputmode="none"
            @input="input($event as InputEvent)"
            @keyup.enter="() => totalBonus?.focus()"
            @focus="assignEl"
          />
        </label>
        <label for="totalBonus" class="flex gap-5 items-center basis-2/5 text-xl">
          <p class="flex-auto">
            購物金:
          </p>
          <input
            type="number"
            :disabled="!canUseBonus"
            v-model="orderVal.totalBonus"
            max="100"
            min="0"
            step="10"
            ref="totalBonus"
            class="operateInput
            block grow  p-2 rounded text-right"
            :class="{'active-operate': el === totalBonus}"
            name="totalBonus"
            inputmode="none"
            @keyup.enter="isShowModal = true"
            @focus="assignEl"
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
              清除訂單
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
              結帳
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
            :fn-search="apiHandler"
            @focus="resetLoading"
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
          :is-show-loading="searchItemUser.isShowLoading"
          :is-search-error="searchItemUser.isSearchError"
          :error-message="searchUserErrorMessage"
        />
      </section>
      <section class="container__foot h-3/5">
        <Keyboard />
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
          <p class="block grow">
            實際支付金額:
          </p>
          <input
            v-model="orderVal.paidCash"
            name="paidCash"
            placeholder="已付金額"
            type="number"
            min="0"
            :max="orderTotal"
            ref="paidCash"
            class="operateInput p-3 block w-[190px] text-right"
            :class="{'active-operate': el === paidCash}"
            @input="input($event as InputEvent)"
            @keyup.enter="() => taxNum?.focus()"
            @focus="assignEl"
          />
        </label>
      </div>
      <div class="mt-3">
        <label for="taxNum" class="text-4xl flex gap-2 items-center">
          <p class="block grow">
            統一編號:
          </p>
          <input
            v-model="orderVal.taxNum"
            name="taxNum"
            placeholder="輸入統編"
            type="text"
            ref="taxNum"
            :maxlength="8"
            class="operateInput p-3 block w-[190px] text-right"
            :class="{'active-operate': el === taxNum}"
            @input="input($event as InputEvent)"
            @keyup.enter="store.dispatch('assign_el', null)"
            @focus="assignEl"
          />
        </label>
      </div>
      <div class="">
        <p class="text-5xl flex">
          找零:
          <span class="grow text-end">
            {{ numberThousand(orderVal.paidCash > 0 ? orderTotal - orderVal.paidCash : 0) }}
          </span>
        </p>
      </div>
    </div>
    <div class="fixed bottom-0 ml-3 flex gap-2 w-[45%] my-3">
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

<script setup lang="ts">
import {
  defineProps, defineEmits, ref, reactive, computed, PropType, watch,
} from 'vue';
import {
  getSpecWithSerialNumber,
  getSpecListWithName,
  getMember,
  getAuthorization,
  createNewOrder,
} from '@/userRequest';
import { useStore } from 'vuex';
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

const props = defineProps({
  /** @params {Array} permissionList - 權限包 */
  permissionList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
const emit = defineEmits(['updatePermissionList']);
/** 會員搜尋 */
const isShowModal = ref(false);
const numberThousand = (number: number): string => {
  if (number === undefined || Number.isNaN(number)) {
    return '-';
  }
  const regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
  return `${number.toString().replace(regExpInfo, '$1,')}`;
};
const searchItemProduct = ref<SearchItem>(new SearchItem(searchKey.product));
const searchItemUser = ref<SearchItem>(new SearchItem(searchKey.user));
const resetLoading = (): void => {
  searchItemProduct.value.value = '';
  searchItemProduct.value.isShowLoading = false;
  searchItemProduct.value.isShowResult = false;
  searchItemProduct.value.isSearchError = false;
  searchItemUser.value.value = '';
  searchItemUser.value.isSearchError = false;
  searchItemUser.value.isShowLoading = false;
  searchItemUser.value.isShowResult = false;
};
const store = useStore();
const el = computed(() => store.getters.getCurrentElement);
const assignEl = (e) : void => {
  resetLoading();
  if (el.value && el.value === e.target) return;
  store.dispatch('assign_el', e.target);
};
const handleClick = (event) => {
  if (event.target.tagName.toLowerCase() === 'input') return;
  store.dispatch('assign_el', null);
  resetLoading();
};
/** 是否有權限修改價格 */
const canModify = ref(false);
/** 訂單的會員資訊 */
const memberInfo = ref<Customer>(new Customer());

/** @param {IProduct[]} productList 商品的搜尋結果 */
const productList = reactive<IProductSpec[]>([]);
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
    searchItemProduct.value.isShowLoading = false;
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
          searchItemProduct.value.isSearchError = true;
        }
        productList.push(spec.data);
      })
      .catch((err) => {
        console.log(err);
        searchProductErrorMessage.value = '找不到相關的商品';
        searchItemProduct.value.isSearchError = true;
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
          searchItemProduct.value.isSearchError = false;
          return;
        }
        productList.push(...res.data);
      })
      .catch((err) => {
        console.log(err);
        searchProductErrorMessage.value = '找不到相關的商品';
        searchItemProduct.value.isSearchError = true;
      });
  }
  searchItemProduct.value.isShowLoading = false;
};
const searchUserErrorMessage = ref<string>(noticeText);
const setOrderMember = (member: Customer) => {
  memberInfo.value = member;
  searchUserErrorMessage.value = noticeText;
};
const getCustomerData = (keyword) => {
  if (phoneRegex.test(keyword)) {
    getMember({ phone: keyword })
      .then((res) => {
        searchUserErrorMessage.value = '';
        searchItemUser.value.value = '';
        searchItemUser.value.isSearchError = false;
        searchItemUser.value.isShowLoading = false;
        searchItemUser.value.isShowResult = false;
        setOrderMember(res.data);
      })
      .catch((err) => {
        searchUserErrorMessage.value = err.response.data;
        searchItemUser.value.isShowLoading = false;
        searchItemUser.value.isSearchError = true;
        searchItemUser.value.isShowResult = true;
      });
  }
};

/** @param {number | null} 輸入事件的debounce定時器 */
const timeout = ref<null | number>(null);
/** 控制搜尋的api以及各項狀態的更新 */
const apiHandler = (content: SearchItem) => {
  if (content.value) {
    if (content.key === searchKey.product) {
      searchProductErrorMessage.value = '請掃描條碼或輸入商品名稱';
    } else {
      searchItemUser.value.isShowResult = true;
      searchItemUser.value.isShowLoading = true;
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
    percentage_discount: 0,
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
};
const removeFromCart = (id: number) => {
  const index = shoppingList.findIndex((item) => item.id === id);
  if (index !== -1) {
    shoppingList.splice(index, 1);
  }
};
const orderVal = reactive({
  totalPercentage: 0,
  totalDiscount: 0,
  totalEMoney: 0,
  totalBonus: 0,
  paidCash: 0,
  taxNum: '',
});
const input = (e: InputEvent) : void => {
  const target = e.target as HTMLInputElement;
  if (e.isTrusted) return;
  if (e.inputType === 'deleteContentBackward') {
    orderVal[target.name] = `${orderVal[target.name]}`.slice(0, -1);
    if (target.name === 'taxNum') return;
    if (orderVal[target.name] === '') {
      orderVal[target.name] = 0;
    }
    return;
  }
  if (orderVal[target.name]) {
    orderVal[target.name] += e.data;
    return;
  }
  orderVal[target.name] = e.data;
};
const shoppingItemTotal = computed(() => shoppingList.map(
  (order) => Math.round(
  order.price_per_unit * order.purchase_count
  * (order.percentage_discount || 100) as number / 100,
  ) - order.amount_discount,
));
const totalBeforeDiscount = computed(
  () => shoppingItemTotal.value.reduce((acc, item) => acc + item, 0),
);
const orderTotal = computed(
  () => Math.round(
    totalBeforeDiscount.value * (orderVal.totalPercentage / 100),
  ) - orderVal.totalDiscount - orderVal.totalEMoney - orderVal.totalBonus,
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
const payment = ref('');
const resetData = () => {
  shoppingList.splice(0);
  orderVal.totalBonus = 0;
  orderVal.totalEMoney = 0;
  orderVal.totalPercentage = 0;
  orderVal.totalDiscount = 0;
  payment.value = '';
  memberInfo.value = new Customer();
  orderVal.taxNum = '';
  orderVal.paidCash = 0;
  payment.value = '';
  isShowModal.value = false;
};
const [
  totalPercentage,
  totalDiscount,
  totalEMoney,
  totalBonus,
  paidCash,
  taxNum,
] = [
  ref<HTMLInputElement | null>(null),
  ref<HTMLInputElement | null>(null),
  ref<HTMLInputElement | null>(null),
  ref<HTMLInputElement | null>(null),
  ref<HTMLInputElement | null>(null),
  ref<HTMLInputElement | null>(null),
];
watch(isShowModal, (val) => {
  if (!val) return;
  paidCash.value?.focus();
});
const createOrder = async () => {
  const apiData = {
    mobile: memberInfo.value.mobile,
    used_e_money: orderVal.totalEMoney,
    used_bonus: orderVal.totalBonus,
    payment_method: payment.value,
    tax_number: orderVal.taxNum,
    percentage_discount: orderVal.totalPercentage || 100,
    amount_discount: orderVal.totalDiscount,
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
  if (!orderVal.paidCash) {
    orderVal.paidCash = orderTotal.value;
  }
  payment.value = pay;
  await createOrder();
};

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
  input {
    &.operateInput {
      @apply outline outline-1 outline-blue-500;
    }
    &.operateInput.active-operate {
      @apply outline-pink-500;
    }
  }

</style>
