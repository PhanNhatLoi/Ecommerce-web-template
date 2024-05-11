import { Col } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE } from '~/configs';
import LayoutForm from '~/views/presentation/layout/forForm';
import ATypography from '~/views/presentation/ui/text/ATypography';

interface OrderInfoProps {
  orderInfoDetail: any;
}
const OrderInfo: React.FC<OrderInfoProps> = (props) => {
  const { t }: any = useTranslation();

  const Info = (props) => {
    return (
      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
        <span style={{ fontSize: '12px', fontWeight: 'normal', padding: '20px 0px' }}>
          <span>{props.text}</span> : <span>{props.data}</span>
        </span>
      </ATypography>
    );
  };
  return (
    <LayoutForm title={t('odrer_inf')} description={t('odrer_inf_des')}>
      <div className="row align-items-center mx-1">
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('Order code')} data={props.orderInfoDetail?.orderCode} />
        </Col>
        <Col xs={0} sm={0} md={1} lg={1} />
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('note_cancel')} data={props.orderInfoDetail?.cancelReason} />
        </Col>
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('Order time')} data={props.orderInfoDetail?.orderTime} />
        </Col>
        <Col xs={0} sm={0} md={1} lg={1} />
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('Payment time')} data={props.orderInfoDetail?.paymentTime} />
        </Col>
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('Ship time')} data={props.orderInfoDetail?.shipTime} />
        </Col>
        <Col xs={0} sm={0} md={1} lg={1} />
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('Complete time')} data={props.orderInfoDetail?.doneTime} />
        </Col>
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('status')} data={props.orderInfoDetail?.status} />
        </Col>
        <Col xs={0} sm={0} md={1} lg={1} />
        <Col xs={24} sm={24} md={11} lg={11}>
          <Info text={t('note')} data={props.orderInfoDetail?.note} />
        </Col>
      </div>
    </LayoutForm>
  );
};

export default OrderInfo;
