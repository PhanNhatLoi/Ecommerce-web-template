import { Trans } from 'react-i18next';
import { DISCOUNT_UNIT, CONVERSION_UNIT } from '~/configs/type/promotionType';
import {
  CategorieDiscountResponse,
  CouponResponse,
  InvoiceDiscountResponse,
  TradingDiscountResponse,
  TradingProductResponse
} from '~/state/ducks/promotion/actions';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

//column of trading product discount
export const columnsProduct = [
  {
    title: <Trans i18nKey="product_code" />,
    dataIndex: 'tradingProduct',
    width: 180,
    align: 'center',
    render: (cell: TradingProductResponse) => {
      return cell ? <span>{cell.itemCode}</span> : '-';
    }
  },
  {
    title: <Trans i18nKey="product_name" />,
    dataIndex: 'tradingProduct',
    width: 180,
    align: 'center',
    render: (cell: TradingProductResponse) => {
      return cell ? <span>{cell.name}</span> : '-';
    }
  },
  {
    title: <Trans i18nKey="min_value" />,
    dataIndex: 'minQuantity',
    width: 180,
    align: 'center',
    render: (cell: string) => {
      return cell ? numberFormatDecimal(cell) : '-';
    }
  },
  {
    title: <Trans i18nKey="limit" />,
    dataIndex: 'quantityLimit',
    width: 180,
    align: 'center',
    render: (cell: string) => {
      return cell ? numberFormatDecimal(cell) : '-';
    }
  },
  {
    title: <Trans i18nKey="discount_value" />,
    dataIndex: 'discount',
    width: 180,
    align: 'center',
    render: (cell: number, row: TradingDiscountResponse) => {
      return (
        <span>{`${numberFormatDecimal(cell)} ${
          row.discountType === DISCOUNT_UNIT.CASH ? CONVERSION_UNIT.CASH : CONVERSION_UNIT.TRADE
        }`}</span>
      );
    }
  }
];

//column of category discount
export const columnsCategory = [
  {
    title: <Trans i18nKey="category_code" />,
    dataIndex: 'categoryId',
    width: 180,
    align: 'center'
  },
  {
    title: <Trans i18nKey="category_name" />,
    dataIndex: 'categoryName',
    width: 180,
    align: 'center'
  },
  {
    title: <Trans i18nKey="min_value" />,
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

//column of invoice discount
export const columnsInvoice = [
  {
    title: <Trans i18nKey="min_price" />,
    dataIndex: 'fromValue',
    width: 180,
    align: 'center',
    render: (cell: number) => {
      return <span>{`${numberFormatDecimal(cell)} ${CONVERSION_UNIT.CASH}`}</span>;
    }
  },
  {
    title: <Trans i18nKey="max_price" />,
    dataIndex: 'toValue',
    width: 180,
    align: 'center',
    render: (cell: number) => {
      return <span>{`${numberFormatDecimal(cell)} ${CONVERSION_UNIT.CASH}`}</span>;
    }
  },
  {
    title: <Trans i18nKey="discount_value" />,
    dataIndex: 'discount',
    width: 180,
    align: 'center',
    render: (cell: number, row: InvoiceDiscountResponse) => {
      return (
        <span>{`${numberFormatDecimal(cell)} ${
          row.discountType === DISCOUNT_UNIT.CASH ? CONVERSION_UNIT.CASH : CONVERSION_UNIT.TRADE
        }`}</span>
      );
    }
  },
  {
    title: <Trans i18nKey="apply_quantity" />,
    dataIndex: 'quantityLimit',
    width: 180,
    align: 'center',
    render: (cell: number) => {
      return cell ? (
        <span>
          {cell} <Trans i18nKey="turn" />
        </span>
      ) : (
        <span>
          <Trans i18nKey="unlimited" />
        </span>
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
