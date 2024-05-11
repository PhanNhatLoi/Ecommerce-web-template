import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FUEL_TYPE, LOAD_CAPACITY, TYPOGRAPHY_TYPE, VEHICLE_BRANDS } from '~/configs';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import MSelect from '~/views/presentation/fields/Select';
import ATypography from '~/views/presentation/ui/text/ATypography';

const TruckForm = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <MSelect //
        label={t('brand')}
        labelAlign="left"
        name="brandId"
        noLabel
        require
        options={Object.keys(VEHICLE_BRANDS).map((type) => {
          return {
            value: VEHICLE_BRANDS[type],
            label: t(type)
          };
        })}
        placeholder={t('brand_placeholder')}
      />
      <MSelect //
        label={t('fuel_type')}
        labelAlign="left"
        require
        name="fuelTypeId"
        noLabel
        options={Object.keys(FUEL_TYPE).map((type) => {
          return {
            value: FUEL_TYPE[type],
            label: t(type)
          };
        })}
        placeholder={t('fuel_type_placeholder')}
      />
      <MSelect //
        label={t('load_capacity')}
        labelAlign="left"
        require
        name="loadCapacity"
        noLabel
        options={Object.keys(LOAD_CAPACITY).map((type) => {
          return {
            value: LOAD_CAPACITY[type],
            label: t(type)
          };
        })}
        placeholder={t('load_capacity_placeholder')}
      />
      <MInput //
        label={t('producing_year')}
        labelAlign="left"
        name="producingYear"
        noLabel
        placeholder={t('producing_year_placeholder')}
      />
      <Divider />
      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
        {t('demention').toUpperCase()}
      </ATypography>
      <MInput //
        label={t('length')}
        labelAlign="left"
        addonAfter="cm"
        name="length"
        noLabel
        placeholder={t('length_placeholder')}
      />
      <MInput //
        label={t('width')}
        labelAlign="left"
        addonAfter="cm"
        name="width"
        noLabel
        placeholder={t('width_placeholder')}
      />
      <MInput //
        label={t('height')}
        labelAlign="left"
        addonAfter="cm"
        name="height"
        noLabel
        placeholder={t('height_placeholder')}
      />
      <Divider />
      <MInput //
        label={t('license_plate')}
        labelAlign="left"
        name="license"
        noLabel
        placeholder={t('license_plate_placeholder')}
      />
      <MInput //
        label={t('owner')}
        labelAlign="left"
        name="ownerBy"
        noLabel
        placeholder={t('owner_placeholder')}
      />
    </>
  );
};

export default TruckForm;
