import { Col, Form, Radio, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PRICING_STEP, PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { settingActions } from '~/state/ducks/settings';
import { VEHICLE_TYPES } from '~/state/ducks/settings/actions';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';
import ATypography from '~/views/presentation/ui/text/ATypography';

type CreateProductBasicInfoProps = {
  form: any;
  loading: boolean;
  isEditing: boolean;
  unitsData: any;
  currencyValue: string;
  setCurrencyValue: React.Dispatch<React.SetStateAction<string>>;
  getSettingVehicles: any;
};

const CreateProductBasicInfo: React.FC<CreateProductBasicInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const isGenuineWatch = Form.useWatch('isGenuine', props.form);
  const [carBrands, setCarBrands] = useState([]);

  useEffect(() => {
    props
      .getSettingVehicles({ type: VEHICLE_TYPES.CAR })
      .then((res) => {
        setCarBrands(res?.content);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Row className="mt-10">
      <Col xs={24} sm={24} md={24} lg={24}>
        <MInput
          noLabel
          loading={props.loading}
          require
          noPadding
          readOnly={!props.isEditing}
          label={t('item_name')}
          placeholder={t('insert_item_name')}
          name="name"
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

      <Col xs={24} sm={24} md={24} lg={11} className="mt-3">
        <MInput
          noLabel
          loading={props.loading}
          noPadding
          require
          readOnly={!props.isEditing}
          label={t('item_id')}
          placeholder={t('insert_item_id')}
          name="code"
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
      <Col xs={24} sm={24} md={24} lg={2}></Col>
      <Col xs={24} sm={24} md={24} lg={11} className="mt-3">
        <MInput
          noLabel
          loading={props.loading}
          require={false}
          noPadding
          readOnly={!props.isEditing}
          label={t('old_item_id')}
          placeholder={t('insert_old_item_id')}
          name="oldCode"
        />
      </Col>

      <Col xs={24} sm={24} md={24} lg={11} className="mt-3">
        <MSelect
          noPadding
          noLabel
          require
          size="large"
          disabled={!props.isEditing}
          name="unit"
          label={t('Unit')}
          placeholder={t('Unit')}
          searchCorrectly={false}
          // fetchData={props.getUnits}
          options={props.unitsData.map((o) => {
            // form.setFieldValue('unit', o?.id);
            return {
              value: o?.id,
              search: o?.name,
              label: o?.name
            };
          })}
          onchange={(value) => {
            props.form.setFieldValue('unit', value);
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={2}></Col>
      <Col xs={24} sm={24} md={24} lg={11} className="mt-3">
        <MInput
          noLabel
          loading={props.loading}
          require={false}
          mRules={[{ max: 30, message: t('max_length_30') }]}
          noPadding
          readOnly={!props.isEditing}
          label={t('barcode')}
          placeholder={t('insert_barcode')}
          name="upcCode"
        />
      </Col>

      <Col xs={24} sm={24} md={24} lg={11} className="mt-3">
        <MInput
          noLabel
          require={false}
          loading={props.loading}
          noPadding
          readOnly={!props.isEditing}
          label={t('item_short_name')}
          placeholder={t('insert_item_short_name')}
          name="shortName"
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={2}></Col>
      <Col xs={24} sm={24} md={24} lg={11} className="mt-3">
        <MInput
          noLabel
          loading={props.loading}
          require={false}
          noPadding
          readOnly={!props.isEditing}
          label={t('item_key_word')}
          placeholder={t('insert_item_key_word')}
          name="keywords"
        />
      </Col>

      <Col xs={24} sm={24} md={24} lg={11} className="mt-3 w-100">
        <MInputNumber
          min={props.currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
          labelAlign="left"
          noLabel
          noPadding
          disabled={!props.isEditing}
          hasFeedback={false}
          placeholder={t('insert_in_stock_price')}
          label={t('in_stock_price')}
          addonAfter={
            <MRadio
              spaceSize={0}
              label=""
              options={[
                { label: 'đ', value: PRICING_UNIT.DONG },
                { label: '$', value: PRICING_UNIT.DOLLARS }
              ]}
              onChange={(e) => props.setCurrencyValue(e.target.value)}
              defaultValue={props.currencyValue}
              optionType="button"
              buttonStyle="solid"
            />
          }
          step={props.currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
          name="inStockPrice"
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={2}></Col>
      <Col xs={24} sm={24} md={24} lg={11} className="d-flex flex-column mt-3 w-100">
        <div>
          <MCheckbox name="isGenuine" noLabel noPadding disabled={!props.isEditing} options={[{ label: `${t('Brand')}?`, value: true }]} />
        </div>
        {head(isGenuineWatch) && (
          <div>
            <MSelect
              name="vehicleBrandIds"
              label=""
              placeholder={t('Vehicles')}
              noPadding
              noLabel
              disabled={!props.isEditing}
              require={true}
              size="large"
              options={carBrands?.map((brand: any) => {
                return { label: brand.name, value: brand.id };
              })}
            />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default connect(null, { getSettingVehicles: settingActions.getSettingVehicles })(CreateProductBasicInfo);
