import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { supplierActions } from '~/state/ducks/vendors/supplier';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { typeValidate } from '~/views/utilities/ant-validation';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  // for full address
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);

  useEffect(() => {
    if (props.id) {
      props
        .getDetailSupplier(props.id)
        .then((res) => {
          const content = res?.content;
          form.setFieldsValue({
            name: content?.name,
            code: content?.phone.startsWith('84') ? 241 : content?.phone.startsWith('1') ? 233 : 241,
            phone: content?.phone.startsWith('84') ? content?.phone?.slice(2) : content?.phone,
            email: content?.email,
            address1: head(content?.address?.fullAddress?.split(', ')),
            country1: content?.address?.countryId,
            state: content?.address?.stateId,
            zipCode: content?.address?.zipCode,
            province: content?.address?.provinceId,
            district: content?.address?.districtId,
            ward: content?.address?.wardId
          });
          setAddressNeedLoad({
            country: content?.address?.countryId,
            state: content?.address?.stateId,
            province: content?.address?.provinceId,
            district: content?.address?.districtId,
            ward: content?.address?.wardId
          });
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 65 ~ useEffect ~ err', err);
        });
    } else {
      form.setFieldsValue({ code: 241 });
    }
  }, [props.id]);

  const onFinish = (values) => {
    setSubmitting(true);
    // get the country phone number code, i.e: +84
    const countryCode = head(props.countries.filter((country) => country.id === values.code))?.phone;
    const phoneNumber = values.phone.startsWith('0') ? countryCode + values.phone.slice(1) : countryCode + values.phone;
    const body = {
      name: values?.name,
      email: values?.email,
      phone: phoneNumber,
      address: {
        address: values.address1,
        districtId: values.district,
        fullAddress: values.addressInfo.filter(Boolean).join(', '),
        provinceId: values.province,
        wardId: values.ward,
        stateId: values.state,
        countryId: values.country1, // this is the actual country address
        zipCode: values.zipCode
      }
    };
    props.isCreate
      ? props
          .createSupplier(body)
          .then((res) => {
            AMessage.success(t('create_supplier_success'));
            setSubmitting(false);
            props.setNeedLoadNewData && props.setNeedLoadNewData(true);
            form.resetFields();
            props.onCancel();
          })
          .catch((err) => {
            console.error('trandev ~ file: InfoForm.js ~ line 75 ~ props.isCreate?props.createSupplier ~ err', err);
            setSubmitting(false);
            AMessage.error(t(err.message));
          })
      : props
          .updateSupplier({ ...body, id: props.id })
          .then((res) => {
            AMessage.success(t('update_supplier_success'));
            setSubmitting(false);
            props.setNeedLoadNewData && props.setNeedLoadNewData(true);
            form.resetFields();
            props.onCancel();
          })
          .catch((err) => {
            console.error('trandev ~ file: InfoForm.js ~ line 75 ~ props.isCreate?props.createSupplier ~ err', err);
            setSubmitting(false);
            AMessage.error(t(err.message));
          });
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  return (
    <Form //
      requiredMark={false}
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col span={24}>
          <MInput //
            noLabel
            disabled={!props.isEditing}
            noPadding
            label={t('fullname')}
            name="name"
            placeholder={t('fullname')}
            require
          />
        </Col>
        <Col md={24} lg={11}>
          <MInputPhone
            noLabel
            noPadding
            phoneTextTranslate="1px"
            disabled={!props.isEditing}
            label={t('phone_number')}
            placeholder={t('phone_number')}
            name="phone"
            require
          />
        </Col>
        <Col md={24} lg={1}></Col>
        <Col md={24} lg={12}>
          <MInput
            noPadding
            noLabel
            disabled={!props.isEditing}
            hasLayoutForm
            label={t('Email')}
            name="email"
            validateFirst
            allowClear
            rules={typeValidate('email')}
            placeholder={t('Email')}
          />
        </Col>

        <Col span={24}>
          <MInputAddress //
            form={form}
            label={t('address')}
            name="addressInfo"
            needLoadData={addressNeedLoad}
            noLabel
            noPadding
            require={false}
            setNeedLoadData={setAddressNeedLoad}
            disabled={!props.isEditing}
          />
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          {props.isEditing && (
            <BasicBtn size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} title={props.submitText} />
          )}
          <BasicBtn
            size="large"
            type="ghost"
            onClick={() => {
              form.resetFields();
              props.onCancel();
            }}
            icon={<CloseOutlined />}
            title={props.cancelText || t('close')}
          />
        </div>
      </Form.Item>
    </Form>
  );
};

export default connect(
  (state) => ({
    countries: state['appData']?.countries
  }),
  {
    createSupplier: supplierActions.createSupplier,
    updateSupplier: supplierActions.updateSupplier,
    getDetailSupplier: supplierActions.getDetailSupplier
  }
)(InfoForm);
