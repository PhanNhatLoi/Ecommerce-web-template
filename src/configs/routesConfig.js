// Authentication path
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const FORGOT_PASSWORD_PATH = '/forgot-password';
export const PROFILE_PATH = '/profile';
export const PROFILE_CHANGE_PASS_PATH = '/profile/change-password';
export const PROFILE_INFO_PATH = '/profile/account-information';
export const PROFILE_INVOICE_INFO_PATH = '/profile/invoice-information';
export const PROFILE_EDIT_INFO_PATH = '/profile/edit-account-information';

// NOTIFICATIONS
export const NOTIFICATIONS_PATH = '/notifications';
export const NOTIFICATION_NEW_PATH = '/notifications/new';

// AUTO CLUBS
export const AUTO_CLUB_PATH = '/auto-clubs';
export const AUTO_CLUB_DASHBOARD_PATH = '/auto-clubs/dashboard';
export const AUTO_CLUB_MEMBERS_PATH = '/auto-clubs/members';
export const AUTO_CLUB_MEMBER_LIST_PATH = '/auto-clubs/members/list';
export const AUTO_CLUB_MEMBER_INVITE_PATH = '/auto-clubs/members/invite';
export const AUTO_CLUB_MEMBER_NEW_PATH = '/auto-clubs/members/new';
export const AUTO_CLUB_REQUEST_PATH = '/auto-clubs/requests';
export const AUTO_CLUB_REQUEST_LIST_PATH = '/auto-clubs/requests/list';
export const AUTO_CLUB_REQUEST_NEW_PATH = '/auto-clubs/requests/new';
export const AUTO_CLUB_MEMBER_HELP_LIST_PATH = '/auto-clubs/helps/list';
export const MEMBER_HELP_PATH = '/members/helps';
export const MEMBER_JOURNEY_LIST_PATH = '/members/journeys/list';
export const MEMBER_JOURNEY_NEW_PATH = '/members/journeys/new';
export const MEMBER_NOTIFICATION_PATH = '/members/notifications';
export const MEMBER_REPORT_PATH = '/members/reports';

// CAR SERVICES
export const CAR_SERVICES_PATH = '/car-services';
export const CAR_SERVICES_DASHBOARD_PATH = '/car-services/dashboard';
export const CAR_SERVICES_EMPLOYEE_PATH = '/car-services/employees';
export const CAR_SERVICES_EMPLOYEE_NEW_PATH = '/car-services/employees/new';
export const CAR_SERVICES_EMPLOYEE_EDIT_PATH = '/car-services/employees/:idMechanic/edit';
export const CAR_SERVICES_REQUEST_PATH = '/car-services/requests';
export const CAR_SERVICES_NEW_REQUEST_PATH = '/car-services/requests/new-requests';
export const CAR_SERVICES_QUOTATION_LIST_PATH = '/car-services/requests/quotations/list';
export const CAR_SERVICES_ORDER_LIST_PATH = '/car-services/orders/list';
export const CAR_ACCESSORIES_ORDER_PATH = '/car-services/orders/list';
export const CAR_SERVICES_REPAIR_LIST_PATH = '/car-services/requests/repair/list';
export const MECHANIC_QUOTATION_NEW_PATH = '/car-services/quotations/new';
export const CAR_SERVICES_PRICING_SYSTEM_PATH = '/car-services/pricing-system';
export const CAR_SERVICES_PRICING_SYSTEM_NEW_PATH = '/car-services/pricing-system/new';
export const CAR_SERVICES_VOUCHER_PATH = '/car-services/voucher';
export const MECHANIC_ORDER_NEW_PATH = '/car-services/orders/new';
export const SERVICE_PROMOTION_PATH = '/car-services/promotions';
export const SERVICE_PROMOTION_NEW_PATH = '/car-services/promotions/new';
export const SERVICE_PROMOTION_EDIT_PATH = '/car-services/promotions/:id/edit';
export const CAR_SERVICES_CUSTOMER_PATH = '/car-services/customers';
export const CAR_SERVICES_CUSTOMER_LIST_PATH = '/car-services/customers/list';
export const CAR_SERVICES_CUSTOMER_NEW_PATH = '/car-services/customers/new';
export const CAR_SERVICES_CUSTOMER_EDIT_PATH = '/car-services/customers/:id/edit';
export const CAR_SERVICES_REPORT_PATH = '/car-services/reports';

// CAR ACCESSORIES
export const CAR_ACCESSORIES_PATH = '/car-accessories';
export const CAR_ACCESSORIES_DASHBOARD_PATH = '/car-accessories/dashboard';
export const CAR_ACCESSORIES_MASTER_DATA_PATH = '/car-accessories/master-data';
export const CAR_ACCESSORIES_PRODUCT_LIST_PATH = '/car-accessories/products/list';
export const CAR_ACCESSORIES_PRODUCT_NEW_PATH = '/car-accessories/products/new';
export const CAR_ACCESSORIES_RETURN_PATH = '/car-accessories/return';
export const CAR_ACCESSORIES_RETURN_NEW_PATH = '/car-accessories/return/new';
export const CAR_ACCESSORIES_RETURN_EDIT_PATH = '/car-accessories/return/:id/edit';
export const CAR_ACCESSORIES_PROMOTION_PATH = '/car-accessories/promotions';
export const CAR_ACCESSORIES_DISCOUNT_NEW_PATH = '/car-accessories/promotions/discount/new';
export const CAR_ACCESSORIES_COUPON_NEW_PATH = '/car-accessories/promotions/coupon/new';
export const CAR_ACCESSORIES_DELIVERY_ODER_PATH = '/car-accessories/delivery-order';
export const CAR_ACCESSORIES_DELIVERY_ODER_NEW_PATH = '/car-accessories/delivery-order/new';
export const CAR_ACCESSORIES_CUSTOMER_PATH = '/car-accessories/master-data/customers';
export const CAR_ACCESSORIES_CUSTOMER_LIST_PATH = '/car-accessories/master-data/customers';
export const CAR_ACCESSORIES_CUSTOMER_NEW_PATH = '/car-accessories/master-data/customers/new';
export const CAR_ACCESSORIES_CUSTOMER_EDIT_PATH = '/car-accessories/master-data/customers/:code/:profileId/edit';
export const CAR_ACCESSORIES_PROVIDER_PATH = '/car-accessories/providers';
export const CAR_ACCESSORIES_SALES_ORDERS_PATH = '/car-accessories/sales-orders';
export const CAR_ACCESSORIES_CREATE_SALES_ORDERS_PATH = '/car-accessories/sales-orders/new';
export const CAR_ACCESSORIES_UPDATE_SALES_ORDERS_PATH = '/car-accessories/sales-orders/create';
export const CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH = '/car-accessories/sales-orders/view-sales-orders';
export const CAR_ACCESSORIES_REPORT_PATH = '/car-accessories/statistical-report';
export const CAR_ACCESSORIES_AR_INVOICE_PATH = '/car-accessories/ar-invoice';
export const CAR_ACCESSORIES_AR_INVOICE_NEW_PATH = '/car-accessories/ar-invoice/new';
export const CAR_ACCESSORIES_AR_INVOICE_EDIT_PATH = '/car-accessories/ar-invoice/:id/edit';
export const CAR_ACCESSORIES_ITEMS_LIST_PATH = '/car-accessories/master-data/items';
export const CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS = '/car-accessories/product-specification';
export const CAR_ACCESSORIES_PRODUCT_SPECIFICATION_FORM = '/car-accessories/product-specification/new';
export const CAR_ACCESSORIES_PRODUCT_SPECIFICATION_EDIT = '/car-accessories/product-specification/:id/edit';
export const CAR_ACCESSORIES_ITEMS_FORM_PATH = '/car-accessories/master-data/items/new';
export const CAR_ACCESSORIES_ITEMS_EDIT_PATH = '/car-accessories/master-data/items/:id/edit';
export const CAR_ACCESSORIES_SPECIFICATION_FORM_PATH = '/car-accessories/master-data/specification';
export const CAR_ACCESSORIES_SPECIFICATION_EDIT_PATH = '/car-accessories/master-data/specification/edit/:id';
export const CAR_ACCESSORIES_PRODUCT_TRADING = '/car-accessories/product-trading';
export const CAR_ACCESSORIES_CREATE_PRODUCT_TRADING = '/car-accessories/product-trading/new';
export const CAR_ACCESSORIES_UPDATE_PRODUCT_TRADING = '/car-accessories/product-trading/edit';
export const CAR_ACCESSORIES_CROSS_CHECK = '/car-accessories/cross_check';

// INSURANCE
export const INSURANCE_PATH = '/insurance';
export const INSURANCE_DASHBOARD_PATH = '/insurance/dashboard';
export const INSURANCE_COMPANY_PROFILE_PATH = '/insurance/company-profile';
export const INSURANCE_PACKAGE_LIST_PATH = '/insurance/package';
export const INSURANCE_PACKAGE_NEW_PATH = '/insurance/package/new';
export const INSURANCE_PACKAGE_VIEW_EDIT_PATH = '/insurance/package/:id/:action';
export const INSURANCE_PACKAGE_EDIT_PATH = '/insurance/package/:id/edit';
export const INSURANCE_ORDER_LIST_PATH = '/insurance/order';
export const INSURANCE_ORDER_NEW_PATH = '/insurance/order/new';
export const INSURANCE_ORDER_EDIT_PATH = '/insurance/order/:id/edit';
export const INSURANCE_PROFILE_LIST_PATH = '/insurance/submission';
export const INSURANCE_PROFILE_NEW_PATH = '/insurance/submission/:insuranceType/new';
export const INSURANCE_PROFILE_EDIT_PATH = '/insurance/submission/:id/view';
export const INSURANCE_CUSTOMER_LIST_PATH = '/insurance/customer';
export const INSURANCE_CUSTOMER_NEW_PATH = '/insurance/customer/new';
export const INSURANCE_CUSTOMER_EDIT_PATH = '/insurance/customer/:id/edit';
export const INSURANCE_PROMOTION_LIST_PATH = '/insurance/promotion';
export const INSURANCE_DISCOUNT_NEW_PATH = '/insurance/promotion/discount/new';
export const INSURANCE_COUPON_NEW_PATH = '/insurance/promotion/coupon/new';
export const INSURANCE_DISCOUNT_EDIT_PATH = '/insurance/promotion/discount/:id/edit';
export const INSURANCE_COUPON_EDIT_PATH = '/insurance/promotion/coupon/:id/edit';
export const INSURANCE_REPORT_PATH = '/insurance/report';

// USED CAR TRADING
export const USED_CAR_TRADING_PATH = '/used-car-trading';
export const USED_CAR_TRADING_DASHBOARD_PATH = '/used-car-trading/dashboard';
export const USED_CAR_TRADING_LIST_PATH = '/used-car-trading/car-trading';
export const USED_CAR_TRADING_NEW_PATH = '/used-car-trading/car-trading/new';
export const USED_CAR_TRADING_EDIT_PATH = '/used-car-trading/car-trading/:id/edit';
export const USED_CAR_TRADING_CUSTOMER_LIST_PATH = '/used-car-trading/customer';
export const USED_CAR_TRADING_CUSTOMER_NEW_PATH = '/used-car-trading/customer/new';
export const USED_CAR_TRADING_CUSTOMER_EDIT_PATH = '/used-car-trading/customer/:id/edit';
export const USED_CAR_TRADING_CAR_APPOINTMENT_LIST = '/used-car-trading/car-appointment';

// VENDORS
export const VENDORS_PATH = '/vendors';
export const VENDORS_SUPPLIERS_PATH = '/vendors/suppliers';

// SETTINGS
export const SETTINGS_PATH = '/settings';
export const SETTINGS_GENERAL_PATH = '/settings/general/new';
export const SETTINGS_USERS_PATH = '/settings/users';
export const SETTINGS_NEW_USERS_PATH = '/settings/users/create-users';
export const SETTINGS_ACTIONS_USERS_PATH = '/settings/users/:action/:id';
export const SETTINGS_ROLES_AND_PERMISSION_PATH = '/settings/roles-and-permission';
export const SETTINGS_NEW_ROLES_AND_PERMISSION_PATH = '/settings/roles-and-permission/new';
export const SETTINGS_EDIT_ROLES_AND_PERMISSION_PATH = '/settings/roles-and-permission/edit/:id';
export const SETTINGS_VIEW_ROLES_AND_PERMISSION_PATH = '/settings/roles-and-permission/view/:id';
export const SETTINGS_BANK_ACCOUNT_LIST_PATH = '/settings/bank-accounts/list';
export const SETTINGS_BANK_ACCOUNT_NEW_PATH = '/settings/bank-accounts/new';
export const SETTINGS_BANK_ACCOUNT_EDIT_PATH = '/settings/bank-accounts/:idAccount';
export const SETTINGS_SERVICES_PATH = '/settings/services';
export const SETTINGS_VEHICLES_PATH = '/settings/vehicles';

// TRANSACTION
export const TRANSACTION_PATH = '/transaction';
export const TRANSACTION_PAYMENT_PATH = '/transaction/payment';

//PAGE
export const DASHBOARD_PATH = '/overview';
export const PROBLEMS_PATH = '/incidents';
export const TECHNICIAN_PATH = '/technicians';
export const NEW_TECHNICIAN_PATH = '/technicians/new';
export const EDIT_TECHNICIAN_PATH = '/technicians/:id';
export const FIX_PROBLEM_PATH = '/fix-incidents';
export const NOTIFICATION_PATH = '/notifications';
export const NEW_NOTIFICATION_PATH = '/notifications/new';
export const EDIT_NOTIFICATION_PATH = '/notifications/:id';
export const REPORT_PATH = '/reports';
export const CONFIG_PATH = '/settings';

export const DEFAULT_PATH = DASHBOARD_PATH;
export const DEFAULT_PATH_USER = [
  DASHBOARD_PATH,
  FORGOT_PASSWORD_PATH,
  PROFILE_PATH,
  PROFILE_CHANGE_PASS_PATH,
  PROFILE_INFO_PATH,
  PROFILE_EDIT_INFO_PATH
];
