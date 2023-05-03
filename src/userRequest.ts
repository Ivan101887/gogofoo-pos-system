import axios, { AxiosResponse } from 'axios';
import { IUser, loginInfo } from '../entities';

const domain = 'https://admin.gogofoo.com';
function getUserToken():string {
  const userData: IUser = JSON.parse(
    localStorage.getItem('user') as string,
  );
  if (userData) {
    return userData.token;
  }
  return '';
}
const headers: {Authorization: string} = {
  Authorization: `Bearer ${getUserToken()}`,
};
function loginPos(info: loginInfo): Promise<AxiosResponse> {
  return axios.post(
    `${domain}/accounts/login/`,
    info,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
function updateRequestHeader(): void {
  headers.Authorization = `Bearer ${getUserToken()}`;
}
function logout(): Promise<AxiosResponse> {
  return axios.post(
    `${domain}/accounts/logout/`,
    null,
    { headers },
  );
}
function getProductWithSerialNumber(productId: string):Promise<AxiosResponse> {
  return axios.get(
    `${domain}/products/specs/serial_number/${productId}/`,
    { headers },
  );
}
function getProductListWithName(params: {
    q: string,
    limit: number,
    page: number,
  }): Promise<AxiosResponse> {
  return axios.get(
    `${domain}/api/v1/products/search/`,
    {
      params,
      headers,
    },
  );
}
export {
  loginPos,
  logout,
  getProductWithSerialNumber,
  getProductListWithName,
  updateRequestHeader,
};
