<script setup lang="ts">
const companyName = 'GOGOFOO';
</script>
<template>
  <header class="header">
    <figure class="logo">
      <picture class="header__imgWrapper">
        <img :alt="companyName" class="header__img" src="@/assets/logo.png">
      </picture>
      <figcaption>
        <h1 class="header__title">
          {{ companyName }}
        </h1>
      </figcaption>
    </figure>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
  </header>
  <router-view/>
</template>

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
}
.logo {
  @apply flex flex-auto items-center gap-[8px];
}
</style>
