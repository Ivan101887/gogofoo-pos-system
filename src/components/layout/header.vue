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
    <nav class="flex gap-1.5 text-white items-center">
      <router-link class="object-center" :to="{name: 'home'}">首頁</router-link> |
      <router-link class="object-center" :to="{name: 'orders'}">歷史訂單</router-link>
    </nav>
    <div class="header__btnGroup relative">
      <button class="flex items-center gap-2" @click="isShowOptions = !isShowOptions">
        <div class="header__btn ">
          <font-awesome-icon
            class="login__icon"
            :icon="['fas', 'user']"
            size="lg"
            style="color: #4778cd;"
          />
        </div>
        <div class="text-white">歡迎，{{userName}}</div>
      </button>
      <ul
        v-show="isShowOptions"
        class="header__optionList bg-[#f0f0f0]"
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
    userName: {
      type: String,
      default: '',
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
  @apply flex flex-auto justify-between items-center gap-2;
  @apply px-2.5 py-1.5;
  @apply bg-sky-600;
  &__title {
    @apply text-2xl text-white font-black tracking-wide;
  }
  &__imgWrapper {
    @apply bg-white rounded-lg w-8 h-8;
  }
  &__img {
    @apply block w-full h-auto;
  }
  &__btn {
    @apply rounded-full bg-light w-6 h-6;
  }
  &__optionList {
    @apply absolute p-1 top-[35px] right-[-10px] shadow shadow-slate-200;
    z-index: 2;
  }
  &__optionItem {
    @apply bg-white w-[100px] py-0.5 text-center hover:bg-slate-300 cursor-pointer;
  }
}
.logo {
  @apply flex flex-auto items-center gap-2;
}
</style>
