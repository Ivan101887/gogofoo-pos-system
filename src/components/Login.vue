<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div class="modal">
    <form class="login" :class="{ 'error': isError}" @submit.prevent autocomplete="on">
      <div class="login__head">
        <div class="login__iconWrapper">
          <font-awesome-icon
            class="login__icon"
            :icon="['fas', 'user']"
            size="xl"
            style="color: #4778cd;"
          />
        </div>
        <div class="login__notice">{{ notice }}</div>
      </div>
      <form class="login__body" @submit.prevent="fnLogin" @keyup.enter.prevent="fnLogin">
        <div class="login__box">
          <label for="UserName" class="block login__label">帳號:</label>
          <input
            ref="acc"
            type="text"
            id="UserName"
            class="block login__input"
            placeholder="請輸入帳號以登入"
            v-model="loginInfo.username"
            @keyup.enter.stop="fnFocusNext('pwd')"
          />
        </div>
        <div class="login__box">
          <label for="Password" class="block login__label">密碼:</label>
          <input
            ref="pwd"
            type="password"
            id="Password"
            class="block login__input"
            placeholder="請輸入密碼以登入"
            v-model="loginInfo.password"
          />
        </div>
        <div class="login__box">
          <label for="storeSelect" class="block login__label">店別:</label>
          <select name="storeSelect" class="block login__input" v-model="selectedStore">
            <option value="" disabled>選擇所屬店別</option>
            <option v-for="store in storeList" :key="store.value">
              {{ store.text }}
            </option>
          </select>
        </div>
      </form>
      <div class="login__foot">
        <button type="reset" class="login__btn btn btn-md btn-cancel">清除</button>
        <button
          type="submit"
          class="login__btn btn btn-md btn-success"
          >
          <!-- @click.self.prevent="fnLogin" -->
          登入
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  reactive, ref, defineProps, defineEmits,
} from 'vue';
import { loginInfo as typeLoginInfo } from '../../entities';

defineProps({
  isError: {
    type: Boolean,
    default: false,
  },
  notice: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['login']);
const pwd = ref<HTMLInputElement | null>(null);
// 林口店、中山店、民族東路店、台中店
const storeList = reactive<{text: string, value: string}[]>([
  { text: '林口店', value: 'LK' },
  { text: '中山店', value: 'ZS' },
  { text: '民族東路店', value: 'MZE' },
  { text: '台中店', value: 'TC' },
]);
const selectedStore = ref<string>(storeList[0].text);
const loginInfo = reactive<typeLoginInfo>({ username: '', password: '' });
const fnLogin = ():void => {
  emit('login', loginInfo);
};
function fnFocusNext(key: string) : void {
  if (key === 'pwd') {
    pwd.value?.focus();
  }
}

</script>

<style lang="scss" scoped>
.modal {
  // position
  @apply fixed top-0 left-0 z-[100];
  // size
  @apply w-[100%] h-[100%];
  // display
  @apply flex justify-center items-center bg-black/[0.6];
}
.login {
  @apply w-[400px] bg-light p-[20px] rounded-lg;
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
  &__head {
    @apply flex flex-col items-center gap-y-3;
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
.error {
  .login {
    &__notice {
      @apply text-red-500;
    }
    &__input {
      @apply bg-red-100 border-rose-600;
    }
  }
}
.test {
  color: #8ca7d4;
}
</style>
