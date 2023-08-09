<template>
  <div v-for="(item, index) in Object.values(operations)" :key="index" class="operation">
    <input type="button" :value="item" class="operation__btn" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const operations = [
      {
        id: 'discount',
        text: '折扣',
        callback: () => {
          console.log('折扣操作');
        },
        class: '',
      },
    ];
    return {
      operations,
    };
  },
});
</script>

<style lang="scss" scoped>
.operation {
  flex-grow: 1;
  text-align: center;
  &__btn {
    display: block;
    @apply w-full;
    font: {
      size: 18px;
      height: 24px;
      weight: 500;
    }
    text-align: center;
    cursor: pointer;
  }
}
</style>
