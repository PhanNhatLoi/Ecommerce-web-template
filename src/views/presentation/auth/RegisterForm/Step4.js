import { Form, Input } from 'antd/es';
import { useEffect, useMemo, useRef, useState } from 'react';
import Geocode from 'react-geocode';
import { Trans, withTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';
import COLOR from '~/color';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { BUSINESS_TYPES, GENERAL_TYPE, MAX_IMAGE_NUMBER } from '~/configs/const';
import { LOGIN_PATH } from '~/configs/routesConfig';
import { appDataActions } from '~/state/ducks/appData';
import { authActions } from '~/state/ducks/authUser';
import HostType from '~/views/container/commons/HostType';
import Divider from '~/views/presentation/divider';
import { MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AvatarUpload } from '~/views/presentation/ui/Images';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ModalNoThing from '~/views/presentation/ui/modal/ModalNoThing';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate, nameValidate } from '~/views/utilities/ant-validation';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

const Step4FormStyled = styled(Form)`
  .allow_geolocation {
    display: none;
    @media screen and (min-width: 1024px) {
      display: unset;
      position: fixed;
      top: 12%;
      left: 14%;
      animation: bounceInUp 1s ease-in-out both infinite;
      width: 100px;
      z-index: 1001;
    }
  }

  @keyframes bounceInUp {
    0%,
    60%,
    75%,
    90%,
    100% {
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      opacity: 0;
      transform: translate3d(0, 100px, 0);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, -20px, 0);
    }
    75% {
      transform: translate3d(0, 10px, 0);
    }
    90% {
      transform: translate3d(0, -5px, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  .image_container {
    margin-bottom: 20px;
    svg {
      max-width: 100%;
      height: auto;
    }
  }
`;

function Step4(props) {
  const { register, t, i18n } = props;
  const [form] = Form.useForm();
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [fileList, setFileList] = useState([]);
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);
  const [requestGeolocation, setRequestGeolocation] = useState(false);
  const businessTypeIdsWatch = Form.useWatch('businessTypeIds', form);
  const fullNameWatch = Form.useWatch('partner', form);
  const phoneNumberWatch = Form.useWatch('phoneNumber', form);
  const addressInfoWatch = Form.useWatch('addressInfo', form);
  const geoLocationPermission = useRef();

  useEffect(() => {
    // default phone code is VN +84
    form.setFieldsValue({ code: 241 });
  }, []);

  const requestGeoLocationPermission = (body) => {
    if (navigator.geolocation) {
      props.setBodyRequestNotAddress(body); // save body request without address
      setRequestGeolocation(true); // show modal request geolocation and arrow
      navigator.geolocation.getCurrentPosition(
        (res) => {
          body.profile.address.lat = res.coords.latitude;
          body.profile.address.lng = res.coords.longitude;
          setRequestGeolocation(body);
          props.setBodyRequest(body);
        },
        (err) => {
          if (err.code === 1) {
            props.setBodyRequest(body);
            setRequestGeolocation(false);
            // !geoLocationPermission.current && AMessage.warning(t('google_map_address_maybe_not_save'));
            !geoLocationPermission.current && props.setRegisterResult(t('google_map_address_maybe_not_save_register'));
          } else {
            props.setBodyRequest(err);
            setRequestGeolocation(body);
          }
        },
        {
          enableHighAccuracy: true
          // maximumAge: 1,
          // timeout: 3000
        }
      );
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    values.addressInfo[0] = values.address1;
    const fullAddress = values.addressInfo.filter(Boolean).join(', ');

    const body = {
      username: props.email,
      password: props.password,
      activationKey: props.resetKey,
      profile: {
        countryId: values.code, // the country code for phone number
        fullName: values.partner,
        email: props.email,
        phone: values.phone.startsWith('0') ? values.phone.slice(1) : values.phone,
        logo: avatar,
        avatar: avatar,
        address: {
          lat: undefined, //default lat lng undefined
          lng: undefined,
          address: values.address1,
          districtId: values.district,
          provinceId: values.province,
          wardsId: values.ward,
          stateId: values.state,
          // this is the actual country address, if address is empty use country code of phone field
          countryId: values.country1 || values.code,
          zipCode: values.zipCode,
          fullAddress: fullAddress
        },
        businessTypeIds: values.businessTypeIds,
        memberSizeId: values.memberSize,
        technicianSizeId: values.technicianSize,
        organizationMedia: values.media
      }
    };

    await Geocode.fromAddress(fullAddress) //google api get lat lng
      .then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          body.profile.address.lat = lat;
          body.profile.address.lng = lng;
          props.setBodyRequest(body);
        },
        () => {
          // Lỗi thì request permission geolocation của máy
          // requestGeoLocationPermission(body);
          props.setBodyRequest(body);
        }
      )
      .catch(() => {
        // Lỗi thì request permission geolocation của máy
        // requestGeoLocationPermission(body);
      });
  };

  const updateProfile = async () => {
    await register(props.bodyRequest)
      .then(() => {
        AMessage.success(t('register_success'));
        props.setStep(7);
        props.setFormError(null);
      })
      .catch((err) => {
        props.setFormError(t(err.message));
      })
      .finally(() => {
        setSubmitting(false);
        setRequestGeolocation(false);
        props.setBodyRequest(null);
        geoLocationPermission.current = true;
      });
  };

  useEffect(() => {
    if (businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_REPAIR_SHOP)) {
      setSubmitting(false);
      setRequestGeolocation(false);
      props.setStep(5);
    } else if (props.bodyRequest?.profile) updateProfile();
  }, [props.bodyRequest]);

  const onFinishFailed = (err) => {
    props.setFormError(t(err.message));
  };

  useEffect(() => {
    props.setRegisterDes('  ');
  }, [i18n?.language]);

  const onImageChange = (fileList) => {
    form.setFieldsValue({
      media: fileList.map((file) => {
        return {
          url: file.url,
          type: 'IMAGE',
          originalName: file.name
        };
      })
    });
  };

  const handleCancelGeolocationPermission = () => {
    !props.bodyRequest && props.setBodyRequest(requestGeolocation);
    setRequestGeolocation(false);
    props.bodyRequest?.code && props.setBodyRequest(requestGeolocation);
    // AMessage.warning(t('google_map_address_maybe_not_save'));
    props.setRegisterResult(t('google_map_address_maybe_not_save_register'));

    if (requestGeolocation && !props.bodyRequest) {
      // Nếu như không action permission alert mà bấm hẳn close thì gửi đi luôn
      props.setBodyRequest(props.bodyRequestNotAddress);
    }
  };

  const technicianSizeIdParams = useMemo(() => ({ type: GENERAL_TYPE.MECHANIC_SIZE }), []);
  const memberSizeIdParams = useMemo(() => ({ type: GENERAL_TYPE.MEMBER_SIZE }), []);

  return (
    <Step4FormStyled
      //
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      id="form_step4">
      {requestGeolocation && (
        <>
          {!props.bodyRequest?.code && (
            <div className="image_container allow_geolocation">
              <SVG src={toAbsoluteUrl('/media/svg/location/arrow_up.svg')} />
            </div>
          )}
          <ModalNoThing
            width={450}
            open
            closeIcon={false}
            getContainer={() => document.getElementById('form_step4')}
            onCancel={handleCancelGeolocationPermission}>
            <div className="image_container">
              <SVG src={toAbsoluteUrl('/media/svg/location/location_delivery.svg')}></SVG>
            </div>
            <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH}>
              <b>{t('hello_you')}</b>
            </ATypography>
            <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH}>
              <Trans i18nKey="geo_location_1" components={{ b: <b /> }} />
            </ATypography>
            <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH}>
              <Trans i18nKey="geo_location_2" components={{ b: <b /> }} />
            </ATypography>
            <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH}>
              <Trans i18nKey="geo_location_3" components={{ b: <b /> }} />
            </ATypography>
            <div className="d-flex justify-content-end gap-3">
              <AButton
                type="text"
                //
                disabled={!props.bodyRequest?.code && requestGeolocation?.profile}
                onClick={handleCancelGeolocationPermission}>
                {t('geo_location_denied')}
              </AButton>
              <AButton
                type="primary"
                loading={!props.bodyRequest?.code && requestGeolocation?.profile}
                disabled={typeof requestGeolocation === 'boolean' || props.bodyRequest?.code}
                onClick={() => {
                  !props.bodyRequest && props.setBodyRequest(requestGeolocation);
                  setRequestGeolocation(false);
                }}>
                {t('geo_location_allow')}
              </AButton>
            </div>
          </ModalNoThing>
        </>
      )}
      <div className="row align-items-end mb-4">
        <div className="col-8">
          <span>
            {t('vendor_name')}&nbsp;(<ATypography type="danger">*</ATypography>)
          </span>
          <Form.Item hasFeedback name="partner" rules={commonValidate().concat(nameValidate())}>
            <Input size="large" placeholder={t('name')} allowClear />
          </Form.Item>
        </div>
        <div className="col-4">
          <Form.Item name="avatar" className="text-center" getValueFromEvent={(e) => setAvatar(e)}>
            <AvatarUpload aspect={1} className="mb-0" imageUrl={avatar} onChange={() => {}} withToken={false} />
          </Form.Item>
        </div>
      </div>
      <div className="mb-4">
        <span>
          {t('phone')}&nbsp;(<ATypography type="danger">*</ATypography>)
        </span>
        <MInputPhone //
          noLabel
          phoneTextTranslate="1px"
          noPadding
          readOnly={false}
          label=""
          placeholder={t('phone_number')}
          name="phoneNumber"
          hasFeedback
        />
      </div>
      <div className="mb-4">
        <span>
          {t('address')}&nbsp;(<ATypography type="danger">*</ATypography>)
        </span>
        <MInputAddress
          form={form}
          fullWidth
          hasRegisterLayout
          label=""
          name="addressInfo"
          needLoadData={addressNeedLoad}
          noLabel
          noPadding
          placeholder={t('address')}
          require
          setNeedLoadData={setAddressNeedLoad}
        />
      </div>
      <div className="mb-4">
        {t('type')}&nbsp;(<ATypography type="danger">*</ATypography>)
        <HostType //
          form={form}
        />
        <div className="row">
          <span></span>
          {businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_REPAIR_SHOP) && (
            <div className="col-12 col-lg-6">
              <MSelect
                name="technicianSize"
                noLabel
                noPadding
                label={t('')}
                placeholder={t('numbersOfMechanics')}
                fetchData={props.getGeneralType}
                searchCorrectly={false}
                valueProperty="id"
                labelProperty="name"
                params={technicianSizeIdParams}
              />
            </div>
          )}

          {businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_CLUB) && (
            <div className="col-12 col-lg-6">
              <MSelect
                name="memberSize"
                noLabel
                noPadding
                label={t('')}
                placeholder={t('numbersOfMembers')}
                fetchData={props.getGeneralType}
                searchCorrectly={false}
                valueProperty="id"
                labelProperty="name"
                params={memberSizeIdParams}
              />
            </div>
          )}
        </div>
      </div>
      <MUploadImageNoCropMultiple
        noPadding
        noLabel
        fileList={fileList}
        noToken={true}
        onImageChange={onImageChange}
        name="media"
        label={
          <div className="mb-5">
            {t('org_media')}
            <br />
            <p className="text-muted">{t('org_media_des')}</p>
          </div>
        }
        maximumUpload={MAX_IMAGE_NUMBER}
        maxCount={MAX_IMAGE_NUMBER}
        aspect={4 / 3}
        rules={[]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      />
      <Divider />
      <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
        <div style={{ fontSize: '13px' }}>
          <span className="text-dark-50">{t('have_account')}</span>
          <Link to={LOGIN_PATH} className="ml-2" id="kt_login_signup" style={{ color: COLOR['primary-color'] }}>
            {t('login')}
          </Link>
        </div>
      </div>
      <AButton
        id="kt_login_signin_submit"
        type="primary"
        size="large"
        disabled={
          !(
            Boolean(businessTypeIdsWatch) &&
            Boolean(fullNameWatch) &&
            Boolean(phoneNumberWatch) &&
            !Boolean(addressInfoWatch.some((s, i) => (s === 'undefined' || s === undefined) && i !== 4))
          )
        }
        loading={isSubmitting}
        style={{ borderRadius: '8px' }}
        block
        htmlType="submit">
        {businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_REPAIR_SHOP) ? t('next') : t('done')}
      </AButton>
    </Step4FormStyled>
  );
}

export default compose(
  withTranslation(),
  connect(
    (state) => ({
      country: state['appData'].country
    }),
    {
      register: authActions.register,
      getGeoLocation: appDataActions.getGeoLocation,
      getGeneralType: appDataActions.getGeneralType
    }
  )
)(Step4);
