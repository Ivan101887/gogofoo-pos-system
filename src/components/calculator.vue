<template>
  <div class="calculator" @keyup.delete.capture="backspace">
    <div class="calculator__head">{{ displayValue }}</div>

    <div class="calculator__body">
      <button class="btn" @click="clear">C</button>
      <button class="btn" @click="clearEntry">CE</button>
      <button class="btn" @click="backspace">←</button>
      <button class="btn" @click="appendOperator('/')">/</button>
      <button class="btn" @click="appendNumber('7')">7</button>
      <button class="btn" @click="appendNumber('8')">8</button>
      <button class="btn" @click="appendNumber('9')">9</button>
      <button class="btn" @click="appendOperator('*')">*</button>
      <button class="btn" @click="appendNumber('4')">4</button>
      <button class="btn" @click="appendNumber('5')">5</button>
      <button class="btn" @click="appendNumber('6')">6</button>
      <button class="btn" @click="appendOperator('-')">-</button>
      <button class="btn" @click="appendNumber('1')">1</button>
      <button class="btn" @click="appendNumber('2')">2</button>
      <button class="btn" @click="appendNumber('3')">3</button>
      <button class="btn" @click="appendOperator('+')">+</button>
      <button class="btn" @click="appendNumber('0')">0</button>
      <button class="btn" @click="appendDecimal()">.</button>
      <button class="btn btn__lg" @click="calculate()">=</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref, computed, defineComponent, watch,
} from 'vue';

export default defineComponent({
  props: {
    target: {
      type: String,
      default: '',
    },
  },
  emit: ['searchProduct'],
  setup(props, { emit }) {
    const displayValue = ref<string>('0');
    const expression = ref<string>('');
    let shouldResetDisplay = false;

    const clear = (): void => {
      displayValue.value = '0';
      expression.value = '';
    };

    const clearEntry = (): void => {
      displayValue.value = '0';
    };

    const backspace = (): void => {
      displayValue.value = displayValue.value.slice(0, -1) || '0';
    };

    const appendNumber = (num: string): void => {
      if (shouldResetDisplay) {
        displayValue.value = '';
        shouldResetDisplay = false;
      }
      if (displayValue.value === '0') {
        displayValue.value = '';
      }
      displayValue.value += num;
    };

    const appendOperator = (operator: string): void => {
      expression.value += `${displayValue.value} ${operator} `;
      shouldResetDisplay = true;
    };

    const appendDecimal = (): void => {
      if (!displayValue.value.includes('.')) {
        displayValue.value += '.';
      }
    };

    const calculate = (): void => {
      expression.value += displayValue.value;
      // eslint-disable-next-line no-eval
      displayValue.value = eval(expression.value);
      expression.value = '';
      shouldResetDisplay = true;
    };
    watch(displayValue, (value: string) => {
      let word = '';
      if (value === '0') {
        word = '';
      } else {
        word = value;
      }
      emit('searchProduct', word);
      console.log(props.target);
    });
    return {
      displayValue: computed(() => displayValue.value),
      clear,
      clearEntry,
      backspace,
      appendNumber,
      appendOperator,
      appendDecimal,
      calculate,
      emit,
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
