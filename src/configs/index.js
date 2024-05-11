import { CheckOutlined, CreditCardFilled, CreditCardOutlined, FileDoneOutlined, ToolOutlined, ToTopOutlined } from '@ant-design/icons';
import React from 'react';
import AMessage from '~/views/presentation/ui/message/AMessage';

AMessage.config({
  maxCount: 2,
  duration: 2
});

export const SUCCESS_SUFFIX = '_SUCCESS';
export const FAILED_SUFFIX = '_FAILED';
export const mockUrl = 'https://a19fb322-26c1-40d7-9a79-c771a24cc2f0.mock.pstmn.io/api/v1';
export const LOGO_AUTH_URL = '/media/logos/eCarAid-logo.png';
export const SIDEBAR_LOGO_AUTH_URL = '/media/svg/logos/Logo-eCAM-5.svg';
export const FULL_LOGO_URL = '/media/logos/eCarAid-logo-full.png';
export const FULL_LOGO_URL_2 = '/media/logos/Logo-eCAM-2.svg';

/**
 * staging
 */
export const API_URL = process.env.DOMAIN;
export const TIME_MESSAGE_POPUP = 3;
/**
 * production
 */
// export const API_URL = process.env.REACT_APP_API_URL || 'http://3.1.89.161:8180';
export const APP_VERSION = '1.7.0';

export const BASE_URL_IMG = API_URL + '/services/media/api/v1/vendor/';
export const BASE_URL_IMG_WITHOUT_TOKEN = API_URL + '/services/media/api/v1/view/';
export const CKEDITOR_URL_IMG = API_URL + '/services/media/api/v1/upload/image';
export const FIREBASE_VAPIKEY = 'BA-F8jgSrdzFP8ZGLnp9jwgQHYEr9MHK0OZ88xMKPB71ZoA2hEkbhkcOuczXo-mvTUfqKwl0uvH5PF5P4mW4Vbg';
export const GOOGLE_MAP_API_KEY = 'AIzaSyDiy6ToTbDa5kqOUK0Es2OFhnfLQvPrPJQ'; // index.html file need check this key
export const IMAGE_UPLOAD_URL = API_URL + '/services/media/api/v1/vendor/upload';
export const IMAGE_UPLOAD_WITHOUT_TOKEN_URL = API_URL + '/services/media/api/v1/upload/image';
export const JWT = 'jwt';
export const LANG = 'lang';
export const HELP_ALLOW_LOCATION_LINK = 'https://support.google.com/chrome/answer/142065';

export const utcTimeString = 'DD/MM/YYYY';
export const apiTimeString = 'YYYY-MM-DD';
export const javaTimeString = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export const DEFAULT_AXIS_10 = 10;
export const DEFAULT_AXIS_100 = 100;
export const DEFAULT_AXIS_100000 = 100000;

export const sizes = {
  xl: '1200px',
  lg: '992px',
  md: '768px',
  sm: '576px'
};

export const imgUploadConfig = {
  minWidth: 750,
  minHeight: 500,
  fileSize: 10,
  type: /\.(jpg|jpeg|bmp|png|pdf|doc|xls|xlsx)$/i
};

export const API_CODE = {
  SUCCESS: 'SUCCESS',
  SERVER_MAINTENANCE: 'SERVER_MAINTENANCE',
  AUTHENTICATION_INVALID: 'AUTHENTICATION_INVALID',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN'
};

export const VEHICLE_TYPES = {
  CAR: 1,
  TRUCK: 2
};

export const VEHICLE_BRANDS = {
  KIA: 1,
  TOYOTA: 2
};

export const MODEL_TYPES = {
  HYUNDAI: 1,
  TOYOTA: 2
};

export const GEARBOX_TYPES = {
  AUTOMATIC: 1
};

export const BODY_TYPE = {
  SEDAN: 1
};

export const FUEL_TYPE = {
  GAS: 1
};

export const LOAD_CAPACITY = {
  ONE_TON: 1,
  TWO_TONS: 2
};

export const TIME_UNITS = {
  DATE: 'Date',
  MONTH: 'Month',
  QUARTER: 'Quarter',
  YEAR: 'Year'
};

export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female'
};

export const EnumVendorMessageType = ['GENERAL', 'EVENT', 'ANNOUNCEMENT', 'POLICY'];

export const REQUEST_FIXED_BY_MECHANIC = [
  { text: 'PICKED_UP', icon: <ToTopOutlined style={{ fontSize: '32px' }} /> },
  { text: 'FIXING', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CONFIRM_DONE', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'WAITING_PAYMENT', icon: <CreditCardOutlined style={{ fontSize: '32px' }} /> },
  { text: 'PAYMENT_CONFIRMED', icon: <CreditCardFilled style={{ fontSize: '32px' }} /> },
  { text: 'CLOSED', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
];

export const REQUEST_HELPED_BY_HELPER = [
  //
  { text: 'PICKED_UP', icon: <ToTopOutlined style={{ fontSize: '32px' }} /> },
  { text: 'FIXING', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CONFIRM_DONE', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CLOSED', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
];

export const REPAIR_STEPS = [
  //
  { text: 'New', icon: <ToTopOutlined style={{ fontSize: '32px' }} /> },
  { text: 'QUOTATION', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'REPAIRING', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CONFIRM_DONE', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'WAITING_PAYMENT', icon: <CheckOutlined style={{ fontSize: '32px' }} /> },
  { text: 'PAYMENT_CONFIRM', icon: <CheckOutlined style={{ fontSize: '32px' }} /> },
  { text: 'DONE', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
];

export const HELP_STEPS = [
  //
  { text: 'PICKED_UP', icon: <ToTopOutlined style={{ fontSize: '32px' }} /> },
  { text: 'FIXING', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CONFIRM_DONE', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CLOSED', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
];

export const NEARBY_REQUEST_STEPS = [
  //
  { text: 'NEW', icon: <ToTopOutlined style={{ fontSize: '32px' }} /> },
  { text: 'QUOTATION', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'REPAIRING', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'CONFIRM_DONE', icon: <CheckOutlined style={{ fontSize: '32px' }} /> },
  { text: 'PAYMENT', icon: <CheckOutlined style={{ fontSize: '32px' }} /> },
  { text: 'PAYMENT_CONFIRM', icon: <CheckOutlined style={{ fontSize: '32px' }} /> },
  { text: 'DONE', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
];

export const SALES_ORDER_PROCESS = [
  //
  { text: 'CREATE_SALE_ORDER', icon: <ToTopOutlined style={{ fontSize: '32px' }} /> },
  { text: 'ACCEPTED_SALE_ORDER', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'REJECTED', icon: <ToolOutlined style={{ fontSize: '32px' }} /> },
  { text: 'SALE_ORDER_PACKING', icon: <FileDoneOutlined style={{ fontSize: '32px' }} /> },
  { text: 'SHIPPING', icon: <CheckOutlined style={{ fontSize: '32px' }} /> },
  // { text: 'DELIVERED', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
  { text: 'DONE', icon: <CheckOutlined style={{ fontSize: '32px' }} /> }
];

export const BUSINESS_TYPE = {
  AutoRepairShop: 9,
  AutoClub: 3,
  TransportationCompany: 10,
  CarWash: 2,
  CarParking: 8,
  Supplier: 24,
  None: 'none'
};

export const CUSTOMER_BUSINESS_TYPE = {
  AUTO_CLUB: 'AUTO_CLUB',
  INSURANCE_COMPANY: 'INSURANCE_COMPANY',
  AUTO_REPAIR_SHOP: 'AUTO_REPAIR_SHOP', // CAR SERVICE
  SUPPLIER: 'SUPPLIER', // E-COMMERCE
  USED_CAR_DEALERSHIP: 'USED_CAR_DEALERSHIP' // mua bán xe cũ
};

export const ECA_USER = {
  ECA: 'ECA',
  ECA_S: 'ECAS'
};

export const PROMOTION_SERVICE_TYPE = {
  OFFER_DISCOUNT: 'OFFER_DISCOUNT',
  COUPON_DISCOUNT: 'COUPON_DISCOUNT'
};

export const ORDER_TYPE = {
  PRODUCT: 'PRODUCT', // E-COMMERCE
  INSURANCE: 'INSURANCE'
};

export const VEHICLE_BUSINESS_TYPE = {
  COMMERCIAL: 'COMMERCIAL',
  NON_COMMERCIAL: 'NON_COMMERCIAL'
};

export const EVENT_TYPE = {
  NEW_ECOMMERCE_ORDER: 'NEW_ECOMMERCE_ORDER',
  NEW_INSURANCE_ORDER: 'NEW_INSURANCE_ORDER'
};

export const GUARANTEE_TYPE = {
  NONE_GUARANTEE: 'NONE_GUARANTEE',
  GUARANTEE_TIME: 'GUARANTEE_TIME',
  GUARANTEE_KM: 'GUARANTEE_KM'
};

export const CONDITION = {
  NO: 'NO',
  YES: 'YES'
};

export const TYPOGRAPHY_TYPE = {
  TEXT: 'TEXT',
  TITLE: 'TITLE',
  PARAGRAPH: 'PARAGRAPH',
  LINK: 'LINK'
};

export const LANGUAGE_TEXT = {
  VI: 'Tiếng Việt',
  EN: 'English'
};
