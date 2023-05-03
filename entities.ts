/* eslint-disable camelcase */

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
  'four_bank_number': string,
  'company_name': string|null,
  'company_phone': string|null,
  'tax_number': string,
  'e_money': number,
  'sales_bonus': number,
  'added_promo_code': string,
  'refer_customer_code': string,
  'refer_sales_code': string,
  'emoney_numerator': number,
  'emoney_denominator': number,
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

export interface IProduct {
  id: string,
  description: string,
  images: string[],
  name: string,
  specs: IProductSpec[],
}
