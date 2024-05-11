import { DeleteOutlined } from '@ant-design/icons';
import { Descriptions, Tooltip } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE, VEHICLE_TYPES } from '~/configs';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import { AListItem } from '~/views/presentation/ui/list/AList';
import ATypography from '~/views/presentation/ui/text/ATypography';

const VehicleItem = (props) => {
  const { t } = useTranslation();
  const { vehicle, setFormModalShow } = props;

  return (
    <AListItem>
      <div className="px-3 py-5 w-100" style={{ border: '1px solid #e6e8ef' }}>
        <div className="row">
          <div className="col-12 col-lg-2 d-flex align-items-start justify-content-center">
            {vehicle?.vehicleTypeId === VEHICLE_TYPES.CAR ? (
              <i className="fas fa-car" style={{ color: '#000', fontSize: '32px' }}></i>
            ) : (
              vehicle?.vehicleTypeId === VEHICLE_TYPES.TRUCK && <i className="fas fa-truck" style={{ color: '#000', fontSize: '32px' }}></i>
            )}
          </div>
          <div className="col-12 col-lg-10">
            <div>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>{`${vehicle?.modelName || vehicle?.brandName}, ${
                vehicle?.producingYear
              }`}</ATypography>
            </div>
            <AlignedDescription //
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.5)', width: 'fit-content', padding: '0px' }}
              contentStyle={{ padding: '0px' }}
              bordered>
              {vehicle?.vehicleTypeId === VEHICLE_TYPES.CAR ? (
                <>
                  <Descriptions.Item label={`${t('brand')}:`}>{vehicle?.brandName}</Descriptions.Item>
                  <Descriptions.Item label={`${t('gearbox_type')}:`}>{vehicle?.gearBoxName}</Descriptions.Item>
                  <Descriptions.Item label={`${t('fuel_type')}:`}>{vehicle?.fuelTypeName}</Descriptions.Item>
                </>
              ) : (
                vehicle?.vehicleTypeId === VEHICLE_TYPES.TRUCK && (
                  <>
                    <Descriptions.Item label={`${t('load_capacity')}:`}>{t(vehicle?.loadCapacityName)}</Descriptions.Item>
                    <Descriptions.Item label={`${t('demention')}:`}>{vehicle?.demention}</Descriptions.Item>
                  </>
                )
              )}
            </AlignedDescription>
            <div className="mt-5 d-flex align-items-center justify-content-between">
              <AButton onClick={() => setFormModalShow(true)} size="large" type="link" className="pl-0">
                {t('edit')}
              </AButton>
              <Tooltip title={t('delete')}>
                <AButton //
                  size="large"
                  type="link"
                  onClick={() => {
                    const newList = props.vehicleList.filter((ve) => {
                      return vehicle?.key !== ve?.key;
                    });
                    props.setVehicleList(newList);
                  }}
                  className="pl-0"
                  icon={<DeleteOutlined style={{ color: '#000' }} />}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </AListItem>
  );
};

export default VehicleItem;
