import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Input, message, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useBeforeUnload } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { ACCEPT_FILE_UPLOAD } from '~/configs/upload';
import { mechanicActions } from '~/state/ducks/mechanic';
import { KTUtil } from '~/static/js/components/util';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputNumber, MInputPhone, MTextArea } from '~/views/presentation/fields/input';
import { MBasicUpload, MUploadImageCrop, MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate, nameValidate, phoneValidate, typeValidate } from '~/views/utilities/ant-validation';
import { isJsonString } from '~/views/utilities/helpers/string.js';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileFile, setProfileFile] = useState([]);
  const [certificateFile, setCertificateFile] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [profileId, setProfileId] = useState();
  const [dirty, setDirty] = useState(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);

  useEffect(() => {
    if (props.id) {
      props
        .getMechanicDetail(props.id)
        .then((res) => {
          const response = res?.content;
          const documentMedia =
            response?.documentMedia !== ''
              ? isJsonString(response?.documentMedia) //
                ? JSON.parse(response?.documentMedia)
                : []
              : [];
          const certificates =
            response?.certificates !== ''
              ? isJsonString(response?.certificates) //
                ? JSON.parse(response?.certificates)
                : []
              : [];

          props.form.setFieldsValue({
            avatar: response?.avatar,
            documentMedia: documentMedia,
            phone: response?.phone,
            fullName: response?.fullName,
            code: response?.country.id,
            email: response?.email,
            experience: response?.experience,
            yearsOfExperience: response?.yearsOfExperience,
            certificates: certificates,
            // address
            country1: response?.address?.countryId,
            address1: response?.address?.address || response?.address?.fullAddress,
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
          // for file upload
          setAvatarFile(response?.avatar);
          setProfileFile(documentMedia);
          setCertificateFile(certificates.map((m) => (typeof m === 'string' ? m : m?.path)));
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 41 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
        });
    } else {
      // set phone code is VN +84 as default
      props.form.setFieldsValue({ code: 241 });
    }
  }, [props.id]);

  const submitForm = (action, body, successMessage) => {
    action(body)
      .then((res) => {
        AMessage.success(t(successMessage));
        props.onCancel();
        props.setIsEditing && props.setIsEditing(false);
        props.setNeedLoadNewData && props.setNeedLoadNewData(true);
        setCertificateFile([]);
        setProfileFile([]);
        setDirty(false);
        setSubmitting(false);
        props.form.resetFields();
        history.push(PATH.CAR_SERVICES_EMPLOYEE_PATH);
      })
      .catch((err) => {
        console.error('trandev ~ file: InfoForm.js ~ line 86 ~ onFinish ~ err', err);
        AMessage.error(t(err.message));
        setSubmitting(false);
      });
  };

  const onFinish = (values) => {
    setSubmitting(true);
    // get the country phone number code, i.e: +84
    const countryCode = head(props.countries?.filter((country) => country?.id === values?.code))?.phone;
    const phoneNumber = values?.phone?.startsWith('0') ? countryCode + values?.phone?.slice(1) : countryCode + values?.phone;
    const addressSplit = values?.address1?.split(' ');
    const profileBody = {
      avatar: values?.avatar,
      email: values?.email,
      certificates: JSON.stringify(values?.certificates),
      documentMedia: JSON.stringify(values?.documentMedia),
      experience: values?.experience,
      fullName: values?.fullName,
      experience: values?.experience,
      yearsOfExperience: values?.yearsOfExperience,
      address: {
        address: addressSplit[0], // house number
        districtId: values?.district,
        fullAddress: addressSplit.slice(1).join(' '), // street name
        provinceId: values?.province,
        wardsId: values?.ward,
        stateId: values?.state,
        countryId: values?.country1, // this is the actual country address
        zipCode: values?.zipCode
      }
    };

    props.id
      ? // update mechanic
        submitForm(
          //
          props.updateMechanic,
          { ...profileBody, id: profileId },
          'update_mechanic_success'
        )
      : // create mechanic
        submitForm(
          props.createMechanic,
          {
            profile: {
              ...profileBody,
              countryId: values.code, // this is the country phone code, i.e: VN +84
              phone: phoneNumber
            },
            username: phoneNumber,
            password: values.password
          },
          'create_mechanic_success'
        );
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onAvatarChange = (file) => {
    setDirty(Boolean(file));
    setAvatarFile(file);
    props.form.setFieldsValue({ avatar: file });
  };

  const onCertificateChange = (file) => {
    setDirty(Boolean(file));
    props.form.setFieldsValue({
      certificates: (file || []).map((cer) => {
        return {
          url: cer?.url,
          name: cer?.name,
          type: 'IMAGE'
        };
      })
    });
  };

  const onProfileChange = (file) => {
    setDirty(Boolean(file));
    props.form.setFieldsValue({
      documentMedia: (file || []).map((p) => {
        return {
          name: p?.name,
          url: p?.url,
          type: 'DOCUMENT'
        };
      })
    });
  };

  const PhoneField = (props) => {
    return (
      <MInputPhone
        noLabel
        noPadding
        disabled={props.isEditing}
        readOnly={props.isEditing}
        label={t('phone_number')}
        placeholder={t('login_phone_number')}
        name="phoneNumber"
        mRules={phoneValidate()}
        extra={props.isEditing ? null : <span style={{ fontSize: '11px' }}>{t('phone_number_extra')}</span>}
        require
        phoneTextTranslate="1px"
        onChange={onPhoneChange}
      />
    );
  };

  const AvatarField = (
    <MUploadImageCrop //
      name="avatar"
      noPadding
      require={false}
      uploadText={t('upload_avatar')}
      aspect={1}
      file={avatarFile}
      onImageChange={onAvatarChange}
    />
  );

  const onPasswordChange = async (e) => {
    if (!e.target.value) {
      props.form.setFieldsValue({ password: null });
    }
  };

  const onConfirmPasswordChange = async (e) => {
    if (!e.target.value) {
      props.form.setFieldsValue({ rePassword: null });
    }
  };

  const onPhoneChange = async (e) => {
    if (!e.target.value) {
      props.form.setFieldsValue({ phoneNumber: null });
    }
  };

  const onFullnameChange = async (e) => {
    if (!e.target.value) {
      props.form.setFieldsValue({ fullName: null });
    }
  };

  // Before unload
  useBeforeUnload(dirty, t('leave_confirm'));
  const onFormChange = () => {
    const values = props.form.getFieldsValue(true);
    setDirty(
      !!(
        values.certificates ||
        values.documentMedia ||
        values.experience ||
        values.yearsOfExperience ||
        values.address1 ||
        values.district ||
        values.province ||
        values.country1 ||
        values.ward ||
        values.state ||
        values.zipCode ||
        values.email ||
        values.fullName ||
        values.password ||
        values.rePassword ||
        values.avatar ||
        values.phoneNumber
      )
    );
  };

  const leaveConfirm = () => {
    if (dirty && props.isModal) {
      props.onCancel(true);
    } else {
      props.onCancel();
      setDirty(false);
    }
  };

  return (
    <Form //
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      form={props.form}
      requiredMark={false}
      onChange={onFormChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Prompt when={dirty} message={t('leave_confirm')} />
      <Row>
        <Col md={24} lg={12}>
          <Row>
            <Col md={24} lg={15}>
              {KTUtil.isMobileDevice() ? AvatarField : <PhoneField isEditing={props.isEditing} />}
            </Col>
            <Col md={24} lg={9} className="d-lg-flex justify-content-center">
              {KTUtil.isMobileDevice() ? <PhoneField isEditing={props.isEditing} /> : AvatarField}
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
                  //hasFeedback
                  rules={commonValidate(6, '6').concat(typeValidate('string'))}>
                  <Input.Password allowClear size="large" placeholder={t('password')} name="password" onChange={onPasswordChange} />
                </Form.Item>
              </Col>

              <Col md={0} lg={1}></Col>

              <Col md={24} lg={11} className="d-lg-flex justify-content-end">
                <Form.Item
                  // hasFeedback
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
                  <Input.Password allowClear size="large" placeholder={t('confirm_pass')} onChange={onConfirmPasswordChange} />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider />

          <Row>
            <Col md={24} lg={12} className="w-100">
              <MInput //
                noLabel
                noPadding
                name="fullName"
                mRules={nameValidate()}
                require
                label={t('fullname')}
                placeholder={t('fullname')}
                onChange={onFullnameChange}
              />
            </Col>

            <Col md={0} lg={1}></Col>

            <Col md={24} lg={11} className="w-100">
              <MInput //
                noLabel
                noPadding
                type="email"
                name="email"
                label={t('Email')}
                placeholder={t('Email')}
                require={false}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <MInputAddress //
                form={props.form}
                label={t('address')}
                name="addressInfo"
                needLoadData={addressNeedLoad}
                noLabel
                noPadding
                require
                setNeedLoadData={setAddressNeedLoad}
              />
            </Col>
          </Row>
        </Col>

        <Col md={0} lg={1}></Col>

        <Col md={24} lg={11}>
          <MInputNumber //
            fullWidth
            noPadding
            require={false}
            noLabel
            max={50}
            label={t('yrs_of_exp')}
            placeholder={t('enter_years_of_exp')}
            name="yearsOfExperience"
          />

          <MTextArea
            noPadding
            noLabel
            editOrganizationInformation
            rows={5}
            name="experience"
            label={t('describe_exp')}
            placeholder={t('')}
            require={false}
          />

          <MBasicUpload //
            noPadding
            noLabel
            name="documentMedia"
            fileList={profileFile}
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
            label={t('certification')}
            name="certificates"
            require={false}
            uploadText={t('upload_certificate')}
            onImageChange={onCertificateChange}
          />
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <BasicBtn size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} title={props.submitText} />
          <BasicBtn
            size="large"
            type="ghost"
            onClick={() => {
              leaveConfirm();
              !props.isModal && history.push(PATH.CAR_SERVICES_EMPLOYEE_PATH);
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
    getMechanicDetail: mechanicActions.getMechanicDetail,
    createMechanic: mechanicActions.createMechanic,
    updateMechanic: mechanicActions.updateMechanic
  }
)(InfoForm);
