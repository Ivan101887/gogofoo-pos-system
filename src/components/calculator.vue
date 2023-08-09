<template>
  <div class="calculator" @keyup.delete.capture="backspace">
    <div class="calculator__body">
      <input type="button" value="清除" class="btn" @click="clear">
      <input type="button" value="CE" class="btn" @click="clear">
      <input type="button" value="更正" class="btn" @click="backspace">
      <input type="button" value="/" class="btn">
      <input type="button" value="7" class="btn" @click="appendNumber('7')">
      <input type="button" value="8" class="btn" @click="appendNumber('8')">
      <input type="button" value="9" class="btn" @click="appendNumber('9')">
      <input type="button" value="*" class="btn">
      <input type="button" value="4" class="btn" @click="appendNumber('4')">
      <input type="button" value="5" class="btn" @click="appendNumber('5')">
      <input type="button" value="6" class="btn" @click="appendNumber('6')">
      <input type="button" value="-" class="btn">
      <input type="button" value="1" class="btn" @click="appendNumber('1')">
      <input type="button" value="2" class="btn" @click="appendNumber('2')">
      <input type="button" value="3" class="btn" @click="appendNumber('3')">
      <input type="button" value="+" class="btn">
      <input type="button" value="0" class="btn" @click="appendNumber('0')">
      <input type="button" value="." class="btn">
      <input type="button" value="結帳" class="btn btn__lg">
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';

export default defineComponent({
  props: {
    /** @param {Function} updateValue 更新父層input值 */
    updateValue: {
      type: Function,
      default: null,
    },
    /** @param {String} nowValue 更新前的值 */
    nowValue: {
      type: String,
      default: '',
    },
    /** @param {HTMLInputElement} target 父層要更新的元素 */
    target: {
      type: HTMLInputElement || null,
      default: null,
    },
  },
  setup(props) {
    const backspace = (): void => {
      const value = props.nowValue.slice(0, -1);
      props.updateValue(value);
    };
    const clear = (): void => {
      props.updateValue('');
    };

    const appendNumber = (num: string): void => {
      props.updateValue(props.nowValue + num);
    };

    return {
      clear,
      appendNumber,
      backspace,
    };
  },
});
</script>

<style lang="scss" scoped>
.calculator{
  @apply flex flex-col m-auto h-full w-full;
  &__head{
    @apply bg-white text-right p-3 text-3xl;
  }
  &__body{
    @apply grid grid-cols-4 h-full;
  }
}

.btn,
.btn__lg{
  @apply text-white rounded-none border-0;
  background-color: #3598da;
}
.btn__lg{
  @apply col-span-2;
  background-color: #2891d8;
}
.btn:hover{
  background-color: #268ccf;
}
.btn__lg:hover{
  background-color: #2483c3;
}
</style>
