import { Trans } from 'react-i18next';
import * as PATH from './routesConfig';
import { BUSINESS_TYPES } from './const';

export const sidebarMenus = [
  {
    path: PATH.PROFILE_CHANGE_PASS_PATH,
    title: <Trans i18nKey="change_password" />,
    businessTypes: 'none',
    showOnlyVendor: true
  },
  {
    path: PATH.PROFILE_EDIT_INFO_PATH,
    title: <Trans i18nKey="edit_profile" />,
    businessTypes: 'none',
    showOnlyVendor: true
  },
  {
    path: PATH.DASHBOARD_PATH,
    title: <Trans i18nKey="organization_summary" />,
    businessTypes: 'none',
    icon: 'overview'
  },
  // ------------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------------
  {
    path: PATH.NOTIFICATIONS_PATH,
    title: <Trans i18nKey="Notification" />,
    businessTypes: 'none',
    icon: 'ring'
  },
  // ------------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------------
  // ------------------------------------------------
  // AUTO CLUB
  // ------------------------------------------------
  // {
  //   group: <Trans i18nKey="Members" />
  // },
  {
    path: PATH.AUTO_CLUB_PATH,
    title: <Trans i18nKey="Auto clubs" />,
    businessTypes: BUSINESS_TYPES.AUTO_CLUB,
    icon: 'car',
    subMenus: [
      {
        path: PATH.AUTO_CLUB_DASHBOARD_PATH,
        title: <Trans i18nKey="dashboard" />
        // icon: icon({ name: 'tachometer-alt' })
      },
      {
        path: PATH.AUTO_CLUB_MEMBER_LIST_PATH,
        title: <Trans i18nKey="members" />
        // icon: icon({ name: 'users' })
      },
      // ENHANCE LATER
      // {
      //   path: PATH.AUTO_CLUB_MEMBERS_PATH,
      //   title: <Trans i18nKey="members" />,
      //   icon: 'fas fa-users',
      //   subMenus: [
      //     {
      //       path: PATH.AUTO_CLUB_MEMBER_LIST_PATH,
      //       title: <Trans i18nKey="Member list" />,
      //       icon: '/media/svg/icons/Communication/Group.svg'
      //     },
      //     {
      //       path: PATH.AUTO_CLUB_MEMBER_NEW_PATH,
      //       title: <Trans i18nKey="Add new member" />,
      //       icon: '/media/svg/icons/Communication/Add-user.svg'
      //     },
      //     {
      //       path: PATH.AUTO_CLUB_MEMBER_INVITE_PATH,
      //       title: <Trans i18nKey="Invite a member" />,
      //       icon: '/media/svg/icons/Communication/Share.svg'
      //     },
      //   ]
      // },
      {
        path: PATH.AUTO_CLUB_REQUEST_LIST_PATH,
        title: <Trans i18nKey="Requests list" />
        // icon: icon({ name: 'car-crash' })
      },
      // ENHANCE LATER
      // {
      //   path: PATH.AUTO_CLUB_REQUEST_PATH,
      //   title: <Trans i18nKey="Requests" />,
      //   icon: 'fas fa-car-crash',
      //   subMenus: [
      //     {
      //       path: PATH.AUTO_CLUB_REQUEST_LIST_PATH,
      //       title: <Trans i18nKey="Requests list" />,
      //       icon: '/media/svg/icons/Communication/Mail-notification.svg'
      //     },
      //     {
      //       path: PATH.AUTO_CLUB_REQUEST_NEW_PATH,
      //       title: <Trans i18nKey="Add new Request" />,
      //       icon: '/media/svg/icons/Navigation/Plus.svg'
      //     }
      //   ]
      // },
      {
        path: PATH.AUTO_CLUB_MEMBER_HELP_LIST_PATH,
        title: <Trans i18nKey="Helps" />
        // icon: icon({ name: 'tools' })
      }
    ]
  },
  // ------------------------------------------------
  // AUTO CLUB
  // ------------------------------------------------

  // ------------------------------------------------
  // CAR SERVICES
  // ------------------------------------------------
  {
    path: PATH.CAR_SERVICES_PATH,
    title: <Trans i18nKey="Car services" />,
    businessTypes: BUSINESS_TYPES.AUTO_REPAIR_SHOP,
    icon: 'service',
    subMenus: [
      {
        path: PATH.CAR_SERVICES_DASHBOARD_PATH,
        title: <Trans i18nKey="dashboard" />
        // icon: icon({ name: 'tachometer-alt' })
      },
      {
        path: PATH.CAR_SERVICES_EMPLOYEE_PATH,
        title: <Trans i18nKey="Employees" />
        // icon: icon({ name: 'users-cog' })
      },
      {
        path: PATH.CAR_SERVICES_NEW_REQUEST_PATH,
        title: <Trans i18nKey="Nearby Requests" />
        // icon: icon({ name: 'car-crash' })
      },
      {
        path: PATH.CAR_SERVICES_QUOTATION_LIST_PATH,
        title: <Trans i18nKey="Quotations" />
        // icon: icon({ name: 'file-invoice-dollar' })
      },
      {
        path: PATH.CAR_SERVICES_REPAIR_LIST_PATH,
        title: <Trans i18nKey="Repairs" />
        // icon: icon({ name: 'hammer' })
      },
      {
        path: PATH.CAR_SERVICES_ORDER_LIST_PATH,
        title: <Trans i18nKey="Orders" />
        // icon: icon({ name: 'receipt' })
      },
      {
        path: PATH.CAR_SERVICES_PRICING_SYSTEM_PATH,
        title: <Trans i18nKey="Product/Services" />
        // icon: icon({ name: 'clipboard-list' })
      },
      {
        path: PATH.CAR_SERVICES_VOUCHER_PATH,
        title: <Trans i18nKey="voucherManagement" />
        // icon: icon({ name: 'clipboard-list' })
      },
      {
        path: PATH.SERVICE_PROMOTION_PATH,
        title: <Trans i18nKey="Promotions" />
      },
      {
        path: PATH.CAR_SERVICES_CUSTOMER_LIST_PATH,
        title: <Trans i18nKey="Customers" />
        // icon: icon({ name: 'user-tie' })
      },
      {
        path: PATH.CAR_SERVICES_REPORT_PATH,
        title: <Trans i18nKey="statistic_report" />
        // icon: icon({ name: 'chart-column' })
      }
    ]
  },
  // ------------------------------------------------
  // CAR SERVICES
  // ------------------------------------------------
  // ------------------------------------------------
  // TRANSACTION
  // ------------------------------------------------
  {
    path: PATH.TRANSACTION_PATH,
    title: <Trans i18nKey="Transaction" />,
    businessTypes: 'none',
    icon: 'office_bag',
    subMenus: [
      {
        path: PATH.TRANSACTION_PAYMENT_PATH,
        title: <Trans i18nKey="PAYMENT" />
        // icon: icon({ name: 'credit-card' })
      }
    ]
  },
  // ------------------------------------------------
  // TRANSACTION
  // ------------------------------------------------
  // ------------------------------------------------
  // CAR ACCESSORIES
  // ------------------------------------------------
  {
    path: PATH.CAR_ACCESSORIES_PATH,
    title: <Trans i18nKey="Car Accessories" />,
    icon: 'ecome',
    businessTypes: BUSINESS_TYPES.SUPPLIER,
    subMenus: [
      {
        path: PATH.CAR_ACCESSORIES_DASHBOARD_PATH,
        title: <Trans i18nKey="dashboard" />
        // icon: icon({ name: 'tachometer-alt-average' })
      },
      {
        path: PATH.CAR_ACCESSORIES_PRODUCT_TRADING,
        title: <Trans i18nKey="product_trading" />
        // icon: icon({ name: 'car' })
      },
      {
        path: PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH,
        title: <Trans i18nKey="Orders" />
        // icon: icon({ name: 'receipt' })
      },
      {
        path: PATH.CAR_ACCESSORIES_DELIVERY_ODER_PATH,
        title: <Trans i18nKey="delivery_orders_list" />
        // icon: icon({ name: 'truck' })
      },
      {
        path: PATH.CAR_ACCESSORIES_AR_INVOICE_PATH,
        title: <Trans i18nKey="ar_invoice" />
        // icon: icon({ name: 'receipt' })
        // disabledAction: ['viewOnly']
      },
      {
        path: PATH.CAR_ACCESSORIES_RETURN_PATH,
        title: <Trans i18nKey="Return" />,
        // icon: icon({ name: 'receipt' }),
        disabledAction: ['viewOnly']
      },
      {
        path: PATH.CAR_ACCESSORIES_PROMOTION_PATH,
        title: <Trans i18nKey="Promotions" />
        // icon: icon({ name: 'tags' })
      },
      {
        path: PATH.CAR_ACCESSORIES_REPORT_PATH,
        title: <Trans i18nKey="business_report" />,
        // icon: icon({ name: 'chart-column' }),
        disabledAction: ['access']
      },
      {
        path: PATH.CAR_ACCESSORIES_MASTER_DATA_PATH,
        title: <Trans i18nKey="Master Data" />,
        // icon: icon({ name: 'car' }),
        subMenus: [
          {
            path: PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH,
            title: <Trans i18nKey="goods_items" />
          },
          {
            path: PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH,
            title: <Trans i18nKey="Customers" />
          }
        ]
      },
      {
        path: PATH.CAR_ACCESSORIES_CROSS_CHECK,
        title: <Trans i18nKey="cross_check" />,
        disabledAction: ['access']
      },
      {
        path: PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS,
        title: <Trans i18nKey="product_specification" />
        // icon: icon({ name: 'cog' })
      }
    ]
  },
  // ------------------------------------------------
  // CAR ACCESSORIES
  // ------------------------------------------------
  // ------------------------------------------------
  // USED CAR TRADING
  // ------------------------------------------------
  {
    path: PATH.USED_CAR_TRADING_PATH,
    title: <Trans i18nKey="usedCarTrading" />,
    icon: 'car',
    businessTypes: BUSINESS_TYPES.USED_CAR_DEALEARSHIP,
    subMenus: [
      {
        path: PATH.USED_CAR_TRADING_DASHBOARD_PATH,
        title: <Trans i18nKey="dashboard" />
      },
      {
        path: PATH.USED_CAR_TRADING_LIST_PATH,
        title: <Trans i18nKey="usedCarListingManagement" />
      },
      {
        path: PATH.USED_CAR_TRADING_CUSTOMER_LIST_PATH,
        title: <Trans i18nKey="Customer" />
      },
      {
        path: PATH.USED_CAR_TRADING_CAR_APPOINTMENT_LIST,
        title: <Trans i18nKey="car_appointment_managerment" />
      }
    ]
  },
  // ------------------------------------------------
  // USED CAR TRADING
  // ------------------------------------------------
  // ------------------------------------------------
  // INSURANCE
  // ------------------------------------------------
  {
    path: PATH.INSURANCE_PATH,
    title: <Trans i18nKey="insurance" />,
    businessTypes: BUSINESS_TYPES.INSURANCE_COMPANY,
    // icon: icon({ name: 'tachometer-alt-average' })
    icon: 'shield02',
    subMenus: [
      {
        path: PATH.INSURANCE_DASHBOARD_PATH,
        title: <Trans i18nKey="dashboard" />
        // icon: icon({ name: 'tachometer-alt-average' })
      },
      {
        path: PATH.INSURANCE_COMPANY_PROFILE_PATH,
        title: <Trans i18nKey="company_profile" />
        // icon: icon({ name: 'building' })
      },
      {
        path: PATH.INSURANCE_PACKAGE_LIST_PATH,
        title: <Trans i18nKey="package_insurance" />
        // icon: icon({ name: 'heart-pulse' })
      },
      {
        path: PATH.INSURANCE_ORDER_LIST_PATH,
        title: <Trans i18nKey="Orders" />
        // icon: icon({ name: 'truck' })
      },
      {
        path: PATH.INSURANCE_PROFILE_LIST_PATH,
        title: <Trans i18nKey="insurance_profile" />
        // icon: icon({ name: 'address-card' })
      },
      {
        path: PATH.INSURANCE_CUSTOMER_LIST_PATH,
        title: <Trans i18nKey="Customer" />
        // icon: icon({ name: 'user' })
      },
      {
        path: PATH.INSURANCE_PROMOTION_LIST_PATH,
        title: <Trans i18nKey="Promotions" />
        // icon: icon({ name: 'tags' })
      },
      {
        path: PATH.INSURANCE_REPORT_PATH,
        title: <Trans i18nKey="report" />,
        // icon: icon({ name: 'chart-column' }),
        disabledAction: ['viewOnly']
      }
    ]
  },
  // ------------------------------------------------
  // INSURANCE
  // ------------------------------------------------
  // ------------------------------------------------
  // VENDORS
  // ------------------------------------------------
  {
    path: PATH.VENDORS_PATH,
    title: <Trans i18nKey="Vendors" />,
    businessTypes: 'none',
    icon: 'persions',
    subMenus: [
      {
        path: PATH.VENDORS_SUPPLIERS_PATH,
        title: <Trans i18nKey="Suppliers" />
        // icon: icon({ name: 'user-tie' })
      }
    ]
  },
  // ------------------------------------------------
  // VENDORS
  // ------------------------------------------------
  // ------------------------------------------------
  // SETTINGS
  // ------------------------------------------------
  // {
  //   group: <Trans i18nKey="Settings" />
  // },
  {
    path: PATH.SETTINGS_PATH,
    title: <Trans i18nKey="Settings" />,
    businessTypes: 'none',
    icon: 'setting',
    subMenus: [
      {
        path: PATH.SETTINGS_BANK_ACCOUNT_LIST_PATH,
        title: <Trans i18nKey="banking_management" />
        // icon: icon({ name: 'university' })
      },
      {
        path: PATH.SETTINGS_GENERAL_PATH,
        title: <Trans i18nKey="General" />
        // icon: icon({ name: 'cog' })
      },
      {
        path: PATH.SETTINGS_SERVICES_PATH,
        title: <Trans i18nKey="Services" />
        // icon: icon({ name: 'check-circle' })
      },
      {
        path: PATH.SETTINGS_VEHICLES_PATH,
        title: <Trans i18nKey="Vehicles" />
        // icon: icon({ name: 'car' })
      },
      {
        path: PATH.SETTINGS_ROLES_AND_PERMISSION_PATH,
        title: <Trans i18nKey="Roles and Permission" />
        // icon: icon({ name: 'user-shield' })
      },
      {
        path: PATH.SETTINGS_USERS_PATH,
        title: <Trans i18nKey="Users" />
      }
    ]
  }
  // ------------------------------------------------
  // SETTINGS
  // ------------------------------------------------
];

export const headerMenus = [
  // {
  //   path: PATH.NOTIFICATIONS_PATH,
  //   title: <Trans i18nKey="Notifications" />,
  // },
  // {
  //   path: '/example',
  //   title: 'Example',
  //   subMenus: [
  //     {
  //       path: '/example/one',
  //       title: 'Item 1',
  //       icon: '/media/svg/icons/Design/PenAndRuller.svg',
  //       subMenus: [
  //         {
  //           path: '/example/one/one',
  //           title: 'Item 1.1'
  //         },
  //         {
  //           path: '/example/one/two',
  //           title: 'Item 1.2'
  //         }
  //       ]
  //     },
  //     {
  //       path: '/example/two',
  //       title: 'Item 2',
  //       icon: '/media/svg/icons/Navigation/Arrow-from-left.svg',
  //       subMenus: [
  //         {
  //           path: '/example/two/one',
  //           title: 'Item 2.1'
  //         },
  //         {
  //           path: '/example/two/two',
  //           title: 'Item 2.2'
  //         }
  //       ]
  //     },
  //     {
  //       path: '/example/three',
  //       title: 'Item 3',
  //       icon: '/media/svg/icons/Design/PenAndRuller.svg'
  //     }
  //   ]
  // }
];
