import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import TableBootstrapHookNoApi from '~/views/presentation/table-bootstrap-hook-no-api';
import AntTable from '~/views/presentation/ui/table/AntTable';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { connect } from 'react-redux';
import { TradingProductResponse } from '~/state/ducks/promotion/actions';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
interface IProductTableView {
  getTradingProduct: any;
  data: any;
}
const ProductTableView: React.FC<IProductTableView> = (props) => {
  const { t }: any = useTranslation();
  const [tradingProductList, setTradingProductList] = useState<any>();

  useEffect(() => {
    props
      .getTradingProduct({ size: 100000 })
      .then((res) => {
        setTradingProductList(res.content);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const columns = [
    {
      title: t('product_name'),
      dataIndex: 'tradingProductId',
      width: '250px',
      align: 'center',
      render: (cell) => {
        const tradingProduct: TradingProductResponse = tradingProductList?.find((f: any) => Number(f.id) === cell);
        return tradingProduct ? <span>{tradingProduct.name}</span> : '-';
      }
    },
    {
      title: t('item_code'),
      dataIndex: 'tradingProductId',
      width: '180px',
      align: 'center',
      render: (cell) => {
        const tradingProduct: TradingProductResponse = tradingProductList?.find((f: any) => Number(f.id) === cell);
        return tradingProduct ? <span>{tradingProduct.itemCode}</span> : '-';
      }
    },
    {
      title: t('unit'),
      dataIndex: 'unit',
      align: 'center',
      width: '190px'
    },
    {
      title: t('quantity'),
      dataIndex: 'quantityOrder',
      width: '150px',
      align: 'center',
      render: (cell: string) => {
        return numberFormatDecimal(cell ? cell : 0);
      }
    },
    {
      title: t('cost'),
      dataIndex: 'price',
      width: '180px',
      align: 'center',
      render: (cell: string) => {
        return numberFormatDecimal(cell ? +cell : 0, ' đ', '');
      }
    },
    {
      title: t('discount_sales_order'),
      dataIndex: 'discount',
      width: '170px',
      align: 'center',
      render: (cell) => {
        return numberFormatDecimal(cell ? +cell : 0, ' đ', '');
      }
    },
    {
      title: t('Subtotal'),
      dataIndex: 'subtotal',
      width: '180px',
      align: 'center',
      render: (cell: string) => {
        return numberFormatDecimal(cell ? +cell : 0, ' đ', '');
      }
    }
  ];

  const columnsNew = columns.map((column) => {
    return {
      headerClasses: 'ht-custom-header-table',
      headerStyle: {
        textAlign: 'center'
      },
      render: (cell, row) => {
        return cell ? <span>{cell}</span> : '-';
      },
      ...column
    };
  });
  return <AntTable columns={columnsNew} data={props?.data || []} />;
};

export default connect(null, {
  getTradingProduct: tradingProductActions.getTradingProduct
})(ProductTableView);
