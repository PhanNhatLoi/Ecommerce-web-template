import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TRADING_PRODUCT_STATUS_RESPONSE } from '~/configs/status/car-accessories/tradingProductStatus';
import { promotionActions } from '~/state/ducks/promotion';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { unitActions } from '~/state/ducks/units';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

interface ProductTableProps {
  getProducts: any;
  getUnits: any;
  getPromotionDetail: any;
  data: Array<any>;
  setdataInit: React.Dispatch<React.SetStateAction<any[]>>;
  setSubtotal: React.Dispatch<React.SetStateAction<number>>;
  setDataOrder: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  dataInit: Array<any>;
  viewPage: Boolean;
  orderCreateOnApp: Boolean;
  notAllowEditInfo: Boolean;
  subtotal: number;
}
const ProductTable: React.FC<ProductTableProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setloading] = useState(false);
  const [needLoad, setNeedLoad] = useState(false);
  const [productList, setproductList] = useState([]);
  const [units, setUnits] = useState([]);

  const [dataReturn, setDataReturn] = useState([]);

  interface DataTemplate {
    tradingProductId: string;
    minQuantity?: number;
    quantityLimit?: number;
    discount?: number;
    discountType?: string;
  }
  let Template: DataTemplate = {
    tradingProductId: ''
  };

  // get trading product list
  useEffect(() => {
    props
      .getProducts({ size: 99999 })
      .then((res) => {
        const data = res.content.filter((item) => {
          // chỉ được chọn sản phẩm có stt=ACTIVATED và approveStatus=APPROVED
          const productStatusInValid = [TRADING_PRODUCT_STATUS_RESPONSE.BLOCKED, TRADING_PRODUCT_STATUS_RESPONSE.DEACTIVATED];
          const productApproveStatusValid = [TRADING_PRODUCT_STATUS_RESPONSE.APPROVED];
          return !productStatusInValid.includes(item.status) && productApproveStatusValid.includes(item.approveStatus);
        });

        setproductList(data);
      })
      .catch((err) => console.error('err effect line 22', err));

    props
      .getUnits()
      .then((res) => setUnits(res?.content))
      .catch((err) => console.error('err effect line 22', err));
  }, []);

  useEffect(() => {
    if (props.dataInit.length) {
      setNeedLoad(true);
    }
  }, [props.dataInit]);

  //get unit list
  useEffect(() => {
    // fill data list product
    if (props?.data && productList.length && units.length) {
      let initData = props?.data;
      initData.map((e) => {
        e.name = e.tradingProduct.name;
        e.tradingProductId = e.tradingProduct.id;
        e.conversionSku = e.tradingProduct?.conversionSku;
        const unitInfo = units.find((f: any) => f.id === e.tradingProduct?.unitId) as any;
        e.unit = unitInfo?.name;
      });
      props.setdataInit(initData);
    }
  }, [productList, units]);

  //calulate subtotal
  useEffect(() => {
    if (dataReturn) {
      const filterData = dataReturn.filter((item: any) => item.subtotal);
      let subTotal = 0;
      for (const item of filterData as any) {
        subTotal += item.subtotal;
      }
      if (!props.viewPage) {
        props.setSubtotal(subTotal);
      }
    }
  }, [dataReturn]);

  //return data for form
  const handleSetData = (newData) => {
    try {
      setDataReturn(newData);
      const dataOrder = newData.filter((item) => item.tradingProductId);
      props.setDataOrder(dataOrder);
    } catch (err) {
      console.error(`~ file: Form.js ~ handleSetDatas ~ err`, err);
    }
  };

  // get trading detail
  const getDataTrading = (tradingProductId: String) => {
    const tradingProduct = productList?.find((productItem: any) => productItem.id === tradingProductId) as any;
    const unit = units?.find((u: any) => u?.id === tradingProduct?.unitId) as any;
    return { tradingProduct, unit };
  };

  const calculatePromotion = (promotion, qtyOrder, price) => {
    if (promotion) {
      switch (promotion?.discountType) {
        case 'CASH':
          return qtyOrder >= promotion?.minQuantity ? promotion?.discount : 0;
        case 'TRADE':
          return qtyOrder >= promotion?.minQuantity ? qtyOrder * price * (promotion?.discount / 100) : 0;
        default:
          return 0;
      }
    } else return 0;
  };

  // calc price by qty and discount
  const calculatePrice = (qtyOrder: number, tradingProduct) => {
    const price = Number(tradingProduct.price);
    const pricesByQty = tradingProduct.prices;
    const disc: any = calculatePromotion(tradingProduct?.existedPromotion, qtyOrder, price);

    const res = {
      price,
      discount: disc,
      subtotal: price * qtyOrder - disc
    };

    if (pricesByQty[0]) {
      const priceByQty = pricesByQty.filter((price) => qtyOrder >= price.fromValue && qtyOrder <= price.toValue)[0];
      if (priceByQty) {
        const disc: any = calculatePromotion(tradingProduct?.existedPromotion, qtyOrder, priceByQty.price);

        return {
          price: priceByQty.price,
          discount: disc,
          subtotal: Number(priceByQty.price) * qtyOrder - disc
        };
      }
      return res;
    } else return res;
  };

  const fillProductField = (newValues, oldValues) => {
    if (newValues.tradingProductId !== oldValues.tradingProductId) {
      const { tradingProduct, unit } = getDataTrading(newValues.tradingProductId);
      newValues.unit = unit?.name || '-';
      const qtyCurrent = Number(oldValues.quantityOrder);
      const quantityMin = Number(tradingProduct.quantityMin);

      newValues.quantityOrder = qtyCurrent ? (qtyCurrent > quantityMin ? qtyCurrent : quantityMin) : quantityMin;

      //nếu mua vượt tồn kho->báo lỗi
      if (tradingProduct.isManageStock) {
        if (newValues.quantityOrder > tradingProduct.stockQuantity)
          AMessage.error(t('err_stock') + ` - ${t('Stock_title')} ${tradingProduct.stockQuantity} `);
        newValues.quantityOrder = quantityMin;
      }
      const qtyOrder = Number(newValues.quantityOrder);

      const { price, subtotal, discount } = calculatePrice(qtyOrder, tradingProduct);

      newValues.price = price;
      newValues.discount = discount;
      newValues.subtotal = subtotal;

      return newValues;
    }
  };

  const fillQuantityAndPriceField = (newValues, oldValues) => {
    if (oldValues.tradingProductId) {
      const { tradingProduct } = getDataTrading(oldValues.tradingProductId);
      let val;

      if (newValues.quantityOrder >= tradingProduct.quantityMin) {
        val = newValues;
      } else {
        AMessage.error(t('require_min_qty') + ` ${tradingProduct.quantityMin} ` + t('products'));
        val = oldValues;
      }

      if (tradingProduct.isManageStock) {
        if (val.quantityOrder > tradingProduct.stockQuantity) {
          AMessage.error(t('err_stock') + ` - ${t('Stock_title')} ${tradingProduct.stockQuantity} `);
          val.quantityOrder = oldValues.quantityOrder;
        }
      }

      const qtyOrder = Number(val.quantityOrder);

      const { price, subtotal, discount } = calculatePrice(qtyOrder, tradingProduct);

      val.price = price;
      val.discount = discount;
      val.subtotal = subtotal > 0 ? subtotal : 0;
      return val;
    }
    return newValues;
  };

  const columns = [
    {
      title: t('product_name'),
      dataIndex: 'tradingProductId',
      width: '150px',
      editable: !props.viewPage,
      type: 'select',
      align: 'center',
      options: productList.map((o) => {
        // fix product name
        return {
          value: o['id'],
          search: o['name'],
          label: o['name']
        };
      }),
      fillOtherField: fillProductField
    },
    {
      title: t('item_id'),
      dataIndex: 'tradingProductId',
      width: '100px',
      editable: !props.viewPage,
      type: 'select',
      align: 'center',
      options: productList.map((o) => {
        // fix product name
        return {
          value: o['id'],
          search: o['itemCode'],
          label: o['itemCode']
        };
      }),
      fillOtherField: fillProductField
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      width: '80px',
      editable: false,
      align: 'center'
    },
    {
      title: t('quantity'),
      dataIndex: 'quantityOrder',
      width: '80px',
      align: 'center',
      editable: !props.viewPage,
      type: 'number',
      fillOtherField: fillQuantityAndPriceField
    },
    {
      title: t('cost'),
      dataIndex: 'price',
      width: '70px',
      editable: false,
      align: 'center',
      type: 'number',
      render: (cell: string) => {
        return numberFormatDecimal(cell ? +cell : 0, ' đ', '');
      }
    },
    {
      title: t('discount_sales_order'),
      dataIndex: 'discount',
      width: '70px',
      align: 'center',
      type: 'number',
      render: (cell: string) => {
        return numberFormatDecimal(cell ? +cell : 0, ' đ', '');
      }
    },
    {
      title: t('Subtotal'),
      dataIndex: 'subtotal',
      width: '100px',
      editable: false,
      type: 'number',
      align: 'center',
      render: (cell: string) => {
        return numberFormatDecimal(cell ? +cell : 0, ' đ', '');
      }
    }
  ];

  return (
    <div className="d-print-none">
      <ATableEditable
        title=""
        isNone={props.viewPage}
        scrollX={1200}
        loading={loading}
        noActionBtn={props.viewPage ? true : false}
        notSupportAddBtn={props.viewPage ? true : false}
        columns={columns}
        needLoadNewData={needLoad}
        setNeedLoadNewData={setNeedLoad}
        dataTemplate={Template}
        dataSource={props.dataInit}
        setDataSource={handleSetData}
      />
    </div>
  );
};

export default connect(null, {
  getProducts: tradingProductActions.getTradingProduct,
  getUnits: unitActions.getUnits,
  getPromotionDetail: promotionActions.getPromotionDetail
})(ProductTable);
