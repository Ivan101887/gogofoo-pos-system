<template>
  <div class="keyboard flex flex-col">
    <van-number-keyboard
      theme="custom"
      :extra-key="['00', '.']"
      :style="{ color: '#000' }"
      show
      close-button-text="Enter"
      @input="onInput"
      @delete="onDelete"
      @close="simulateKeyUpEnter"
      @click.stop
    >
    </van-number-keyboard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const el = computed(() => store.getters.getCurrentElement);
const onInput = (v) : void => {
  const event = new InputEvent('input', {
    bubbles: true, // Whether the event should bubble up through the DOM
    cancelable: true, // Whether the event can be canceled
    data: `${v}`, // The input data associated with the event
    inputType: 'insertText', // The type of input event (e.g., 'insertText', 'insertCompositionText', 'deleteContentBackward', etc.)
    isComposing: false, // Indicates whether the event is part of a composition (IME) session
    composed: true,
  });
  if (el.value) {
    el.value.dispatchEvent(event);
  }
};
const onDelete = () : void => {
  const event = new InputEvent('input', {
    bubbles: true, // Whether the event should bubble up through the DOM
    cancelable: true, // Whether the event can be canceled
    data: null, // The input data associated with the event
    inputType: 'deleteContentBackward', // The type of input event (e.g., 'insertText', 'insertCompositionText', 'deleteContentBackward', etc.)
    isComposing: false, // Indicates whether the event is part of a composition (IME) session
    composed: true,
  });
  if (el.value) {
    el.value.dispatchEvent(event);
  }
};
const simulateKeyUpEnter = (): void => {
  const event = new KeyboardEvent('keyup', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
  });
  if (el.value) {
    el.value.dispatchEvent(event);
    store.dispatch('assign_el', null);
  }
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
    @apply bg-gray-100 shadow shadow-gray-600 h-full text-black;
  }
  &:deep(.van-key--large) {
    @apply box-border py-6 static;
  }
}
</style>
