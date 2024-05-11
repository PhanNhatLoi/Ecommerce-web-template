import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// PROMOTION ACTIONS
// -----------------------------
export type PromotionBodyRequest = {
  id?: number;
  promotionType?: 'INVOICE_DISCOUNT' | 'PRODUCT_DISCOUNT' | 'CATEGORY_DISCOUNT' | 'COUPON_DISCOUNT';
  images?: any;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  quantityUsed?: number;
  content?: string;
  invoiceDiscounts?: InvoiceDiscountResponse[];
  categories?: CategorieDiscountResponse[];
  tradingProducts?: TradingDiscountRequest[];
};
export type CouponBodyRequest = {
  name?: string;
  images?: any;
  startDate?: Date;
  endDate?: Date;
  quantityUsed?: number;
  content?: string;
  code?: string;
  id?: number;
  promotionType?: 'INVOICE_DISCOUNT' | 'PRODUCT_DISCOUNT' | 'CATEGORY_DISCOUNT' | 'COUPON_DISCOUNT';
  coupons?: CouponResponse[];
};

export type PromotionResponse = {
  id: number;
  name: string;
  images: any;
  startDate: Date;
  endDate: Date;
  promotionType: 'INVOICE_DISCOUNT' | 'PRODUCT_DISCOUNT' | 'CATEGORY_DISCOUNT' | 'COUPON_DISCOUNT';
  status: 'ACTIVATED' | 'WAITING_FOR_APPROVAL' | 'APPROVED' | 'REJECTED' | 'BLOCKED' | 'EXPIRED' | 'CANCELED';
  quantityUsed?: number;
  createdDate: Date;
  content?: string;
  code?: string;
  coupons?: CouponResponse[];
  invoiceDiscounts?: InvoiceDiscountResponse[];
  categories?: CategorieDiscountResponse[];
  tradingProducts?: TradingDiscountResponse[];
};

export type TradingDiscountResponse = {
  id?: number;
  minQuantity?: number;
  quantityLimit?: number;
  discount?: number;
  discountType: string; //'CASH' | 'TRADE';
  tradingProduct: TradingProductResponse;
};

export type TradingDiscountRequest = {
  minQuantity?: number;
  productName?: string;
  unit?: string;
  quantityLimit?: number;
  discount?: number;
  discountType: string; //'CASH' | 'TRADE';
  tradingProductId?: number;
  tradingProduct?: TradingProductResponse;
  itemCode?: string;
};

export type TradingProductResponse = {
  id: number;
  productId: number;
  supplierId: number;
  attributes: {
    id: number;
    name: string;
    value: string;
  }[];
  itemCode: string;
  status: string;
  approveStatus: string;
  unitId: number;
  unitName?: string;
  vehicleBrandId: number;
  price: number;
  name: string;
  description: string;
  quantityMin: number;
  conversionSku: number;
  prices: [];
  isManageStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  shipping: {
    id: number;
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  media: {
    url: string;
    type: string;
  }[];
};

export type InvoiceDiscountResponse = {
  id: number;
  fromValue: number;
  toValue: number;
  quantityLimit?: number;
  discount: number;
  quantity?: string[];
  discountType: 'CASH' | 'TRADE';
};

export type CouponResponse = {
  id: number;
  couponCode: string;
  quantityLimit?: number;
  discount: Number;
  type: 'CASH' | 'TRADE';
  maxDiscount?: number;
  quantityLimitForUser?: number;
};

export type CategorieDiscountResponse = {
  id?: number;
  categoryId: number;
  categoryName: string;
  minQuantity: number;
  quantityLimit?: number;
  discount: number;
  discountType: string; //'CASH' | 'TRADE'
};
export const getPromotions = (params: { obj?: {}; startWith?: string }) =>
  apiAction('get')(types.GET_PROMOTIONS, `/services/product/api/v1/vendor/promotions${parseObjToQuery(params)}`, {}, true);

export const getPromotionDetail = (id: number) =>
  apiAction('get')(types.GET_PROMOTION_DETAIL, `/services/product/api/v1/vendor/promotion/${id}`, {}, true);

export const updatePromotion = (body: PromotionBodyRequest, id: number) =>
  apiAction('put')(types.UPDATE_PROMOTION, `/services/product/api/v1/vendor/promotion/${id}`, body, true);

export const deletePromotion = (id: number) =>
  apiAction('delete')(types.DELETE_PROMOTION, `/services/product/api/v1/vendor/promotion/${id}`, {}, true);

// INVOICE_DISCOUNT
export const createInvoiceDiscount = (body: PromotionBodyRequest) =>
  apiAction('post')(types.CREATE_INVOICE_DISCOUNT, `/services/product/api/v1/vendor/promotion/invoice-discount`, body, true);
// INVOICE_DISCOUNT

// RADING_PRODUCT
export const createProductTradingDiscount = (body: PromotionBodyRequest) =>
  apiAction('post')(types.CREATE_TRADING_PRODUCT_PROMOTION, `/services/product/api/v1/vendor/promotion/product-discount`, body, true);
// RADING_PRODUCT

// CATEGORIES_PROMOTION
export const createCategoryDiscount = (body: PromotionBodyRequest) =>
  apiAction('post')(types.CREATE_CATEGORIES_PROMOTION, `/services/product/api/v1/vendor/promotion/category-discount`, body, true);
// CATEGORIES_PROMOTION

// CREATE_COUPON
export const createCoupon = (body: CouponBodyRequest) =>
  apiAction('post')(types.CREATE_COUPON, `/services/product/api/v1/vendor/promotion/coupon`, body, true);
export const updateCoupon = (body: CouponBodyRequest, id: number) =>
  apiAction('put')(types.UPDATE_COUPON, `/services/product/api/v1/vendor/promotion/coupon/${id}`, body, true);
// CREATE_COUPON
