import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { mechanicActions } from '~/state/ducks/mechanic';
import Divider from '~/views/presentation/divider';
import { MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate, typeValidate } from '~/views/utilities/ant-validation';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);

  const [shippingAddressInfo, setShippingAddressInfo] = useState();

  useEffect(() => {
    if (props.id) {
    }
  }, [props.id]);

  const onFinish = (values) => {};

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
        <Col md={24} lg={24} className="w-100">
          <Form.Item //
            hasFeedback
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            label={t('fullname')}
            validateFirst
            name="fullName"
            rules={commonValidate().concat(typeValidate('string'))}>
            <Input allowClear size="large" placeholder={t('fullname')} />
          </Form.Item>
        </Col>
        <Col md={24} lg={11}>
          <MInputPhone
            noLabel
            noPadding
            readOnly={props.isEditing}
            label={t('phone_number')}
            placeholder={t('login_phone_number')}
            name="phoneNumber"
            extra={props.isEditing ? null : <span style={{ fontSize: '11px' }}>{t('phone_number_extra')}</span>}
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
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
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            form={form}
            label={t('address')}
            name="addressInfo"
            needLoadData={addressNeedLoad}
            noLabel
            noPadding
            require={false}
            setNeedLoadData={setAddressNeedLoad}
          />
        </Col>

        <Divider />

        <Col span={24}>
          <MInputAddress //
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            form={form}
            label={t('shippingAddress')}
            name="addressInfo"
            needLoadData={addressNeedLoad}
            noLabel
            noPadding
            require={false}
            setNeedLoadData={setAddressNeedLoad}
          />
        </Col>
      </Row>

      <Form.Item>
        {props.isPage ? (
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="px-5"
              size="large"
              htmlType="submit"
              loading={submitting}
              type="primary"
              icon={props.submitIcon}>
              {props.submitText}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              loading={submitting}
              onClick={() => {
                form.submit();
                history.push(PATH.CAR_SERVICES_CUSTOMER_LIST_PATH);
              }}
              icon={props.submitIcon}>
              {props.secondarySubmitText}
            </AButton>
          </div>
        ) : (
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="px-5"
              size="large"
              htmlType="submit"
              loading={submitting}
              type="primary"
              icon={props.submitIcon}>
              {props.submitText}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              type="ghost"
              onClick={() => {
                form.resetFields();
                props.onCancel();
              }}
              icon={<CloseOutlined />}>
              {props.cancelText || t('close')}
            </AButton>
          </div>
        )}
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getMechanicDetail: mechanicActions.getMechanicDetail,
  createMechanic: mechanicActions.createMechanic,
  updateMechanic: mechanicActions.updateMechanic
})(InfoForm);
