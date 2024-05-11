import React from 'react';
import { useTranslation } from 'react-i18next';
import { BODY_TYPE, FUEL_TYPE, GEARBOX_TYPES, MODEL_TYPES, VEHICLE_BRANDS } from '~/configs';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import MSelect from '~/views/presentation/fields/Select';

const CarForm = (props) => {
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
        label={t('model')}
        labelAlign="left"
        name="modelId"
        require
        noLabel
        options={Object.keys(MODEL_TYPES).map((type) => {
          return {
            value: MODEL_TYPES[type],
            label: t(type)
          };
        })}
        placeholder={t('model_placeholder')}
      />
      <MSelect //
        label={t('gearbox_type')}
        require
        labelAlign="left"
        name="gearboxTypeId"
        noLabel
        options={Object.keys(GEARBOX_TYPES).map((type) => {
          return {
            value: GEARBOX_TYPES[type],
            label: t(type)
          };
        })}
        placeholder={t('gearbox_type_placeholder')}
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
      <MInput //
        label={t('producing_year')}
        labelAlign="left"
        name="producingYear"
        noLabel
        require={false}
        placeholder={t('producing_year_placeholder')}
      />
      <MInput //
        label={t('seats')}
        labelAlign="left"
        require={false}
        name="seat"
        noLabel
        placeholder={t('seats_placeholder')}
      />
      <MInput //
        label={t('doors')}
        labelAlign="left"
        require={false}
        name="door"
        noLabel
        placeholder={t('doors_placeholder')}
      />
      <MInput //
        label={t('engine')}
        labelAlign="left"
        require={false}
        name="engine"
        noLabel
        placeholder={t('engine_placeholder')}
      />
      <MSelect //
        label={t('body_type')}
        labelAlign="left"
        require={false}
        name="bodyTypeId"
        noLabel
        options={Object.keys(BODY_TYPE).map((type) => {
          return {
            value: BODY_TYPE[type],
            label: t(type)
          };
        })}
        placeholder={t('body_type_placeholder')}
      />
      <Divider />
      <MInput //
        label={t('license_plate')}
        labelAlign="left"
        require={false}
        name="license"
        noLabel
        placeholder={t('license_plate_placeholder')}
      />
      <MInput //
        label={t('owner')}
        labelAlign="left"
        name="ownerdBy"
        require={false}
        noLabel
        placeholder={t('owner_placeholder')}
      />
    </>
  );
};

export default CarForm;
