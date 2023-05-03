<script lang="ts">
import Header from '@/components/layout/header.vue';
import { ref, defineComponent, onMounted } from 'vue';
import {
  loginPos,
  logout,
  updateRequestHeader,
} from '@/userRequest';
import type {
  ICustomer,
  IUser,
  IProduct,
  IProductSpec,
  loginInfo as typeLoginInfo,
} from '../entities';

export default defineComponent({
  setup() {
    /** @param {string} 公司名稱 */
    const companyName = 'GOGOFOO';
    /** @param {boolean} 是否登入 */
    const isLoginned = ref<boolean>(false);
    /** @param {boolean} 是否登入成功 */
    const isError = ref<boolean>(false);
    /**
     * @param {object} userInfo 使用者資訊
     * @param {string} name 名字
     * @param {string} email 電子郵件
     * @param {number} postcode 郵遞區號
     * @param {string} address 地址
     * @property {string} mobile 手機號碼
     * @param {string} four_bank_number 銀行帳號後四碼
     * @param {string} company_name 公司名稱
     * @param {string} company_phone 公司電話
    */
    const userInfo = ref<ICustomer>({
      name: '',
      email: '',
      postcode: 0,
      address: '',
      mobile: '',
      four_bank_number: '',
      company_name: null,
      company_phone: null,
      tax_number: '',
      e_money: 0,
      sales_bonus: 0,
      added_promo_code: '',
      refer_customer_code: '',
      refer_sales_code: '',
      emoney_numerator: 0,
      emoney_denominator: 0,
    });
    const token = ref<string>('');
    const message = ref<string>('歡迎，請先輸入帳號密碼登入系統');
    /**
     * 登入
     * @description api互動成功儲存使用者資訊到localStorage
     * @returns {void}
     */
    const fnLogin = (loginInfo: typeLoginInfo):void => {
      loginPos(loginInfo)
        .then((res) => {
          userInfo.value = res.data.customer;
          token.value = res.data.token;
          const userData = JSON.stringify({ userInfo: userInfo.value, token: token.value });
          localStorage.setItem('user', userData);
          updateRequestHeader();
          isLoginned.value = true;
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
          isLoginned.value = false;
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
        userInfo: {
          name: '',
          email: '',
          postcode: 0,
          address: '',
          mobile: '',
          four_bank_number: '',
          company_name: null,
          company_phone: null,
          tax_number: '',
          e_money: 0,
          sales_bonus: 0,
          added_promo_code: '',
          refer_customer_code: '',
          refer_sales_code: '',
          emoney_numerator: 0,
          emoney_denominator: 0,
        },
        token: '',
      };
      if (userLocalStorage) {
        userData = JSON.parse(userLocalStorage);
      }
      if (
        Object.keys(userData).length
        && userData.userInfo
        && userData.token
      ) {
        userInfo.value = userData.userInfo as ICustomer;
        token.value = userData.token;
        isLoginned.value = true;
      }
    });
    return {
      companyName,
      isLoginned,
      fnLogin,
      fnLogout,
      isError,
      message,
    };
  },
});
</script>
<template>
  <Header :title="companyName" @logout="fnLogout" />
  <router-view />
  <Login
    v-if="!isLoginned"
    :is-error="isError"
    :notice="message"
    @login="fnLogin"
  />
</template>

<style lang="scss" scoped>

</style>
