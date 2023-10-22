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
      @focus="fnSetCurrent(item)"
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

<script lang="ts">
import {
  defineComponent, PropType, reactive, watchEffect,
} from 'vue';
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
export default defineComponent({
  components: { SearchList },
  props: {
    /** @param {Object} searchItem - 搜尋框的物件  */
    searchItem: {
      type: Object as PropType<Item>,
      default: new Item(),
    },
    /** @param {string} placeholder - 輸入框的替代文字 */
    placeholder: {
      type: String,
      default: '',
    },
    /** @params {Function} fnSetCurrent - 獲取目前輸入的元素 */
    fnSetCurrent: {
      type: Function,
      default: null,
    },
    /** @param {Function} fnSearch - 搜尋關鍵字 */
    fnSearch: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    // eslint-disable-next-line no-shadow
    enum searchKey {
      product = 'product',
      user = 'user',
    }
    const item = reactive(props.searchItem);
    watchEffect(async () => {
      if (item.key === searchKey.user) return;
      if (!item.value) {
        item.isShowLoading = false;
        item.isShowResult = false;
        item.isSearchError = false;
        return;
      }
      item.isShowResult = true;
      item.isShowLoading = true;
      await props.fnSearch(item);
    });
    return {
      item,
      searchKey,
    };
  },
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
