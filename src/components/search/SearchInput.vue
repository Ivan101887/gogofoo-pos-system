<template>
  <!-- 商品檢索的入框 -->
  <label
    :for="item.key"
    class="itemLabel flex items-center gap-2 grow bg-white rounded-2xl py-2.5 px-5
        font-semibold shadow-lg shadow-[#35385a1f]
    "
  >
    <slot name="prefix"></slot>
    <input
      :name="item.key"
      class="
        itemLabel__input outline-0 bg-transparent
        grow text-3xl
      "
      :class="[item.key === searchKey.user ? 'text-gray-500' : '']"
      type="text"
      v-model="item.value"
      :placeholder="placeholder"
      :inputmode="item.key === searchKey.user ? 'none' : 'text'"
      @focus="fnSetCurrent(item)"
      />
    <slot name="suffix"></slot>
  </label>
  <!-- 商品檢索結果 -->
  <div
    v-if="item.isShowResult"
    class="absolute w-full top-[46px] left-0 bg-sky-50 h-80 overflow-y-auto"
  >
    <Component :is="component" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, reactive, computed, watchEffect,
} from 'vue';
import SearchList from './searchList.vue';
import SearchUser from './SearchUser.vue';

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
  components: { SearchList, SearchUser },
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
      user = 'User',
    }
    const item = reactive(props.searchItem);
    watchEffect(async () => {
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
    const component = computed(() => (props.searchItem.key === 'product' ? 'SearchList' : 'SearchUser'));
    const onFocus = (obj) : void => {
      console.log('test');
      props.fnSetCurrent(obj);
    };
    return {
      item,
      component,
      searchKey,
      onFocus,
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
