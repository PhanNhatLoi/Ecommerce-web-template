import { Col, Form, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CUSTOMER_BUSINESS_TYPE, TYPOGRAPHY_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { TEXT_AREA_ROWS } from '~/configs/status/car-accessories/itemsType';
import { arInvoiceActions } from '~/state/ducks/ar_invoice';
import { customerActions } from '~/state/ducks/customer';
import { CustomerListResponse } from '~/state/ducks/customer/actions';
import TableARInvoice from '~/views/container/Ecommerce/ARInvoice/table/TableARInvoice';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputNumber, MTextArea } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { BackBtn, ResetBtn, SaveAndPrintBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import readCurrencyString from '~/views/utilities/helpers/readCurrencyString';

import ReturnModal from '../Modal/ReturnModal';
import { AddressNeedLoadType } from './Types';

const PrintStyled = styled.div`
  @media (max-width: 480px) {
    .delivery-content {
      width: 100% !important;
      margin-bottom: 10px;
    }
  }

  @media screen {
    .sign {
      display: none;
    }
  }

  @media print {
    .sign {
      display: flex;
    }
    .input-btn {
      display: none;
    }
    .right-content {
      width: 20%;
    }
    .delivery-content {
      width: 50%;
      padding: 2px;
    }
  }
`;
const DateInputStyled = styled.div`
  label {
    font-size: 13px;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 0px;
    padding-bottom: 8px;
  }
  .date {
    border-bottom: 1px solid #000;
    padding: 16px 11px 4.5px 11px;
    font-size: 12px;
  }
`;
const MInputStyled = styled(MInput)`
  .ant-form-item-required {
    font-weight: bold;
  }
  label {
    font-weight: bold;
  }
`;
const MInputAddressStyled = styled(MInputAddress)`
  label {
    font-weight: bold;
  }
`;
const MSelectStyled = styled(MSelect)`
  .ant-form-item-required {
    font-weight: bold;
  }
`;
const MInputNumberStyled = styled(MInputNumber)`
  width: 100%;
  label {
    font-weight: bold;
  }
`;

const ButtonStyled = styled(AButton)`
  background: #48a8db !important;
  color: white;
  font-size: 20px;
`;
const MTextAreaStyled = styled(MTextArea)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .ant-input {
    border: 0.5px solid #000 !important;
  }
  label {
    font-weight: bold;
  }
`;

type ARInvoiceProps = {
  getCustomers: any;
  createArInvoice: any;
  setNeedLoadNewData: any;
};

const ARInvoice: React.FC<ARInvoiceProps> = (props) => {
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState<boolean>(false);
  const [customerList, setCustomerList] = useState<CustomerListResponse[]>([]);
  const [returnModalShow, setReturnModalShow] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [loadData, setLoadData]: any = useState([]);

  const [returnData, setReturnData] = useState<Array<any>>([]);
  const [orderId, setOrderId] = useState<number>(0);
  const [resestField, setResestField] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const total = Form.useWatch('total', form);
  const [displayFullAddresses, setDisplayFullAddresses] = useState<boolean>(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState<AddressNeedLoadType>();
  let finalTotal: number = 0;
  const [print, setPrint] = useState<boolean>(false);

  const onValuesChange = (value) => {
    setDirty(true);
    if (value.customerName || value.customerCode) {
      const customer: any = customerList.find((customer) => customer.id === (value.customerName || value.customerCode));
      const addressName = `${customer?.address?.address || ''} ${customer?.address?.fullAddress || ''}`.trim();

      form.setFieldsValue({
        customerCode: customer?.code,
        customerName: customer?.fullname,
        country1: customer?.address?.countryId,
        address1: addressName,
        state: customer?.address?.stateId || undefined,
        zipCode: customer?.address?.zipCode || undefined,
        province: customer?.address?.provinceId,
        district: customer?.address?.districtId,
        ward: customer?.address?.wardsId
      });
      setAddressNeedLoad({
        country: customer?.address?.countryId,
        state: customer?.address?.stateId,
        province: customer?.address?.provinceId,
        district: customer?.address?.districtId,
        ward: customer?.address?.wardsId
      });
    }
  };

  useEffect(() => {
    let totalMoney: number = 0;
    const totalValueFinal = returnData.map((e: any) => {
      totalMoney = totalMoney + e?.total;
    });
    setTotalAmount(totalMoney);
    form.setFieldValue('total', totalAmount);
    form.setFieldValue('totalInWords', readCurrencyString(totalAmount));
  }, [returnData, totalAmount]);
  useEffect(() => {
    props
      .getCustomers({ businessType: CUSTOMER_BUSINESS_TYPE.SUPPLIER })
      .then((res: { content: React.SetStateAction<customerActions.CustomerListResponse[]> }) => {
        setCustomerList(res?.content);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const Sign = (props) => {
    return (
      <div>
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {t(props.role)}
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('signature')}
        </ATypography>
        <div style={{ borderBottom: '3px dotted #b5b5c3', height: 20 }}></div>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('full_name')}
        </ATypography>
        <div style={{ borderBottom: '3px dotted #b5b5c3', height: 20 }}></div>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('Date')}
        </ATypography>
        <div style={{ borderBottom: '3px dotted #b5b5c3', height: 20 }}></div>
      </div>
    );
  };
  const handleResest = () => {
    setResestField(true);
    setLoadData([]);
    setReturnData([]);
    setTotalAmount(0);
    setDirty(false);
    setDisplayFullAddresses(false);
    form.resetFields();
  };
  const submitForm = (action, body, successMessage) => {
    action(body)
      .then((res) => {
        if (print) {
          setPrint(false);
          window.print();
        }
        setSubmitting(false);
        setDirty(false);
        setDisplayFullAddresses(false);
        form.resetFields();
        setLoadData([]);
        setReturnData([]);
        setTotalAmount(0);
        setResestField(true);
        AMessage.success(t(successMessage));
        props.setNeedLoadNewData && props.setNeedLoadNewData(true);
        history.push(PATH.CAR_ACCESSORIES_AR_INVOICE_PATH);
      })
      .catch((err) => {
        catchPromiseError(err);
        setDirty(false);
        setSubmitting(false);
      });
  };
  const catchPromiseError = (err) => {
    setSubmitting(false);
    AMessage.error(t(err.message));
    console.error('trandev ~ file: InfoForm.js ~ line 31 ~ useEffect ~ err', err);
  };
  const onFinish = async (values) => {
    setSubmitting(true);
    const getCustomerCode = customerList.find((e) => e.profileId === values?.customerCode);
    if (returnData.length > 0) {
      const body = {
        code: values?.code,
        orderId: orderId,
        deliveryId: orderId,
        customerId: values?.customerId,
        customerCode: values?.customerCode,
        customerName: values?.customerName,
        customerAddress: values?.addressInfo?.join(', '),
        note: values?.note,
        total: values?.total,
        invoiceDetails: returnData
      };

      submitForm(
        //
        await props.createArInvoice,
        body,
        'create_ar_invoice_success'
      );
    } else {
      setSubmitting(false);
      AMessage.error(t('miss_field_in_table'));
    }
  };

  // On finish fail
  const onFinishFailed = (err) => {
    console.error('trandev ~ file: DeliveryOderAdd.tsx  ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onContractChange = (file) => {
    form.setFieldsValue({
      licenseFile: (file || []).map((l) => {
        return {
          name: l?.name,
          url: l?.url,
          type: 'DOCUMENT'
        };
      })
    });
  };
  const newData = loadData.map((data) => {
    return {
      ...data,
      vat: ((data?.unitPrice * data?.quantity) / 100) * 10,
      total: data?.unitPrice * data?.quantity + data?.vat
    };
  });

  return (
    <PrintStyled>
      <BCard>
        <div className="input-btn">
          <CardHeader
            titleHeader={''}
            btn={
              <div>
                <BackBtn
                  onClick={() => {
                    history.push(PATH.CAR_ACCESSORIES_AR_INVOICE_PATH);
                  }}
                />
                <SubmitBtn loading={submitting} onClick={() => form.submit()} />
                <SaveAndPrintBtn
                  loading={submitting}
                  onClick={() => {
                    form.submit();
                    setDisplayFullAddresses(true);
                    setPrint(true);
                  }}
                />
              </div>
            }></CardHeader>
        </div>
        <CardBody>
          <Form //
            requiredMark={false}
            {...ANT_FORM_SEP_LABEL_LAYOUT}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
              scrollMode: 'always'
            }}
            form={form}
            onValuesChange={onValuesChange}
            name="deliveryOderAdd"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Prompt when={dirty} message={t('leave_confirm')} />
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={3} style={{ textAlign: 'center' }}>
              {t('AR_Invoice').toUpperCase()}
            </ATypography>
            <Row className="mb-15 mt-10">
              <Col xs={24} sm={13} md={13} lg={13}></Col>
              <Col xs={24} sm={5} md={5} lg={5} className="w-100">
                <MInputStyled //
                  noPadding
                  noLabel
                  allowClear={false}
                  require
                  // labelCol={{ span: 9 }}
                  // wrapperCol={{ span: 15 }}
                  label={t('form_number')}
                  name="code"
                />
              </Col>
              <Col xs={24} sm={1} md={1} lg={1}></Col>
              <Col xs={24} sm={5} md={5} lg={5} className="w-100">
                <DateInputStyled>
                  <label>{t('date')}</label>
                  <div className="date">{UtilDate.toDateLocal(Date.now())}</div>
                </DateInputStyled>
              </Col>
            </Row>

            <Row className="mt-15">
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="mb-10 d-print-none">
                  <label>{t('goods_payment')}</label>
                  <span className="pl-4">
                    <ButtonStyled
                      type="primary"
                      size="large"
                      onClick={() => {
                        setReturnModalShow(true);
                      }}>
                      {t('delivery_order_detail_list')}
                    </ButtonStyled>
                  </span>
                </div>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <MSelectStyled
                  noPadding
                  name="customerCode"
                  noLabel
                  // disabled={true}
                  require
                  hasFeedback={false}
                  labelAlign="left"
                  // labelCol={{ span: 7 }}
                  wrapperCol={{ span: 24 }}
                  label={t('customer_code')}
                  placeholder={t('find_customer_code')}
                  valueProperty="id"
                  labelProperty="code"
                  options={customerList}
                  showSearch></MSelectStyled>
              </Col>
              <Col xs={24} sm={24} md={2} lg={2}></Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <MSelectStyled
                  noPadding
                  name="customerName"
                  noLabel
                  require
                  hasFeedback={false}
                  // disabled={true}
                  labelAlign="left"
                  // labelCol={{ span: 2 }}
                  wrapperCol={{ span: 24 }}
                  label={t('customer_name')}
                  placeholder={t('find_customer_name')}
                  valueProperty="id"
                  labelProperty="fullname"
                  options={customerList}
                  showSearch></MSelectStyled>
              </Col>

              <div className="mt-8 mb-8">
                <label className={displayFullAddresses ? '' : 'd-none'}>
                  <strong>{`${t('address')} : `}</strong>
                  {fullAddress}
                </label>
              </div>
              <Col xs={24} sm={24} md={24} lg={24}>
                <MInputAddressStyled //
                  noLabel
                  className="d-print-none"
                  require={false}
                  noPadding
                  hasFeedback={false}
                  form={form}
                  name="addressInfo"
                  label={t('address')}
                  needLoadData={addressNeedLoad}
                  setNeedLoadData={setAddressNeedLoad}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <MTextAreaStyled //
                  require={false}
                  noLabel
                  hasFeedback={false}
                  noPadding
                  rows={TEXT_AREA_ROWS.SHORT}
                  // labelCol={{ span: 2 }}
                  // wrapperCol={{ span: 22 }}
                  label={t('note')}
                  name="note"
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                {/* table */}
                <TableARInvoice
                  data={loadData}
                  setData={setReturnData}
                  resestField={resestField}
                  // form={form}
                  setResestField={setResestField}
                  // setTotalAmount={setTotalAmount}
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={11} lg={11}>
                <MInputNumberStyled //
                  noPadding
                  noLabel
                  require={false}
                  // value={totalAmount}
                  readOnly={true}
                  // labelCol={{ span: 4 }}
                  // wrapperCol={{ span: 20 }}
                  // disabled={true}
                  label={t('total_amount')}
                  name="total"
                  placeholder={t('')}
                />
              </Col>
              <Col xs={24} sm={24} md={2} lg={2}></Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <MInputStyled //
                  noPadding
                  noLabel
                  require={false}
                  // labelCol={{ span: 4 }}
                  // wrapperCol={{ span: 20 }}
                  readOnly={true}
                  label={t('amount_in_words')}
                  name="totalInWords"
                  placeholder={t('')}
                />
              </Col>
            </Row>
            <Divider />
            {/* sign */}
            <div className="row sign">
              <div className="col-4">
                <Sign role="delivery_creator" />
              </div>
              <div className="col-2"></div>
              <div className="col-3">
                <Sign role="deliver" />
              </div>
              <div className="col-3">
                <Sign role="receiver" />
              </div>
            </div>
            <Form.Item className="mt-5 input-btn">
              <div className="d-flex flex-wrap justify-content-center align-item-center">
                <BackBtn
                  onClick={() => {
                    history.push(PATH.CAR_ACCESSORIES_AR_INVOICE_PATH);
                  }}
                />
                <SubmitBtn loading={submitting} />
                <SaveAndPrintBtn
                  loading={submitting}
                  onClick={() => {
                    setPrint(true);
                    setDisplayFullAddresses(true);
                  }}
                />
                <ResetBtn onClick={() => handleResest()} />
              </div>
            </Form.Item>
          </Form>
        </CardBody>
      </BCard>
      <ReturnModal //
        modalShow={returnModalShow}
        setModalShow={setReturnModalShow}
        setLoadData={setLoadData}
        setOrderId={setOrderId}
        setFullAddress={setFullAddress}
        form={form}
        setAddressNeedLoad={setAddressNeedLoad}
      />
    </PrintStyled>
  );
};
export default connect(null, {
  getCustomers: customerActions.getCustomers,
  createArInvoice: arInvoiceActions.createArInvoice
})(ARInvoice);
