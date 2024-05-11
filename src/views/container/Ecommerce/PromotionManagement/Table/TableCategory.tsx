import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Radio } from 'antd/es';
import { DISCOUNT_UNIT, CONVERSION_UNIT } from '~/configs/type/promotionType';
import { useTranslation } from 'react-i18next';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';
import { categoryActions } from '~/state/ducks/categories';
import { CategorieDiscountResponse } from '~/state/ducks/promotion/actions';

const TableCategory = (props: {
  data?: CategorieDiscountResponse[];
  getCategories: any;
  setdata: React.Dispatch<React.SetStateAction<CategorieDiscountResponse[]>>;
}) => {
  const { t }: any = useTranslation();
  const [DataSource, setDataSource] = useState<CategorieDiscountResponse[]>([]);
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(false);

  useEffect(() => {
    // fill data list category
    if (props?.data) {
      setDataSource(props.data);
      setNeedLoadNewData(true);
    }
  }, [props.data]);

  const handleSetData = (newData) => {
    try {
      props.setdata(newData);
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
      title: t('category_name'),
      dataIndex: 'categoryName',
      width: '200px',
      align: 'center',
      editable: true,
      type: 'selectApi',
      require: true,
      unique: true,
      fixDataUnique: (oldValues: CategorieDiscountResponse) => {
        return { ...oldValues, categoryId: null, categoryName: null };
      },
      fillOtherField: (newValues: CategorieDiscountResponse, oldValues: CategorieDiscountResponse, object: any) => {
        if (newValues.categoryName !== oldValues.categoryName) {
          newValues.categoryId = object.id;
        }
        return newValues;
      },
      fetchData: {
        action: props.getCategories,
        value: 'name',
        label: 'name'
      }
    },
    {
      title: t('category_code'),
      dataIndex: 'categoryId',
      width: '80px',
      align: 'center',
      editable: true,
      type: 'selectApi',
      require: true,
      fetchData: {
        action: props.getCategories,
        value: 'id',
        label: 'id'
      },
      unique: true,
      fixDataUnique: (oldValues: CategorieDiscountResponse) => {
        return { ...oldValues, categoryId: null, categoryName: null };
      },
      fillOtherField: (newValues: CategorieDiscountResponse, oldValues: CategorieDiscountResponse, object: any) => {
        if (newValues.categoryId !== oldValues.categoryId) {
          newValues.categoryName = object.name;
        }
        return newValues;
      }
    },
    {
      title: t('min_value'),
      dataIndex: 'minQuantity',
      width: '100px',
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
      dataSource={DataSource}
      needLoadNewData={needLoadNewData}
      setNeedLoadNewData={setNeedLoadNewData}
      setDataSource={handleSetData}
    />
  );
};

export default connect(null, {
  getCategories: categoryActions.getCategories
})(TableCategory);
