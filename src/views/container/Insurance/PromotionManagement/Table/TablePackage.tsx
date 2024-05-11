import { Radio } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { GENERAL_TYPE } from '~/configs/const';
import { CONVERSION_UNIT, DISCOUNT_UNIT } from '~/configs/type/promotionType';
import { appDataActions } from '~/state/ducks/appData';
import { packageActions } from '~/state/ducks/insurance/package';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';

const TablePackage = (props: { data?: any; getPackage: any; setData: React.Dispatch<React.SetStateAction<any>>; getGeneralType: any }) => {
  const { t }: any = useTranslation();
  const [dataSource, setDataSource] = useState<any>([]);
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(false);

  useEffect(() => {
    // fill package data
    if (props?.data) {
      setDataSource(props.data);
      setNeedLoadNewData(true);
    }
  }, [props.data]);

  const handleSetData = (newData) => {
    try {
      props.setData(newData);
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
      title: t('package_id'),
      dataIndex: 'insurancePackageId',
      width: '100px',
      align: 'center',
      editable: true,
      type: 'selectApi',
      require: true,
      fetchData: {
        action: props.getPackage,
        value: 'id',
        label: 'id'
      },
      unique: true,
      fixDataUnique: (oldValues: any) => {
        return { ...oldValues, insurancePackageId: null, insurancePackageName: null };
      },
      fillOtherField: (newValues: any, oldValues: any, object: any) => {
        if (newValues.insurancePackageId !== oldValues.insurancePackageId) {
          newValues.insurancePackageName = object.name;
        }
        return newValues;
      }
    },
    {
      title: t('package_name'),
      dataIndex: 'insurancePackageName',
      width: '200px',
      align: 'center',
      editable: true,
      type: 'selectApi',
      require: true,
      unique: true,
      fixDataUnique: (oldValues: any) => {
        return { ...oldValues, insurancePackageId: null, insurancePackageName: null };
      },
      fillOtherField: (newValues: any, oldValues: any, object: any) => {
        if (newValues.insurancePackageName !== oldValues.insurancePackageName) {
          newValues.insurancePackageId = object.id;
        }
        return newValues;
      },
      fetchData: {
        action: props.getPackage,
        value: 'name',
        label: 'name'
      }
    },
    {
      title: t('insuranceYear'),
      dataIndex: 'minQuantity',
      width: '100px',
      align: 'center',
      editable: true,
      type: 'selectApi',
      require: true,
      fetchData: {
        action: props.getGeneralType,
        params: { type: GENERAL_TYPE.AAA_INSURANCE_EFFECT_YEAR },
        value: 'name',
        label: 'name'
      }
    },
    {
      title: t('limit'),
      dataIndex: 'quantityLimit',
      width: '80px',
      align: 'center',
      editable: true,
      require: true,
      type: 'number'
    },
    {
      title: t('discount_value'),
      dataIndex: 'discount',
      width: '100px',
      align: 'center',
      editable: true,
      require: true,
      type: 'number'
    },
    {
      title: t('discount_unit'),
      dataIndex: 'discountType',
      width: '140px',
      align: 'center',
      editable: true,
      require: true,
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
      dataSource={dataSource}
      needLoadNewData={needLoadNewData}
      setNeedLoadNewData={setNeedLoadNewData}
      setDataSource={handleSetData}
    />
  );
};

export default connect(null, {
  getPackage: packageActions.getPackage,
  getGeneralType: appDataActions.getGeneralType
})(TablePackage);
