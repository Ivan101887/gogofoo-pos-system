import axios from 'axios';
import vueAxios from 'vue-axios';
import { ref, reactive } from 'vue';

export type loginInfo = {
  username: string;

  password: string;
}
export type userInfo = {
  name: string,
  email: string,
  postcode: number,
  address: string,
  mobile: string,
  'four_bank_number': string,
  'company_name'?: string,
  'company_phone'?: string,
  'tax_number': string,
  'e_money': number,
  'sales_bonus': number,
  'added_promo_code': string,
  'refer_customer_code': string,
  'refer_sales_code': string,
  'emoney_numerator': number,
  'emoney_denominator': number,
}
export default {
  async loginPos(info: loginInfo):Promise<{
    userInfo: userInfo,
    errorMessage: string,
  }> {
    const data = reactive({
      token: '',
      userInfo: {},
    });
    const userInfo: userInfo = reactive({
      name: '',
      email: '',
      postcode: 0,
      address: '',
      mobile: '',
      four_bank_number: '',
      tax_number: '',
      e_money: 0,
      sales_bonus: 0,
      added_promo_code: '',
      refer_customer_code: '',
      refer_sales_code: '',
      emoney_numerator: 0,
      emoney_denominator: 0,
    });
    const token = ref('');
    const errorMessage = ref<string>('');
    const response = await axios.post(
      'https://admin.gogofoo.com/accounts/login/',
      info,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    console.log(response);
    return {
      userInfo,
      errorMessage,
    };
  },
};
