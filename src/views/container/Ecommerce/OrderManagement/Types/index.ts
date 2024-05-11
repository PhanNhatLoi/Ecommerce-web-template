import React from 'react';

export type Column = {
  dataField: String;
  text: String;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  formatter?: any;
  sort?: Boolean;
  onSort?: any;
  filterRenderer?: ((onFilter, column) => React.ReactElement) | '';
  csvText?: String;
  csvFormatter?: any;
  editable?: Boolean;
  sortCaret?: any;
  headerClasses?: String;
  headerFormatter?: any;
  filter?: any;
  align?: String;
  classes?: String;
  headerAlign?: String;
  footerAlign?: String;
};
export type Action = {
  icon: any;
  text: String;
  onClick: (row: any) => void;
  alterIcon?: String;
  alterText?: String;
  stt?: String;
  key?: string;
};

type ProgressDotRender = any;

export type StepStyledProps = {
  windowWidth: number;
  progressDot: (dot: any, { status, index }) => ((boolean | ProgressDotRender | undefined) & String) | React.ReactElement;
  labelPlacement: String;
  current: number;
};

export type Customer = {
  code: String;
  createdDate: String;
  email: String;
  fullAddress: String;
  fullname: String;
  id: String;
  lastModifiedDate: String;
  phone: String;
  profileId: String;
  status: String; //enum
  totalOrder: Number;
  userId: String;
  vendorUserId: String;
  country?: any;
  address?: any;
  fullName?: any;
};

export interface AddressNeedLoadType {
  country: number;
  state: any;
  province: number;
  district: number;
  ward: number;
}

export const PAYMENT_TYPE = {
  TYPE_INFO: 'BANK_TRANSFER',
  TYPE_SUCCESS: 'CASH'
};

export const UNIT_PRICE = {
  CASH: 'đ'
};

export type OrderInfoDetail = {
  orderCode: String | Number;
  orderTime: String;
  shipTime: String;
  paymentTime: String;
  doneTime: String;
  status: String;
  note: String;
  cancelReason: String;
  buyerProfileId?: Number;
  statusRes: String;
};

export type SaleOrderDetail = {
  id: number;
  groupCode: string;
  code: string;
  status: string;
  paymentGateway?: any;
  paymentId?: any;
  paymentStatus?: any;
  deliverStatus?: any;
  subTotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  buyerId?: any;
  buyerName: string;
  buyerProfileId: number;
  sellerId: string;
  sellerName: string;
  invoiceDiscount: number;
  invoiceDiscountId?: any;
  couponDiscount: number;
  couponDiscountId?: any;
  type: string;
  note: string;
  createdDate: string;
  lastModifiedDate: string;
  date?: any;
  shippingAddressId: number;
  shippingCode?: any;
  orderDetails: OrderDetail[];
  sellerInfoCache: SellerInfoCache;
  invoiceDiscountCache?: any;
  couponDiscountCache?: any;
  shippingAddress: ShippingAddress;
  audit: Audit;
  shippingCache?: any;
};

interface Audit {
  waitingDate: string;
  acceptedDate?: any;
  rejectedDate?: any;
  doneDate?: any;
  canceledDate?: any;
  requestedReturnDate?: any;
  returnedDate?: any;
  deliveredDate?: any;
  deletedDate: string;
  packagedDate: string;
  createdDate: string;
  shippingDate: string;
  lastModifiedDate: string;
}

interface ShippingAddress {
  id: number;
  address: string;
  isDefault: boolean;
  lat?: any;
  lng?: any;
  fullAddress: string;
  userId?: any;
  zipCode?: any;
  fullName: string;
  phone: string;
  province: Province;
  district: Province;
  wards: Province;
  state?: any;
  country: Country;
}

interface Country {
  id: number;
  code: string;
  name: string;
  phone: string;
  nativeName: string;
}

interface Province {
  id: number;
  name: string;
}

interface SellerInfoCache {
  profileId: number;
  phone: string;
  fullName: string;
  avatar: string;
  userId: string;
}

interface OrderDetail {
  id: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  productId?: any;
  productName: string;
  images?: any;
  tradingProductId: number;
  promotionId?: any;
  promotionCache?: any;
  tradingProductCache: TradingProductCache;
}

interface TradingProductCache {
  id: number;
  price: number;
  originalPrice?: any;
  description: string;
  isManageStock: boolean;
  stockQuantity: number;
  allowBackorder?: any;
  lowStockThreshold: number;
  note?: any;
  sku?: any;
  conversionSku: number;
  shipping: Shipping;
  prices: Price[];
  productId?: any;
  name: string;
  attributes: Attribute[];
  existedPromotion?: any;
  media?: any;
}

interface Attribute {
  id: number;
  name: string;
  value: string;
}

interface Price {
  id: number;
  fromValue: number;
  toValue: number;
  price: number;
}

interface Shipping {
  id: number;
  weight?: any;
  length?: any;
  width?: any;
  height?: any;
}
export interface CustomerInfoOrderDetail {
  addressInfo: InfoAddres;
  customerName: string;
  buyerProfileId: any;
}
export interface InfoAddres {
  id: number;
  address: string;
  isDefault: boolean;
  lat: null;
  lng: null;
  fullAddress: string;
  userId: string;
  zipCode: string;
  fullName: string;
  phone: string;
  province: District;
  district: District;
  wards: District;
  state: null;
  country: Country;
}

export interface District {
  id: number;
  name: string;
}
