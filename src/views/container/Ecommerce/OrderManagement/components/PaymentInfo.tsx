import { Col, Form, FormInstance, Radio, RadioChangeEvent, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE } from '~/configs';
import Divider from '~/views/presentation/divider';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import { PAYMENT_TYPE } from '../Types';
import { MInputNumberStyled } from './styled';

interface PaymentInfoProps {
  form: FormInstance<any>;
  dataPayment: String;
  setDataPaymet: React.Dispatch<any>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  subtotal: number;
  viewPage: any;
  notAllowEditInfo: any;
  orderCreateOnApp: Boolean;
  dataOrder: any;
  dataInit: Array<any>;
  promotionDiscount: number;
  couponDiscount: number;
  setCouponDiscount: React.Dispatch<React.SetStateAction<number>>;
  shippingFee: number;
  setShippingFee: React.Dispatch<React.SetStateAction<number>>;
  couponCodeList: any;
}

const PaymentInfo: React.FC<PaymentInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const couponCodeWatch = Form.useWatch('couponCode', props.form);

  const onChange = (e: RadioChangeEvent) => {
    props.setDataPaymet(e.target.value);
  };

  // if product list empty
  useEffect(() => {
    if (props.dataOrder?.length === 0 && props.dataInit?.length === 0) {
      props.form.setFieldsValue({ couponCode: '', shippingFee: 0 });
      props.setCouponDiscount(0);
      props.setShippingFee(0);
    }
  }, [props.dataOrder, props.dataInit]);

  // calculate coupon discount
  useEffect(() => {
    if (couponCodeWatch) {
      const couponCode = props.couponCodeList.find((item) => item.couponCode === couponCodeWatch);
      props.setCouponDiscount(handleCouponCode(couponCode));
    } else {
      props.setCouponDiscount(0);
    }
  }, [couponCodeWatch]);

  // calculate total
  useEffect(() => {
    const newTotal = props.subtotal - props.couponDiscount - props.promotionDiscount;

    props.setTotal(newTotal <= 0 ? props.shippingFee || 0 : newTotal + (props.shippingFee || 0));
  }, [props.subtotal, props.couponDiscount, props.shippingFee]);

  function handleCouponCode(couponCode) {
    switch (couponCode?.type) {
      case 'CASH':
        return couponCode?.discount;
      case 'TRADE':
        if (couponCode?.maxDiscount) {
          const couponDiscount = props.subtotal * (couponCode?.discount / 100);
          return couponDiscount <= couponCode?.maxDiscount ? couponDiscount : couponCode?.maxDiscount;
        } else return props.subtotal * (couponCode?.discount / 100);
      default:
        return 0;
    }
  }

  return (
    <Col xs={24} sm={24} md={24} lg={24}>
      <LayoutForm title={t('payment_info')} description={t('payment_info_des')}>
        <Row>
          <Col xs={24} sm={24} md={11} lg={11}>
            <Radio.Group onChange={onChange} value={props.dataPayment}>
              {/* <Row>
              <Radio disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp} value={PAYMENT_TYPE.TYPE_PRIMARY}>
                {t('payment_by_card')}
              </Radio>{' '}
            </Row> */}
              <Row>
                <Radio disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp} value={PAYMENT_TYPE.TYPE_SUCCESS}>
                  {' '}
                  {t('cash_payment')}
                </Radio>{' '}
              </Row>
              <Row>
                <Radio disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp} value={PAYMENT_TYPE.TYPE_INFO}>
                  {' '}
                  {t('transfer_payments')}
                </Radio>{' '}
              </Row>
            </Radio.Group>

            <Row>
              <MInputNumberStyled
                className="pt-1 w-100"
                require={false}
                colon={false}
                labelAlign="left"
                label={t('reference_code')}
                noPadding
                disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
                controls={false}
                customLayout="w-100"
                name="referenceCode"
                hasFeedback={false}
                formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              />
            </Row>
          </Col>
          <Col xs={24} sm={24} md={2} lg={2} />
          <Col xs={24} sm={24} md={11} lg={11}>
            <div className="row d-flex justify-content-between">
              <div className="col-6">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {t('subtotal_price')}{' '}
                </ATypography>
              </div>
              <div className="col-6 text-right ">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {numberFormatDecimal(+props.subtotal, ' đ', '')}{' '}
                </ATypography>
              </div>
            </div>
            <Row>
              <MSelect
                className="mt-1 w-100"
                colon={false}
                labelAlign="left"
                label={t('couponCode')}
                placeholder={t('couponCode')}
                noPadding
                require={false}
                allowClear
                customLayout="w-100"
                searchCorrectly={false}
                disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
                name="couponCode"
                options={(props.couponCodeList || []).map((o: any) => {
                  return {
                    value: o.couponCode,
                    search: o.couponCode,
                    label: o.couponCode
                  };
                })}
              />
            </Row>
            <Row>
              <MInputNumberStyled
                className="mt-2 w-100"
                require={false}
                labelAlign="left"
                noPadding
                defaultValue={0}
                customLayout="w-100"
                hasFeedback={false}
                colon={true}
                name="shippingFee"
                label={t('shipping_fee')}
                placeholder={t('shipping_fee')}
                disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
              />
            </Row>
            <div className="row mt-5 justify-content-between d-flex">
              <div className="col-6">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {t('total_discount')}{' '}
                </ATypography>
              </div>
              <div className="col-6 text-right">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {numberFormatDecimal(props.couponDiscount + props.promotionDiscount, ' đ', '')}
                </ATypography>
              </div>
            </div>
            <Divider />
            <div className="row justify-content-between d-flex">
              <div className="col-6">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {t('total_price')}{' '}
                </ATypography>
              </div>
              <div className="col-6 text-right">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {' '}
                  {numberFormatDecimal(+props.total, ' đ', '')}{' '}
                </ATypography>
              </div>
            </div>
          </Col>
        </Row>
      </LayoutForm>
    </Col>
  );
};

export default PaymentInfo;
