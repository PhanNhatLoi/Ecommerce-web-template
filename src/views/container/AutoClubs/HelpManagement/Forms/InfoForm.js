import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useWindowSize } from 'react-use';
import { ACCEPT_FILE_UPLOAD } from '~/configs/upload';
import { mechanicActions } from '~/state/ducks/mechanic';
import Divider from '~/views/presentation/divider';
import { MCKEditor, MInputAddress, MInputNumber, MInputPhone } from '~/views/presentation/fields/input';
import { MBasicUpload, MUploadImageCrop, MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate, typeValidate } from '~/views/utilities/ant-validation';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { width, height } = useWindowSize();
  const [avatarFile, setAvatarFile] = useState({});
  const [profileFile, setProfileFile] = useState([]);
  const [certificateFile, setCertificateFile] = useState([]);
  const [expDescription, setExpDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [profileId, setProfileId] = useState();
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);

  useEffect(() => {
    if (props.id) {
      props
        .getMechanicDetail(props.id)
        .then((res) => {
          form.setFieldsValue({
            avatar: res?.content?.avatar,
            profile: JSON.parse(res?.content.documentMedia),
            phone: res?.content.phone,
            fullName: res?.content.fullName,
            code: res?.content.country.id,
            email: res?.content.email,
            yearsOfExperience: res?.content.yearsOfExperience,
            certificates: JSON.parse(res?.content.certificates).map((cer) => cer.url),
            // address
            country1: res?.content.address.countryId,
            address1: res?.content.address.address,
            state: res?.content.address.stateId,
            zipCode: res?.content.address.zipCode,
            province: res?.content.address.provinceId,
            district: res?.content.address.districtId,
            ward: res?.content.address.wardsId
          });
          setAddressNeedLoad({
            country: res?.content.address.countryId,
            state: res?.content.address.stateId,
            province: res?.content.address.provinceId,
            district: res?.content.address.districtId,
            ward: res?.content.address.wardsId
          });
          // set profile id to update
          setProfileId(res?.content.profileId);
          // for ckeditor input
          setExpDescription(res?.content.experience);
          // for file upload
          setAvatarFile(res?.content?.avatar);
          setProfileFile(JSON.parse(res?.content.documentMedia));
          setCertificateFile(JSON.parse(res?.content.certificates).map((cer) => cer.url));
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
      documentMedia: JSON.stringify(
        (values.profile || []).map((p) => {
          return {
            name: p.name,
            url: p.url,
            type: 'DOCUMENT'
          };
        })
      ),
      certificates: JSON.stringify(
        (values.certificates || []).map((cer) => {
          return {
            url: cer,
            type: 'IMAGE'
          };
        })
      ),
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
          AMessage.success(t('update_mechanic_success'));
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
          AMessage.success(t('create_mechanic_success'));
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

  const onCertificateChange = (file) => {
    form.setFieldsValue({ certificates: file });
  };

  const onDescriptionChange = (data) => {
    form.setFieldsValue({ experience: data });
  };

  const onProfileChange = (file) => {
    form.setFieldsValue({ profile: file });
  };

  const PhoneField = (props) => {
    return (
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
                tooltip={{
                  title: t('required_field'),
                  icon: (
                    <span>
                      (<ATypography type="danger">*</ATypography>)
                    </span>
                  )
                }}
                noLabel
                form={form}
                name="addressInfo"
                needLoadData={addressNeedLoad}
                setNeedLoadData={setAddressNeedLoad}
                noPadding
                label={t('address')}
              />
            </Col>
          </Row>
        </Col>

        <Col md={0} lg={1}></Col>

        <Col md={24} lg={11}>
          <MInputNumber //
            fullWidth
            noPadding
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            require
            noLabel
            label={t('yrs_of_exp')}
            placeholder={t('enter_years_of_exp')}
            name="yearsOfExperience"
          />

          <MCKEditor //
            noPadding
            noLabel
            require={false}
            name="experience"
            label={t('describe_exp')}
            value={expDescription}
            onChange={onDescriptionChange}
          />

          <MBasicUpload //
            noPadding
            noLabel
            name="profile"
            fileList={profileFile}
            label={t('upload_profile')}
            required={false}
            maximumUpload={2}
            accept={ACCEPT_FILE_UPLOAD.join(',')}
            onImageChange={onProfileChange}
            extra={<span style={{ fontSize: '11px' }}>{`${t('required_format')}: pdf, word`}</span>}
          />

          <MUploadImageNoCropMultiple //
            noLabel
            noPadding
            fileList={certificateFile}
            name="certificates"
            require={false}
            label={t('certificates')}
            onImageChange={onCertificateChange}
          />
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <AButton
            style={{ verticalAlign: 'middle', width: '200px' }}
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
  getMechanicDetail: mechanicActions.getMechanicDetail,
  createMechanic: mechanicActions.createMechanic,
  updateMechanic: mechanicActions.updateMechanic
})(InfoForm);
