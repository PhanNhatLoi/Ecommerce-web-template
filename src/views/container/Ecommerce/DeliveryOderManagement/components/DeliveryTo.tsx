import { FormInstance, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';
import { AddressType } from '~/state/ducks/carAccessories/deliveryOrders/actions';
import { customerActions } from '~/state/ducks/customer';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';

import * as Types from '../Type';

const BorderStyled = styled.div`
  border: 1px solid;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  padding: 10px;
  padding-left: 0px;
  .title {
    font-weight: bold;
    font-size: 17px;
    margin: 20px;
  }
`;

const DeliveryTo = (props: Props) => {
  const { t }: any = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState<Types.AddressNeedLoadType>();

  useEffect(() => {
    if (props?.addressInfor) {
      const data = props.addressInfor;
      props.form.setFieldsValue({
        // address
        country1: data.countryId,
        address1: data.address,
        province: data.provinceId,
        zipCode: data.zipCode,
        district: data.districtId,
        ward: data.wardsId,
        code_to: data.countryId
      });
      setAddressNeedLoad({
        country: data.countryId,
        state: data.state,
        province: data.provinceId,
        district: data.districtId,
        ward: data.wardsId
      });
    }
  }, [props.addressInfor]);

  useEffect(() => {
    if (props.buyerProfileId) {
      props.form.setFieldsValue({
        customer: props.buyerProfileId
      });
      handleChangeId(props.buyerProfileId);
    }
  }, [props.buyerProfileId]);

  const handleChangeId = (e) => {
    if (e) {
      setIsLoading(true);
      props.getCustomerDetail(e).then((res) => {
        const response = res?.content;
        const address = response?.address;
        const addressName = `${address?.address} ${address?.fullAddress}`.trim();

        props.form.setFieldsValue({
          email_to: response.email,
          phone_number_to: response.phone,
          code_to: response.country?.id,
          // address
          country1: address?.countryId,
          address1: addressName,
          province: address?.provinceId,
          zipCode: address?.zipCode,
          district: address?.districtId,
          ward: address?.wardsId
        });
        setAddressNeedLoad({
          country: address?.countryId,
          state: address?.stateId,
          province: address?.provinceId,
          district: address?.districtId,
          ward: address?.wardsId
        });
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="delivery-content col-lg-6 mt-lg-0 mt-1">
      <BorderStyled>
        <span className="title col-12 p-0">{t('delivery_to')}</span>
        <div className="col-lg-12 col-md-6">
          <MSelect
            require
            label={t('customer_name')}
            name="customer"
            placeholder={t('customer_name')}
            noLabel
            noPadding
            fetchData={props.getCustomers}
            params={{ businessType: CUSTOMER_BUSINESS_TYPE.SUPPLIER }}
            valueProperty="profileId"
            labelProperty="fullname"
            onChange={handleChangeId}
          />
        </div>
        <div className="col-lg-12 col-md-6">
          <MSelect
            require
            label={t('customer_code')}
            name="customer"
            placeholder={t('customer_code')}
            noLabel
            noPadding
            fetchData={props.getCustomers}
            params={{ businessType: CUSTOMER_BUSINESS_TYPE.SUPPLIER }}
            valueProperty="profileId"
            labelProperty="code"
            onChange={handleChangeId}
          />
        </div>
        <Skeleton className="p-10" active loading={isLoading}>
          <div className="col-lg-12 col-md-6">
            <MInputAddress
              form={props.form}
              label={t('address')}
              name="addressInfo"
              needLoadData={addressNeedLoad}
              noLabel
              noPadding
              require={true}
              hasRegisterLayout
              codeInputStyle={{ paddingTop: '0.5px' }}
              setNeedLoadData={setAddressNeedLoad}
            />
          </div>
          <div className="col-lg-12 col-md-6">
            <MInputPhone //
              label={t('phone')}
              labelAlign="left"
              customName="phone_number_to"
              noLabel
              require
              noPadding
              code="code_to"
              placeholder={t('phone_number')}
              phoneTextTranslate={'1px'}
            />
          </div>
          <div className="col-lg-12 col-md-6">
            <MInput //
              require={false}
              noLabel
              noPadding
              type="email"
              label={t('Email')}
              name="email_to"
              placeholder={t('')}
            />
          </div>
        </Skeleton>
      </BorderStyled>
    </div>
  );
};

type Props = {
  getCustomers: any;
  getCustomerDetail: any;
  buyerProfileId?: number;
  form: FormInstance<any>;
  addressInfor?: AddressType;
};

export default connect(null, {
  getCustomers: customerActions.getCustomers,
  getCustomerDetail: customerActions.getCustomerDetail
})(DeliveryTo);
