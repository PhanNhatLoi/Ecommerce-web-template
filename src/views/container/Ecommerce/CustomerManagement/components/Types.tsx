import { CustomerListResponse } from '~/state/ducks/customer/actions';

export interface AddressNeedLoadType {
  country: number;
  state?: number;
  province: number;
  district: number;
  ward: number;
}

export interface ConfirmDataType {
  type: string;
  id: number;
  fullname: string;
  status?: string;
}

export interface ViewCustomerIdType {
  code: string;
  profileId: string;
}

export interface Action {
  key?: string;
  icon: JSX.Element;
  text: string;
  onClick: (row: CustomerListResponse) => void;
  alterText?: string;
  alterIcon?: JSX.Element;
  disabled?: boolean;
}

export interface OnFilterType {
  antdCustom: boolean;
  value: string;
}
