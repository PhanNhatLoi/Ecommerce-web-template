import React, { lazy } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { BUSINESS_TYPES } from '~/configs/const';
import { connect } from 'react-redux';
import { getAuthentication } from '~/state/ducks/authUser/selectors';
import * as PATH from '~/configs/routesConfig';
// import AuthPage from '~/views/presentation/auth/AuthPage';
import AuthorizedRoute from './AuthorizedRoute';
const AuthPage = lazy(() => import('~/views/presentation/auth/AuthPage'));

const AppRouter = (props) => {
  const authPage = !props.isAuthenticated ? <AuthPage /> : <Redirect to={PATH.DEFAULT_PATH} />;
  return (
    <>
      <Router>
        <Switch>
          <Route path={PATH.LOGIN_PATH} component={() => authPage} />
          <Route path={PATH.REGISTER_PATH} component={() => authPage} />
          <Route path={PATH.FORGOT_PASSWORD_PATH} component={() => authPage} />

          <AuthorizedRoute path={PATH.PROFILE_PATH} />
          <AuthorizedRoute path={PATH.PROFILE_CHANGE_PASS_PATH} />
          <AuthorizedRoute path={PATH.PROFILE_EDIT_INFO_PATH} />
          <AuthorizedRoute path={PATH.PROFILE_INFO_PATH} />
          <AuthorizedRoute path={PATH.PROFILE_INVOICE_INFO_PATH} />

          {/* NOTIFICATIONS */}
          <AuthorizedRoute path={PATH.NOTIFICATION_PATH} />
          <AuthorizedRoute path={PATH.NOTIFICATION_NEW_PATH} />

          {/* MEMBERS */}
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_DASHBOARD_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_MEMBER_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_MEMBER_INVITE_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_MEMBER_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_MEMBER_HELP_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.MEMBER_JOURNEY_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.MEMBER_JOURNEY_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_REQUEST_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_CLUB} path={PATH.AUTO_CLUB_REQUEST_NEW_PATH} />

          {/* CAR SERVICES */}
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_DASHBOARD_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_EMPLOYEE_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_EMPLOYEE_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_EMPLOYEE_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_NEW_REQUEST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_QUOTATION_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_REPAIR_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.MECHANIC_QUOTATION_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_PRICING_SYSTEM_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_PRICING_SYSTEM_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_VOUCHER_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_ORDER_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.MECHANIC_ORDER_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_REQUEST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.SERVICE_PROMOTION_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.SERVICE_PROMOTION_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.SERVICE_PROMOTION_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_CUSTOMER_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_CUSTOMER_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_CUSTOMER_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_CUSTOMER_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.AUTO_REPAIR_SHOP} path={PATH.CAR_SERVICES_REPORT_PATH} />

          {/* CAR ACCESSORIES */}
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_DASHBOARD_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PRODUCT_TRADING} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CREATE_PRODUCT_TRADING} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_UPDATE_PRODUCT_TRADING} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CREATE_SALES_ORDERS_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_UPDATE_SALES_ORDERS_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PRODUCT_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_RETURN_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_RETURN_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_RETURN_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PRODUCT_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PROMOTION_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_DISCOUNT_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_COUPON_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_DELIVERY_ODER_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_DELIVERY_ODER_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CUSTOMER_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CUSTOMER_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CUSTOMER_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PROVIDER_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_REPORT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_ITEMS_FORM_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_ITEMS_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_SPECIFICATION_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_SPECIFICATION_FORM_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_MASTER_DATA_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_FORM} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_EDIT} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_AR_INVOICE_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_AR_INVOICE_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_AR_INVOICE_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.SUPPLIER} path={PATH.CAR_ACCESSORIES_CROSS_CHECK} />

          {/* TODO: change business type */}
          {/* USED CAR TRADING */}
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_DASHBOARD_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_CUSTOMER_LIST_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_CUSTOMER_NEW_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_CUSTOMER_EDIT_PATH} />
          <AuthorizedRoute businessTypes={BUSINESS_TYPES.USED_CAR_DEALEARSHIP} path={PATH.USED_CAR_TRADING_CAR_APPOINTMENT_LIST} />

          {/* INSURANCE */}
          <AuthorizedRoute path={PATH.INSURANCE_DASHBOARD_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_COMPANY_PROFILE_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PACKAGE_LIST_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PACKAGE_NEW_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PACKAGE_VIEW_EDIT_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PACKAGE_EDIT_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_ORDER_LIST_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_ORDER_NEW_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_ORDER_EDIT_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PROFILE_LIST_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PROFILE_NEW_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PROFILE_EDIT_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_CUSTOMER_LIST_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_PROMOTION_LIST_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_DISCOUNT_NEW_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_COUPON_NEW_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_DISCOUNT_EDIT_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_COUPON_EDIT_PATH} />
          <AuthorizedRoute path={PATH.INSURANCE_REPORT_PATH} />

          {/* VENDORS */}
          <AuthorizedRoute path={PATH.VENDORS_SUPPLIERS_PATH} />

          {/* SETTINGS */}
          <AuthorizedRoute path={PATH.SETTINGS_GENERAL_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_SERVICES_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_VEHICLES_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_USERS_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_NEW_USERS_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_ACTIONS_USERS_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_ROLES_AND_PERMISSION_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_NEW_ROLES_AND_PERMISSION_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_EDIT_ROLES_AND_PERMISSION_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_VIEW_ROLES_AND_PERMISSION_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_BANK_ACCOUNT_LIST_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_BANK_ACCOUNT_NEW_PATH} />
          <AuthorizedRoute path={PATH.SETTINGS_BANK_ACCOUNT_EDIT_PATH} />

          {/* TRANSACTION */}
          <AuthorizedRoute path={PATH.TRANSACTION_PAYMENT_PATH} />
          <AuthorizedRoute path={PATH.DASHBOARD_PATH} />
          <AuthorizedRoute path={PATH.PROBLEMS_PATH} />
          <AuthorizedRoute path={PATH.TECHNICIAN_PATH} />
          <AuthorizedRoute path={PATH.NEW_TECHNICIAN_PATH} />
          <AuthorizedRoute path={PATH.EDIT_TECHNICIAN_PATH} />
          <AuthorizedRoute path={PATH.FIX_PROBLEM_PATH} />
          <AuthorizedRoute path={PATH.NEW_NOTIFICATION_PATH} />
          <AuthorizedRoute path={PATH.EDIT_NOTIFICATION_PATH} />
          <AuthorizedRoute path={PATH.REPORT_PATH} />

          <Redirect to={PATH.DEFAULT_PATH} />
        </Switch>
      </Router>
    </>
  );
};

export default connect((state) => ({
  isAuthenticated: getAuthentication(state)
}))(AppRouter);
