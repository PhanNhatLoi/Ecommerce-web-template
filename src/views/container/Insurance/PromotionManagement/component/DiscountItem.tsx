import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DISCOUNT_UNIT } from '~/configs/type/promotionType';
import { packageActions } from '~/state/ducks/insurance/package';

import TableCategory from '../Table/TablePackage';
import { Checkbox } from 'antd/es';

const LineContinerStyled = styled.div`
  overflow: hidden;
  position: relative;
  padding-left: 8px;

  &:before {
    content: '';
    border-left: 1px solid #0094ff;
    position: absolute;
    height: 100%;
  }
`;

const DiscountItem = (props: {
  data?: any;
  getPackage: any;
  itemPackage: any;
  setItemPackage: React.Dispatch<React.SetStateAction<any>>;
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t }: any = useTranslation();
  const [indeterminatePackage, setIndeterminatePackage] = useState<boolean>(false);
  const [allItem, setAllItem] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [packages, setPackages] = useState<any>([]);
  const [fillData, setFillData] = useState<boolean>(false);

  useEffect(() => {
    if (props?.data) {
      setDataTable(props?.data?.insurancePackages);
    }
  }, [props?.data]);

  useEffect(() => {
    props
      .getPackage({ size: 9999 })
      .then((res) => {
        setPackages(res?.content);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // check all and uncheck all
    if (props.itemPackage) {
      setIndeterminatePackage(!!props.itemPackage.length && props.itemPackage.length < packages.length);
      setAllItem(!(props.itemPackage.length !== packages.length || !props.itemPackage.length));
    }
  }, [props.itemPackage, packages]);

  useEffect(() => {
    // reset data on table
    if (props.reset) {
      setDataTable([]);
      setAllItem(false);
      props?.setReset(false);
    }
  }, [props?.reset]);

  useEffect(() => {
    // when checked checkbox all
    if (fillData) {
      setFillData(false);
      if (allItem) {
        // all categories
        let arr: any = props.itemPackage;
        let filterData: any[] = packages;
        props.itemPackage.map((m: any) => {
          filterData = filterData.filter((f) => f.id !== m.insurancePackageId);
        });
        filterData.map((e: any) => {
          const item = {
            insurancePackageId: e.id,
            insurancePackageName: e.name,
            minQuantity: 1,
            quantityLimit: 1,
            discount: 0,
            discountType: DISCOUNT_UNIT.CASH
          };
          arr.push(item);
        });
        setDataTable(arr);
      } else setDataTable([]);
    }
  }, [allItem]);

  return (
    <div>
      <div style={{ display: 'flex' }} className="mt-5">
        <span className="pr-5">{t('discount_insurance_package')}</span>
        <div>
          <Checkbox
            indeterminate={indeterminatePackage}
            checked={allItem}
            onChange={(e) => {
              setFillData(true);
              setAllItem(e.target.checked);
            }}>
            {t('all')}
          </Checkbox>
        </div>
      </div>
      <TableCategory data={dataTable} setData={(e) => props.setItemPackage(e)} />
    </div>
  );
};

export default connect(null, {
  getPackage: packageActions.getPackage
})(DiscountItem);
