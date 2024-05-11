import { Radio, Space } from 'antd/es';
import { head } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PAYMENT_GATEWAY } from '~/configs/const';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput } from '~/views/presentation/fields/input';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

const PaymentInfoWrapper = styled.div`
  border: 1px solid #000;
  padding: 24px 16px;
`;

const PaymentInfoTitle = styled.span`
  background: #fff;
  top: -12px;
  position: absolute;
  left: 46px;
  padding: 0px 8px;
`;

type OrderPaymentProps = { formValues: any };

const OrderPayment: React.FC<OrderPaymentProps> = (props) => {
  const { t }: any = useTranslation();

  const BillItem = ({ label, value, isRedText = false }: any) => {
    return (
      <div className="row mb-5">
        <div className="col-4">
          <ATypography strong>{label}</ATypography>
        </div>
        <div className="col-2"></div>
        <div className="col-6 text-right">
          <ATypography strong type={isRedText ? 'danger' : undefined}>
            {value}
          </ATypography>
        </div>
      </div>
    );
  };

  return (
    <div className="row" style={{ marginTop: '40px !important' }}>
      <div className="col-12 col-lg-5 mt-5 mb-10" style={{ position: 'relative' }}>
        <PaymentInfoTitle>{t('payment_info')}</PaymentInfoTitle>
        <PaymentInfoWrapper>
          <Radio.Group className="mb-5" onChange={() => {}} value={props?.formValues?.paymentGateway} disabled>
            <Space direction="vertical">
              <Radio value={PAYMENT_GATEWAY.BANK_TRANSFER}>{t('bank_transfer')}</Radio>
              <Radio value={PAYMENT_GATEWAY.CASH}>{t('cash')}</Radio>
            </Space>
          </Radio.Group>

          <MDatePicker //
            noLabel
            labelCol={{ offset: 0 }}
            noPadding
            require={false}
            hasFeedback={false}
            disabled
            label={t('payment_date')}
            placeholder={t('no_data')}
            name="paymentDate"
          />
          <MInput //
            noLabel
            hasFeedback={false}
            labelCol={{ offset: 0 }}
            noPadding
            require={false}
            disabled
            label={t('reference_id')}
            placeholder={t('no_data')}
            name="referenceId"
          />
        </PaymentInfoWrapper>
      </div>
      <div className="col-12 col-lg-1"></div>
      <div className="col-12 col-lg-6">
        <BillItem
          label={`${t('Subtotal')}:`}
          value={<h5>{numberFormatDecimal(head(props.formValues?.orderDetails)?.unitPrice || 0, ' đ', '')}</h5>}
        />
        {/* {orderDetail?.quotationApplyDiscount?.giftApplyDiscount && ( */}
        <BillItem
          label={`${t('voucher')}:`}
          value={props.formValues?.discount ? `- ${numberFormatDecimal(props.formValues?.discount || 0, ' đ', '')}` : t('no_data')}
          isRedText={Boolean(props.formValues?.discount)}
        />
        {/* )} */}
        {/* {orderDetail?.quotationApplyDiscount?.promotionApplied && ( */}
        <BillItem
          label={`${t('Promotion')}:`}
          value={
            head(props.formValues?.orderDetails)?.discount
              ? `- ${numberFormatDecimal(head(props.formValues?.orderDetails)?.discount || 0, ' đ', '')}`
              : t('no_data')
          }
          isRedText={Boolean(head(props.formValues?.orderDetails)?.discount)}
        />
        {/* )} */}

        {/* <BillItem
        label={`${t('coupon')}:`}
        value={
          <Input.Group compact>
            <Input disabled style={{ width: 'calc(100% - 50px)' }} defaultValue="" />
            <AButton size="small" type="primary" disabled content={t('apply')}/
          </Input.Group>
        }
      /> */}

        <div className="col-12">
          <Divider />
        </div>
        <BillItem label={`${t('total')}:`} value={<h4>{numberFormatDecimal(props.formValues?.total || 0, ' đ', '')}</h4>} />
      </div>
    </div>
  );
};

export default connect(null, {})(OrderPayment);
