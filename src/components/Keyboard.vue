<template>
  <div class="keyboard flex flex-col">
    <van-number-keyboard
      theme="custom"
      :extra-key="['00', '.']"
      show
      @input="onInput"
      @delete="onDelete"
      @close="enter"
    >
    </van-number-keyboard>
  </div>
</template>

<script lang="ts" setup>
import {
  ref, defineProps, watch, onMounted,
} from 'vue';

const props = defineProps({
  val: {
    type: String,
    default: '',
  },
  updateValue: {
    type: Function,
    default: null,
  },
  fnGetReset: {
    type: Function,
    default: null,
  },
  fnEnter: {
    type: Function,
    default: null,
  },
});
const value = ref(props.val);
const enter = (e) : void => {
  const { fnEnter } = props;
  if (!fnEnter) return;
  fnEnter();
  console.log(e, 111);
};
const onInput = (v) : void => {
  value.value = props.val;
  if (value.value) {
    value.value += `${v}`;
    return;
  }
  value.value = `${v}`;
};
const onDelete = () : void => {
  value.value = value.value.slice(0, -1);
};
const resetValue = () : void => {
  value.value = '';
};
onMounted(() => {
  props.fnGetReset(resetValue);
});
watch(value, () => {
  props.updateValue(value.value);
});
</script>
<style lang="scss" scoped>
.keyboard {
  height: 100%;
  &:deep(.van-number-keyboard) {
    @apply h-full relative box-border flex items-center justify-center py-0 bg-transparent;
  }
  &:deep(.van-number-keyboard__body) {
    @apply gap-[18px] p-0 h-[90%];
  }
  &:deep(.van-key__wrapper) {
    @apply basis-0 p-0;
  }
  &:deep(.van-number-keyboard__keys) {
    flex: 5;
    @apply gap-[18px];
    & {
      .van-key__wrapper {
        @apply basis-[90px];
      }
    }
  }
  &:deep(.van-number-keyboard__sidebar) {
    @apply gap-5;
  }
  &:deep(.van-key) {
    @apply bg-gray-100 shadow shadow-gray-600 h-full;
  }
  &:deep(.van-key--large) {
    @apply box-border py-6 static;
  }
}
</style>
