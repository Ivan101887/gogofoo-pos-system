<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <header class="header">
    <figure class="logo">
      <picture class="header__imgWrapper">
        <img :alt="title" class="header__img" src="@/assets/logo.png">
      </picture>
      <figcaption>
        <h1 class="header__title">
          {{ title }}
        </h1>
      </figcaption>
    </figure>
    <nav class="flex gap-[6px] text-white items-center">
      <router-link :to="{name: 'home'}">首頁</router-link> |
      <router-link :to="{name: 'orders'}">訂單資訊</router-link>
    </nav>
    <div class="header__btnGroup relative">
      <button class="header__btn" @click="isShowOptions = !isShowOptions">
        <font-awesome-icon
            class="login__icon"
            :icon="['fas', 'user']"
            size="lg"
            style="color: #4778cd;"
          />
      </button>
      <ul
        v-show="isShowOptions"
        class="header__optionList"
      >
        <li class="header__optionItem" @click="fnLogout">登出</li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'GOGOFOO',
    },
  },
  emit: ['logout'],
  setup(props, { emit }) {
    const isShowOptions = ref<boolean>(false);
    const fnLogout = (): void => {
      isShowOptions.value = false;
      emit('logout');
    };
    return {
      isShowOptions,
      fnLogout,
      emit,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @apply flex flex-auto justify-between items-center gap-[8px];
  @apply px-[10px];
  @apply bg-sky-600;
  &__title {
    @apply text-[40px] text-white font-black;
  }
  &__imgWrapper {
    @apply bg-white rounded-lg;
    width: 40px;
    height: 40px;
  }
  &__img {
    @apply block;
    width: 100%;
    height: auto;
  }
  &__btn {
    @apply rounded-full bg-light w-[24px] h-[24px];
  }
  &__optionList {
    @apply absolute p-1 top-[42px] right-[-10px] shadow shadow-slate-200;
  }
  &__optionItem {
    @apply bg-white w-[100px] py-0.5 text-center hover:bg-slate-300;
    cursor: pointer;
  }
}
.logo {
  @apply flex flex-auto items-center gap-[8px];
}
</style>
