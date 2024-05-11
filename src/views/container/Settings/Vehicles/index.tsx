import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';

import VehiclesList from './VehicleCheckList';

const SettingVehicles = () => {
  const { t }: any = useTranslation();

  return (
    <Card>
      <CardHeader
        className="d-flex flex-wrap w-100"
        titleHeader={
          <div className="d-flex flex-column mr-3 my-5 pb-5 pb-lg-1">
            <h2>{t('settings_vehicle').toUpperCase()}</h2>
            <div className="text-muted w-100">{t('settings_vehicle_des')}</div>
          </div>
        }></CardHeader>
      <CardBody className="pt-4">
        <VehiclesList />
      </CardBody>
    </Card>
  );
};

export default SettingVehicles;
