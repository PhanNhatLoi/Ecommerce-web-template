import { CloseOutlined } from '@ant-design/icons';
import { Col, Descriptions, Form, Radio, Row, Skeleton, Space } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PROMOTION_SERVICE_TYPE } from '~/configs';
import { orderActions } from '~/state/ducks/order';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import MRadio from '~/views/presentation/fields/Radio';
import MInput from '~/views/presentation/fields/input/Input';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import NewAuthFile from '~/views/presentation/ui/file/NewAuthFile';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import COLOR from '~/views/utilities/layout/color';

const PaymentInfoWrapper = styled.div`
  border: 1px solid ${COLOR.Black};
  padding: 24px 16px;

  .ant-radio-disabled + span {
    color: ${COLOR.Black};
  }
`;

const PaymenInfoTitle = styled.span`
  background: #fff;
  top: -12px;
  position: absolute;
  left: 46px;
  padding: 0px 8px;
`;

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [pageLoading, setPageLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [customerDetail, setCustomerDetail] = useState({});
  const [paymentForm] = Form.useForm();

  //----------------------------------------
  // FETCH DATA
  //----------------------------------------
  const fetch = ({ id, action, setData, showMessage = true }) => {
    setPageLoading(true);
    action(id)
      .then((res) => {
        setPageLoading(false);
        setData(res?.content);
      })
      .catch((err) => {
        console.error('trandev ~ file: ViewForm.js ~ line 49 ~ useEffect ~ err', err);
        showMessage && AMessage.error(t(err.message));
        setPageLoading(false);
      });
  };

  useEffect(() => {
    if (Boolean(props.id)) {
      fetch({
        id: props.id,
        action: props.getOrderDetail,
        setData: setOrderDetail
      });
      fetch({
        id: props.id,
        action: props.getPaymentInfo,
        setData: setPaymentInfo,
        showMessage: false
      });
    }
  }, [props.id]);

  useEffect(() => {
    if (Boolean(orderDetail?.requesterId)) {
      fetch({
        id: orderDetail?.requesterId,
        action: props.getConsumerDetail,
        setData: setCustomerDetail
      });
    }
  }, [orderDetail]);

  useEffect(() => {
    paymentForm.setFieldsValue({
      paymentDate: moment(paymentInfo?.createdDate),
      referenceId: paymentInfo?.orderId
    });
  }, [paymentInfo]);
  //----------------------------------------
  // FETCH DATA
  //----------------------------------------

  const BillItem = ({ label, value }) => {
    return (
      <div className="row mb-5">
        <div className="col-4">
          <ATypography strong>{label}</ATypography>
        </div>
        <div className="col-2"></div>
        <div className="col-6 text-right">
          <ATypography strong>{value}</ATypography>
        </div>
      </div>
    );
  };

  const descriptionLabelStyles = {
    color: 'rgba(0,0,0,0.5)',
    width: '80px !important',
    verticalAlign: 'top',
    fontSize: '12px',
    paddingBottom: '5px',
    paddingTop: '5px'
  };

  const descriptionContentStyles = {
    fontSize: '12px',
    paddingBottom: '5px',
    paddingTop: '5px'
  };

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <div className="d-flex justify-content-between flex-wrap mb-5">
          <div>
            <AlignedDescription
              column={1}
              labelStyle={descriptionLabelStyles}
              contentStyle={descriptionContentStyles}
              colon={false}
              bordered>
              <Descriptions.Item label={`${t('order_id')}`}>
                <b>{orderDetail?.id || '-'}</b>
              </Descriptions.Item>
              <Descriptions.Item label={`${t('payment_method')}`}>
                <b>{orderDetail?.paymentGateway ? t(orderDetail?.paymentGateway) : '-'}</b>
              </Descriptions.Item>
            </AlignedDescription>
          </div>
        </div>
      </Skeleton>

      <Skeleton loading={pageLoading} active>
        <Row style={{ marginTop: '40px' }}>
          <Col md={24} lg={8}>
            <ATypography strong style={{ paddingLeft: '8px' }}>
              {t('general')}
            </ATypography>
            <AlignedDescription
              column={1}
              labelStyle={descriptionLabelStyles}
              contentStyle={descriptionContentStyles}
              colon={false}
              bordered>
              <Descriptions.Item label={t('order_date')}>
                {orderDetail?.createdDate ? UtilDate.toDateLocal(orderDetail?.createdDate) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('status')}>{orderDetail?.orderStatus ? t(orderDetail?.orderStatus) : '-'}</Descriptions.Item>
              <Descriptions.Item label={t('customer')}>
                {orderDetail?.requesterName ? (
                  <AButton type="link" className="pl-0">
                    {orderDetail?.requesterName}
                  </AButton>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
          <Col md={24} lg={8}>
            <ATypography strong style={{ paddingLeft: '8px' }}>
              {t('billing')}
            </ATypography>
            <br />
            <ATypography className="text-muted" style={{ paddingLeft: '8px' }}>
              {orderDetail?.requesterName}
            </ATypography>
            <br />
            <ATypography className="text-muted" style={{ paddingLeft: '8px' }}>
              {customerDetail?.address || ''}
            </ATypography>
            <AlignedDescription
              column={1}
              layout="vertical"
              labelStyle={{
                color: 'rgba(0,0,0,1)',
                width: '150px',
                verticalAlign: 'top',
                paddingTop: '5px',
                paddingBottom: '5px'
              }}
              colon={false}
              contentStyle={{ padding: 0 }}
              bordered>
              <Descriptions.Item label={`${t('email_address')}:`}>
                <AButton type="link" className="pl-0">
                  {customerDetail?.email || '-'}
                </AButton>
              </Descriptions.Item>
              <Descriptions.Item label={`${t('phone')}:`}>
                <AButton type="link" className="pl-0">
                  {customerDetail?.phone ? formatPhoneWithCountryCode(customerDetail?.phone, customerDetail?.country?.code) : '-'}
                </AButton>
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
          <Col md={24} lg={8}>
            <ATypography strong style={{ paddingLeft: '8px' }}>
              {t('car_repair_service_info')}
            </ATypography>
            <Row>
              <Col md={24} lg={12}>
                <AlignedDescription
                  column={1}
                  layout="vertical"
                  labelStyle={{
                    color: '#000',
                    width: '150px',
                    verticalAlign: 'top'
                  }}
                  colon={false}
                  contentStyle={{ color: 'rgba(0,0,0,0.3)', padding: 0 }}
                  bordered>
                  <Descriptions.Item label={`${t('request_id')}`}>
                    {orderDetail?.requestId ? (
                      <AButton type="link" className="pl-0">
                        {orderDetail?.requestId}
                      </AButton>
                    ) : (
                      '-'
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={`${t('service_advisor')}`}>
                    {orderDetail?.helperName ? (
                      <AButton type="link" className="pl-0">
                        {orderDetail?.helperName}
                      </AButton>
                    ) : (
                      '-'
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={`${t('invoice')}`}>
                    {orderDetail?.document?.invoice ? (
                      <NewAuthFile
                        action={firstImage(orderDetail?.document?.invoice?.path)}
                        pdfName={orderDetail?.document?.invoice?.fileName}
                      />
                    ) : (
                      '-'
                    )}
                  </Descriptions.Item>
                </AlignedDescription>
              </Col>
              <Col md={24} lg={12}>
                <AlignedDescription
                  column={1}
                  layout="vertical"
                  labelStyle={{
                    color: '#000',
                    width: '150px',
                    verticalAlign: 'top'
                  }}
                  colon={false}
                  contentStyle={{ color: 'rgba(0,0,0,0.3)', padding: 0 }}
                  bordered>
                  <Descriptions.Item label={`${t('request_status')}`}>
                    {orderDetail?.status ? t(orderDetail?.status) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={`${t('car_repair_shop')}`}>{props.user?.fullName || '-'}</Descriptions.Item>
                </AlignedDescription>
              </Col>
            </Row>
          </Col>
        </Row>
      </Skeleton>

      <Divider />

      <div className="mb-5" style={{ border: '1px solid #000', overflow: 'auto', fontSize: '12px' }}>
        <div className="row" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px 16px' }}>
          <div className="col-6">{t('item').toUpperCase()}</div>
          <div className="col-2">{t('cost').toUpperCase()}</div>
          <div className="col-2">{t('quantity').toUpperCase()}</div>
          <div className="col-2">{t('total').toUpperCase()}</div>
        </div>
        {(orderDetail?.items || []).map((item) => (
          <div key={item?.id} className="row" style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '8px 16px' }}>
            <div className="col-6">
              <p>{item?.name || '-'}</p>
              <p>SKU: {item?.id || '-'}</p>
            </div>
            <div className="col-2">{numberFormatDecimal(+item?.price, ' đ', '')}</div>
            <div className="col-2">x{+item?.quantity}</div>
            <div className="col-2">{numberFormatDecimal(+item?.price * +item?.quantity, ' đ', '')}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: '40px !important' }}>
        <div className="col-12 col-lg-5 mt-5" style={{ position: 'relative' }}>
          <PaymenInfoTitle>{t('payment_info')}</PaymenInfoTitle>
          <PaymentInfoWrapper>
            <Radio.Group className="mb-5" onChange={{}} value={orderDetail?.paymentGateway} disabled>
              <Space direction="vertical">
                <Radio value="BANK_TRANSFER">{t('bank_transfer')}</Radio>
                <Radio value="CASH">{t('cash')}</Radio>
              </Space>
            </Radio.Group>
            <Form form={paymentForm}>
              <MDatePicker //
                noLabel
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                noPadding
                require={false}
                hasFeedback={false}
                disabled
                label={t('payment_date')}
                name="paymentDate"
              />
              <MInput //
                noLabel
                hasFeedback={false}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                noPadding
                require={false}
                disabled
                label={t('reference_id')}
                value="9484236"
                name="referenceId"
              />
            </Form>
          </PaymentInfoWrapper>
        </div>
        <div className="col-12 col-lg-1"></div>
        <div className="col-12 col-lg-6">
          <BillItem
            label={`${t('Subtotal')}:`}
            value={numberFormatDecimal(
              (orderDetail?.items || []).reduce((accumulator, item) => {
                return accumulator + item.price * item.quantity;
              }, 0),
              ' đ',
              ''
            )}
          />
          {orderDetail?.quotationApplyDiscount?.giftApplyDiscount && (
            <BillItem
              label={`${t('gift_card')}:`}
              value={numberFormatDecimal(+orderDetail.quotationApplyDiscount.giftApplyDiscount, ' đ', '')}
            />
          )}
          {orderDetail?.quotationApplyDiscount?.promotionApplied && (
            <BillItem
              label={`${t('Promotion')}:`}
              value={
                orderDetail?.quotationApplyDiscount?.promotionApplied?.promotionType === PROMOTION_SERVICE_TYPE.COUPON_DISCOUNT
                  ? numberFormatDecimal(+orderDetail.quotationApplyDiscount.promotionApplyDiscount, ' đ', '')
                  : orderDetail?.quotationApplyDiscount?.promotionApplied?.name
              }
            />
          )}

          {/* <BillItem
            label={`${t('coupon')}:`}
            value={
              <Input.Group compact>
                <Input disabled style={{ width: 'calc(100% - 50px)' }} defaultValue="" />
                <AButton size="small" type="primary" disabled content={t('apply')}/>
                  
                </AButton>
              </Input.Group>
            }
          /> */}
          <BillItem label={`${t('tax')} (%):`} value={'0%'} />

          <div className="col-12">
            <Divider />
          </div>
          <BillItem label={`${t('total')}:`} value={<h4>{numberFormatDecimal(+orderDetail?.totalPrice, ' đ', '')}</h4>} />
        </div>
      </div>

      <Divider />
      <div className="d-flex d-lg-flex flex-column flex-lg-row align-items-between justify-content-between">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />

        {/* ENHANCE AFTER CREATE ORDER IS ADDED
        <AButton //
          style={{ verticalAlign: 'middle', width: '250px' }}
          className="px-5"
          size="large"
          onClick={() => setProcessModal(true)}
          type="primary"
          icon={props.submitIcon}content={'Processing'}/>
        ENHANCE AFTER CREATE ORDER IS ADDED */}
      </div>

      {/* ENHANCE AFTER CREATE ORDER IS ADDED
      <AntModal
        title={`${t('process_order_number')}: 48942121`}
        description={t('process_order_des')}
        destroyOnClose
        width={1200}
        modalShow={processModal}
        submitDisabled={false}
        onCancel={() => setProcessModal(false)}
        hasSubmit>
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="row">
                <div className="col-5">
                  <MInput
                    noLabel
                    loading={false}
                    noPadding
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    disabled={true}
                    readOnly={!props.isEditing}
                    name="currentState"
                    label={t('current_state')}
                  />
                </div>
                <div className="col-2 d-flex align-items-center justify-content-center">
                  <DoubleRightOutlined />
                </div>
                <div className="col-5">
                  <MSelect //
                    colon={false}
                    label={t('next_state')}
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="nextState"
                    noLabel
                    options={[
                      { value: 'NEW', label: 'Reparing' },
                      { value: 'PROCESSING', label: 'Completed' }
                    ]}
                    placeholder={t('select_state')}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-5">
                  <MInput
                    noLabel
                    loading={false}
                    noPadding
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    disabled={true}
                    readOnly={!props.isEditing}
                    name="currentAssignee"
                    label={t('current_assignee')}
                  />
                </div>
                <div className="col-2 d-flex align-items-center justify-content-center">
                  <DoubleRightOutlined />
                </div>
                <div className="col-5">
                  <MSelect //
                    colon={false}
                    label={t('assign_to')}
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="assignee"
                    noLabel
                    options={[
                      { value: 'NEW', label: 'Elon Musk' },
                      { value: 'PROCESSING', label: 'Bill Clinton' }
                    ]}
                    placeholder={t('select_assignee')}
                  />
                </div>
              </div>
            </div>
          </div>

          <Divider />
          <Form.Item>
            <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
              <AButton
                style={{ verticalAlign: 'middle', width: '200px' }}
                className="px-5"
                loading={processSubmitting}
                size="large"
                htmlType="submit"
                type="primary"
                icon={<CheckOutlined />} content={t('done')}/>
              <AButton
                style={{ verticalAlign: 'middle', width: '200px' }}
                className="mt-3 mt-lg-0 ml-lg-3 px-5"
                size="large"
                onClick={() => setProcessModal(false)}
                icon={<CloseOutlined />}
                content={t('close')}
              />
            </div>
          </Form.Item>
        </Form>
      </AntModal>
      ENHANCE AFTER CREATE ORDER IS ADDED */}
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getOrderDetail: orderActions.getOrderDetail,
    getConsumerDetail: orderActions.getConsumerDetail,
    getPaymentInfo: orderActions.getPaymentInfo
  }
)(ViewForm);
