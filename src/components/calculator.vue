<template>
  <div class="calculator" @keyup.delete.capture="backspace">
    <div class="calculator__body">
      <button class="btn" @click="clear">C</button>
      <button class="btn" @click="clear">CE</button>
      <button class="btn" @click="backspace">←</button>
      <button class="btn">/</button>
      <button class="btn" @click="appendNumber('7')">7</button>
      <button class="btn" @click="appendNumber('8')">8</button>
      <button class="btn" @click="appendNumber('9')">9</button>
      <button class="btn">*</button>
      <button class="btn" @click="appendNumber('4')">4</button>
      <button class="btn" @click="appendNumber('5')">5</button>
      <button class="btn" @click="appendNumber('6')">6</button>
      <button class="btn">-</button>
      <button class="btn" @click="appendNumber('1')">1</button>
      <button class="btn" @click="appendNumber('2')">2</button>
      <button class="btn" @click="appendNumber('3')">3</button>
      <button class="btn">+</button>
      <button class="btn" @click="appendNumber('0')">0</button>
      <button class="btn">.</button>
      <button class="btn btn__lg">=</button>
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
