import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';
import { promotionActions } from '~/state/ducks/promotion';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { unitActions } from '~/state/ducks/units';
import { DISCOUNT_UNIT, CONVERSION_UNIT } from '~/configs/type/promotionType';
import { Radio } from 'antd/es';
import AntTable from '~/views/presentation/ui/table/AntTable';
import { UtilDate } from '~/views/utilities/helpers';
import { arInvoiceActions } from '~/state/ducks/ar_invoice';
import { Unit } from '~/state/ducks/items/actions';
import { DeliveryDetail, DeliveryOrderType } from '~/state/ducks/ar_invoice/actions';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type TableARInvoiceProps = {
  getUnits: any;
  getPromotionDetail: any;
  getDeliveryOrder: any;
  resestField: any;
  setResestField: (value: boolean) => void;
  data: [];
  setData: any;
};

const TableARInvoice: React.FC<TableARInvoiceProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setloading] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<DeliveryOrderType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [dataInit, setdataInit] = useState<DeliveryDetail[]>([]);

  const [dataReturn, setDataReturn] = useState([]);
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(false);
  let dataArray: DeliveryDetail[] = [];

  const orderDetail = orderList?.map((o) => {
    const secondValue = o.deliveryDetails.map((e) => {
      return {
        deliveryId: o.id,
        createdDate: o.createdDate,
        ...e
      };
    });
    const thirdValue = Object.assign({}, ...secondValue);
    dataArray.push(thirdValue);
  });

  useEffect(() => {
    props
      .getDeliveryOrder()
      .then((res) => setOrderList(res?.content))
      .catch((err) => console.error('err effect line 43', err));

    props
      .getUnits()
      .then((res: { content: React.SetStateAction<Unit[]> }) => setUnits(res?.content))
      .catch((err) => console.error('err effect line 48', err));
  }, []);

  useEffect(() => {
    if (props?.resestField) {
      props.setResestField(false);
      setdataInit([]);
      setNeedLoadNewData(true);
    }
  }, [props.resestField]);

  useEffect(() => {
    // fill data list product
    if (props.data) {
      let initData = props.data;

      let valueArray: any = [];
      const newData = initData.map((e: any) => {
        const secondArray = e.map((o) => {
          return {
            ...o
          };
        });

        const thirdArray = Object.assign({}, ...secondArray);

        valueArray.push(thirdArray);
        setdataInit(secondArray);
      });
      setNeedLoadNewData(true);
    }
  }, [props.data]);

  const handleSetData = (newData) => {
    try {
      props.setData(newData);
      setDataReturn(newData);
    } catch (err) {
      console.error(`~ file: Form.js ~ handleSetDatas ~ err`, err);
    }
  };
  const columns = [
    {
      title: t('STT'),
      dataIndex: 'key',
      width: '70px',
      align: 'center',
      render: (cell, row, index) => {
        return ++index;
      }
    },
    {
      title: t('product_name'),
      dataIndex: 'productName',
      width: '350px',
      type: 'select',
      editable: true,
      align: 'center',
      options: dataArray.map((o) => {
        // fix product name
        return {
          value: o['productName'],
          search: o['productName'],
          label: o['productName']
        };
      }),
      fillOtherField: (newValues, oldValues) => {
        if (newValues.productName !== oldValues.productName) {
          const findValue = dataArray.find((f: any) => f.productName === newValues.productName) as any;
          newValues.tradingProductId = findValue.tradingProductId;
          newValues.quantity = findValue.deliveriedQuantity;
          newValues.note = findValue.note;
          newValues.unit = findValue.unit;
          newValues.unitPrice = findValue.unitPrice;
        }
        return newValues;
      }
    },
    {
      title: t('trading_product_id'),
      dataIndex: 'tradingProductId',
      width: '200px',
      editable: true,
      type: 'select',
      align: 'center',
      options: dataArray.map((o) => {
        // fix product name
        return {
          value: o['tradingProductId'],
          search: o['tradingProductId'],
          label: o['tradingProductId']
        };
      }),
      fillOtherField: (newValues, oldValues) => {
        if (newValues.tradingProductId !== oldValues.tradingProductId) {
          const findValue = dataArray.find((f: any) => f.tradingProductId === newValues.tradingProductId) as any;
          newValues.productName = findValue.productName;
          newValues.quantity = findValue.deliveriedQuantity;
          newValues.note = findValue.note;
          newValues.unit = findValue.unit;
          newValues.unitPrice = findValue.unitPrice;
        }
        return newValues;
      }
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      width: '120px',
      align: 'center',
      type: 'select',
      editable: true,
      options: units.map((o) => {
        // fix product name
        return {
          value: o['name'],
          search: o['name'],
          label: o['name']
        };
      })
    },
    {
      title: t('unit_price'),
      dataIndex: 'unitPrice',
      width: '150px',
      align: 'center',
      editable: true,
      type: 'number',
      render: (cell, record) => {
        record.total = record?.quantity * (record?.unitPrice | 1000) + ((record?.quantity * record?.unitPrice) / 100) * record.vat || '';
        return cell;
      }
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      width: '150px',
      align: 'center',
      editable: true,
      type: 'number'
    },
    {
      title: t('vat'),
      dataIndex: 'vat',
      width: '100px',
      align: 'center',
      require: true,
      editable: true,
      maxNumber: 100,
      type: 'number',
      render: (cell, record) => {
        // return ((record?.quantity * record?.unitPrice) / 100) * 10 || '';
        return cell;
      }
    },
    {
      title: t('total_money'),
      dataIndex: 'total',
      width: '150px',
      align: 'center',
      editable: false,
      type: 'number',
      render: (cell, record) => {
        // return record?.quantity * record?.unitPrice + ((record?.quantity * record?.unitPrice) / 100) * 10 || '';
        return numberFormatDecimal(cell, ' đ', '');
      }
    },
    {
      title: t('note'),
      dataIndex: 'note',
      width: '200px',
      align: 'center',
      editable: true
    }
  ];

  return (
    <React.Fragment>
      <div className="d-print-none">
        <ATableEditable
          noTitle
          noActionBtn
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
  getUnits: unitActions.getUnits,
  getPromotionDetail: promotionActions.getPromotionDetail,
  getDeliveryOrder: arInvoiceActions.getDeliveryOrder
})(TableARInvoice);
