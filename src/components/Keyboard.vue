<template>
  <div class="keyboard flex flex-col">
    <van-number-keyboard
      theme="custom"
      :extra-key="['00', '.']"
      show
      @input="onInput"
      @delete="onDelete"
      @close="simulateKeyUpTab"
    >
    </van-number-keyboard>
  </div>
</template>

<script lang="ts" setup>
import {
  ref, defineProps, watch, onMounted,
} from 'vue';
import { useStore } from 'vuex';

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
});
const value = ref(props.val);
const store = useStore();
const onInput = (v) : void => {
  const el = store.getters.getCurrentElement;
  const event = new InputEvent('input', {
    bubbles: true, // Whether the event should bubble up through the DOM
    cancelable: true, // Whether the event can be canceled
    data: `${v}`, // The input data associated with the event
    inputType: 'insertText', // The type of input event (e.g., 'insertText', 'insertCompositionText', 'deleteContentBackward', etc.)
    isComposing: false, // Indicates whether the event is part of a composition (IME) session
    composed: true,
  });
  el.dispatchEvent(event);
  // value.value = props.val;
  // if (value.value) {
  //   value.value += `${v}`;
  //   return;
  // }
  // value.value = `${v}`;
};
const onDelete = () : void => {
  const el = store.getters.getCurrentElement;
  const event = new InputEvent('input', {
    bubbles: true, // Whether the event should bubble up through the DOM
    cancelable: true, // Whether the event can be canceled
    data: null, // The input data associated with the event
    inputType: 'deleteContentBackward', // The type of input event (e.g., 'insertText', 'insertCompositionText', 'deleteContentBackward', etc.)
    isComposing: false, // Indicates whether the event is part of a composition (IME) session
    composed: true,
  });
  el.dispatchEvent(event);
  // value.value = props.val;
  // value.value = value.value.slice(0, -1);
};
const resetValue = () : void => {
  value.value = '';
};
onMounted(() => {
  props.fnGetReset(resetValue);
});
watch(value, () => {
  console.log(value.value);
  props.updateValue(value.value);
});
const simulateKeyUpTab = (): void => {
  console.log('simulating keyup event');
  const event = new KeyboardEvent('keyup', {
    key: 'Tab',
    code: 'Tab',
    keyCode: 9,
    which: 9,
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
  });
  const target = document.activeElement as HTMLInputElement;
  console.log(target);
  target.dispatchEvent(event);
};
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
