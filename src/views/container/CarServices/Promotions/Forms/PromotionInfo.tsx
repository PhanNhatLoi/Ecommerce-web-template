import { EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Col } from 'antd/es';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MCKEditor, MInput } from '~/views/presentation/fields/input';
import { MUploadImageCropWithBtn } from '~/views/presentation/fields/upload';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { UtilDate } from '~/views/utilities/helpers';

const ACCEPT_IMAGE_UPLOAD = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];

type PromotionInfoProps = {
  form: any;
  allowEdit: boolean;
  loading: boolean;
  content: string;
  bannerFile: any;
  onBannerChange: any;
};

const PromotionInfo: React.FC<PromotionInfoProps> = (props) => {
  const { t }: any = useTranslation();

  const onContentChange = (data: any) => {
    props.form.setFieldsValue({ content: data });
  };

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <MInput
          name="name"
          noLabel
          noPadding
          validateStatus={props.loading ? 'validating' : undefined}
          disabled={!props.allowEdit}
          label={t('promotionName')}
          placeholder={t('promotionName')}
        />
      </div>

      <div className="col-12 col-lg-6 mb-4">
        <MDatePicker
          name="startDate"
          label={t('start_day')}
          placeholder={t('start_day')}
          noLabel
          noPadding
          showTime
          showNow={false}
          disabled={!props.allowEdit}
          format={UtilDate.formatDateTimeLocal}
          disabledDate={(current: any) => {
            return (
              (current && current < moment().subtract(1, 'day').endOf('day')) ||
              (current && props.form.getFieldValue('outOfDate') && current >= props.form.getFieldValue('outOfDate').endOf('day'))
            );
          }}
        />
      </div>

      <div className="col-12 col-lg-6 mb-4">
        <MDatePicker
          name="endDate"
          label={t('end_day')}
          placeholder={t('end_day')}
          noLabel
          noPadding
          showTime
          showNow={false}
          require={false}
          disabled={!props.allowEdit}
          format={UtilDate.formatDateTimeLocal}
          disabledDate={(current: any) => {
            return (
              (current && current < moment().subtract(1, 'day').endOf('day')) ||
              (current && props.form.getFieldValue('effectiveDate') && current < props.form.getFieldValue('effectiveDate').endOf('day'))
            );
          }}
        />
      </div>

      <div className="col-12 mb-4">
        <MUploadImageCropWithBtn
          name="images"
          label={t('banner')}
          helperText={t('helperUploadPromotion')}
          accept={ACCEPT_IMAGE_UPLOAD}
          noLabel
          noPadding
          aspect={3 / 1}
          require={true}
          disabled={!props.allowEdit}
          alwayShowUploadBtn
          type="primary"
          maximumUpload={1}
          onImageChange={props.onBannerChange}
          itemRender={() => {}}
          tooltip={{
            title: t('validBannerFormat'),
            icon: <QuestionCircleOutlined />
          }}
        />

        {props.bannerFile && (
          <Col sm={24} md={24} lg={24} className="mt-6">
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
      </div>

      <div className="col-12 mt-4">
        <MCKEditor
          name="content"
          label={t('description')}
          placeholder={t('description')}
          noLabel
          noPadding
          require={false}
          loading={props.loading}
          disabled={!props.allowEdit}
          mRules={[{ max: 10000, message: t('max_length_10000') }]}
          value={props.content}
          onChange={onContentChange}
          toolBar={{
            toolbar: {
              items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'imageUpload']
            }
          }}
        />
      </div>
    </div>
  );
};

export default PromotionInfo;
