import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { deliveryOrdersActions } from '~/state/ducks/carAccessories/deliveryOrders';
import { DeliveryBodyRequest, DeliveryBodyResponse, DeliveryDetailsResponse } from '~/state/ducks/carAccessories/deliveryOrders/actions';
import { orderActions } from '~/state/ducks/carAccessories/order';
import { customerActions } from '~/state/ducks/customer';
import { CustomerDetailResponse } from '~/state/ducks/customer/actions';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, CancelBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';

import HOC from '../../../HOC';
import DeliveryFrom from '../components/DeliveryFrom';
import DeliveryLicense from '../components/DeliveryLicense';
import DeliveryNote from '../components/DeliveryNote';
import DeliveryTo from '../components/DeliveryTo';
import TableProduct from '../table/TableProduct';
import * as Types from '../Type';

const PrintStyled = styled.div`
  @media (max-width: 480px) {
    .delivery-content {
      width: 100%;
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

const DeliveryOderAdd = (props: Props) => {
  const history = useHistory();
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [documentFile, setDocumentFile] = useState<Types.documentFileType[]>([]);
  const [dirty, setDirty] = useState<boolean>(false);
  const [tableData, setTableData] = useState<DeliveryDetailsResponse[]>([]);
  const [orderFromSaleOrder, setOrderFromSaleOrder] = useState<DeliveryDetailsResponse[]>([]);
  const [resetTable, setResetTable] = useState<boolean>(false);
  const [companyInfor, setCompanyInfor] = useState<Types.companyInforType>();
  const [customer, setCustomer] = useState<CustomerDetailResponse>();
  const [fillCustomerTo, setFillCustomerTo] = useState<number>();
  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    props
      .getUser()
      .then((res) => {
        setCompanyInfor(res.content);
      })
      .catch((err) => {
        console.error(err);
      });

    if (props?.data) {
      const data = props?.data;
      form.setFieldsValue({
        //delivery license
        gdnNo: data?.gdnNo,
        soNo: data?.soNo,
        //delivery from
        deliver: data?.deliveryFrom?.deliver,
        phone_number_from: data?.deliveryFrom?.phoneNumberDeliver,
        vehicle_from: data?.deliveryFrom?.vehicleFrom,
        email_from: data?.deliveryFrom?.emailFrom,
        //delivery to
        customer: data?.deliveryTo?.customer?.profileId,
        phone_number_to: data?.deliveryTo?.phoneNumberTo,
        email_to: data?.deliveryTo?.emailTo,
        //delivery note
        note: data?.note || undefined
      });
      if (data?.media) setDocumentFile([{ name: t('license_file'), url: data?.media }]);
    }
  }, []);

  const submitForm = (action: any, body: DeliveryBodyRequest, Message: string) => {
    action(body)
      .then(() => {
        setSubmitting(false);
        form.resetFields();
        AMessage.success(t(`${Message}`));
        setDirty(false);
        history.push(PATH.CAR_ACCESSORIES_DELIVERY_ODER_PATH);
      })
      .catch((err) => {
        console.error(err);
        setSubmitting(false);
        AMessage.error(t(err.message));
      });
  };

  // On finish
  const onFinish = (values) => {
    if (!tableData.length) {
      AMessage.error(t('no_data_delivery_details'));
      return;
    }
    setSubmitting(true);
    let addressTo = '';
    values.addressInfo.map((m, index) => {
      if (m && index !== 0) {
        addressTo += ', ' + m;
      } else if (m) addressTo += m;
    });
    const body = {
      id: props?.data ? props?.data?.id : null,
      orderId: Number(values.soNo),
      gdnNo: !props?.data ? values.gdnNo : null,
      soNo: !props?.data ? values.soNo : null,
      deliveryFrom: {
        company: companyInfor?.fullName,
        addressCompany: companyInfor?.address?.fullAddress,
        phoneNumberCompany: companyInfor?.phone,
        deliver: values.deliver,
        phoneNumberDeliver:
          values.phone_number_from.search('84') === 0 ? values.phone_number_from.slice(2) : Number(values.phone_number_from).toString(),
        code: values.code_from,
        vehicleFrom: values.vehicle_from,
        emailFrom: values.email_from
      },
      deliveryTo: {
        customer: customer,
        fullAddress: addressTo,
        address: {
          address: values.address1,
          districtId: values.district,
          provinceId: values.province,
          wardsId: values.ward,
          state: values.state,
          countryId: values.country1, // this is the actual country address
          zipCode: values.zipCode
        },
        phoneNumberTo:
          values.phone_number_to.search('84') === 0 ? values.phone_number_to.slice(2) : Number(values.phone_number_to).toString(),
        code: values.code_to,
        emailTo: values.email_to
      },
      deliveryDetails: tableData,
      media: documentFile[0]?.url,
      note: values.note
    };

    if (props?.data) {
      submitForm(props.updateDelivery, body, 'update_delivery_order_success');
    } else {
      submitForm(props.createDelivery, body, 'create_delivery_order_success');
    }
  };

  // On finish fail
  const onFinishFailed = (err) => {
    console.error('trandev ~ file: DeliveryOderAdd.tsx  ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onContractChange = (file: Types.documentFileType) => {
    if (file[0].url) {
      setDocumentFile([file[0]]);
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setDocumentFile([]);
    setDirty(false);
    setResetTable(true);
  };

  const onFormChange = () => {
    setDirty(true);
    if (props.setDirty) props.setDirty(true);
    const customerId = form.getFieldValue('customer');
    if (customer?.profileId !== customerId) {
      props.getCustomerDetail(customerId).then((res) => {
        setCustomer(res.content);
      });
    }
  };

  const handleFillData = (value: string) => {
    const orderId = orderData.find((item) => item.code === value).id;
    if (orderId) {
      props
        .getOderDetail(orderId)
        .then((res) => {
          const response = res?.content;
          setFillCustomerTo(response?.buyerProfileId);
          let OrderDetails: any = [];
          response?.orderDetails.map((m) => {
            const order: any = {
              orderedQuantity: m.quantity,
              tradingProductId: m.tradingProductId,
              productName: m.productName,
              unitPrice: m.unitPrice
            };
            OrderDetails.push(order);
          });
          setOrderFromSaleOrder(OrderDetails);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <HOC>
      <PrintStyled>
        <Card>
          {!props?.data && (
            <div className="input-btn">
              <CardHeader
                titleHeader={t('new_delivery_order')}
                btn={
                  <div>
                    <BackBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_DELIVERY_ODER_PATH)} />
                    <SubmitBtn disabled={!dirty} loading={submitting} onClick={() => form.submit()} />
                  </div>
                }></CardHeader>
            </div>
          )}
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
              name="deliveryOderAdd"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onFieldsChange={onFormChange}>
              <Prompt when={dirty} message={t('leave_confirm')} />
              <h3 style={{ textAlign: 'center' }}>{t('GOODS_DELIVERY_NOTE')}</h3>
              <DeliveryLicense data={props.data} handleFillData={handleFillData} setOrderData={setOrderData} orderData={orderData} />
              <LayoutForm
                data-aos="fade-right"
                data-aos-delay="300"
                title={t('delivery_infomation')}
                description={t('delivery_infomation_des')}>
                <div className="row">
                  <DeliveryFrom form={form} companyInfor={companyInfor} />
                  <DeliveryTo buyerProfileId={fillCustomerTo} form={form} addressInfor={props?.data?.deliveryTo?.address} />
                </div>
              </LayoutForm>
              <Divider />
              {/* table */}
              <div className="d-print-none">
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                  {t('table_delivery')}
                </ATypography>
                <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
                  {t('table_delivery_des')}
                </ATypography>
              </div>
              <div className="pl-5">
                <TableProduct
                  setDirty={setDirty}
                  data={props.data?.deliveryDetails || orderFromSaleOrder || []}
                  setData={setTableData}
                  reset={resetTable}
                  setReset={setResetTable}
                />
              </div>
              <Divider />
              {/* note */}
              <DeliveryNote documentFile={documentFile} onContractChange={onContractChange} />
              <Divider />
              <Form.Item className="mt-5 input-btn">
                <div className="d-flex flex-wrap justify-content-center align-item-center">
                  <SubmitBtn disabled={!dirty} loading={submitting} />
                  <ResetBtn onClick={handleResetForm} />
                  <CancelBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_DELIVERY_ODER_PATH)} />
                </div>
              </Form.Item>
            </Form>
          </CardBody>
        </Card>
      </PrintStyled>
    </HOC>
  );
};

type Props = {
  getAuthUser: any;
  getUser: any;
  createDelivery: any;
  updateDelivery: any;
  getOders: any;
  getOderDetail: any;
  getCustomerDetail: any;
  data?: DeliveryBodyResponse;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getUser: authActions.getUser,
    createDelivery: deliveryOrdersActions.createDeliveryOrder,
    updateDelivery: deliveryOrdersActions.updateDeliveryOrder,
    getOders: orderActions.getSalesOrders,
    getOderDetail: orderActions.getOrderDetail,
    getCustomerDetail: customerActions.getCustomerDetail
  }
)(DeliveryOderAdd);
