import { FormInstance } from 'antd/es';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { MInput, MInputPhone } from '~/views/presentation/fields/input';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';

import * as Types from '../Type';

export const DeliveryFrom = (props: Props) => {
  const { t }: any = useTranslation();

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

  useEffect(() => {
    props.form.setFieldsValue({
      code_from: 241
    });
  }, []);
  return (
    <div className="delivery-content col-lg-6">
      <BorderStyled>
        <span className="title">{t('delivery_from')}</span>
        <div className="col-12">
          <span>{t('company')} </span>
          <span style={{ fontSize: '17px' }}>{props?.companyInfor?.fullName}</span>
          <p />
          <span>
            {t('address')} : {props?.companyInfor?.address?.fullAddress}
          </span>
          <p />
          <span>
            {t('phone_number')} :{' '}
            {props?.companyInfor?.phone
              ? formatPhoneWithCountryCode(
                  props?.companyInfor?.phone,
                  props?.companyInfor?.phone?.startsWith('84') ? 'VN' : props?.companyInfor?.phone?.startsWith('1') ? 'US' : 'VN'
                )
              : ''}
          </span>
          <p />
        </div>
        <div className="col-lg-12 col-md-6">
          <MInput //
            require
            noLabel
            noPadding
            label={t('deliver')}
            name="deliver"
            placeholder={t('')}
          />
        </div>
        <div className="col-lg-12 col-md-6">
          <MInput //
            require={false}
            noLabel
            noPadding
            label={t('vehicle')}
            name="vehicle_from"
            placeholder={t('')}
          />
        </div>
        <div className="col-lg-12 col-md-6">
          <MInputPhone //
            label={t('phone')}
            labelAlign="left"
            customName="phone_number_from"
            noLabel
            code="code_from"
            require
            noPadding
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
            name="email_from"
            placeholder={t('')}
          />
        </div>
      </BorderStyled>
    </div>
  );
};

type Props = {
  form: FormInstance<any>;
  companyInfor?: Types.companyInforType;
};

export default connect(null, {})(DeliveryFrom);
