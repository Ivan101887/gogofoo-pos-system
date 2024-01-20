<script setup lang="ts">
import {
  defineProps, reactive, computed, PropType, defineEmits, watch, ref,
} from 'vue';
import { useStore } from 'vuex';
import { IShoppingItem } from '../../../entities';

const props = defineProps({
  index: {
    type: Number,
    default: -1,
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
  now: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['removeItem', 'focus', 'setLine']);
// eslint-disable-next-line no-shadow
enum editFieldName {
  discount = 'percentage_discount',
  price = 'price_per_unit',
  coupon = 'amount_discount',
  count = 'purchase_count',
}

const store = useStore();
const el = computed(() => store.getters.getCurrentElement);
const assignEl = (e) => {
  emit('focus');
  const { now, index } = props;
  if (now !== index) {
    emit('setLine', props.index);
  }
  if (el.value && el.value === e.target) return;
  store.dispatch('assign_el', e.target);
};
const order = reactive(props.item);
const input = (e) => {
  if (e.isTrusted) return;
  if (e.inputType === 'deleteContentBackward') {
    order[e.target.name] = `${order[e.target.name]}`.slice(0, -1);
    return;
  }
  if (order[e.target.name]) {
    order[e.target.name] += e.data;
    return;
  }
  order[e.target.name] = e.data;
};
const maxPrice = { ...order }.price_per_unit;
const total = computed(() => Math.round(
  order.price_per_unit * order.purchase_count * ((order.percentage_discount || 100) / 100),
) - order.amount_discount);
watch(order, (b, a) => {
  const discountBase = 100;
  const totalAfterDiscount = Math.round(
    a.price_per_unit * a.purchase_count * ((a.percentage_discount || 100) / 100),
  );
  switch (el.value.name) {
    case editFieldName.price:
      if (a[el.value.name] > maxPrice || a[el.value.name] <= 0) {
        alert(`價格設定有誤，不能超過${maxPrice}，請輸入正確的價格!!`);
        order[el.value.name] = b[el.value.name];
      }
      break;
    case editFieldName.discount:
      if (!(a[el.value.name] <= discountBase && a[el.value.name] > 0)) {
        alert('折扣請輸入0-100之間');
        order[el.value.name] = b[el.value.name];
      }
      break;
    case editFieldName.coupon:
      if (a[el.value.name] >= (totalAfterDiscount)) {
        alert(`折扣金額不能超過${totalAfterDiscount}喔!!`);
        order[el.value.name] = b[el.value.name];
      }
      break;
    // no default
  }
});
const trInItem = ref<HTMLTableRowElement | null>(null);
watch(() => props.now, () => {
  if (props.now === props.index) {
    const inputs = trInItem.value?.querySelectorAll('input.shoppingItem:not(disabled)');
    if (!inputs) return;
    const target = Array.from(inputs).find(
      (e) => (e as HTMLInputElement).name === editFieldName.count,
    );
    (target as HTMLInputElement).focus();
  }
});
const goNext = () => {
  const inputs = trInItem.value?.querySelectorAll('input.shoppingItem:not(disabled)');
  if (!inputs) return;
  if (inputs[inputs.length - 1] === el.value) {
    emit('setLine', props.index + 1);
    return;
  }
  const idx = Array.from(inputs).findIndex((e) => e === el.value);
  if (idx === -1) return;
  (inputs[idx + 1]as HTMLInputElement).focus();
};
const confirmRemoveItem = () => {
  const confirm = window.confirm(`確定要刪除品項: ${order.product_name}嗎?`);
  if (confirm) {
    emit('removeItem', order.id);
  }
};
</script>
<template>
  <tr ref="trInItem" class="even:bg-cyan-100 px-2 py-2.5">
    <td align="center" width="25%">{{ order['product_name'] }}</td>
    <td align="center" width="15%">
      <label :for="editFieldName.price">
        <input
          type="number"
          :name="editFieldName.price"
          v-model="order[editFieldName.price]"
          class="shoppingItem text-lg p-2"
          :class="{
            'active-input': now === index && el?.name === editFieldName.price
          }"
          min="0"
          :max="maxPrice"
          :disabled="!canModify"
          inputmode="none"
          @keyup.enter="goNext"
          @input="input"
          @focus="assignEl"
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
          :class="{
            'active-input': now === index && el?.name === editFieldName.count
          }"
          inputmode="none"
          min="1"
          @keyup.enter="goNext"
          @input="input"
          @focus="assignEl"
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
          :class="{
            'active-input': now === index && el?.name === editFieldName.discount
          }"
          max="100"
          min="0"
          step="5"
          inputmode="none"
          @keyup.enter="goNext"
          @input="input"
          @focus="assignEl"
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
          :class="{
            'active-input': now === index && el?.name === editFieldName.coupon
          }"
          min="0"
          step="10"
          inputmode="none"
          @keyup.enter="goNext"
          @input="input"
          @focus="assignEl"
        />
      </label>
    </td>
    <td align="center" width="15%">{{ total }}</td>
    <td align="center" width="5%">
      <button class="btn" @click="confirmRemoveItem">
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
