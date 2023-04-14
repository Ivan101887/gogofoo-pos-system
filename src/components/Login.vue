<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div class="modal">
    <section class="login">
      <div class="login__head">
        <div class="login__iconWrapper">
          <font-awesome-icon
            class="login__icon"
            :icon="['fas', 'user']"
            size="xl"
            style="color: #4778cd;"
          />
        </div>
      </div>
      <div class="login__body">
        <div class="login__box">
          <label for="UserName" class="block login__label">帳號:</label>
          <input
            type="text"
            id="UserName"
            class="block login__input"
            placeholder="請輸入帳號以登入"
            v-model="loginInfo.username"
          />
        </div>
        <form class="login__box">
          <label for="Password" class="block login__label">密碼:</label>
          <input
            type="password"
            id="Password"
            class="block login__input"
            placeholder="請輸入密碼以登入"
            v-model="loginInfo.password"
          />
        </form>
      </div>
      <div class="login__foot">
        <button type="reset" class="login__btn btn btn-cancel">清除</button>
        <button type="button" class="login__btn btn btn-success" @click="fnLogin">登入</button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { reactive, ref, computed } from 'vue';
import { loginPos } from '@/userRequest';

export default {
  setup() {
    const loginInfo = reactive({ username: '', password: '' });
    const fnLogin = ():void => {
      console.log('這邊要登入');
      loginPos();
    };
    return {
      loginInfo,
      fnLogin,
    };
  },
  // computed: {
  //   loginInfo(): {acc: string, pwd: string} {
  //     return {
  //       acc: '',
  //       pwd: '',
  //     };
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.modal {
  // position
  @apply fixed top-0 left-0;
  // size
  @apply w-[100%] h-[100%];
  // display
  @apply flex justify-center items-center bg-black/[0.6];
}
.login {
  @apply w-[400px] h-[300px] bg-light p-[20px] rounded-lg;
  @apply flex flex-col justify-center items-center gap-[20px];
  &__iconWrapper {
    @apply relative;
    @apply w-[64px] h-[64px] bg-[#8ca7d4] rounded-full;
  }
  &__icon {
    @apply absolute top-[50%] left-[50%];
    @apply w-[48px] h-[48px];
    vertical-align: middle;
    transform: translate(-50%, -50%);
  }
  &__body {
    @apply flex flex-col;
    @apply w-[100%] gap-[16px];
  }
  &__box {
    @apply flex gap-x-3 items-center;
  }
  &__label {
    @apply text-lg;
  }
  &__input {
    @apply grow h-[36px] rounded-sm p-2;
    outline: none;
  }
  &__btn {
    & + & {
      @apply ml-3;
    }
  }
}
.test {
  color: #8ca7d4;
}
</style>
