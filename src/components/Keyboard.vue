<template>
  <div class="keyboard flex flex-col">
    <van-field v-model="bindValue" label="金额" readonly />
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
import { ref, defineProps, defineEmits } from 'vue';

const emit = defineEmits(['update-value']);
const props = defineProps({
  updateValue: {
    type: Function,
    default: null,
  },
});
const bindValue = ref(props.value);
const onInput = (value) : void => {
  props.updateValue(value);
  console.log(value);
  // if (bindValue.value) {
  // } else {
  //   bindValue.value = value;
  // }
};
// const onInput = (value) : void => {
//   if (bindValue.value) {
//     bindValue.value += value;
//     emit('update-value');
//   } else {
//     bindValue.value = value;
//   }
// };
const onDelete = () => {
  console.log('delete number');
};
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
