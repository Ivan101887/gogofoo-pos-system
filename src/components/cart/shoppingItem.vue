<script setup lang="ts">
import {
  defineProps, reactive, computed, PropType, defineEmits, ref,
  ComponentPublicInstance, watch,
} from 'vue';
import { IShoppingItem } from '../../../entities';

const props = defineProps({
  searchKey: {
    type: String,
    default: '',
  },
  /** @params {IShoppingItem} item - 商品 */
  item: {
    type: Object as PropType<IShoppingItem>,
    default: () => ({}),
  },
  /** @params {Boolean} canModify - 是否可以修改價格 */
  canModify: {
    type: Boolean,
    default: false,
  },
  focusOnEl: {
    type: Function,
    default: null,
  },
});
type refElement = (HTMLInputElement | ComponentPublicInstance | null)
const itemInputs = ref<Array<refElement>>([]);
const emit = defineEmits(['removeItem']);
// eslint-disable-next-line no-shadow
enum editFieldName {
      discount = 'percentage_discount',
      price = 'price_per_unit',
      coupon = 'amount_discount',
      count = 'purchase_count',
    }
// eslint-disable-next-line no-shadow
enum editFieldIndex {
      price = 0,
      count = 1,
      discount = 2,
      coupon = 3,
    }
const order = reactive(props.item);
const maxPrice = { ...order }.price_per_unit;
// const baseTotal = {}
const total = computed(() => Math.round(
  order.price_per_unit * order.purchase_count * (order.percentage_discount / 100),
) - order.amount_discount);
watch(order, (b, a) => {
  const discountBase = 100;
  const totalAfterDiscount = Math.round(
    a.price_per_unit * a.purchase_count * (a.percentage_discount / 100),
  );
  switch (props.searchKey) {
    case editFieldName.price:
      if (a[props.searchKey] > maxPrice || a[props.searchKey] <= 0) {
        alert(`價格設定有誤，不能超過${maxPrice}，請輸入正確的價格!!`);
        (itemInputs.value[editFieldIndex.price] as HTMLInputElement).focus();
      }
      break;
    case editFieldName.discount:
      if (!(a[props.searchKey] <= discountBase && a[props.searchKey] > 0)) {
        alert('打折請輸入0-100之間');
        (itemInputs.value[editFieldIndex.price] as HTMLInputElement).focus();
      }
      break;
      // 折讓修改
    case editFieldName.coupon:
      if (a[props.searchKey] >= (totalAfterDiscount)) {
        alert(`折扣金額不能超過${totalAfterDiscount}喔!!`);
        (itemInputs.value[editFieldIndex.price] as HTMLInputElement).focus();
      }
      break;
          // no default
  }
});
</script>
<template>
  <tr class="even:bg-cyan-100 px-2 py-2.5">
    <td align="center" width="25%">{{ order['product_name'] }}</td>
    <td align="center" width="15%">
      <label :for="editFieldName.price">
        <input
          type="number"
          :name="editFieldName.price"
          v-model="order[editFieldName.price]"
          class="shoppingItem text-lg p-2"
          :class="{ 'active-input': searchKey === editFieldName.price }"
          min="0"
          :max="maxPrice"
          :disabled="!canModify"
          inputmode="none"
          @focus="focusOnEl(order, editFieldName.price)"
          :ref="(el) => {itemInputs.push(el as refElement)}"
        />
      </label>
    </td>
    <td align="center" width="13%">
      <label :for="editFieldName.count">
        <input
          type="number"
          :name="editFieldName.count"
          v-model="order[editFieldName.count]"
          class="shoppingItem text-lg p-2"
          :class="{ 'active-input': searchKey === editFieldName.count }"
          inputmode="none"
          min="1"
          @focus="focusOnEl(order, editFieldName.count)"
          :ref="(el) => {itemInputs.push(el as refElement)}"
        />
      </label>
    </td>
    <td align="center" width="12%">
      <label :for="editFieldName.discount">
        <input
          type="number"
          :name="editFieldName.discount"
          v-model="order[editFieldName.discount]"
          class="shoppingItem text-lg p-2"
          :class="{ 'active-input': searchKey === editFieldName.discount }"
          max="100"
          min="0"
          step="5"
          inputmode="none"
          @focus="focusOnEl(order, editFieldName.discount)"
          :ref="(el) => {itemInputs.push(el as refElement)}"
        />
      </label>
    </td>
    <td align="center" width="15%">
      <label :for="editFieldName.coupon">
        <input
          type="number"
          :name="editFieldName.coupon"
          v-model="order[editFieldName.coupon]"
          class="shoppingItem text-lg p-2"
          :class="{ 'active-input': searchKey === editFieldName.coupon }"
          min="0"
          step="10"
          inputmode="none"
          @focus="focusOnEl(order, editFieldName.coupon)"
          :ref="(el) => {itemInputs.push(el as refElement)}"
        />
      </label>
    </td>
    <td align="center" width="15%">{{ total }}</td>
    <td align="center" width="5%">
      <button class="btn" @click="emit('removeItem', order.id)">
        <font-awesome-icon :icon="['fas', 'trash-can']" size="xl" class="text-rose-700" />
      </button>
    </td>
  </tr>
</template>
<style lang="scss" scoped>
td {
  vertical-align: middle;
}
label,
input {
  display: block;
  width: 100%;
  text-align: center;
}
input {
  &.active-input {
    @apply bg-blue-800 text-white;
  }
  @apply bg-transparent;
}
</style>
