import { CloseOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';
import { DELIVERY_ODER_STATUS } from '~/configs/status/car-accessories/deliveryOderStatus';
import { arInvoiceActions } from '~/state/ducks/ar_invoice';
import { DeliveryOrderType } from '~/state/ducks/ar_invoice/actions';
import { customerActions } from '~/state/ducks/customer';
import { CustomerListResponse } from '~/state/ducks/customer/actions';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';

const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
`;

const ReturnModal = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState<DeliveryOrderType | undefined>();

  const [customerList, setCustomerList] = useState<CustomerListResponse[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [actionType, setActionType] = useState('');
  const [orderDetail, setOrderDetail] = useState<DeliveryOrderType[]>([]);

  const countryWatch = Form.useWatch('deliveryCode', form);
  const customerAddress = selectedIds?.deliveryTo?.customer?.address;

  const filterOrderDetail = orderDetail.filter((e) => e.status !== DELIVERY_ODER_STATUS.WAITING && e.status !== DELIVERY_ODER_STATUS.DONE);

  useEffect(() => {
    if (countryWatch) {
      props.setOrderId(countryWatch);
      props.getArInvoiceDetail(countryWatch).then((res: { content: DeliveryOrderType }) => {
        setSelectedIds(res?.content);
        props.setFullAddress(res?.content?.deliveryTo?.fullAddress);
      });
    }
    props
      .getDeliveryOrder()
      .then((res: { content: DeliveryOrderType[] }) => {
        setOrderDetail(res?.content);
      })
      .catch((err) => {
        console.error(err);
      });
    props.getCustomers({ businessType: CUSTOMER_BUSINESS_TYPE.SUPPLIER }).then((res: { content: CustomerListResponse[] }) => {
      setCustomerList(res?.content);
    });
  }, [countryWatch]);
  const submitForm = (action, body, successMessage) => {
    action(body)
      .then((res: any) => {
        setSubmitting(false);
        setDirty(false);
        form.resetFields();
        AMessage.success(t(successMessage));
        props.setNeedLoadNewData && props.setNeedLoadNewData(true);
        props.onCancel(true);
        // history.push(PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH);
      })
      .catch((err) => {
        catchPromiseError(err);
        setDirty(false);
        // history.push(PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH);
      });
  };
  const catchPromiseError = (err) => {
    setLoading(false);
    AMessage.error(t(err.message));
    console.error('trandev ~ file: InfoForm.js ~ line 31 ~ useEffect ~ err', err);
  };

  const onFinish = async (values) => {
    if (selectedIds) {
      const data = customerList?.find((e) => e?.profileId == selectedIds?.deliveryTo?.customer.id);
      const body = selectedIds?.deliveryDetails.map((data) => {
        return {
          tradingProductId: data?.tradingProductId,
          sku: data?.sku,
          productName: data?.productName,
          unit: data?.unit,
          unitPrice: data?.unitPrice,
          quantity: data?.deliveriedQuantity,
          deliveriDate: selectedIds?.createdDate,
          tradingProductCache: data?.tradingProductCache,
          orderDetailId: data?.orderDetailId,
          orderedQuantity: data?.orderedQuantity,
          deliveriedQuantity: data?.deliveriedQuantity,
          note: data?.note

          // vat: ((data?.deliveriedQuantity * data?.unitPrice) / 100) * 10
        };
      });
      const addressName = `${customerAddress?.address || ''} ${customerAddress?.fullAddress || ''}`.trim();
      props.form.setFieldsValue({
        customerCode: data?.code,
        customerName: selectedIds?.deliveryTo?.customer?.fullName,
        note: selectedIds?.note,
        country1: customerAddress?.countryId,
        address1: addressName,
        state: customerAddress?.stateId || undefined,
        zipCode: customerAddress?.zipCode || undefined,
        province: customerAddress?.provinceId,
        district: customerAddress?.districtId,
        ward: customerAddress?.wardsId
      });
      props.setAddressNeedLoad({
        country: customerAddress?.countryId,
        state: customerAddress?.stateId,
        province: customerAddress?.provinceId,
        district: customerAddress?.districtId,
        ward: customerAddress?.wardsId
      });

      props.setLoadData([body]);
    }

    setSubmitting(false);
    setDirty(false);
    form.resetFields();
    props.setModalShow(false);
    AMessage.success(t('get_delivery_success'));
    // submitForm(
    //   //
    //   await props.createArInvoice,
    //   body,
    //   'create_ar_invoice_success'
    // );
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitDisabled(true);
    props.setModalShow(false);
    // props.setData([]);
    setSelectedIds(undefined);
  };

  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t('select_delivery_order')}
      // description={t(`${actionType}_pricing_product_des`)}
      width={1000}
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={handleCancel}>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <MSelect
          noPadding
          name="deliveryCode"
          noLabel
          // disabled={!isEditing}
          require={false}
          labelAlign="left"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          label={t('select_delivery_code')}
          placeholder={t('find_delivery_code')}
          options={(orderDetail || []).map((o: any) => {
            return {
              value: o.id,
              search: o.gdnNo,
              label: o.gdnNo
            };
          })}
          showSearch
        />

        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', minWidth: '200px' }}
              className="px-5"
              loading={loading}
              size="large"
              // disabled={submitDisabled}
              htmlType="submit"
              type="primary">
              {t('confirm_select')}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '200px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              type="ghost"
              onClick={handleCancel}
              icon={<CloseOutlined />}>
              {t('close')}
            </AButton>
          </div>
        </Form.Item>
      </Form>
    </AntModal>
  );
};

export default connect(null, {
  getDeliveryOrder: arInvoiceActions.getDeliveryOrder,
  getArInvoiceDetail: arInvoiceActions.getArInvoiceDetail,
  getCustomers: customerActions.getCustomers
})(ReturnModal);
