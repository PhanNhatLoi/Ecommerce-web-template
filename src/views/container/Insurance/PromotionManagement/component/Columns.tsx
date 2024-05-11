import { Trans } from 'react-i18next';
import { CONVERSION_UNIT, DISCOUNT_UNIT } from '~/configs/type/promotionType';
import { CategorieDiscountResponse, CouponResponse } from '~/state/ducks/promotion/actions';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

//column of package discount
export const columnsPackageDiscount = [
  {
    title: <Trans i18nKey="package_id" />,
    dataIndex: 'insurancePackageId',
    width: 120,
    align: 'center'
  },
  {
    title: <Trans i18nKey="package_name" />,
    dataIndex: 'insurancePackageName',
    width: 200,
    align: 'center'
  },
  {
    title: <Trans i18nKey="insuranceYear" />,
    dataIndex: 'minQuantity',
    width: 180,
    align: 'center'
  },
  {
    title: <Trans i18nKey="limit" />,
    dataIndex: 'quantityLimit',
    width: 180,
    align: 'center'
  },
  {
    title: <Trans i18nKey="discount_value" />,
    dataIndex: 'discount',
    width: 180,
    align: 'center',
    render: (cell: number, row: CategorieDiscountResponse) => {
      return (
        <span>{`${numberFormatDecimal(cell)} ${
          row.discountType === DISCOUNT_UNIT.CASH ? CONVERSION_UNIT.CASH : CONVERSION_UNIT.TRADE
        }`}</span>
      );
    }
  }
];

// column of coupon
export const columnsCoupon = [
  {
    title: <Trans i18nKey="coupon_code" />,
    dataIndex: 'couponCode',
    width: 180,
    align: 'center'
  },
  {
    title: <Trans i18nKey="discount_value" />,
    dataIndex: 'discount',
    width: 180,
    align: 'center',
    render: (cell: number, row: CouponResponse) => {
      return (
        <span>{`${numberFormatDecimal(cell)} ${row.type === DISCOUNT_UNIT.CASH ? CONVERSION_UNIT.CASH : CONVERSION_UNIT.TRADE}`}</span>
      );
    }
  },
  {
    title: <Trans i18nKey="max" />,
    dataIndex: 'maxDiscount',
    width: 180,
    align: 'center',
    render: (cell: number, row: CouponResponse) => {
      return row.type === DISCOUNT_UNIT.CASH ? (
        <Trans i18nKey="no_value" />
      ) : cell ? (
        <span>
          {cell} {CONVERSION_UNIT.CASH}
        </span>
      ) : (
        <Trans i18nKey="unlimited" />
      );
    }
  },
  {
    title: <Trans i18nKey="apply_quantity" />,
    dataIndex: 'quantityLimit',
    width: 180,
    align: 'center',
    render: (cell: number) => {
      return cell ? <span>{numberFormatDecimal(cell)}</span> : <Trans i18nKey="unlimited" />;
    }
  },
  {
    title: <Trans i18nKey="maximum_applications" />,
    dataIndex: 'quantityLimitForUser',
    width: 180,
    align: 'center',
    render: (cell: number) => {
      return cell ? <span>{numberFormatDecimal(cell)}</span> : <Trans i18nKey="unlimited" />;
    }
  }
];
