<template>
  <div class="keyboard flex flex-col">
    <van-field label="金额" readonly />
    <van-number-keyboard
      theme="custom"
      :extra-key="['00', '.']"
      :show="true"
      @input="onInput"
      @delete="onDelete"
    >
    </van-number-keyboard>
  </div>
</template>

<script lang="ts" setup>
import {
  ref, defineProps, defineEmits, watch,
} from 'vue';

const emit = defineEmits(['update-value']);
const props = defineProps({
  updateValue: {
    type: Function,
    default: null,
  },
});
const value = ref('');
const onInput = (v) : void => {
  if (value.value) {
    value.value += `${v}`;
    return;
  }
  value.value = `${v}`;
};
const onDelete = () : void => {
  value.value = value.value.slice(0, -1);
};
watch(value, () => {
  props.updateValue(value);
  console.log(value);
});
</script>
<style lang="scss" scoped>
.keyboard {
  height: 100%;
  &:deep(.van-number-keyboard) {
    box-sizing: border-box;
    position: relative;
    height: 100%;
  }
  &:deep(.van-number-keyboard__body) {
    height: 100%;
    gap: 12px;
  }
  &:deep(.van-number-keyboard__keys) {
    flex: 5;
    gap: 12px;
    & {
      .van-key__wrapper {
        flex-basis: calc(100% / 3 - 12px);
        & {
        }
      }
    }
  }
  &:deep(.van-key) {
    height: 100%;
    line-height: 100%;
    @apply shadow shadow-gray-600;
  }
  &:deep(.van-key__wrapper) {
    padding: 0;
    flex-basis: 0;
  }
}
</style>
