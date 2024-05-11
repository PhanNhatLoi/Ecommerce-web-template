import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ACCEPT_VIDEO_UPLOAD } from '~/configs/upload';
import { vehicleActions } from '~/state/ducks/vehicle';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUpload } from '~/views/presentation/fields/upload';
import UploadImageCropMultiple from '~/views/presentation/fields/upload/UploadImageCropMultiple';
import UploadImageNoCropMultiple from '~/views/presentation/fields/upload/UploadImageNoCropMultiple';
import LayoutForm from '~/views/presentation/layout/forForm';

type VehicleInfoProps = {
  form: any;
  allowEdit: boolean;
  loading: boolean;
  isRevaluationModal?: boolean;
  images?: any;
  video?: any;
  getVehicleBrand: any;
  getVehicleModel: any;
  getVehicleType: any;
};

export const VEHICLE_MAX_DATA = {
  PRICE: 50000000000,
  PRODUCING_YEAR: moment().year(),
  TRAVELLED_DISTANCE: 999999,
  SEATS: 60,
  LICENSE: 20,
  TITLE: 50,
  DESCRIPTION: 1500
};

const VehicleInfo: React.FC<VehicleInfoProps> = (props) => {
  const { t }: any = useTranslation();

  const [brandId, setBrandId] = useState<any>();

  const onImageChange = (file: any) => {
    if (file.every((f: any) => f.url.length > 0)) {
      props.form.setFieldsValue({
        images: file.map((f: any) => {
          return {
            url: f?.url,
            type: 'IMAGE'
          };
        })
      });
    }
  };

  const onVideoChange = (file: any) => {
    props.form.setFieldsValue({
      video:
        file?.length > 0
          ? file.map((f: any) => {
              return { name: f?.name, url: f?.url, type: 'VIDEO' };
            })
          : []
    });
  };

  return (
    <LayoutForm data-aos="fade-left" data-aos-delay="300" title={t('vehicleInformation')} description={t('')}>
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <MSelect
            name="brandId"
            noLabel
            noPadding
            require={true}
            label={t('vehicleBrand')}
            placeholder={t('vehicleBrand')}
            disabled={!props.allowEdit}
            searchCorrectly={false}
            hasFeedback={false}
            fetchData={props.getVehicleBrand}
            params={{ type: 'CAR' }}
            valueProperty="id"
            labelProperty="name"
            onChange={(value: any) => {
              setBrandId(value);
              props.form.setFieldValue('modelId', undefined);
            }}
          />
        </div>
        <div className="col-12 col-md-6 mb-4">
          <MSelect
            name="modelId"
            noLabel
            noPadding
            require={true}
            label={t('vehicleModel')}
            placeholder={t('vehicleModel')}
            disabled={!props.allowEdit}
            searchCorrectly={false}
            hasFeedback={false}
            fetchData={props.getVehicleModel}
            params={{ brandId: props.form.getFieldValue('brandId') || brandId }}
            valueProperty="id"
            labelProperty="name"
          />
        </div>

        <div className="col-12 col-md-6">
          <MInputNumber
            name="producingYear"
            noLabel
            noPadding
            require
            hasFeedback={false}
            controls={false}
            formatter={undefined}
            disabled={!props.allowEdit}
            label={t('producing_year')}
            placeholder={t('producing_year')}
            max={VEHICLE_MAX_DATA.PRODUCING_YEAR}
          />
        </div>
        <div className="col-12 col-md-6 mb-4">
          <MSelect
            name="gearboxTypeId"
            noLabel
            noPadding
            require={true}
            label={t('gearbox_type')}
            placeholder={t('gearbox_type')}
            disabled={!props.allowEdit}
            searchCorrectly={false}
            hasFeedback={false}
            fetchData={props.getVehicleType}
            params={{ type: 'GEARBOX_TYPE' }}
            valueProperty="id"
            labelProperty="name"
          />
        </div>

        <div className="col-12 col-md-6 mb-4">
          <MSelect
            name="fuelTypeId"
            noLabel
            noPadding
            require={true}
            label={t('fuel_type')}
            placeholder={t('fuel_type')}
            disabled={!props.allowEdit}
            searchCorrectly={false}
            hasFeedback={false}
            fetchData={props.getVehicleType}
            params={{ type: 'FUEL_TYPE' }}
            valueProperty="id"
            labelProperty="name"
          />
        </div>
        {!props.isRevaluationModal && (
          <>
            <div className="col-12 col-md-6 mb-4">
              <MInputNumber
                name="seat"
                noLabel
                noPadding
                require={false}
                hasFeedback={false}
                controls={false}
                disabled={!props.allowEdit}
                label={t('Seats')}
                placeholder={t('Seats')}
                max={VEHICLE_MAX_DATA.SEATS}
              />
            </div>

            <div className="col-12 col-md-6 mb-4">
              <MSelect
                name="bodyTypeId"
                noLabel
                noPadding
                require={false}
                label={t('body_type')}
                placeholder={t('body_type')}
                disabled={!props.allowEdit}
                searchCorrectly={false}
                hasFeedback={false}
                fetchData={props.getVehicleType}
                params={{ type: 'BODY_TYPE' }}
                valueProperty="id"
                labelProperty="name"
              />
            </div>
            <div className="col-12 col-md-6 mb-4">
              <MSelect
                name="colorId"
                noLabel
                noPadding
                require={false}
                label={t('vehicleColor')}
                placeholder={t('vehicleColor')}
                disabled={!props.allowEdit}
                searchCorrectly={false}
                hasFeedback={false}
                fetchData={props.getVehicleType}
                params={{ type: 'COLOR' }}
                valueProperty="id"
                labelProperty="name"
              />
            </div>
          </>
        )}

        <div className="col-12 col-md-6 mb-4">
          <MInputNumber
            name="travelledDistance"
            noLabel
            noPadding
            require
            hasFeedback={false}
            controls={false}
            disabled={!props.allowEdit}
            label={t('odometerReading')}
            placeholder={t('odometerReading')}
            max={VEHICLE_MAX_DATA.TRAVELLED_DISTANCE}
          />
        </div>
        {!props.isRevaluationModal && (
          <>
            <div className="col-12 col-md-6 mb-4">
              <MInput //
                name="license"
                label={t('license_plate')}
                placeholder={t('license_plate_placeholder')}
                require={false}
                noLabel
                noPadding
                disabled={!props.allowEdit}
                maxLength={VEHICLE_MAX_DATA.LICENSE}
              />
            </div>

            <div className="col-12 col-md-6 mb-4">
              <UploadImageCropMultiple
                name="images"
                label={t('carImage')}
                aspect={1 / 1}
                noLabel
                noPadding
                require
                alwayShowUploadBtn
                fileList={props.images}
                disabled={!props.allowEdit}
                uploadText={t('upload_image')}
                onImageChange={onImageChange}
              />
            </div>
            <div className="col-12 col-md-6 mb-4">
              <MUpload //
                name="video"
                label={t('video')}
                noLabel
                accept={ACCEPT_VIDEO_UPLOAD.join(', ')}
                noPadding
                alwayShowUploadBtn
                maxCount={undefined}
                disabled={!props.allowEdit}
                fileList={props.video}
                require={false}
                onImageChange={onVideoChange}
              />
            </div>
          </>
        )}
      </div>
    </LayoutForm>
  );
};

export default connect(
  (state: any) => ({
    locale: state['appData']?.locale
  }),
  {
    getVehicleBrand: vehicleActions.getVehicleBrand,
    getVehicleModel: vehicleActions.getVehicleModel,
    getVehicleType: vehicleActions.getVehicleType
  }
)(VehicleInfo);
