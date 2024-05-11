import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { unitActions } from '~/state/ducks/units';
import AntTable from '~/views/presentation/ui/table/AntTable';
import { DeliveryDetailsResponse } from '~/state/ducks/carAccessories/deliveryOrders/actions';

type Props = {
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  getProducts: any;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  data: DeliveryDetailsResponse[];
  setData: React.Dispatch<React.SetStateAction<DeliveryDetailsResponse[]>>;
  getUnits: any;
};

const TableProduct = (props: Props) => {
  const { t }: any = useTranslation();
  const [loading, setloading] = useState<boolean>(false);
  const [dataInit, setdataInit] = useState<DeliveryDetailsResponse[]>([]);
  const [dataReturn, setDataReturn] = useState<DeliveryDetailsResponse[]>([]);
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(false);

  useEffect(() => {
    if (props?.reset) {
      props.setReset(false);
      setdataInit([]);
      setNeedLoadNewData(true);
    }
  }, [props.reset]);

  useEffect(() => {
    // fill data list product
    if (props?.data?.length) {
      props.getProducts({ size: 9999 }).then((res) => {
        props?.data.map((m) => {
          return (m.itemCode = res.content.find((f: any) => f.id === m.tradingProductId).itemCode);
        });
      });
      setdataInit(props?.data);
      setNeedLoadNewData(true);
    }
  }, [props.data]);

  const handleSetData = (newData) => {
    try {
      if (newData.length) {
        setDataReturn(newData);
        props.setData(newData);
        props.setDirty(true);
        if (!props.data && newData.length) props.setDirty(true);
        const keys1 = Object.keys(dataInit);
        for (let key of keys1) {
          if (dataInit[key] !== newData[key]) {
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
      fetchData: {
        action: props.getProducts,
        value: 'id',
        label: 'name'
      },
      fillOtherField: (newValues, oldValues, object) => {
        if (newValues.tradingProductId !== oldValues.tradingProductId) {
          newValues.itemCode = object.itemCode;
          newValues.unitPrice = object.price;
          newValues.productName = object.name;
        }
        return newValues;
      }
    },
    {
      title: t('item_code'),
      dataIndex: 'itemCode',
      width: '200px',
      editable: true,
      type: 'selectApi',
      align: 'center',
      require: true,
      fetchData: {
        action: props.getProducts,
        value: 'itemCode',
        label: 'itemCode'
      },
      fillOtherField: (newValues, oldValues, object) => {
        if (newValues.itemCode !== oldValues.itemCode) {
          newValues.tradingProductId = object.id;
          newValues.unitPrice = object.price;
          newValues.productName = object.name;
        }
        return newValues;
      }
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      width: '100px',
      editable: true,
      type: 'selectApi',
      require: true,
      align: 'center',
      fetchData: {
        action: props.getUnits,
        value: 'name',
        label: 'name'
      }
    },

    {
      title: t('quantity_order'),
      dataIndex: 'orderedQuantity',
      width: '80px',
      align: 'center',
      editable: true,
      require: true,
      type: 'number'
    },
    {
      title: t('quantity_real'),
      dataIndex: 'deliveriedQuantity',
      width: '80px',
      align: 'center',
      editable: true,
      require: true,
      type: 'number'
    },
    {
      title: t('variance'),
      dataIndex: 'variance',
      width: '80px',
      editable: false,
      align: 'center',
      render: (cell, row) => {
        return row.deliveriedQuantity >= 0 && row.orderedQuantity >= 0 ? (
          <span>{Math.abs(row.deliveriedQuantity - row.orderedQuantity)}</span>
        ) : (
          '-'
        );
      }
    },
    {
      title: t('note'),
      dataIndex: 'note',
      width: '280px',
      align: 'center',
      editable: true
    }
  ];

  return (
    <React.Fragment>
      <div className="d-print-none">
        <ATableEditable
          noTitle
          scrollX={1200}
          loading={loading}
          columns={columns}
          dataSource={dataInit}
          needLoadNewData={needLoadNewData}
          setNeedLoadNewData={setNeedLoadNewData}
          setDataSource={handleSetData}
        />
      </div>
      <div className="d-none d-print-block">
        <AntTable columns={columns} data={dataReturn} />
      </div>
    </React.Fragment>
  );
};

export default connect(null, {
  getProducts: tradingProductActions.getTradingProduct,
  getUnits: unitActions.getUnits
})(TableProduct);
