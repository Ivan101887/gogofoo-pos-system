<!-- eslint-disable import/no-unresolved -->
<template>
  <div class="main">
    <section class="main__head cashier">
      <div class="cashier__head">
        <label for="ProductId" class="cashier__search">
          <font-awesome-icon class="cashier__icon" :icon="['fas', 'magnifying-glass']" size="sm" />
          <input name="ProductId" class="cashier__input" type="text" placeholder="商品名稱或編號" >
        </label>
        <button class="btn">輸入</button>
      </div>
      <div class="cashier__body">
        <ul class="list">
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
          <li class="item">
            生魚片
          </li>
        </ul>
      </div>
      <div class="cashier__foot"></div>
    </section>
    <div class="main__body">
      <section class="container__head">
        這邊要放會員搜尋
      </section>
      <section class="container__body">
        這邊放常見商品
      </section>
    </div>
  </div>
  <div class="foot">
    <Login />
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue';

import Login from '@/components/Login.vue';

</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  @apply flex flex-auto;
  &__head, &__body {
    @apply w-[50%];
  }
}
.cashier {
  &__head {
    @apply p-[4px] bg-[#D9D9D9];
  }
  &__input {
    @apply bg-transparent;
  }
}
</style>
