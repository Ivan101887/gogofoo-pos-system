import axios, { AxiosResponse } from 'axios';
import {
  IOrderDetailed, IUser, loginInfo, IShoppingItem,
} from '../entities';

/** api的根路徑 */
// const domain = {
//   formal: 'https://admin.gogofoo.com',
//   envTest: 'http://dev-gogofoo.tky.one', // 測試環境的訂單系統
// };
const domain = 'http://dev-gogofoo.tky.one';
/** 取得登入狀態
 * @return localStorage中的token
 */
function getUserToken(): string {
  const userData: IUser = JSON.parse(localStorage.getItem('user') as string);
  if (userData) {
    return userData.token;
  }
  return '';
}
/** 發送api請求所需的header */
const headers: { Authorization: string } = {
  Authorization: `Bearer ${getUserToken()}`,
};
/**
 * 登入pos系統
 * @param {loginInfo} info 登入所需的驗證資訊
 * @param {string} info.username 使用者名稱
 * @param {string} info.password 使用者密碼
 * @returns axios請求的promise物件
 */
function loginPos(info: loginInfo): Promise<AxiosResponse> {
  return axios.post(`${domain}/accounts/pos/login/`, info, {
    headers: { 'Content-Type': 'application/json' },
  });
}
/**
 * 登入後要更新header裡面的token
 */
function updateRequestHeader(): void {
  headers.Authorization = `Bearer ${getUserToken()}`;
}
/**
 * 登出 - 清除localStorage中的token顯示登出畫面
 * @returns axios請求的promise物件
 */
function logout(): Promise<AxiosResponse> {
  return axios.post(`${domain}/accounts/logout/`, null, { headers });
}
/**
 * 透過產編檢索商店內所有商品
 * @param {string} productId - 產品編號
 * @returns axios請求的promise物件
 */
function getSpecWithSerialNumber(productId: string): Promise<AxiosResponse> {
  return axios.get(`${domain}/products/specs/serial_number/${productId}/`, { headers });
}
/**
 * 透過關鍵字檢索商店內所有商品
 * @param {object} params 搜尋商品需要的參數
 * @returns axios請求的promise物件
 */
function getSpecListWithName(params: {
  q: string;
  limit: number;
  page: number;
}): Promise<AxiosResponse> {
  return axios.get(`${domain}/api/v1/products/specs/search/`, {
    params,
    headers,
  });
}
function getMember(params: { phone: string }): Promise<AxiosResponse> {
  return axios.get(`${domain}/accounts/mobile/${params.phone}`, { headers });
}
/**
 * 透過日期回顧歷史訂單
 * @param {object} params 搜尋商品需要的參數
 * @returns axios請求的promise物件
 */
function getHistoryOrders(params: {
  start: string | null;
  end: string | null;
  limit: number;
  offset: number;
}): Promise<
  {items: IOrderDetailed[], count:number}
> {
  return axios.get(`${domain}/api/v1/orders/list`, {
    params,
    headers,
  })
    .then((res) => ({
      items: res.data.items.map((item) => ({
        order_source_platform: item.order_source_platform,
        order_number: item.order_number,
        date: item.date,
        time: item.time,
        customer: item.customer,
        customer_mobile: item.customer_mobile,
        payment_method: item.payment_method,
        used_e_money: item.used_e_money,
        used_bonus: item.used_bonus,
        final_price: item.final_price,
        tax_number: item.tax_number,
        order_created_by: item.order_created_by,
        auth_event: item.auth_event,
        percentage_discount: item.applied_discounts.find((discount) => discount.discountType === 'percentage_discount_type')?.discount_value,
        amount_discount: item.applied_discounts.find((discount) => discount.discountType === 'amount_discount_type')?.discount_value,
        items: item.items,
      })),
      count: res.data.count,
    }))
    .catch((err) => {
      console.log(err);
      return {
        items: [],
        count: 0,
      };
    });
}
function getAuthorization(authorizationObj) {
  return axios.post(`${domain}/api/v1/auths/event/`, authorizationObj, {
    headers,
  });
}
function createNewOrder(orderObj: {
  'mobile': string,
  'used_e_money': number,
  'used_bonus': number,
  'payment_method': string,
  'tax_number': string,
  'percentage_discount': number,
  'amount_discount': number,
  'auth_event_id': number,
  'items': IShoppingItem[],
  }) {
  return axios.post(
    `${domain}/api/v1/orders/create`,
    orderObj,
    { headers },
  )
    .then((res) => res.data)
    .catch((err) => err);
}
export {
  loginPos,
  logout,
  getSpecListWithName,
  getHistoryOrders,
  getSpecWithSerialNumber,
  updateRequestHeader,
  getMember,
  getAuthorization,
  createNewOrder,
};
