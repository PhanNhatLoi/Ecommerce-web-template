import { Checkbox, Col, Form, Input, Row } from 'antd/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { useBeforeUnload } from 'react-use';
import styled from 'styled-components';
import { PAYMENT_GATEWAY } from '~/configs/const';
import * as PATH from '~/configs/routesConfig';
import { SALE_ORDER_STATUS } from '~/configs/status/car-accessories/saleOrderStatus';
import { orderActions } from '~/state/ducks/carAccessories/order';
import { customerActions } from '~/state/ducks/customer';
import { CustomerDetailResponse } from '~/state/ducks/customer/actions';
import { returnActions } from '~/state/ducks/return';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATableEditable from '~/views/presentation/ui/table/ATableEditable';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { typeValidate } from '~/views/utilities/ant-validation';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

interface AddressNeedLoadType {
  country: number;
  state: number;
  province: number;
  district: number;
  ward: number;
}

type ReturnManagementProps = {
  getReturnDetail: any;
  getSalesOrders: any;
  getOrderDetail: any;
  getCustomerDetail: any;
  createReturn: any;
  editReturn: any;
};

const ReturnManagement: React.FC<ReturnManagementProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const params = useParams();
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState<AddressNeedLoadType>();

  const [orderList, setOrderList] = useState<any>([]);
  const [orderDetail, setOrderDetail] = useState<any>({});
  const paymentGateawayWatch = Form.useWatch('paymentGateway', form);

  const [returnQuantity, setReturnQuantity] = useState<number>(0);
  const [totalMoney, setTotalMoney] = useState<number>(0);
  const [differ, setDiffer] = useState<number>(0);
  const [customerMustPay, setCustomerMustPay] = useState<number>(0); // ENHANCE LATER
  const [payCustomer, setPayCustomer] = useState<number>(0);

  // Get order list
  useEffect(() => {
    setLoading(true);
    props
      .getSalesOrders({ status: SALE_ORDER_STATUS.DONE })
      .then((res: any) => {
        setOrderList(res?.content);
        // default phone code is VN +84
        form.setFieldsValue({ code: 241 });
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: index.tsx: 85 ~ useEffect ~ err', err);
        setLoading(false);
      });
  }, []);

  // Get return detail
  useEffect(() => {
    setLoading(true);
    if (params.id) {
      props
        .getReturnDetail(params.id)
        .then((res: any) => {
          const response = res?.content;
          handleSelectOrderId(response?.orderId);
          form.setFieldsValue({
            orderId: response?.orderId,
            sellerName: response?.orderInfo?.sellerName,
            buyerName: response?.customerInfo?.buyerName,
            phone: response?.customerInfo?.phone,
            code: response?.customerInfo?.code,
            email: response?.customerInfo?.email,
            note: !response?.note || response?.note === 'undefined' ? '' : response?.note,
            // address
            country1: response?.customerInfo?.address?.countryId,
            address1: response?.customerInfo?.address?.fullAddress,
            state: response?.customerInfo?.address?.stateId,
            zipCode: response?.customerInfo?.address?.zipCode,
            province: response?.customerInfo?.address?.provinceId,
            district: response?.customerInfo?.address?.districtId,
            ward: response?.customerInfo?.address?.wardsId
          });
          setAddressNeedLoad({
            country: response?.customerInfo?.address?.countryId,
            state: response?.customerInfo?.address?.stateId,
            province: response?.customerInfo?.address?.provinceId,
            district: response?.customerInfo?.address?.districtId,
            ward: response?.customerInfo?.address?.wardsId
          });
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: index.tsx: 85 ~ useEffect ~ err', err);
          setLoading(false);
        });
    }
  }, []);

  // Get order detail
  const handleSelectOrderId = (orderId: number) => {
    if (orderId) {
      setLoading(true);
      props
        .getOrderDetail(orderId)
        .then((res: any) => {
          const response = res?.content;
          setOrderDetail(response);
          form.setFieldsValue(
            params.id
              ? { paymentGateway: response?.paymentGateway }
              : {
                  sellerName: response?.sellerName,
                  buyerName: response?.shippingAddress?.fullName,
                  phone: response?.shippingAddress?.phone,
                  code: response?.shippingAddress?.country?.id,
                  paymentGateway: response?.paymentGateway,
                  note: !response?.note || response?.note === 'undefined' ? '' : response?.note,
                  // address
                  country1: response?.shippingAddress?.country?.id,
                  address1: response?.shippingAddress?.fullAddress,
                  state: response?.shippingAddress?.state?.id,
                  zipCode: response?.shippingAddress?.zipCode,
                  province: response?.shippingAddress?.province?.id,
                  district: response?.shippingAddress?.district?.id,
                  ward: response?.shippingAddress?.wards?.id
                }
          );
          !params.id &&
            setAddressNeedLoad({
              country: response?.shippingAddress?.country?.id,
              state: response?.shippingAddress?.state?.id,
              province: response?.shippingAddress?.province?.id,
              district: response?.shippingAddress?.district?.id,
              ward: response?.shippingAddress?.wards?.id
            });
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: index.tsx: 106 ~ handleSelectOrderId ~ err', err);
          setLoading(false);
        });
    }
  };

  // Get buyer information
  useEffect(() => {
    setLoading(true);
    if (orderDetail?.buyerProfileId) {
      props
        .getCustomerDetail(orderDetail?.buyerProfileId)
        .then((res: { content: CustomerDetailResponse }) => {
          !params.id &&
            form.setFieldsValue({
              email: res?.content?.email
            });
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: index.tsx: 143 ~ useEffect ~ err', err);
          setLoading(false);
        });
    }
  }, [orderDetail?.buyerProfileId]);

  const BillItem = ({ label, value, strong }) => {
    return (
      <Row>
        <Col span={13} className="mt-2">
          <ATypography strong={strong}>{label}</ATypography>
        </Col>
        <Col span={11} className="mt-2">
          <ATypography strong={strong}>
            <span className="d-flex justify-content-end">{value}</span>
          </ATypography>
        </Col>
      </Row>
    );
  };

  // Before unload
  useBeforeUnload(dirty, t('leave_confirm'));
  const onValuesChange = () => {
    setDirty(true);
  };

  const onFinish = (values: any) => {
    setSubmitLoading(true);
    setDirty(false);

    const finalPhone = values.phone.startsWith('0') ? values.phone.slice(1) : values.phone;

    let body = {
      code: orderDetail?.code,
      orderId: Number.parseInt(values.orderId),
      orderInfo: {
        sellerName: values.sellerName
      },
      customerId: orderDetail?.buyerProfileId,
      customerInfo: {
        buyerName: values.buyerName,
        code: values.code,
        phone: finalPhone,
        email: values.email,
        address: {
          address: '',
          districtId: values.district,
          provinceId: values.province,
          wardsId: values.ward,
          stateId: values.state,
          countryId: values.country1, // this is the actual country address,
          zipCode: values.zipCode,
          fullAddress: values?.address1
        }
      },
      paymentId: null, // ENHANCE LATER
      paymentInfo: {
        paymentGateway: values.paymentGateway,
        transactionCode: values.transactionCode,
        note: values.note
      },
      received: values.received || false,
      refundAmount: payCustomer,
      orderAmount: null, // ENHANCE LATER
      note: values.note
    };

    params.id
      ? props
          .editReturn({ ...body, id: +params.id })
          .then(() => {
            setOrderDetail([]);
            form.resetFields();
            AMessage.success(t('update_return_successfully'));
            setSubmitLoading(false);
            history.push(PATH.CAR_ACCESSORIES_RETURN_PATH);
          })
          .catch(() => {
            AMessage.error(t('update_return_failed'));
            setSubmitLoading(false);
          })
      : props
          .createReturn(body)
          .then(() => {
            setOrderDetail([]);
            form.resetFields();
            AMessage.success(t('create_return_successfully'));
            setSubmitLoading(false);
            history.push(PATH.CAR_ACCESSORIES_RETURN_PATH);
          })
          .catch(() => {
            AMessage.error(t('create_return_failed'));
            setSubmitLoading(false);
          });
  };

  const onFinishFailed = (err: any) => {
    console.error('chiendev ~ file: index.tsx: 227 ~ onFinishFailed ~ err', err);
    setSubmitLoading(false);
  };

  const columns = [
    {
      title: t('product_code'),
      dataIndex: 'id',
      width: '80px'
    },
    {
      title: t('product_other_name'),
      dataIndex: 'productName',
      width: '200px',
      align: 'left'
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      width: '100px'
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      width: '100px',
      type: 'number',
      ellipsis: true
    },
    {
      title: t('refund_quantity'),
      dataIndex: 'refundQuantity',
      width: '100px',
      type: 'number',
      editable: true,
      ellipsis: true,
      minNumber: Number.MIN_SAFE_INTEGER,
      render: (newQuantity: number, record: any) => {
        if (newQuantity) newQuantity = newQuantity > record.quantity ? record.quantity : newQuantity < 0 ? 1 : newQuantity;
        else newQuantity = newQuantity === 0 ? 1 : record.quantity;
        record.refundQuantity = newQuantity;
        record.total = newQuantity * record.unitPrice;
        return newQuantity;
      }
    },
    {
      title: t('price'),
      dataIndex: 'unitPrice',
      width: '100px',
      type: 'number',
      render: (cell: number) => cell && numberFormatDecimal(cell)
    },
    {
      title: t('amount'),
      dataIndex: 'total',
      width: '100px',
      type: 'number',
      render: (cell: number) => (cell ? numberFormatDecimal(cell) : '')
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  let columnsArr = columns.map((column) => {
    return {
      editable: false,
      align: 'center',
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  // ENHANCE LATER:
  // - calculate customer must pay

  const handleSetData = (newData: any) => {
    setReturnQuantity(newData.reduce((total: number, currentValue: any) => (total = total + currentValue.refundQuantity), 0));
    setTotalMoney(
      newData.reduce((total: number, currentValue: any) => (total = total + currentValue.refundQuantity * currentValue.unitPrice), 0)
    );
    setDiffer(orderDetail.total - newData.reduce((total: number, currentValue: any) => (total = total + currentValue.total), 0));
    setPayCustomer(
      newData.reduce((total: number, currentValue: any) => (total = total + currentValue.refundQuantity * currentValue.unitPrice), 0)
    );
  };

  return (
    <HOC>
      <WrapStyleForm>
        <BCard>
          <CardHeader
            titleHeader={params.id ? t('editReturn') : t('createReturn')}
            btn={
              <div>
                <BackBtn
                  onClick={() => {
                    history.push(PATH.CAR_ACCESSORIES_RETURN_PATH);
                  }}
                />
                <SubmitBtn loading={submitLoading} onClick={() => form.submit()} />
              </div>
            }></CardHeader>
          <Prompt when={dirty} message={t('leave_confirm')} />
          <CardBody>
            <Form //
              {...ANT_FORM_SEP_LABEL_LAYOUT}
              scrollToFirstError={{
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
                scrollMode: 'always'
              }}
              form={form}
              name={'create'}
              onValuesChange={onValuesChange}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}>
              <Prompt when={dirty} message={t('leave_confirm')} />

              <LayoutForm title={t('order_info')}>
                <Col>
                  <Row>
                    <MSelect //
                      label={t('order_id')}
                      require
                      name="orderId"
                      hasFeedback
                      disabled={params.id}
                      onChange={handleSelectOrderId}
                      options={orderList?.map((order: any) => {
                        return {
                          value: order.id,
                          label: order.code
                        };
                      })}
                      placeholder={t('customer_search_by_code')}
                    />
                    <MInput //
                      label={t('Sellers')}
                      name="sellerName"
                      hasFeedback
                      require={false}
                      placeholder={t('Sellers')}
                    />
                  </Row>
                </Col>
              </LayoutForm>

              <Divider />

              <LayoutForm data-aos="fade-right" data-aos-delay="300" title={t('customer_info')}>
                <Col>
                  <Row>
                    <MInput //
                      label={t('customer_name')}
                      name="buyerName"
                      hasFeedback
                      require={false}
                      placeholder={t('customer_name')}
                    />
                    <MInputPhone //
                      label={t('phone_number')}
                      name="phone"
                      hasFeedback
                      phoneTextTranslate="1px"
                      placeholder={t('phone_number')}
                    />
                    <MInputAddress //
                      form={form}
                      label={t('address')}
                      name="addressInfo"
                      noLabel
                      hasRegisterLayout
                      codeInputStyle={{ paddingTop: '1px' }}
                      needLoadData={addressNeedLoad}
                      setNeedLoadData={setAddressNeedLoad}
                    />
                    <Form.Item //
                      hasFeedback
                      label={t('Email')}
                      className="px-4 w-100"
                      name="email"
                      validateFirst
                      rules={typeValidate('email')}>
                      <Input allowClear className="w-100" size="large" placeholder={t('Email')} />
                    </Form.Item>
                  </Row>
                </Col>
              </LayoutForm>

              <Divider />

              <Col className="px-4">
                <ATableEditable
                  noTitle
                  notSupportAddBtn
                  scrollX={1200}
                  columns={columnsArr}
                  dataSource={orderDetail?.orderDetails || []}
                  setDataSource={handleSetData}
                  setNeedLoadNewData={setLoading}
                  needLoadNewData={loading}
                />
              </Col>

              <Col className="px-4">
                <Row>
                  <Col md={24} lg={24} xl={7} className="mb-4 w-100">
                    <Form.Item name="received">
                      <Checkbox
                        onChange={(e) => {
                          form.setFieldValue('received', e.target.checked);
                        }}>
                        {t('picked_up_return_product')}
                      </Checkbox>
                    </Form.Item>
                  </Col>

                  <Col md={24} lg={24} xl={3}></Col>

                  <Col md={24} lg={24} xl={14} className="w-100">
                    <BillItem
                      label={t('return_product_number')}
                      value={returnQuantity ? numberFormatDecimal(returnQuantity) : 0}
                      strong={false}
                    />
                    <BillItem label={t('total_amount')} value={totalMoney ? numberFormatDecimal(totalMoney) : 0} strong={true} />
                    <BillItem label={t('price_differences')} value={differ ? numberFormatDecimal(differ) : 0} strong={false} />
                    <BillItem label={t('customer_pay')} value={customerMustPay ? numberFormatDecimal(customerMustPay) : 0} strong={true} />
                    <Divider />
                    <BillItem label={t('refund_amount')} value={payCustomer ? numberFormatDecimal(payCustomer) : 0} strong={true} />
                  </Col>
                </Row>
              </Col>

              <Divider />

              <LayoutForm data-aos="fade-right" data-aos-delay="500" title={t('payment_information')}>
                <Col>
                  <Row>
                    <MRadio
                      name="paymentGateway"
                      label=""
                      noLabel
                      require={false}
                      direction="vertical"
                      spaceSize="middle"
                      value={paymentGateawayWatch}
                      options={[
                        { value: PAYMENT_GATEWAY.CASH, label: t(PAYMENT_GATEWAY.CASH) },
                        { value: PAYMENT_GATEWAY.BANK_TRANSFER, label: t(PAYMENT_GATEWAY.BANK_TRANSFER) }
                        // { value: PAYMENT_GATEWAY.CARD, label: t(PAYMENT_GATEWAY.CARD) },
                        // { value: PAYMENT_GATEWAY.DEBT, label: t(PAYMENT_GATEWAY.DEBT) }
                      ]}
                      className="mb-6"
                    />
                    <MInput //
                      label={t('reference_code')}
                      name="transactionCode"
                      hasFeedback
                      require={false}
                      noLabel
                      placeholder={t('reference_code')}
                    />
                    <MInput //
                      label={t('note')}
                      name="note"
                      noLabel
                      hasFeedback
                      require={false}
                      placeholder={t('note')}
                      className="mt-4"
                    />
                  </Row>
                </Col>
              </LayoutForm>
            </Form>

            <Divider />

            <Col className="d-flex flex-wrap justify-content-center align-item-center">
              <Row>
                <BackBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_RETURN_PATH)} />
                <ResetBtn onClick={() => {}} />
                <SubmitBtn loading={submitLoading} onClick={() => form.submit()} />
              </Row>
            </Col>
          </CardBody>
        </BCard>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(null, {
  getReturnDetail: returnActions.getReturnDetail,
  getSalesOrders: orderActions.getSalesOrders,
  getOrderDetail: orderActions.getOrderDetail,
  getCustomerDetail: customerActions.getCustomerDetail,
  createReturn: returnActions.createReturn,
  editReturn: returnActions.editReturn
})(ReturnManagement);
