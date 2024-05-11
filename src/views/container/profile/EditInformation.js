import { Form, message } from 'antd/es';
import { useEffect, useMemo, useRef, useState } from 'react';
import Geocode from 'react-geocode';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { useBeforeUnload } from 'react-use';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { Breadcrumbs } from '~/configs/breadcrumbs';
import { BUSINESS_TYPES, GENERAL_TYPE, SOCIAL_TYPES } from '~/configs/const';
import { appDataActions } from '~/state/ducks/appData';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { useSubheader } from '~/views/presentation/core/Subheader';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone, MTextArea } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AvatarUpload } from '~/views/presentation/ui/Images';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { nameValidate } from '~/views/utilities/ant-validation';

import HostTypeSection from './HostTypeSection';
import MapFullCustomModal from './MapFullCustomModal';

const MTextAreaStyled = styled(MTextArea)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .ant-input {
    border: 1px solid #000 !important;
  }
`;

function EditInformation(props) {
  const { t } = useTranslation();
  const subheader = useSubheader();
  const [form] = Form.useForm();

  const [avatar, setAvatar] = useState('');
  const [addressNeedLoad, setAddressNeedLoad] = useState(null);
  const [currentAddress, setCurrentAddress] = useState({});
  const [fileList, setFileList] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const businessTypeIdsWatch = Form.useWatch('businessTypeIds', form);
  const [showMapFullCustom, setShowMapFullCustom] = useState(false);
  const [defaultBusinessType, setDefaultBusinessType] = useState();
  // Before unload
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty, t('leave_confirm'));

  useEffect(() => {
    subheader.setBreadcrumbs(Breadcrumbs.personalInformationEditPage);
  }, []);

  const getSocialInfo = (otherInfo) => {
    let result = {};
    (otherInfo || [])?.forEach((info) => {
      result[info?.type] = info?.value;
    });
    return result;
  };

  useEffect(() => {
    if (props.getAuthUser && !submitting) {
      const profiles = { ...props.getAuthUser };
      const otherInfo = profiles?.otherInfo;
      const socialInformation = getSocialInfo(typeof otherInfo === 'string' ? JSON.parse(otherInfo) : profiles?.otherInfo);
      const businessTypeIds = (profiles?.businessTypes || []).map((b) => b.id);
      const addressInfo = { ...profiles?.address };
      setDefaultBusinessType(businessTypeIds);
      // set field values
      form.setFieldsValue({
        email: profiles?.email,
        phone: profiles?.phone,
        description: profiles?.description,
        code: profiles?.address?.countryId,
        businessTypeIds: businessTypeIds,
        fullName: profiles?.fullName,
        memberSizeId: profiles?.memberSize?.id,
        technicianSizeId: profiles?.technicianSize?.id,
        organizationMedia: profiles?.organizationMedia || [],
        // address
        country1: addressInfo?.countryId,
        address1: addressInfo?.address,
        state: addressInfo?.stateId,
        zipCode: addressInfo?.zipCode,
        province: addressInfo?.provinceId,
        district: addressInfo?.districtId,
        ward: addressInfo?.wardsId,
        address: addressInfo,
        // social info
        website: socialInformation?.WEBSITE,
        facebook: socialInformation?.FACEBOOK,
        linkedin: socialInformation?.LINKEDIN,
        twitter: socialInformation?.TWITTER,
        zalo: socialInformation?.ZALO
      });
      // for organization media
      setFileList((profiles?.organizationMedia || []).map((media) => media?.url));
      // for avatar
      setAvatar(profiles?.avatar);
      // for address
      setCurrentAddress(addressInfo);
      setAddressNeedLoad({
        country: addressInfo?.countryId,
        state: addressInfo?.stateId,
        province: addressInfo?.provinceId,
        district: addressInfo?.districtId,
        ward: addressInfo?.wardsId
      });
    }
  }, [props.getAuthUser]);

  const checkBusinessType = () => {
    const temp1 = defaultBusinessType.sort();
    const temp2 = businessTypeIdsWatch.sort();
    if (temp1.length !== temp2.length) return false;
    temp1.forEach((e, index) => {
      if (e !== temp2[index]) return false;
    });
    return true;
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    values.addressInfo[0] = values.address1;
    const fullAddress = values.addressInfo.filter(Boolean).join(', ');
    const body = {
      ...values,
      fullName: values.fullName.trim(),
      companyTypeId: null, // required field but no use in version 1.0.7
      phone: values.phone.startsWith('0') ? values.phone.slice(1) : values.phone,
      organizationMedia: values.organizationMedia,
      avatar: avatar,
      logo: avatar,
      countryId: values.code, // the country code for phone number
      address: {
        lat: currentAddress.lat,
        lng: currentAddress.lng,
        address: values.address1,
        districtId: values.district,
        provinceId: values.province,
        wardsId: values.ward,
        stateId: values.state,
        countryId: values.country1, // this is the actual country address
        zipCode: values.zipCode,
        fullAddress
      },
      otherInfo: [
        {
          value: values.facebook,
          type: SOCIAL_TYPES.FACEBOOK
        },
        {
          value: values.website,
          type: SOCIAL_TYPES.WEBSITE
        },
        {
          value: values.twitter,
          type: SOCIAL_TYPES.TWITTER
        },
        {
          value: values.zalo,
          type: SOCIAL_TYPES.ZALO
        },
        {
          value: values.linkedin,
          type: SOCIAL_TYPES.LINKEDIN
        }
      ]
    };

    if (!currentAddress.lat || !currentAddress.lng) {
      await Geocode.fromAddress(fullAddress) //google api get lat lng
        .then((response) => {
          const { lat, lng } = response.results[0].geometry.location;
          body.address.lat = lat;
          body.address.lng = lng;
        })
        .catch(() => {
          AMessage.warning(t('google_map_address_maybe_not_save', 5));
          setSubmitting(false);
        });
    }

    if (body.address.lat && body.address.lng) {
      if (checkBusinessType()) {
        await props
          .updateUser({ ...body, businessTypeIds: null })
          .then(() => {
            AMessage.success(t('update_profile_success'));
            props.getUser().finally(() => {
              setSubmitting(false);
            });
          })
          .catch(() => {
            AMessage.error(t('update_profile_failed'));
            setSubmitting(false);
          });

        setDirty(false);
      } else {
        if (confirm(t('update_businessType'))) {
          await props
            .updateUser(body)
            .then(() => {
              props.logout();
            })
            .catch(() => {
              AMessage.error(t('update_profile_failed'));
              setSubmitting(false);
            });
        } else setSubmitting(false);
      }
    } else setSubmitting(false);
  };

  const onFinishFailed = (error) => {
    // AMessage.error(t('update_profile_failed'));
    console.error('EditInformation.js ~ line 53 ~ onFinish ~ error', error);
  };

  const onImageChange = (fileList) => {
    form.setFieldsValue({
      organizationMedia: fileList.map((file) => {
        return {
          url: file?.url,
          type: 'IMAGE',
          originalName: file?.name
        };
      })
    });
  };

  const onValuesChange = (value, allValue) => {
    setDisableSubmit(false);
    setDirty(true);
  };

  const technicianSizeIdParams = useMemo(() => ({ type: GENERAL_TYPE.MECHANIC_SIZE }), []);
  const memberSizeIdParams = useMemo(() => ({ type: GENERAL_TYPE.MEMBER_SIZE }), []);
  return (
    <Form //
      form={form}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      onFinishFailed={onFinishFailed}
      className="card card-custom card-stretch">
      <Prompt when={dirty} message={t('leave_confirm')} />
      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <div className="d-flex align-items-center">
            <h3 className="card-label font-weight-bolder text-dark mr-2">{t('edit_info')}</h3>
          </div>
          <span className="text-muted font-weight-bold font-size-sm mt-1">{t('edit_info_des')}</span>
        </div>
        <div className="card-toolbar">
          <AButton type="primary" htmlType="submit" loading={submitting} disabled={disableSubmit}>
            {t('save_changes')}
          </AButton>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        {/* begin::Body */}
        <div className="card-body">
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('organization_logo')}</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <Form.Item name="avatar" getValueFromEvent={(e) => setAvatar(e)}>
                <AvatarUpload aspect={1 / 1} imageUrl={avatar} onChange={() => {}} withToken={true} />
              </Form.Item>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('vendor_name')}</label>
            <div className="col-lg-9 col-xl-7">
              <MInput //
                noLabel
                loading={false}
                noPadding
                wrapperCol={{ span: 24 }}
                name="fullName"
                mRules={nameValidate()}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('email_address')}</label>
            <div className="col-lg-9 col-xl-7">
              <MInput
                noLabel
                loading={false}
                noPadding
                wrapperCol={{ span: 24 }}
                require={false}
                disabled={true}
                name="email"
                extra={t('login_email_des')}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('description')}</label>
            <div className="col-lg-9 col-xl-7">
              <MTextAreaStyled //
                noLabel
                rows={4}
                loading={false}
                noPadding
                placeholder={t('description')}
                wrapperCol={{ span: 24 }}
                name="description"
                editOrganizationInformation
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('phone_number')}</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MInputPhone //
                noLabel
                noPadding
                hasFeedback
                wrapperCol={{ span: 24 }}
                placeholder={t('login_phone_number')}
                name="phoneNumber"
                phoneTextTranslate="1.3px"
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('address')}</label>
            <div className="col-lg-9 col-xl-7 d-flex flex-column gap-3">
              <MapFullCustomModal
                formParent={form}
                title={t('location')}
                description={currentAddress.fullAddress}
                modalShow={showMapFullCustom}
                setAddress={setCurrentAddress}
                setModalShow={setShowMapFullCustom}
              />

              <MInputAddress //
                form={form}
                hasRegisterLayout
                label=""
                name="addressInfo"
                needLoadData={addressNeedLoad}
                noLabel
                noPadding
                require={true}
                setNeedLoadData={setAddressNeedLoad}
              />
            </div>

            <div className="col-xl-2" />

            <label className="col-xl-3 col-lg-3 col-form-label text-muted"> </label>
            <div className="col-lg-9 col-xl-7 d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-2 px-sm-4 mx-sm-4 px-lg-0 mx-lg-0 mt-3">
                {!currentAddress?.fullAddress && (
                  <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} className="mb-0" type="danger" style={{ fontSize: 12 }}>
                    {!currentAddress?.fullAddress && (
                      <>
                        <i className="fa fa-exclamation-triangle mr-2" style={{ color: 'red' }} />
                        {t('warning_address')}
                      </>
                    )}
                  </ATypography>
                )}
                <AButton
                  className="w-max-content"
                  type="primary"
                  onClick={() => {
                    setShowMapFullCustom(currentAddress?.lat ? { lat: currentAddress.lat, lng: currentAddress.lng } : true);
                    setDisableSubmit(false);
                    setDirty(true);
                  }}
                  icon={<i className="fa fa-map-marker mr-2" style={{ fontSize: 16 }} />}>
                  {t('locate_address')}
                </AButton>

                <ATypography type="secondary" style={{ fontSize: 12 }}>
                  {`${currentAddress.lat || t('N/A')}, ${currentAddress.lng || t('N/A')}`}
                </ATypography>
              </div>
            </div>
          </div>

          <Divider />

          <HostTypeSection //
            form={form}
            setDisableSubmit={setDisableSubmit}
            setDirty={setDirty}
          />

          {businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_REPAIR_SHOP) && (
            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('total_mechanics')}</label>
              <div className="col-lg-9 col-xl-7 d-flex align-items-center">
                <MSelect
                  name="technicianSizeId"
                  noLabel
                  noPadding
                  label={t('')}
                  placeholder={t('numbersOfMechanics')}
                  fetchData={props.getGeneralType}
                  searchCorrectly={false}
                  valueProperty="id"
                  labelProperty="name"
                  params={technicianSizeIdParams}
                  require={businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_REPAIR_SHOP)}
                />
              </div>
            </div>
          )}

          {businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_CLUB) && (
            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('total_members_lowercase')}</label>
              <div className="col-lg-9 col-xl-7 d-flex align-items-center">
                <MSelect
                  name="memberSizeId"
                  noLabel
                  noPadding
                  label={t('')}
                  placeholder={t('numbersOfMembers')}
                  fetchData={props.getGeneralType}
                  searchCorrectly={false}
                  valueProperty="id"
                  labelProperty="name"
                  params={memberSizeIdParams}
                  require={businessTypeIdsWatch?.includes?.(BUSINESS_TYPES.AUTO_CLUB)}
                />
              </div>
            </div>
          )}

          <Divider />

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('media')}</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MUploadImageNoCropMultiple
                noPadding
                noLabel
                fileList={fileList}
                onImageChange={onImageChange}
                name="organizationMedia"
                label={
                  <div className="mb-5">
                    {t('org_media')}
                    <br />
                    <p className="text-muted">{t('org_media_des')}</p>
                  </div>
                }
                maximumUpload={5}
                maxCount={5}
                aspect={4 / 3}
                rules={[]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              />
            </div>
          </div>

          <Divider />

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Website</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MInput //
                noLabel
                loading={false}
                require={false}
                extra={`${t('example')}: www.ecaraid.com`}
                noPadding
                wrapperCol={{ span: 24 }}
                name="website"
                placeholder="www.banhuduongxa.com"
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Facebook</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MInput //
                noLabel
                loading={false}
                require={false}
                extra={`${t('example')}: ecaraidautorepairfacebook`}
                noPadding
                wrapperCol={{ span: 24 }}
                name="facebook"
                placeholder="@banhuuduongxa"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Twitter</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MInput //
                noLabel
                loading={false}
                extra={`${t('example')}: ecaraidautorepairtwitter`}
                require={false}
                noPadding
                wrapperCol={{ span: 24 }}
                name="twitter"
                placeholder="@banhuuduongxa"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">LinkedIn</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MInput //
                noLabel
                require={false}
                extra={`${t('example')}: ecaraidautorepairlinkedin`}
                loading={false}
                noPadding
                wrapperCol={{ span: 24 }}
                name="linkedin"
                placeholder="@banhuuduongxa"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Zalo</label>
            <div className="col-lg-9 col-xl-7 d-flex align-items-center">
              <MInput //
                noLabel
                loading={false}
                extra={`${t('example')}: +84 90 198 9827`}
                require={false}
                noPadding
                wrapperCol={{ span: 24 }}
                name="zalo"
                placeholder="+84 944466442"
              />
            </div>
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Form */}
    </Form>
  );
}

export default connect(
  (state) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getGeneralType: appDataActions.getGeneralType,
    getUser: authActions.getUser,
    updateUser: authActions.updateUser,
    logout: authActions.logout
  }
)(EditInformation);
