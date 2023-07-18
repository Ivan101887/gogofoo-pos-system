/* eslint-disable max-classes-per-file */
/* eslint-disable camelcase */
type CreateArrayWithLengthX<
  LENGTH extends number,
  ACC extends unknown[] = [],
> = ACC['length'] extends LENGTH ? ACC : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>;

type NumericRange<
  START_ARR extends number[],
  END extends number,
  ACC extends number = never,
> = START_ARR['length'] extends END
  ? ACC | END
  : NumericRange<[...START_ARR, 1], END, ACC | START_ARR['length']>;

export type loginInfo = {
  username: string;
  password: string;
};

export class Customer {
  name: string;

  email: string;

  postcode: number;

  address: string;

  mobile: string;

  four_bank_number: string;

  company_name: string | null;

  company_phone: string | null;

  tax_number: string | null;

  e_money: number;

  sales_bonus: number;

  added_promo_code: string | null;

  refer_customer_code: string | null;

  refer_sales_code: string | null;

  emoney_numerator: number;

  emoney_denominator: number;

  constructor(
    name = '',
    tax_number = null,
    email = '',
    postcode = 0,
    address = '',
    mobile = '',
    four_bank_number = '',
    company_name = null,
    company_phone = null,
    e_money = 0,
    sales_bonus = 0,
    added_promo_code = null,
    refer_customer_code = null,
    refer_sales_code = null,
    emoney_numerator = 0,
    emoney_denominator = 0,
  ) {
    this.name = name;
    this.email = email;
    this.postcode = postcode;
    this.address = address;
    this.mobile = mobile;
    this.four_bank_number = four_bank_number;
    this.company_name = company_name;
    this.company_phone = company_phone;
    this.tax_number = tax_number;
    this.e_money = e_money;
    this.sales_bonus = sales_bonus;
    this.added_promo_code = added_promo_code;
    this.refer_customer_code = refer_customer_code;
    this.refer_sales_code = refer_sales_code;
    this.emoney_numerator = emoney_numerator;
    this.emoney_denominator = emoney_denominator;
  }
}
// eslint-disable-next-line no-shadow
export enum permission {
  authorize = 'authorisations.grant_auth_event',
  operatePos = 'orders.add_order_from_pos_machine',
  changePrice = 'discounts.add_sellingpricechange',
}
export class User {
  name: string;

  email: string;

  mobile: string;

  permissions: Array<string>;

  constructor(name = '', email = '', mobile = '', permissions: Array<string> = []) {
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.permissions = permissions;
  }
}

export interface IUser {
  token: string;
  userInfo: User;
}

export interface IProductSpec {
  id: number;
  photo: string;
  price_per_unit: number;
  product: number;
  product_name: string;
  quantity: number;
  serial_number: string;
  server_warn_string: string | null;
  spec_name: string;
  vendor: string;
  weight: number;
}
interface IOrderItem {
  purchase_count: number;
  price_per_unit: number;
  percentage_discount: number;
  amount_discount: number;
  product_name: string;
}
export class IShoppingItem implements IOrderItem {
  id: number;

  serial_number: string;

  purchase_count: number;

  price_per_unit: number;

  percentage_discount: number;

  amount_discount: number;

  product_name: string;

  constructor(
    id = 0,
    product_name = '',
    serial_number = '',
    purchase_count = 0,
    price_per_unit = 0,
    amount_discount = 0,
    percentage_discount = 0,
  ) {
    this.id = id;
    this.product_name = product_name;
    this.serial_number = serial_number;
    this.purchase_count = purchase_count;
    this.price_per_unit = price_per_unit;
    this.amount_discount = amount_discount;
    this.percentage_discount = percentage_discount;
  }
}

type ZERO_TO_HUNDRED = NumericRange<CreateArrayWithLengthX<0>, 100>;
type transaction_tool = 'cash' | 'card';

export interface IOrderInfo {
  mobile?: string;
  used_e_money?: number;
  used_bonus?: number;
  payment_method: transaction_tool;
  percentage_discount?: ZERO_TO_HUNDRED;
  amount_discount?: number;
  items: IShoppingItem[];
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
  id: number;
  order_from_platform: string;
  order_forged_by_account: number;
  customer: number;
  name: string;
  mobile: string;
  payment_method: string;
  payment_status: string;
  customer_note: string;
  date: string;
  order_number: string;
  auth_event: number;
  items: IOrderItem[];
}
