import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AList } from '~/views/presentation/ui/list/AList';
import ATypography from '~/views/presentation/ui/text/ATypography';

import VehicleForm from './VehicleForm';
import VehicleItem from './VehicleItem';

const VehicleList = (props) => {
  const { t } = useTranslation();
  const [formModalShow, setFormModalShow] = useState(false);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-5">
        <ATypography className="mr-2" style={{ fontSize: 24 }}>
          {t('vehicles')}
        </ATypography>
        <AButton onClick={() => setFormModalShow(true)} type="primary" icon={<PlusOutlined />}>
          {t('add_new_vehicle')}
        </AButton>
      </div>
      <AList
        itemLayout="horizontal"
        dataSource={props.vehicleList}
        renderItem={(vehicle) => (
          <VehicleItem //
            setVehicleList={props.setVehicleList}
            vehicleList={props.vehicleList}
            vehicle={vehicle}
            setFormModalShow={setFormModalShow}
          />
        )}
      />

      <VehicleForm //
        vehicleList={props.vehicleList}
        setVehicleList={props.setVehicleList}
        modalShow={formModalShow}
        setModalShow={setFormModalShow}
      />
    </>
  );
};

export default VehicleList;
