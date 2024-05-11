import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useWindowSize } from 'react-use';
import { mechanicActions } from '~/state/ducks/mechanic';
import { memberActions } from '~/state/ducks/member';
import Divider from '~/views/presentation/divider';
import { MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate, nameValidate, typeValidate } from '~/views/utilities/ant-validation';

import VehicleList from '../components/VehicleList';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { width, height } = useWindowSize();
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileFile, setProfileFile] = useState([]);
  const [certificateFile, setCertificateFile] = useState([]);
  const [expDescription, setExpDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [profileId, setProfileId] = useState();
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);

  const [vehicleList, setVehicleList] = useState([]);

  useEffect(() => {
    if (props.id) {
      props
        .getMemberDetail(props.id)
        .then((res) => {
          const response = res?.content;
          form.setFieldsValue({
            avatar: response?.avatar,
            profile: JSON.parse(response?.documentMedia || '[]'),
            phone: response?.phone,
            fullName: response?.fullName,
            code: response?.country.id,
            email: response?.email,
            yearsOfExperience: response?.yearsOfExperience,
            certificates: JSON.parse(response?.certificates || '[]').map((cer) => cer.url),
            // address
            country1: response?.address?.countryId,
            address1: response?.address?.address,
            state: response?.address?.stateId,
            zipCode: response?.address?.zipCode,
            province: response?.address?.provinceId,
            district: response?.address?.districtId,
            ward: response?.address?.wardsId
          });
          setAddressNeedLoad({
            country: response?.address?.countryId,
            state: response?.address?.stateId,
            province: response?.address?.provinceId,
            district: response?.address?.districtId,
            ward: response?.address?.wardsId
          });
          // set profile id to update
          setProfileId(response?.profileId);
          // for ckeditor input
          setExpDescription(response?.experience);
          // for file upload
          setAvatarFile(response?.avatar);
          setProfileFile(JSON.parse(response?.documentMedia || '[]'));
          setCertificateFile(JSON.parse(response?.certificates || '[]').map((cer) => cer.url));
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 41 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
        });
    } else {
      // set phone code is VN +84 as default
      form.setFieldsValue({ code: 241 });
    }
  }, [props.id]);

  const onFinish = (values) => {
    setSubmitting(true);
    const profileBody = {
      avatar: values.avatar,
      countryId: values.code, // this is the country phone code, i.e: VN +84
      email: values.email,
      experience: values.experience,
      fullName: values.fullName,
      yearsOfExperience: values.yearsOfExperience,
      address: {
        address: values.address1,
        districtId: values.district,
        fullAddress: values.addressInfo.filter(Boolean).join(', '),
        provinceId: values.province,
        wardsId: values.ward,
        stateId: values.state,
        countryId: values.country1, // this is the actual country address
        zipCode: values.zipCode
      }
    };

    // if the action is edit, then no need profile field
    const body = props.id
      ? profileBody
      : {
          profile: { ...profileBody, phone: values.phone.startsWith('0') ? values.phone.slice(1) : values.phone }
        };

    if (props.id) {
      props
        .updateMechanic({ ...body, id: profileId })
        .then((res) => {
          AMessage.success(t('update_member_success'));
          setSubmitting(false);
          props.onCancel();
          props.setNeedLoadNewData(true);
        })
        .catch((err) => {
          AMessage.error(t(err.message));
          console.error('trandev ~ file: InfoForm.js ~ line 86 ~ onFinish ~ err', err);
          setSubmitting(false);
        });
    } else {
      props
        .createMechanic({
          ...body,
          username: values.phone.startsWith('0') ? values.phone.slice(1) : values.phone,
          password: values.password
        })
        .then((res) => {
          AMessage.success(t('create_member_success'));
          setSubmitting(false);
          props.onCancel();
          props.setNeedLoadNewData(true);
        })
        .catch((err) => {
          AMessage.error(t(err.message));
          console.error('trandev ~ file: InfoForm.js ~ line 72 ~ onFinish ~ err', err);
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

  const PhoneField = (props) => {
    return (
      <MInputPhone
        noLabel
        require
        noPadding
        disabled={props.isEditing}
        label={t('phone_number')}
        placeholder={t('login_phone_number')}
        name="phoneNumber"
        phoneTextTranslate="1px"
        extra={props.isEditing ? null : <span style={{ fontSize: '11px' }}>{t('phone_number_extra')}</span>}
      />
    );
  };

  const AvatarField = () => {
    return (
      <MUploadImageCrop //
        name="avatar"
        noPadding
        file={avatarFile}
        require={false}
        uploadText="Upload avatar"
        aspect={1}
        onImageChange={onAvatarChange}
      />
    );
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
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col md={24} lg={12}>
          <Row>
            <Col md={24} lg={15}>
              {width <= 768 ? <AvatarField /> : <PhoneField isEditing={props.isEditing} />}
            </Col>
            <Col md={24} lg={9} className="d-lg-flex justify-content-end">
              {width <= 768 ? <PhoneField isEditing={props.isEditing} /> : <AvatarField />}
            </Col>
          </Row>

          {!props.isEditing && (
            <Row>
              <Col md={24} lg={12}>
                <Form.Item
                  label={t('password')}
                  validateFirst
                  tooltip={{
                    title: t('required_field'),
                    icon: (
                      <span>
                        (<ATypography type="danger">*</ATypography>)
                      </span>
                    )
                  }}
                  name="password"
                  hasFeedback
                  rules={commonValidate(6, '6').concat(typeValidate('string'))}>
                  <Input.Password allowClear size="large" placeholder={t('password')} name="password" />
                </Form.Item>
              </Col>

              <Col md={0} lg={1}></Col>

              <Col md={24} lg={11} className="d-lg-flex justify-content-end">
                <Form.Item
                  hasFeedback
                  tooltip={{
                    title: t('required_field'),
                    icon: (
                      <span>
                        (<ATypography type="danger">*</ATypography>)
                      </span>
                    )
                  }}
                  label={t('confirm_pass')}
                  name="rePassword"
                  validateFirst
                  rules={commonValidate().concat(({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('pass_not_match')));
                    }
                  }))}>
                  <Input.Password allowClear size="large" placeholder={t('confirm_pass')} />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider />

          <Row>
            <Col md={24} lg={12} className="w-100">
              <Form.Item //
                hasFeedback
                require
                label={t('fullname')}
                validateFirst
                name="fullName"
                rules={commonValidate().concat(nameValidate())}>
                <Input allowClear size="large" placeholder={t('fullname')} />
              </Form.Item>
            </Col>

            <Col md={0} lg={1}></Col>

            <Col md={24} lg={11} className="w-100">
              <Form.Item //
                hasFeedback
                label={t('Email')}
                name="email"
                validateFirst
                rules={typeValidate('email')}>
                <Input allowClear size="large" placeholder={t('Email')} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
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
              />
            </Col>
          </Row>
        </Col>

        <Col md={0} lg={2}></Col>

        <Col md={24} lg={10}>
          <VehicleList vehicleList={vehicleList} setVehicleList={setVehicleList} />
        </Col>
      </Row>

      <Divider />
      <Form.Item>
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
            style={{ verticalAlign: 'middle', width: '200px' }}
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
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getMemberDetail: memberActions.getMemberDetail,
  createMechanic: mechanicActions.createMechanic,
  updateMechanic: mechanicActions.updateMechanic
})(InfoForm);
