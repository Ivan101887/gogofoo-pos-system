<template>
  <div v-if="isShowLoading" class="load">
    <Loading />
  </div>
  <div v-else-if="result" class="result__list" @click="emit('setOrderMember', result)">
    <p class="result__item">會員姓名: {{ result.name }}</p>
    <p class="result__item">電話號碼: {{ result.mobile }}</p>
  </div>
  <div v-else class="notify">
    {{ errorMessage }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Customer } from '../../../entities';

export default defineComponent({
  props: {
    /** 搜尋結果 */
    result: {
      type: Object as PropType<Customer>,
      required: true,
    },
    /** 是否搜尋中 */
    isShowLoading: {
      type: Boolean,
      default: false,
    },
    /** 搜尋是否錯誤 */
    isSearchError: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '輸入完整手機以查詢',
    },
  },
  setup(props, { emit }) {
    return {
      emit,
    };
  },
});
</script>

<style lang="scss" scoped>
.result__list {
  @apply bg-gray-50/50 w-full cursor-pointer;
}
.load {
  @apply h-full flex items-center justify-center;
}
.notify {
  @apply text-center w-full mt-3;
}
</style>
