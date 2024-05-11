import { EyeOutlined } from '@ant-design/icons';
import { Checkbox, Col, Row } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { PROMOTION_TYPE } from '~/configs/type/promotionType';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput, MTextArea } from '~/views/presentation/fields/input';
import MRangePicker from '~/views/presentation/fields/RangePicker';
import { MUploadImageCropWithBtn } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { noSpecialCharactersValidate } from '~/views/utilities/ant-validation';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

const ACCEPT_IMAGE_UPLOAD = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];

const PromotionSetting = (props: Props) => {
  const { t }: any = useTranslation();
  return (
    <Col xs={24} sm={24} md={24} lg={24}>
      <LayoutForm title={t('description_promotion')} description={t('description_promotion_des')}>
        <Row>
          <Col
            xs={24}
            sm={24}
            md={props.type === PROMOTION_TYPE.COUPON_DISCOUNT ? 11 : 24}
            lg={props.type === PROMOTION_TYPE.COUPON_DISCOUNT ? 11 : 24}>
            <MInput //
              require
              noPadding
              customLayout="w-100"
              hasLayoutForm
              hasFeedback
              label={
                <span>
                  {t('promotionName')} (<ATypography type="danger">*</ATypography>)
                </span>
              }
              name="name"
              placeholder={t('')}
            />
          </Col>
          {props.type === PROMOTION_TYPE.COUPON_DISCOUNT && (
            <>
              <Col xs={24} sm={24} md={2} lg={2}></Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <MInput //
                  noPadding
                  customLayout="w-100"
                  require={false}
                  hasLayoutForm
                  hasFeedback
                  label={t('coupon_code')}
                  mRules={noSpecialCharactersValidate()}
                  name="code"
                  placeholder={t('')}
                />
              </Col>
            </>
          )}
          <Col xs={24} sm={24} md={24} lg={24}>
            <MUploadImageCropWithBtn
              name="images"
              label={
                <span>
                  {t('banner')} (<ATypography type="danger">*</ATypography>)
                </span>
              }
              helperText={t('helperUploadPromotion')}
              accept={ACCEPT_IMAGE_UPLOAD}
              noLabel
              noPadding
              aspect={3 / 1}
              require={true}
              alwayShowUploadBtn
              type="primary"
              maximumUpload={1}
              onImageChange={props.onBannerChange}
              itemRender={() => {}}
              tooltip={{
                title: t('validBannerFormat'),
                icon: <SVG style={{ height: '13px' }} src={toAbsoluteUrl('/media/svg/icons/Tools/Tooltips.svg')} />
              }}
            />
          </Col>
          {props.bannerFile && (
            <Col xs={24} sm={24} md={24} lg={24} className="my-8">
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                style={{ objectFit: 'contain' }}
                isAuth={true}
                src={props.bannerFile}
                notHaveBorder
              />
            </Col>
          )}
          <Col xs={24} sm={24} md={24} lg={24} className="mt-4">
            <MTextArea
              customLayout="w-100"
              editOrganizationInformation
              rows={5}
              name="content"
              label={t('description')}
              placeholder={t('')}
              require={false}
            />
          </Col>
        </Row>
      </LayoutForm>
      <Divider />
      <LayoutForm title={t('apply_time_promotion')} description={t('apply_time_promotion_des')}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={11} className="w-100">
            {props.unLimitTime ? (
              <MDatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                noPadding
                require
                customLayout="w-100"
                placeholder={[t('start_date')]}
                label={t('apply_time')}
                name="startDate"
              />
            ) : (
              <MRangePicker
                showTime
                noPadding
                noLabel
                require
                placeholder={[t('start_date'), t('end_date')]}
                label={t('apply_time')}
                name="daytime"
              />
            )}
          </Col>
          <Col span={24} className="mt-2">
            <Checkbox
              checked={props.unLimitTime}
              onChange={() => {
                props.setUnlimitTime(!props.unLimitTime);
              }}>
              <span style={{ fontSize: 12 }}>{t('unlimited')}</span>
            </Checkbox>
          </Col>
        </Row>
      </LayoutForm>
    </Col>
  );
};

type Props = {
  type?: string;
  unLimitTime: boolean;
  setUnlimitTime: React.Dispatch<React.SetStateAction<boolean>>;
  onBannerChange: any;
  bannerFile: any;
};
export default PromotionSetting;
