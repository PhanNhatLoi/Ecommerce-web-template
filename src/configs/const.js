export const tabsReport = {
  INCIDENT: 'incident',
  MEMBER: 'member',
  TECHNICIAN: 'technician',
  REPAIR_INCIDENT: 'repairIncident',
  SALES: 'sales',
  NOTIFICATION: 'notification'
};

export const hosts = {
  TECHNICIAN: 'TECHNICIAN',
  MEMBER: 'MEMBER',
  BOTH: 'BOTH'
};

export const data = [
  ['Code1', 101, 1000000, 10000, 10000],
  ['Code2', 102, 200000, 20000, 10000],
  ['Code3', 103, 300000, 30000, 10000],
  ['Code4', 104, 450000, 45000, 10000],
  ['Code5', 105, 1000000, 100000, 10000]
];

export const importHeaders = ['orderCode', 'shippingCode', 'total', 'discount', 'shippingFee'];
export const exportHeaders = ['Mã đơn hàng', 'Mã vận đơn', 'Tổng cộng', 'Giảm giá', 'Phí vận chuyển'];
export const downloadFileName = 'CrossCheckExample.xlsx';

export const requestDistributionTabs = {
  CATEGORY: 'category',
  CITY: 'city'
};

export const userDistributionTabs = {
  CITY: 'city',
  GROUP: 'group'
};

export const topMemberTabs = {
  REQUEST: 'request',
  HELPS: 'helps'
};

export const topTechnicianTabs = {
  FIXES: 'fixes',
  REVENUE: 'revenue'
};

export const GENERAL_TYPE = {
  MEMBER_SIZE: 'MEMBER_SIZE',
  MECHANIC_SIZE: 'MECHANIC_SIZE',
  HOST_TYPE: 'HOST_TYPE',
  BUSINESS_TYPE: 'BUSINESS_TYPE',
  AAA_INSURANCE_EFFECT_YEAR: 'AAA_INSURANCE_EFFECT_YEAR', // Số Năm Bảo Hiểm
  AAA_INSURANCE_RESPONSIBILITY_PERSON_PRICE: 'AAA_INSURANCE_RESPONSIBILITY_PERSON_PRICE', // Mức Trách Nhiệm Về người
  AAA_INSURANCE_RESPONSIBILITY_PROPERTIES_PRICE: 'AAA_INSURANCE_RESPONSIBILITY_PROPERTIES_PRICE', // Mức Trách Nhiệm Về tài sản
  AAA_INSURANCE_VOLUNTARY_PREMIUM_PRICE: 'AAA_INSURANCE_VOLUNTARY_PREMIUM_PRICE', // Mức Trách Nhiệm
  AAA_INSURANCE_VOLUNTARY_PREMIUM_RATE: 'AAA_INSURANCE_VOLUNTARY_PREMIUM_RATE', // % Phí Bảo Hiểm Tự Nguyện
  OTHER: 'OTHER'
};

export const PAYMENT_GATEWAY = {
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
  DEBT: 'DEBT'
};

export const BUSINESS_TYPES = {
  AUTO_REPAIR_SHOP: 9, // Cửa hàng / hãng sửa xe/DỊCH VỤ
  AUTO_CLUB: 3, // Câu lạc bộ / cộng đồng xe hơi
  SUPPLIER: 24,
  TRANSPORTATION_COMPANY: 10, // Công ty vận tải
  CAR_WASH: 2, // Tiệm rửa xe hơi
  CAR_PARKING: 8, // Bãi đậu xe hơi
  INSURANCE_COMPANY: 23, // Công ty bảo hiểm
  USED_CAR_DEALEARSHIP: 123 // Đại lý bán xe
};

export const HOST_TYPES = {
  HOST_MECHANIC: 6, // Thợ sửa xe
  HOST_MEMBER: 5 // Thành viên
};

export const USER_ROLES = {
  CONSUMER: 'ROLE_CONSUMER',
  TECHNICIAN: 'ROLE_TECHNICIAN'
};

export const SOCIAL_TYPES = {
  FACEBOOK: 'FACEBOOK',
  WEBSITE: 'WEBSITE',
  TWITTER: 'TWITTER',
  ZALO: 'ZALO',
  LINKEDIN: 'LINKEDIN'
};

export const TABS_REPORT = {
  REVENUE: 'REVENUE',
  ORDER: 'ORDER',
  PRODUCT: 'PRODUCT',
  SHIPPING: 'SHIPPING',
  CUSTOMER: 'CUSTOMER',
  SERVICE: 'SERVICE',
  USER: 'USER',
  GIFT_CARD: 'GIFT_CARD',
  PROMOTION: 'PROMOTION',
  PACKAGE: 'PACKAGE'
};

export const MAX_IMAGE_NUMBER = 5;
