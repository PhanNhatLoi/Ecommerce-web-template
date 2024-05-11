import React, { lazy } from 'react';
import * as ROUTES from '~/configs/routesConfig';
import Dashboard from '~/views/container/dashboard';
import RoleAndPermission from '~/views/container/Settings/RolesAndPermission';
import CreateRoleAndPermission from '~/views/container/Settings/RolesAndPermission/pages/CreateRoleAndPermission';
import UserManagement from '~/views/container/Settings/UserManagement';
import CreateUpdateUser from '~/views/container/Settings/UserManagement/pages/CreateUpdateUser';

// Underdevelopment page
const UnderDevelopment = lazy(() => import('~/views/container/commons/UnderDevelopment'));

// Profile
const Profile = lazy(() => import('~/views/container/profile'));
// const ChangePassword = lazy(() => import('~/views/container/profile/ChangePassword'));

// Notifications
const NotificationManagement = lazy(() => import('~/views/container/NotificationManagement'));
const NotificationForm = lazy(() => import('~/views/container/NotificationManagement/Form'));

// Auto Clubs
const MemberManagement = lazy(() => import('~/views/container/AutoClubs/MemberManagement'));
const NewRequest = lazy(() => import('~/views/container/AutoClubs/RequestManagement/AddPage'));
const MemberDashboard = lazy(() => import('~/views/container/AutoClubs/dashboard'));
const InvitePage = lazy(() => import('~/views/container/AutoClubs/MemberManagement/InvitePage'));
const AddPage = lazy(() => import('~/views/container/AutoClubs/MemberManagement/AddPage'));
const HelpManagement = lazy(() => import('~/views/container/AutoClubs/HelpManagement'));
const MemberRequests = lazy(() => import('~/views/container/AutoClubs/RequestManagement'));

// Car Services
const PricingSystem = lazy(() => import('~/views/container/CarServices/PricingSystem'));
const PricingSystemForm = lazy(() => import('~/views/container/CarServices/PricingSystem/Form'));
const PricingSystemVoucher = lazy(() => import('~/views/container/CarServices/ProductServiceVoucher'));
const MechanicManagement = lazy(() => import('~/views/container/CarServices/MechanicManagement'));
const MechanicForm = lazy(() => import('~/views/container/CarServices/MechanicManagement/Form'));
const MechanicRequests = lazy(() => import('~/views/container/CarServices/RequestManagement'));
const OrderManagement = lazy(() => import('~/views/container/CarServices/OrderManagement'));
const OrderAddPage = lazy(() => import('~/views/container/CarServices/OrderManagement/AddPage'));
const QuotationManagement = lazy(() => import('~/views/container/CarServices/QuotationManagement'));
const QuotationAddPage = lazy(() => import('~/views/container/CarServices/QuotationManagement/AddPage'));
const CarServicePromotion = lazy(() => import('~/views/container/CarServices/Promotions'));
const CarServicePromotionForm = lazy(() => import('~/views/container/CarServices/Promotions/Forms/InfoForm'));
const CustomerManagement = lazy(() => import('~/views/container/CarServices/CustomerManagement'));
const CustomerForm = lazy(() => import('~/views/container/CarServices/CustomerManagement/Form'));
const RepairManagement = lazy(() => import('~/views/container/CarServices/RepairManagement'));
const CarServiceDashboard = lazy(() => import('~/views/container/CarServices/dashboard'));
const CarServiceReport = lazy(() => import('~/views/container/CarServices/Report'));

// Vendors
const SupplierManagement = lazy(() => import('~/views/container/Vendors/SupplierManagement'));

// Ecommerce
const EcommerceDashboard = lazy(() => import('~/views/container/Ecommerce/Dashboard'));
const ProductTrading = lazy(() => import('~/views/container/CarAccessories/ProductTrading'));
const CreateProductTrading = lazy(() => import('~/views/container/CarAccessories/ProductTrading/pages/CreateProduct'));
const EcommerceReport = lazy(() => import('~/views/container/Ecommerce/Report'));
const SalesOrder = lazy(() => import('~/views/container/Ecommerce/OrderManagement'));
const CreateUpdateOrder = lazy(() => import('~/views/container/Ecommerce/OrderManagement/pages/CreateUpdateOrder'));
// const ProductManagement = lazy(() => import('~/views/container/Ecommerce/ProductManagement'));
// const ProductAddPage = lazy(() => import('~/views/container/Ecommerce/ProductManagement/AddPage'));
const DeliveryOderManagement = lazy(() => import('~/views/container/Ecommerce/DeliveryOderManagement'));
const DeliveryOderAddNew = lazy(() => import('~/views/container/Ecommerce/DeliveryOderManagement/Forms/InfoForm'));
const ReturnManagement = lazy(() => import('~/views/container/Ecommerce/ReturnManagement'));
const ReturnManagementForm = lazy(() => import('~/views/container/Ecommerce/ReturnManagement/Forms/InfoForm'));
const PromotionManagement = lazy(() => import('~/views/container/Ecommerce/PromotionManagement'));
const PromotionAddNew = lazy(() => import('~/views/container/Ecommerce/PromotionManagement/Forms/DiscountInfoForm'));
const CouponAddNew = lazy(() => import('~/views/container/Ecommerce/PromotionManagement/Forms/CouponInfoForm'));
const ProviderManagement = lazy(() => import('~/views/container/Ecommerce/ProviderManagement'));
const ItemManagement = lazy(() => import('~/views/container/Ecommerce/ItemManagement'));
const ItemsForm = lazy(() => import('~/views/container/Ecommerce/ItemManagement/Forms/InfoForm'));
const SpecificationForm = lazy(() => import('~/views/container/Ecommerce/ItemManagement/specificationForm'));
const SpecificationEdit = lazy(() => import('~/views/container/Ecommerce/ItemManagement/specificationForm'));
const ARInvoiceManagement = lazy(() => import('~/views/container/Ecommerce/ARInvoice'));
const ARInvoiceForm = lazy(() => import('~/views/container/Ecommerce/ARInvoice/components/ARInvoice'));
const ProductSpecification = lazy(() => import('~/views/container/Ecommerce/Settings/components/ProductSpecificationTable'));
const ProductSpecificationForm = lazy(() => import('~/views/container/Ecommerce/Settings/Forms/ProductSpecificationForm'));
const CustomerManagementCarAccessories = lazy(() => import('~/views/container/Ecommerce/CustomerManagement'));
const CustomerFormCarAccessories = lazy(() => import('~/views/container/Ecommerce/CustomerManagement/components/CustomerForm'));
const CrossCheckList = lazy(() => import('~/views/container/Ecommerce/CrossCheckManagement/components/CrossCheckTable'));

// Used car trading
const UsedCarTradingDashboard = lazy(() => import('~/views/container/UsedCarTrading/Dashboard'));
const CarTradingManagement = lazy(() => import('~/views/container/UsedCarTrading/CarTradingManagement'));
const CarTradingForm = lazy(() => import('~/views/container/UsedCarTrading/CarTradingManagement/Forms/InfoForm'));
const UsedCarTradingCustomerManagement = lazy(() => import('~/views/container/UsedCarTrading/CustomerManagement'));
const UsedCarTradingCustomerForm = lazy(() => import('~/views/container/UsedCarTrading/CustomerManagement/Forms/InfoForm'));
const UsedCarTradingCarAppointment = lazy(() => import('~/views/container/UsedCarTrading/CarAppointment/index'));

// Insurance
const InsuranceDashboard = lazy(() => import('~/views/container/Insurance/Dashboard'));
const CompanyProfile = lazy(() => import('~/views/container/Insurance/CompanyProfile'));
const PackageManagement = lazy(() => import('~/views/container/Insurance/PackageManagement'));
const PackageViewEditForm = lazy(() => import('~/views/container/Insurance/PackageManagement/Forms/ViewEditForm'));
const PackageEditForm = lazy(() => import('~/views/container/Insurance/PackageManagement/Forms/InfoForm'));
const InsuranceOrderManagement = lazy(() => import('~/views/container/Insurance/OrderManagement'));
const InsuranceOrderForm = lazy(() => import('~/views/container/Insurance/OrderManagement/Forms/InfoForm'));
const InsuranceProfile = lazy(() => import('~/views/container/Insurance/InsuranceProfile'));
const InsuranceProfileForm = lazy(() => import('~/views/container/Insurance/InsuranceProfile/Forms/InfoForm'));
const InsuranceCustomer = lazy(() => import('~/views/container/Insurance/CustomerManagement'));
const InsuranceCustomerForm = lazy(() => import('~/views/container/Insurance/CustomerManagement/Forms/InfoForm'));
const InsurancePromotion = lazy(() => import('~/views/container/Insurance/PromotionManagement'));
const InsurancePromotionDiscountForm = lazy(() => import('~/views/container/Insurance/PromotionManagement/Forms/DiscountInfoForm'));
const InsurancePromotionCouponForm = lazy(() => import('~/views/container/Insurance/PromotionManagement/Forms/CouponInfoForm'));
const InsuranceReport = lazy(() => import('~/views/container/Insurance/Report'));

// Transaction
const PaymentManagement = lazy(() => import('~/views/container/Transaction/PaymentManagement'));

// Settings
const SettingsGeneral = lazy(() => import('~/views/container/Settings/General'));
const SettingsServices = lazy(() => import('~/views/container/Settings/Services'));
const SettingsVehicles = lazy(() => import('~/views/container/Settings/Vehicles'));
const BankingConfiguration = lazy(() => import('~/views/container/Settings/BankingConfiguration'));

const routes = [
  {
    path: ROUTES.DASHBOARD_PATH,
    component: () => <Dashboard />,
    exact: true
  },
  // PROFILE
  {
    path: ROUTES.PROFILE_PATH,
    component: () => <Profile />,
    exact: true
  },
  {
    path: ROUTES.PROFILE_INFO_PATH,
    component: () => <Profile />,
    exact: true
  },
  {
    path: ROUTES.PROFILE_CHANGE_PASS_PATH,
    component: () => <Profile />,
    exact: true
  },
  {
    path: ROUTES.PROFILE_EDIT_INFO_PATH,
    component: () => <Profile />,
    exact: true
  },
  {
    path: ROUTES.PROFILE_INVOICE_INFO_PATH,
    component: () => <Profile />,
    exact: true
  },
  //------------------------------------------
  // NOTIFICATION
  //------------------------------------------
  {
    path: ROUTES.NOTIFICATION_PATH,
    component: () => <NotificationManagement />,
    exact: true
  },
  {
    path: ROUTES.NOTIFICATION_NEW_PATH,
    component: () => <NotificationForm />,
    exact: true
  },
  //------------------------------------------
  // NOTIFICATION
  //------------------------------------------
  //------------------------------------------
  // AUTO CLUBS
  //------------------------------------------
  {
    path: ROUTES.AUTO_CLUB_DASHBOARD_PATH,
    component: () => <MemberDashboard />,
    exact: true
  },
  {
    path: ROUTES.AUTO_CLUB_MEMBER_LIST_PATH,
    component: () => <MemberManagement />,
    exact: true
  },
  {
    path: ROUTES.AUTO_CLUB_MEMBER_INVITE_PATH,
    component: () => <InvitePage />,
    exact: true
  },
  {
    path: ROUTES.AUTO_CLUB_MEMBER_NEW_PATH,
    component: () => <AddPage />,
    exact: true
  },
  // MEMBERS > REQUESTS
  {
    path: ROUTES.AUTO_CLUB_REQUEST_LIST_PATH,
    component: () => <MemberRequests />,
    exact: true
  },
  {
    path: ROUTES.AUTO_CLUB_REQUEST_NEW_PATH,
    component: () => <NewRequest />,
    exact: true
  },
  {
    path: ROUTES.AUTO_CLUB_MEMBER_HELP_LIST_PATH,
    component: () => <HelpManagement />,
    exact: true
  },
  {
    path: ROUTES.MEMBER_JOURNEY_LIST_PATH,
    component: () => <UnderDevelopment />,
    exact: true
  },
  {
    path: ROUTES.MEMBER_JOURNEY_NEW_PATH,
    component: () => <UnderDevelopment />,
    exact: true
  },
  {
    path: ROUTES.MEMBER_REPORT_PATH,
    component: () => <UnderDevelopment />,
    exact: true
  },
  //------------------------------------------
  // AUTO CLUBS
  //------------------------------------------
  //------------------------------------------
  // CAR SERVICES
  //------------------------------------------
  {
    path: ROUTES.CAR_SERVICES_DASHBOARD_PATH,
    component: () => <CarServiceDashboard />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_ORDER_LIST_PATH,
    component: () => <OrderManagement />,
    exact: true
  },
  {
    path: ROUTES.MECHANIC_ORDER_NEW_PATH,
    component: () => <OrderAddPage />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_QUOTATION_LIST_PATH,
    component: () => <QuotationManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_REPAIR_LIST_PATH,
    component: () => <RepairManagement />,
    exact: true
  },
  {
    path: ROUTES.MECHANIC_QUOTATION_NEW_PATH,
    component: () => <QuotationAddPage />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_PRICING_SYSTEM_PATH,
    component: () => <PricingSystem />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_PRICING_SYSTEM_NEW_PATH,
    component: () => <PricingSystemForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_VOUCHER_PATH,
    component: () => <PricingSystemVoucher />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_EMPLOYEE_PATH,
    component: () => <MechanicManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_EMPLOYEE_NEW_PATH,
    component: () => <MechanicForm />,
    exact: true
  },
  {
    path: ROUTES.SERVICE_PROMOTION_PATH,
    component: () => <CarServicePromotion />,
    exact: true
  },
  {
    path: ROUTES.SERVICE_PROMOTION_NEW_PATH,
    component: () => <CarServicePromotionForm />,
    exact: true
  },
  {
    path: ROUTES.SERVICE_PROMOTION_EDIT_PATH,
    component: () => <CarServicePromotionForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_CUSTOMER_LIST_PATH,
    component: () => <CustomerManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_CUSTOMER_NEW_PATH,
    component: () => <CustomerForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_NEW_REQUEST_PATH,
    component: () => <MechanicRequests />,
    exact: true
  },
  {
    path: ROUTES.CAR_SERVICES_REPORT_PATH,
    component: () => <CarServiceReport />,
    exact: true
  },
  //------------------------------------------
  // CAR SERVICES
  //------------------------------------------
  //------------------------------------------
  // CAR ACCESSORIES
  //------------------------------------------
  {
    path: ROUTES.CAR_ACCESSORIES_DASHBOARD_PATH,
    component: () => <EcommerceDashboard />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PRODUCT_TRADING,
    component: () => <ProductTrading />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_CREATE_PRODUCT_TRADING,
    component: () => <CreateProductTrading />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_UPDATE_PRODUCT_TRADING,
    component: () => <CreateProductTrading />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_CUSTOMER_LIST_PATH,
    component: () => <CustomerManagementCarAccessories />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_CUSTOMER_NEW_PATH,
    component: () => <CustomerFormCarAccessories />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_CUSTOMER_EDIT_PATH,
    component: () => <CustomerFormCarAccessories />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_SALES_ORDERS_PATH,
    component: () => <SalesOrder />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_CREATE_SALES_ORDERS_PATH,
    component: () => <CreateUpdateOrder />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_UPDATE_SALES_ORDERS_PATH,
    component: () => <CreateUpdateOrder />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH,
    component: () => <CreateUpdateOrder />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PRODUCT_LIST_PATH,
    component: () => <UnderDevelopment />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PRODUCT_NEW_PATH,
    component: () => <ItemsForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_DELIVERY_ODER_PATH,
    component: () => <DeliveryOderManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_DELIVERY_ODER_NEW_PATH,
    component: () => <DeliveryOderAddNew />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_RETURN_PATH,
    component: () => <ReturnManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_RETURN_NEW_PATH,
    component: () => <ReturnManagementForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_RETURN_EDIT_PATH,
    component: () => <ReturnManagementForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PROMOTION_PATH,
    component: () => <PromotionManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_DISCOUNT_NEW_PATH,
    component: () => <PromotionAddNew />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_COUPON_NEW_PATH,
    component: () => <CouponAddNew />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PROVIDER_PATH,
    component: () => <ProviderManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_REPORT_PATH,
    component: () => <EcommerceReport />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_CROSS_CHECK,
    component: () => <CrossCheckList />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_AR_INVOICE_PATH,
    component: () => <ARInvoiceManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_AR_INVOICE_NEW_PATH,
    component: () => <ARInvoiceForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_AR_INVOICE_EDIT_PATH,
    component: () => <ARInvoiceForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_ITEMS_LIST_PATH,
    component: () => <ItemManagement />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_ITEMS_FORM_PATH,
    component: () => <ItemsForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_ITEMS_EDIT_PATH,
    component: () => <ItemsForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_SPECIFICATION_FORM_PATH,
    component: () => <SpecificationForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_SPECIFICATION_EDIT_PATH,
    component: () => <SpecificationEdit />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS,
    component: () => <ProductSpecification />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_FORM,
    component: () => <ProductSpecificationForm />,
    exact: true
  },
  {
    path: ROUTES.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_EDIT,
    component: () => <ProductSpecificationForm />,
    exact: true
  },
  //------------------------------------------
  // CAR ACCESSORIES
  //------------------------------------------
  //------------------------------------------
  // USED CAR TRADING
  //------------------------------------------
  {
    path: ROUTES.USED_CAR_TRADING_DASHBOARD_PATH,
    component: () => <UsedCarTradingDashboard />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_LIST_PATH,
    component: () => <CarTradingManagement />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_NEW_PATH,
    component: () => <CarTradingForm />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_EDIT_PATH,
    component: () => <CarTradingForm />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_CUSTOMER_LIST_PATH,
    component: () => <UsedCarTradingCustomerManagement />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_CUSTOMER_NEW_PATH,
    component: () => <UsedCarTradingCustomerForm />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_CUSTOMER_EDIT_PATH,
    component: () => <UsedCarTradingCustomerForm />,
    exact: true
  },
  {
    path: ROUTES.USED_CAR_TRADING_CAR_APPOINTMENT_LIST,
    component: () => <UsedCarTradingCarAppointment />,
    exact: true
  },
  //------------------------------------------
  // USED CAR TRADING
  //------------------------------------------
  //------------------------------------------
  // INSURANCE
  //------------------------------------------
  {
    path: ROUTES.INSURANCE_DASHBOARD_PATH,
    component: () => <InsuranceDashboard />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_COMPANY_PROFILE_PATH,
    component: () => <CompanyProfile />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PACKAGE_LIST_PATH,
    component: () => <PackageManagement />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PACKAGE_NEW_PATH,
    component: () => <PackageEditForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PACKAGE_VIEW_EDIT_PATH,
    component: () => <PackageViewEditForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PACKAGE_EDIT_PATH,
    component: () => <PackageEditForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_ORDER_LIST_PATH,
    component: () => <InsuranceOrderManagement />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_ORDER_NEW_PATH,
    component: () => <InsuranceOrderForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_ORDER_EDIT_PATH,
    component: () => <InsuranceOrderForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PROFILE_LIST_PATH,
    component: () => <InsuranceProfile />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PROFILE_NEW_PATH,
    component: () => <InsuranceProfileForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PROFILE_EDIT_PATH,
    component: () => <InsuranceProfileForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_CUSTOMER_LIST_PATH,
    component: () => <InsuranceCustomer />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_CUSTOMER_NEW_PATH,
    component: () => <InsuranceCustomerForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_CUSTOMER_EDIT_PATH,
    component: () => <InsuranceCustomerForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_PROMOTION_LIST_PATH,
    component: () => <InsurancePromotion />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_DISCOUNT_NEW_PATH,
    component: () => <InsurancePromotionDiscountForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_COUPON_NEW_PATH,
    component: () => <InsurancePromotionCouponForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_DISCOUNT_EDIT_PATH,
    component: () => <InsurancePromotionDiscountForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_COUPON_EDIT_PATH,
    component: () => <InsurancePromotionCouponForm />,
    exact: true
  },
  {
    path: ROUTES.INSURANCE_REPORT_PATH,
    component: () => <InsuranceReport />,
    exact: true
  },
  //------------------------------------------
  // INSURANCE
  //------------------------------------------
  //------------------------------------------
  // VENDORS
  //------------------------------------------
  {
    path: ROUTES.VENDORS_SUPPLIERS_PATH,
    component: () => <SupplierManagement />,
    exact: true
  },
  //------------------------------------------
  // VENDORS
  //------------------------------------------

  //------------------------------------------
  // TRANSACTION
  //------------------------------------------
  {
    path: ROUTES.TRANSACTION_PAYMENT_PATH,
    component: () => <PaymentManagement />,
    exact: true
  },
  //------------------------------------------
  // TRANSACTION
  //------------------------------------------
  //------------------------------------------
  // SETTINGS
  //------------------------------------------
  {
    path: ROUTES.SETTINGS_BANK_ACCOUNT_LIST_PATH,
    component: () => <BankingConfiguration />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_GENERAL_PATH,
    component: () => <SettingsGeneral />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_SERVICES_PATH,
    component: () => <SettingsServices />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_VEHICLES_PATH,
    component: () => <SettingsVehicles />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_USERS_PATH,
    component: () => <UserManagement />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_NEW_USERS_PATH,
    component: () => <CreateUpdateUser />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_ACTIONS_USERS_PATH,
    component: () => <CreateUpdateUser />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_ROLES_AND_PERMISSION_PATH,
    component: () => <RoleAndPermission />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_NEW_ROLES_AND_PERMISSION_PATH,
    component: () => <CreateRoleAndPermission />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_EDIT_ROLES_AND_PERMISSION_PATH,
    component: () => <CreateRoleAndPermission />,
    exact: true
  },
  {
    path: ROUTES.SETTINGS_VIEW_ROLES_AND_PERMISSION_PATH,
    component: () => <CreateRoleAndPermission />,
    exact: true
  }
  //------------------------------------------
  // SETTINGS
  //------------------------------------------
];

export default routes;
