<template>
  <!-- 商品檢索的入框 -->
  <label
    :for="item.key"
    class="itemLabel flex items-center gap-2 grow bg-white rounded-2xl py-2.5 px-5
        font-semibold shadow-lg shadow-[#35385a1f]
    "
  >
  <div class="order-first">
    <slot name="prefix"></slot>
  </div>
  <div class="order-last shrink-0">
    <slot name="suffix"></slot>
  </div>
    <input
      :name="item.key"
      class="searchInput block outline-0 bg-transparent text-3xl w-4/5 grow shrink"
      :class="[item.key === searchKey.user ? 'text-gray-500' : '']"
      type="text"
      v-model="item.value"
      :placeholder="placeholder"
      :inputmode="item.key === searchKey.user ? 'none' : 'text'"
      @input="input"

      @keyup.enter="searchOnEnter"
      @focus="assignEl"
    />
  </label>
  <!-- 商品檢索結果 -->
  <div
    v-if="item.isShowResult && item.key === searchKey.product"
    class="absolute w-full top-full mt-2 bg-sky-300 z-[101]
      overflow-y-auto shadow-lg shadow-[#35385a1f] rounded-2xl h-[430px]
    "
  >
    <SearchList class="p-4" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import {
  PropType, reactive, watchEffect, defineProps, defineEmits,
} from 'vue';
import { useStore } from 'vuex';
import SearchList from './searchList.vue';

class Item {
  key = '';

  value = '';

  isShowLoading = false;

  isShowResult = false;

  isSearchError = false;

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

const props = defineProps({
  /** @param {Object} searchItem - 搜尋框的物件  */
  searchItem: {
    type: Object as PropType<Item>,
    require: true,
  },
  /** @param {string} placeholder - 輸入框的替代文字 */
  placeholder: {
    type: String,
    default: '',
  },
  /** @param {Function} fnSearch - 搜尋關鍵字 */
  fnSearch: {
    type: Function,
    default: null,
  },
});
// eslint-disable-next-line no-shadow
enum searchKey {
  product = 'product',
  user = 'user',
}
const item = reactive<Item>(props.searchItem as Item);
const input = (e) => {
  if (e.isTrusted) return;
  if (e.inputType === 'deleteContentBackward') {
    item.value = item.value.slice(0, -1);
    return;
  }
  if (item.value) {
    item.value += e.data;
    return;
  }
  item.value = e.data;
};
const emit = defineEmits(['focus']);
const store = useStore();
const assignEl = (e) => {
  const target = store.getters.getCurrentElement;
  emit('focus', item.key);
  if (target && target === e.target) return;
  store.dispatch('assign_el', e.target);
};
const search = async () => {
  if (!item.value) {
    item.isShowLoading = false;
    item.isShowResult = false;
    item.isSearchError = false;
    return;
  }
  item.isShowResult = true;
  item.isShowLoading = true;
  await props.fnSearch(item);
};
const searchOnEnter = async () => {
  if (item.key === searchKey.product) return;
  await search();
};
watchEffect(async () => {
  if (item.key === searchKey.user) return;
  await search();
});

</script>

<style lang="scss" scoped>
.itemLabel {
  &__search,
  &__icon,
  &__input {
    display: block;
  }
}
</style>
