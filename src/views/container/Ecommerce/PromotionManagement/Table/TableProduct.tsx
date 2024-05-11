import { Radio } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CONVERSION_UNIT, DISCOUNT_UNIT } from '~/configs/type/promotionType';
import { promotionActions } from '~/state/ducks/promotion';
import { TradingDiscountRequest, TradingDiscountResponse, TradingProductResponse } from '~/state/ducks/promotion/actions';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { unitActions } from '~/state/ducks/units';
import { UnitRespone } from '~/state/ducks/units/actions';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';

const TableProduct = (props: {
  getUnits: any;
  getProducts: any;
  data?: TradingDiscountResponse[];
  setdata: React.Dispatch<React.SetStateAction<TradingDiscountRequest[]>>;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t }: any = useTranslation();
  const [DataSource, setDataSource] = useState<TradingDiscountResponse[]>([]);
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(false);
  const [units, setUnits] = useState<UnitRespone[]>([]);

  useEffect(() => {
    props
      .getUnits({ size: 9999 })
      .then((res) => setUnits(res?.content))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    // fill data list product
    if (props?.data) {
      props.data.map((m: any) => {
        m.tradingProductId = m?.tradingProduct?.id;
        m.itemCode = m?.tradingProduct?.itemCode;
      });
      setDataSource(props?.data);
      setNeedLoadNewData(true);
    }
  }, [props.data]);

  const handleSetData = (newData: TradingDiscountRequest[]) => {
    try {
      if (newData.length) {
        props.setdata(newData);
        if (!props.data && newData.length) props.setDirty(true);
        const keys1 = Object.keys(DataSource);
        for (let key of keys1) {
          if (DataSource[key] !== newData[key]) {
            return props.setDirty(true);
          }
        }
      }
    } catch (err) {
      console.error(`~ file: Form.js ~ handleSetDatas ~ err`, err);
    }
  };

  const columns = [
    {
      title: t('contact_index'),
      dataIndex: 'key',
      width: '80px',
      align: 'center'
    },
    {
      title: t('product_name'),
      dataIndex: 'tradingProductId',
      width: '200px',
      editable: true,
      type: 'selectApi',
      align: 'center',
      require: true,
      unique: true,
      fixDataUnique: (oldValues: TradingDiscountRequest) => {
        return { ...oldValues, itemCode: null, tradingProductId: null, productName: null };
      },
      fetchData: {
        action: props.getProducts,
        value: 'id',
        label: 'name'
      },
      fillOtherField: (newValues: TradingDiscountRequest, oldValues: TradingDiscountRequest, object: TradingProductResponse) => {
        if (newValues.tradingProductId !== oldValues.tradingProductId) {
          newValues.itemCode = object.itemCode;
          newValues.productName = object.name;
          const findUnit = units.find((f: UnitRespone) => f.id === object.unitId);
          if (findUnit) newValues.unit = findUnit?.name;
          else newValues.unit = '-';
        }
        return newValues;
      }
    },
    {
      title: t('product_code'),
      dataIndex: 'itemCode',
      width: '200px',
      editable: true,
      type: 'selectApi',
      align: 'center',
      require: true,
      unique: true,
      fixDataUnique: (oldValues: TradingDiscountRequest) => {
        return { ...oldValues, itemCode: null, tradingProductId: null, productName: null };
      },
      fetchData: {
        action: props.getProducts,
        value: 'itemCode',
        label: 'itemCode'
      },
      fillOtherField: (newValues: TradingDiscountRequest, oldValues: TradingDiscountRequest, object: TradingProductResponse) => {
        if (newValues.itemCode !== oldValues.itemCode) {
          newValues.tradingProductId = object.id;
          newValues.productName = object.name;
          const findUnit = units.find((f: UnitRespone) => f.id === object.unitId);
          if (findUnit) newValues.unit = findUnit?.name;
          else newValues.unit = '-';
        }
        return newValues;
      }
    },
    {
      title: t('unit'),
      dataIndex: 'unit',
      width: '100px',
      align: 'center',
      type: 'string'
    },
    {
      title: t('min_value'),
      dataIndex: 'minQuantity',
      width: '120px',
      align: 'center',
      editable: true,
      type: 'number',
      require: true
    },
    {
      title: t('limit'),
      dataIndex: 'quantityLimit',
      width: '80px',
      align: 'center',
      editable: true,
      type: 'number',
      require: true
    },
    {
      title: t('discount_value'),
      dataIndex: 'discount',
      width: '200px',
      align: 'center',
      editable: true,
      type: 'number',
      require: true
    },
    {
      title: t('discount_unit'),
      require: true,
      dataIndex: 'discountType',
      width: '140px',
      align: 'center',
      editable: true,
      type: 'radio',
      options: [
        { label: CONVERSION_UNIT.CASH, value: DISCOUNT_UNIT.CASH },
        { label: CONVERSION_UNIT.TRADE, value: DISCOUNT_UNIT.TRADE }
      ],
      render: (value: string[]) => (
        <Radio.Group
          options={[
            { label: CONVERSION_UNIT.CASH, value: DISCOUNT_UNIT.CASH },
            { label: CONVERSION_UNIT.TRADE, value: DISCOUNT_UNIT.TRADE }
          ]}
          value={value}
          optionType="button"
          buttonStyle="solid"
        />
      )
    }
  ];

  return (
    <ATableEditable
      noTitle
      scrollX={1200}
      columns={columns}
      dataSource={DataSource}
      needLoadNewData={needLoadNewData}
      setNeedLoadNewData={setNeedLoadNewData}
      setDataSource={handleSetData}
    />
  );
};

export default connect(null, {
  getPromotions: promotionActions.getPromotions,
  getProducts: tradingProductActions.getTradingProduct,
  getUnits: unitActions.getUnits,
  getPromotionDetail: promotionActions.getPromotionDetail
})(TableProduct);
