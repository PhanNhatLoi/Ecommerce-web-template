import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { SALE_ORDER_STATUS } from '~/configs/status/car-accessories/saleOrderStatus';
import { DeliveryBodyResponse } from '~/state/ducks/carAccessories/deliveryOrders/actions';
import { orderActions } from '~/state/ducks/carAccessories/order';
import { MInput } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import { UtilDate } from '~/views/utilities/helpers';

const DateInputStyled = styled.div`
  padding-top: 9px;
  .date {
    border-bottom: 1px solid;
    font-size: 12px;
    margin-top: 15px;
    padding: 5px;
  }
`;

type Props = {
  data?: DeliveryBodyResponse;
  getOrders: any;
  handleFillData: (value: string) => void;
  setOrderData: any;
  orderData: any;
};

const DeliveryLicense = (props: Props) => {
  const { t }: any = useTranslation();

  useEffect(() => {
    props
      .getOrders({ size: 99999 })
      .then((res) => {
        const response = res?.content;
        props.setOrderData(
          response.filter((order) =>
            [SALE_ORDER_STATUS.ACCEPTED, SALE_ORDER_STATUS.VIETTEL_POST_PENDING, SALE_ORDER_STATUS.PACKAGED].includes(order.status)
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <LayoutForm title={t('license_code')} description={t('license_code_des')}>
      <div className="row justify-content-end">
        <div className="col-4">
          <DateInputStyled>
            <div style={{ fontSize: 12 }}>{t('date')}</div>
            <div className="date">{UtilDate.toDateLocal(Date.now())}</div>
          </DateInputStyled>
        </div>
        <div className="col-4">
          <MInput //
            readOnly={props?.data}
            require
            noPadding
            noLabel
            label={t('gdn_no')}
            name="gdnNo"
            placeholder={t('')}
          />
        </div>
      </div>
      <div className="row justify-content-end">
        <div className="col-4">
          {props?.data ? (
            <MInput //
              readOnly={true}
              noLabel
              require
              noPadding
              label={t('so_no')}
              name="soNo"
              placeholder={t('search_so')}
            />
          ) : (
            <MSelect
              name="soNo"
              noLabel
              noPadding
              require
              label={t('so_no')}
              placeholder={t('search_so')}
              onChange={props.handleFillData}
              searchCorrectly={false}
              options={(props.orderData || []).map((o: any) => {
                return {
                  value: o.code,
                  search: o.code,
                  label: o.code
                };
              })}
            />
          )}
        </div>
      </div>
    </LayoutForm>
  );
};

export default connect(null, {
  getOrders: orderActions.getSalesOrders
})(DeliveryLicense);
