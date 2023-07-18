<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue';
import { loginPos, logout, updateRequestHeader } from '@/userRequest';
import {
  User, IUser, loginInfo as typeLoginInfo,
} from '../entities';

export default defineComponent({
  setup() {
    /** @param {string} 公司名稱 */
    const companyName = 'GOGOFOO';
    /** @param {boolean} 是否登入 */
    const isLogin = ref<boolean>(false);
    /** @param {boolean} 是否登入成功 */
    const isError = ref<boolean>(false);
    /**
     * @param {object} userInfo 使用者資訊
     * @param {string} userInfo.name 名字
     * @param {string} userInfo.email 電子郵件
     * @param {string} userInfo.mobile 手機號碼
     * @param {Array} userInfo.permissions 使用者權限
     */
    const userInfo = ref<User>(new User());
    const token = ref<string>('');
    const message = ref<string>('歡迎，請先輸入帳號密碼登入系統');
    /**
     * 登入
     * @description api互動成功儲存使用者資訊到localStorage
     * @returns {void}
     */
    const fnLogin = (loginInfo: typeLoginInfo): void => {
      loginPos(loginInfo)
        .then((res) => {
          userInfo.value = res.data.user;
          token.value = res.data.token;
          const userData = JSON.stringify({ userInfo: userInfo.value, token: token.value });
          localStorage.setItem('user', userData);
          updateRequestHeader();
          isLogin.value = true;
        })
        .catch((err) => {
          message.value = err.response.data;
          isError.value = true;
        });
    };
    const fnLogout = (): void => {
      logout()
        .then(() => {
          message.value = '你已登出，請重新登入繼續使用';
          isLogin.value = false;
          localStorage.removeItem('user');
        })
        .catch((err) => {
          console.log(err);
        });
    };
    /**
     * 登出
     * @description 登出並清除localStorage使用者資訊
     * @returns {void}
     */
    onMounted(() => {
      const userLocalStorage: string = localStorage.getItem('user') as string;
      let userData: IUser = {
        userInfo: userInfo.value,
        token: '',
      };
      if (userLocalStorage) {
        userData = JSON.parse(userLocalStorage);
      }
      if (Object.keys(userData).length && userData.userInfo && userData.token) {
        userInfo.value = userData.userInfo as User;
        token.value = userData.token;
        isLogin.value = true;
      }
    });
    return {
      companyName,
      isLogin,
      fnLogin,
      fnLogout,
      userInfo,
      isError,
      message,
    };
  },
});
</script>
<template>
  <Header :title="companyName" @logout="fnLogout" />
  <router-view :permission-list="userInfo.permissions"/>
  <Login v-if="!isLogin" :is-error="isError" :notice="message" @login="fnLogin" />
</template>

<style lang="scss" scoped>
body {
  @apply bg-[#f0f0f0];
}
</style>
