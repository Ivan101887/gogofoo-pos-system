<script lang="ts">
import {
  defineComponent, reactive, computed, PropType,
} from 'vue';
import { IShoppingItem } from '../../../entities';

export default defineComponent({
  props: {
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
  },
  setup(props, { emit }) {
    // eslint-disable-next-line no-shadow
    enum editField {
      discount = 'percentage_discount',
      price = 'price_per_unit',
      coupon = 'amount_discount',
      count = 'purchase_count',
    }
    const order = reactive(props.item);
    const maxPrice = { ...order }.price_per_unit;
    const total = computed(() => Math.round(
      order.price_per_unit * order.purchase_count * (order.percentage_discount / 100)
          - order.amount_discount,
    ));
    const changeValue = (e, key) => {
      const discountBase = 100;
      const value = parseInt(e.target.innerHTML, 10);
      switch (key) {
        case editField.price:
          if (value > maxPrice || value <= 0) {
            alert('價格設定有誤，請輸入正確的價格!!');
          }
          break;
        case editField.count:
          if (value <= 0) {
            emit('removeItem', order.id);
          }
          break;
        case editField.discount:
          if (!(value <= discountBase && value > 0)) {
            alert('打折請輸入0-100之間');
          }
          break;
        // 折讓修改
        case editField.coupon:
          if (value >= total.value) {
            e.target.innerHTML = order[key];
            alert('折扣金額不能超過總金額喔!!');
          } else {
            order[key] = value;
          }
          break;
        // no default
      }
    };
    return {
      order,
      total,
      changeValue,
      maxPrice,
      editField,
    };
  },
});
</script>
<template>
  <tr>
    <td align="center" width="25%">{{ order['product_name'] }}</td>
    <td align="center" width="15%">
      <div v-if="canModify">
        {{ order[editField.price] }}
      </div>
      <label v-else :for="editField.price">
        <input
          type="number"
          :name="editField.price"
          v-model="order[editField.price]"
          min="0"
          :max="maxPrice"
          @focus="focusOnEl(order, editField.price)"
        />
      </label>
    </td>
    <td align="center" width="13%">
      <label :for="editField.count">
        <input
          type="number"
          :name="editField.count"
          v-model="order[editField.count]"
          @focus="focusOnEl(order, editField.count)"
        />
      </label>
    </td>
    <td align="center" width="12%">
      <label :for="editField.discount">
        <input
          type="number"
          :name="editField.discount"
          v-model="order[editField.discount]"
          max="100"
          min="0"
          step="5"
          @focus="focusOnEl(order, editField.discount)"
        />
      </label>
    </td>
    <td align="center" width="15%">
      <label :for="editField.coupon">
        <input
          type="number"
          :name="editField.coupon"
          v-model="order[editField.coupon]"
          min="0"
          step="10"
          @focus="focusOnEl(order, editField.coupon)"
        />
      </label>
    </td>
    <td align="center" width="20%">{{ total }}</td>
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
</style>
