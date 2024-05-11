import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { customerActions } from '~/state/ducks/customer';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { typeValidate } from '~/views/utilities/ant-validation';

import VehicleList from '../components/VehicleList';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [vehicleList, setVehicleList] = useState([]);
  // for full address
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);
  const [addressInfo, setAddressInfo] = useState();

  useEffect(() => {
    if (props.id) {
      props
        .getCustomerDetail(props.id)
        .then((res) => {
          const response = res?.content;
          const address = response?.address;
          const addressName = `${address?.address} ${address?.fullAddress}`.trim();

          form.setFieldsValue({
            avatar: response?.avatar,
            phone: response?.phone,
            fullName: response?.fullName,
            code: response?.country.id,
            email: response?.email,
            // address
            country1: address?.countryId,
            address1: addressName,
            state: address?.stateId,
            zipCode: address?.zipCode,
            province: address?.provinceId,
            district: address?.districtId,
            ward: address?.wardsId
          });
          setAddressNeedLoad({
            country: address?.countryId,
            state: address?.stateId,
            province: address?.provinceId,
            district: address?.districtId,
            ward: address?.wardsId
          });
          // for file upload
          setAvatarFile(response?.avatar);
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 66 ~ useEffect ~ err', err);
        });
    }
  }, [props.id]);

  const onFinish = (values) => {
    setSubmitting(true);
    const addressSplit = values?.address1?.split(' ');
    const body = {
      ...values,
      countryId: values.code,
      phone: values.phone.startsWith(0) ? values.phone.slice(0) : values.phone,
      logo: values.avatar,
      vehicleInfos: vehicleList,
      address: {
        address: addressSplit[0], // house number
        districtId: values.district,
        fullAddress: addressSplit.slice(1).join(' '), // street name
        provinceId: values.province,
        wardsId: values.ward,
        stateId: values.state,
        countryId: values.country1, // this is the actual country address
        zipCode: values.zipCode
      }
    };
    if (props.id) {
      props
        .editCustomer({ ...body, id: props.id })
        .then((res) => {
          AMessage.success(t('edit_customer_success'));
          props.onOk();
          props.setNeedLoadNewData(true);
          setSubmitting(false);
        })
        .catch((err) => {
          AMessage.error(err.message);
          setSubmitting(false);
        });
    } else {
      props
        .createCustomer(body)
        .then((res) => {
          AMessage.success(t('create_customer_success'));
          props.onOk();
          props.setNeedLoadNewData(true);
          setSubmitting(false);
        })
        .catch((err) => {
          AMessage.error(err.message);
          setSubmitting(false);
        });
    }
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onAvatarChange = (file) => {
    form.setFieldsValue({ avatar: file });
  };

  const onValuesChange = () => {
    props.setDirty(true);
  };

  return (
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}>
      <Row>
        <Col md={24} lg={12}>
          <Row>
            <Col md={24} lg={16} className="w-100">
              <MInput //
                noLabel
                noPadding
                label={t('fullName')}
                name="fullName"
                placeholder={t('fullName')}
                require
              />
            </Col>
            <Col md={24} lg={2}></Col>
            <Col md={24} lg={6} className="w-100">
              <MUploadImageCrop //
                name="avatar"
                noPadding
                file={avatarFile}
                require={false}
                uploadText={t('upload_avatar')}
                aspect={1}
                onImageChange={onAvatarChange}
              />
            </Col>
            <Col md={24} lg={11}>
              <MInputPhone
                noLabel
                noPadding
                phoneTextTranslate="1px"
                readOnly={props.isEditing}
                label={t('phone_number')}
                placeholder={t('login_phone_number')}
                name="phoneNumber"
                extra={props.isEditing ? null : <span style={{ fontSize: '11px' }}>{t('phone_number_extra')}</span>}
                require
              />
            </Col>
            <Col md={24} lg={1}></Col>
            <Col md={24} lg={12}>
              <Form.Item //
                hasFeedback
                label={t('Email')}
                name="email"
                validateFirst
                rules={typeValidate('email')}>
                <Input allowClear size="large" placeholder={t('Email')} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <MInputAddress //
                form={form}
                label={t('address')}
                name="addressInfo"
                needLoadData={addressNeedLoad}
                noLabel
                noPadding
                require
                setNeedLoadData={setAddressNeedLoad}
              />
            </Col>

            <Divider />
          </Row>
        </Col>
        <Col md={24} lg={1}></Col>
        <Col md={24} lg={11}>
          <VehicleList vehicleList={vehicleList} setVehicleList={setVehicleList} />
        </Col>
      </Row>

      <Form.Item className="mt-5">
        {props.isPage ? (
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} title={props.submitText} />
            <BasicBtn
              size="large"
              loading={submitting}
              onClick={() => {
                form.submit();
                history.push(PATH.CAR_SERVICES_CUSTOMER_LIST_PATH);
              }}
              icon={props.submitIcon}
              title={props.secondarySubmitText}
            />
          </div>
        ) : (
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} title={props.submitText} />
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
        )}
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  createCustomer: customerActions.createCustomer,
  getCustomerDetail: customerActions.getCustomerDetail,
  editCustomer: customerActions.editCustomer
})(InfoForm);
