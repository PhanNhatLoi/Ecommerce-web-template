import { EditFilled, EyeOutlined } from '@ant-design/icons';
import { Image, Rate, Tooltip } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { Breadcrumbs } from '~/configs/breadcrumbs';
import { BUSINESS_TYPES } from '~/configs/const';
import { PROFILE_CHANGE_PASS_PATH, PROFILE_EDIT_INFO_PATH } from '~/configs/routesConfig';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import MapModal from '~/views/container/commons/MapModal';
import { useSubheader } from '~/views/presentation/core/Subheader';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const MEMBER_SIZE = {
  18: '101 - 500',
  19: '501 - 1,000',
  20: '1,001 - 10,000',
  21: '10,001 - 100,000',
  22: 'Above 100,000',
  7: 'Below 100'
};

const MECHANIC_SIZE = {
  11: 'Below 10',
  13: '10 - 50',
  14: '51 - 100',
  15: '101 - 500',
  16: '501 - 1,000',
  17: 'Above 1,000'
};

function PersonaInformation(props) {
  const { t } = useTranslation();
  const subheader = useSubheader();
  const history = useHistory();
  const [user, setUser] = useState({});

  const [mapLocation, setMapLocation] = useState();

  useEffect(() => {
    subheader.setBreadcrumbs(Breadcrumbs.personalInformationPage);
  }, []);

  const getSocialInfo = (otherInfo) => {
    let result = {};
    (otherInfo || [])?.forEach((info) => {
      result[info?.type] = info?.value;
    });
    return result;
  };

  useEffect(() => {
    if (props.getAuthUser) {
      const profiles = props.getAuthUser;
      const otherInfo = props.getAuthUser?.otherInfo;
      const socialInformation = getSocialInfo(typeof otherInfo === 'string' ? JSON.parse(otherInfo) : profiles?.otherInfo);
      setUser({
        ...profiles,
        avatar: firstImage(profiles?.avatar),
        fullName: profiles?.fullName,
        id: profiles?.id,
        email: profiles?.email,
        description: profiles?.description,
        phone: formatPhoneWithCountryCode(profiles?.phone, profiles?.country?.code),
        fullAddress: profiles?.address?.fullAddress,
        lat: profiles?.address?.lat,
        lng: profiles?.address?.lng,
        businessTypes: (profiles?.businessTypes || []).map((host) => host?.name),
        businessTypeIds: (profiles?.businessTypes || []).map((host) => host?.id),
        memberSize: MEMBER_SIZE[profiles?.memberSize?.id],
        mechanicSize: MECHANIC_SIZE[profiles?.technicianSize?.id],
        media: (profiles?.organizationMedia || []).map((media) => media?.url),
        website: socialInformation?.WEBSITE,
        facebook: socialInformation?.FACEBOOK,
        linkedin: socialInformation?.LINKEDIN,
        twitter: socialInformation?.TWITTER,
        zalo: socialInformation?.ZALO
      });
    }
  }, [props.getAuthUser]);

  const handleClickMap = () => {
    const profiles = props.getAuthUser;

    setMapLocation({
      showConfirm: false, // for show Confirm button on modal map
      lat: profiles?.address?.lat,
      lng: profiles?.address?.lng,
      address: profiles?.address?.fullAddress
    });
  };

  return (
    <div className="card card-custom card-stretch">
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <div className="d-flex align-items-center">
            <h3 className="card-label font-weight-bolder text-dark mr-2">{t('personal_info')}</h3>
            {roleBaseStatus.isVendor() && (
              <Tooltip title={t('edit_info')}>
                <AButton
                  type="link"
                  size="large"
                  onClick={() => {
                    history.push(PROFILE_EDIT_INFO_PATH);
                  }}
                  icon={<EditFilled style={{ color: '#000' }} />}
                />
              </Tooltip>
            )}
          </div>
          <span className="text-muted font-weight-bold font-size-sm mt-1">{t('personal_info_des')}</span>
        </div>
      </div>
      <div className="form">
        <div className="card-body">
          <div className="form-group d-flex flex-wrap align-items-center">
            <AuthAvatar className="mr-5" size={124} isAuth src={user?.avatar} />
            <div className="d-flex flex-column">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} className="mb-0" level={2}>
                {user?.fullName}
              </ATypography>
              <Rate className="mb-2" disabled="true" value={props?.rating || 5} />
              <ATypography strong>
                <span className="text-muted">{t('vendor_id')}:</span>&nbsp;
                <span style={{ fontSize: '16px' }}>{user?.id}</span>
              </ATypography>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('email_address')}</label>
            <div className="col-lg-9 col-xl-6">
              <ATypography strong>{user?.email}</ATypography>
              <br />
              <ATypography className="text-muted">{t('login_email_des')}</ATypography>
              <br />
              {roleBaseStatus.isVendor() && (
                <AButton type="link" className="pl-0" onClick={() => history.push(PROFILE_CHANGE_PASS_PATH)}>
                  {t('change_password')}
                </AButton>
              )}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('description')}</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              <ATypography strong>{user?.description || '-'}</ATypography>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('phone_number')}</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              <ATypography strong>{user?.phone || '-'}</ATypography>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('address')}</label>
            <div className="col-lg-9 col-xl-6 d-flex justify-content-center flex-column gap-4">
              <ATypography strong>{user?.fullAddress || '-'}</ATypography>
              {(user?.fullAddress || user?.lat) && (
                <ATypography variant={TYPOGRAPHY_TYPE.LINK} onClick={handleClickMap}>
                  <i className="fa fa-map-o mr-2" />
                  {t('view_full_map')}
                </ATypography>
              )}
              <MapModal
                width={886}
                title={t('location')}
                description={mapLocation}
                modalShow={Boolean(mapLocation)}
                setModalShow={setMapLocation}
                address={mapLocation}
              />
            </div>
          </div>

          <Divider />

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('type')}</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              <ATypography strong>
                {user?.businessTypes?.length > 0 ? user?.businessTypes?.map((item) => t(item)).join(' - ') : '-'}
              </ATypography>
            </div>
          </div>

          {(user?.companyTypeId === BUSINESS_TYPES.CAR_WASH || user?.companyTypeId === BUSINESS_TYPES.CAR_PARKING) && (
            <>
              <div className="form-group row">
                <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('min_price')}</label>
                <div className="col-lg-9 col-xl-6 d-flex align-items-center">
                  <ATypography strong>{numberFormatDecimal(user?.minPrice, ' đ', '')}</ATypography>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('max_price')}</label>
                <div className="col-lg-9 col-xl-6 d-flex align-items-center">
                  <ATypography strong>{numberFormatDecimal(user?.maxPrice, ' đ', '')}</ATypography>
                </div>
              </div>
            </>
          )}

          {user?.businessTypeIds?.includes?.(BUSINESS_TYPES.AUTO_REPAIR_SHOP) && (
            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('number_of_mechanics')}</label>
              <div className="col-lg-9 col-xl-6 d-flex align-items-center">
                <ATypography strong>{t(user?.mechanicSize) || '-'}</ATypography>
              </div>
            </div>
          )}

          {user?.businessTypeIds?.includes?.(BUSINESS_TYPES.AUTO_CLUB) && (
            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('number_of_members')}</label>
              <div className="col-lg-9 col-xl-6 d-flex align-items-center">
                <ATypography strong>{t(user?.memberSize) || '-'}</ATypography>
              </div>
            </div>
          )}

          <Divider />

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('media')}</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              {Boolean(user?.media) ? (
                <Image.PreviewGroup>
                  {user?.media?.map((imageUrl, i) => {
                    return (
                      <AuthImage
                        key={i}
                        className="p-0"
                        preview={{
                          mask: <EyeOutlined />
                        }}
                        width={80}
                        height="auto"
                        isAuth={true}
                        src={firstImage(imageUrl)}
                        // onClick={(e) => e.stopPropagation()}
                      />
                    );
                  })}
                </Image.PreviewGroup>
              ) : (
                <ATypography strong>-</ATypography>
              )}
            </div>
          </div>

          <Divider />

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Website</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              {user?.website ? (
                <ATypography variant={TYPOGRAPHY_TYPE.LINK} target="_blank" href={user?.website}>
                  {user?.website}
                </ATypography>
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Facebook</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              {user?.facebook ? (
                <ATypography variant={TYPOGRAPHY_TYPE.LINK} target="_blank" href={'https://www.facebook.com/' + user?.facebook}>
                  {user?.facebook}
                </ATypography>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Twitter</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              {user?.twitter ? (
                <ATypography variant={TYPOGRAPHY_TYPE.LINK} target="_blank" href={'https://www.twitter.com/' + user?.twitter}>
                  {user?.twitter}
                </ATypography>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">LinkedIn</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              {user?.linkedin ? (
                <ATypography variant={TYPOGRAPHY_TYPE.LINK} target="_blank" href={'https://www.linkedin.com/in/' + user?.linkedin}>
                  {user?.linkedin}
                </ATypography>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-muted">Zalo</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
              <ATypography strong>{user?.zalo || '-'}</ATypography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getUser: authActions.getUser,
    updateUser: authActions.updateUser
  }
)(PersonaInformation);
