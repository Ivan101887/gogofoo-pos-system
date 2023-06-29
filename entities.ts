/* eslint-disable camelcase */
type CreateArrayWithLengthX<
    LENGTH extends number,
    ACC extends unknown[] = [],

> = ACC['length'] extends LENGTH
    ? ACC
    : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>

type NumericRange<
START_ARR extends number[],
END extends number,
ACC extends number=never>=
START_ARR['length'] extends END
? ACC | END
: NumericRange<[...START_ARR, 1], END, ACC | START_ARR['length']>

export type loginInfo = {
  username: string;
  password: string;
}

export interface ICustomer {
  name: string,
  email: string,
  postcode: number,
  address: string,
  mobile: string,
  four_bank_number: string,
  company_name: string|null,
  company_phone: string|null,
  tax_number: string|null,
  e_money: number,
  sales_bonus: number,
  added_promo_code: string|null,
  refer_customer_code: string|null,
  refer_sales_code: string|null,
  emoney_numerator: number,
  emoney_denominator: number,
}

export interface IUser {
  token: string;
  userInfo: ICustomer;
}

export interface IProductSpec {
  id: number,
  photo: string,
  price_per_unit: number,
  product: number,
  product_name: string,
  quantity: number,
  serial_number: string,
  server_warn_string: string | null,
  spec_name: string,
  vendor: string,
  weight: number,
}
interface IOrderItem {
  serial_number?: string,
  purchase_count: number,
  price_per_unit?: number,
  percentage_discount?: number,
  amount_discount?: number
}
export interface IShoppingItem extends IOrderItem{
  id: number,
  product_name: string,
}

type ZERO_TO_HUNDRED = NumericRange<CreateArrayWithLengthX<0>, 100>
type transaction_tool = 'cash' | 'card';

export interface IOrderInfo {
  mobile?: string,
  used_e_money?: number,
  used_bonus?: number,
  payment_method: transaction_tool,
  percentage_discount?: ZERO_TO_HUNDRED,
  amount_discount?: number,
  items: IShoppingItem[],
}
// eslint-disable-next-line no-shadow
export enum PaymentMethod {
  CreditCard = '刷卡',
  Cash = '現金',
  Coupon = '購物金',
  Credit = '抵用金',
  Discount = '折扣',
}
// eslint-disable-next-line no-shadow
export enum Operation {
  Check = '結帳',
  Discount = '折扣',
  Modify = '更正',
  Reset = '清除',
}
export interface IOrderDetailed {
  id: number,
  order_from_platform: string,
  order_forged_by_account: number,
  customer: number,
  name: string,
  mobile: string,
  payment_method: string,
  payment_status: string,
  customer_note: string,
  date: string,
  order_number: string,
  auth_event: number,
  items: IOrderItem[],
}
