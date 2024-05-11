import { FormInstance } from 'antd/es';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CONVERSION_UNIT, DISCOUNT_UNIT } from '~/configs/type/promotionType';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput, MInputNumber, MTextArea } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';

export const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-input {
    font-size: 12px;
  }

  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
    background-color: white;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

type GiftCardInfoProps = {
  form: FormInstance<any>;
  loading: boolean;
  allowEditing: boolean;
  loadingChangeLang: boolean;
  handleChangeLocalize: any;
  fileIcon: any;
  setFileIcon: any;
};

const GiftCardInfo: React.FC<GiftCardInfoProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <MUploadImageCrop
          name="image"
          require={false}
          noLabel
          disabled={!props.allowEditing}
          label={t('voucherImage')}
          file={props.fileIcon}
          onImageChange={(file: any) => {
            props.form.setFieldsValue({ image: file });
          }}
        />
      </div>

      <div className="col-12 mb-4">
        <MInput
          name="name"
          noLabel
          noPadding
          disabled={!props.allowEditing}
          label={t('voucherName')}
          placeholder={t('')}
          require={false}
          // for change translations
          onChange={(e: any) => props.handleChangeLocalize(e.target.value, 'name')}
        />
      </div>

      <div className="col-12 col-lg-6 mb-4">
        <MDatePicker
          name="startDate"
          label={t('effectiveDate')}
          placeholder=""
          noLabel
          noPadding
          showTime
          showNow={false}
          require={false}
          disabled={!props.allowEditing}
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
          name="expireDate"
          label={t('expireDate')}
          placeholder=""
          noLabel
          noPadding
          showTime
          showNow={false}
          require={false}
          disabled={!props.allowEditing}
          disabledDate={(current: any) => {
            return (
              (current && current < moment().subtract(1, 'day').endOf('day')) ||
              (current && props.form.getFieldValue('effectiveDate') && current < props.form.getFieldValue('effectiveDate').endOf('day'))
            );
          }}
        />
      </div>

      <div className="col-12 mb-4">
        <MTextArea //
          noLabel
          noPadding
          label={t('description')}
          placeholder={t('description')}
          name="description"
          rows={5}
          maxLength={null}
          disabled={!props.allowEditing}
          onChange={(e: any) => props.handleChangeLocalize(e.target.value, 'description')}
        />
      </div>

      <div className="col-12 col-lg-6 mb-4">
        <MInputNumber
          name="price"
          label={`${t('salePrice')} (đ)`}
          placeholder={t('salePrice')}
          noLabel
          noPadding
          disabled={!props.allowEditing}
          min={1000}
          hasFeedback={false}
        />
      </div>
      <div className="col-12 col-lg-6 mb-4">
        <MInputNumberStyled
          name="denominations"
          label={t('voucherValue')}
          placeholder={t('voucherValue')}
          className="w-100"
          colon={false}
          noLabel
          noPadding
          disabled={!props.allowEditing}
          hasFeedback={false}
          addonAfter={
            <MRadio
              noPadding
              spaceSize={0}
              label=""
              name="discountType"
              options={[
                { label: CONVERSION_UNIT.CASH, value: DISCOUNT_UNIT.CASH },
                { label: CONVERSION_UNIT.TRADE, value: DISCOUNT_UNIT.TRADE }
              ]}
              optionType="button"
              buttonStyle="solid"
              disabled={!props.allowEditing}
            />
          }
        />
      </div>
    </div>
  );
};

export default connect(null, {})(GiftCardInfo);
