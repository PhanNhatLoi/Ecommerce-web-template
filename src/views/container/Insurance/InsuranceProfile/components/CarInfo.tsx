import { Col, Form, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { VEHICLE_BUSINESS_TYPE } from '~/configs';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import Divider from '~/views/presentation/divider';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { NextBtn, PrevBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import { STEP_LENGTH_APD, STEP_LENGTH_CL } from '../Forms/StepProgressForm';
import { MDatePickerStyled, MInputNumberStep2Styled } from './Styles';

const MInputNumberStyled = styled(MInputNumber)`
  :hover {
    border-color: #40a9ff;
  }

  .ant-input-number-affix-wrapper-focused {
    box-shadow: none;
  }

  .ant-input-number-affix-wrapper {
    border: none;
    border-bottom: 1px solid #000;
  }
`;

type CarInfoProps = {
  type: string;
  formValues: any;
  setFormValues: any;
  next?: () => void;
  prev?: () => void;
  currentStep?: number;
  allowEdit: boolean;
};

const CarInfo: React.FC<CarInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const vehicleTypeWatch = Form.useWatch('vehicleType', form) || VEHICLE_BUSINESS_TYPE.NON_COMMERCIAL;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    form.setFieldsValue({
      vehicleType: props.formValues?.vehicleType || VEHICLE_BUSINESS_TYPE.NON_COMMERCIAL
    });
  }, [props.currentStep]);

  const onFinish = (values: any) => {
    const data = {
      vehicle: {
        numberPlate: values?.numberPlate,
        chassisNumber: values?.chassisNumber,
        machineNumber: values?.machineNumber,
        seat: values?.seat,
        weight: values?.weight
      }
    };

    props.setFormValues((prevState) => ({ ...prevState, ...data }));
    props.next && props.next();
  };

  const BillItem = ({ label, value, strong }) => {
    return (
      <div className="row mb-5">
        <div className="col-5">
          <ATypography strong={strong || false}>{label}</ATypography>
        </div>
        <div className="col-1"></div>
        <div className="col-6 text-right">
          <ATypography strong={strong || false}>{value}</ATypography>
        </div>
      </div>
    );
  };

  const billList = [
    { label: t('compulsoryInsuranceFee'), value: numberFormatDecimal(1000000000, ' đ', '') },
    { label: t('vatTax'), value: numberFormatDecimal(100000000, ' đ', '') },
    { label: t('totalCompulsoryInsuranceFee'), value: numberFormatDecimal(1100000000, ' đ', ''), strong: true }
  ];

  const CLLayout = () => (
    <>
      <Col sm={24} md={11} lg={11} className="w-100">
        <MInput
          name="chassisNumber"
          label={t('chassisNumber')}
          hasFeedback
          placeholder={t('chassisNumber')}
          noLabel
          noPadding
          required={true}
        />
      </Col>
      <Col sm={24} md={2} lg={2} />
      <Col sm={24} md={11} lg={11} className="w-100">
        <MInput
          name="machineNumber"
          label={t('engineNumber')}
          hasFeedback
          require={false}
          placeholder={t('engineNumber')}
          noLabel
          noPadding
        />
      </Col>
    </>
  );

  const APDLayout = () => (
    <>
      <Col sm={24} md={11} lg={11} className="w-100">
        <MInput
          name="chassisNumber"
          label={t('chassisNumber')}
          hasFeedback
          placeholder={t('chassisNumber')}
          noLabel
          noPadding
          required={true}
        />
        <MInput
          name="machineNumber"
          label={t('engineNumber')}
          hasFeedback
          require={false}
          placeholder={t('engineNumber')}
          noLabel
          noPadding
        />
      </Col>
      <Col sm={24} md={2} lg={2} />
      <Col sm={24} md={11} lg={11} className="my-auto d-flex justify-content-center align-items-center">
        <MUploadImageCrop //
          name="vehicleMedia"
          aspect={17 / 10}
          uploadText={t('uploadCarDocument')}
          // file={avatarFile}
          // onImageChange={onAvatarChange}
          required={true}
        />
      </Col>

      <Col sm={24} md={24} lg={24} className="w-100">
        <MSelect label={t('vehicleBrand')} name="vehicleBrand" noLabel noPadding placeholder={t('vehicleBrand')} />
      </Col>

      <Col sm={24} md={24} lg={24} className="w-100">
        <MSelect label={t('vehicleModel')} name="vehicleModel" noLabel noPadding placeholder={t('vehicleModel')} />
      </Col>

      <Col sm={24} md={24} lg={24} className="w-100">
        <MInputNumberStyled
          name="manufactureYear"
          label={t('yearOfManufacture')}
          hasFeedback
          require={false}
          placeholder={t('yearOfManufacture')}
          noLabel
          noPadding
          controls={false}
          size="medium"
        />
      </Col>
    </>
  );

  return (
    <Form
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      form={form}
      onFinish={onFinish}>
      <div className="mt-10">
        {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT && (
          <LayoutForm title={t('vehicle_type')} description={t('')}>
            <Row>
              <Col sm={24} md={24} lg={24} className="w-100">
                <MRadio
                  name="vehicleType"
                  label={t('car_type')}
                  noLabel
                  noPadding
                  required={true}
                  spaceSize="middle"
                  defaultValue={VEHICLE_BUSINESS_TYPE.NON_COMMERCIAL}
                  options={[
                    { value: VEHICLE_BUSINESS_TYPE.COMMERCIAL, label: t('business') },
                    { value: VEHICLE_BUSINESS_TYPE.NON_COMMERCIAL, label: t('nonBusiness') }
                  ]}
                  className="mb-6"
                />
              </Col>

              <Col sm={24} md={24} lg={24} className="w-100">
                <MSelect
                  label={vehicleTypeWatch === VEHICLE_BUSINESS_TYPE.COMMERCIAL ? t('businessCar') : t('nonBusinessCar')}
                  name="unitId"
                  noLabel
                  noPadding
                  size="medium"
                  placeholder={vehicleTypeWatch === VEHICLE_BUSINESS_TYPE.COMMERCIAL ? t('businessCar') : t('nonBusinessCar')}
                />
              </Col>
            </Row>
          </LayoutForm>
        )}

        <Divider />

        <LayoutForm title={t('vehicle_info')} description={t('')}>
          <Row>
            <Col sm={24} md={24} lg={24} className="w-100">
              <MSelect label={t('selectCarList')} name="unitId" noLabel noPadding size="medium" placeholder={t('selectCarList')} />
            </Col>

            <Col sm={24} md={24} lg={24} className="w-100">
              <MInput name="numberPlate" label={t('licensePlate')} hasFeedback placeholder={t('licensePlate')} noLabel noPadding />
            </Col>

            {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? <CLLayout /> : <APDLayout />}

            <Col sm={24} md={11} lg={11} className="w-100">
              <MInputNumberStyled
                name="seat"
                label={t('Seats')}
                hasFeedback
                placeholder={t('Seats')}
                noLabel
                noPadding
                require={false}
                controls={false}
                min={1}
                size="medium"
              />
            </Col>
            <Col sm={24} md={2} lg={2} />
            <Col sm={24} md={11} lg={11} className="w-100">
              <MInputNumberStyled
                name="weight"
                label={`${t('loadCapacity')} (${t('tons')})`}
                hasFeedback
                require={false}
                placeholder={`${t('loadCapacity')} (${t('tons')})`}
                noLabel
                noPadding
                controls={false}
                size="medium"
              />
            </Col>

            {props.type === INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE && (
              <>
                <Col sm={24} md={11} lg={11}>
                  <MDatePickerStyled
                    label={t('registrationDate')}
                    labelAlign="left"
                    disabledDate={false}
                    name="registrationDate"
                    placeholder={t('registrationDate')}
                    noLabel
                    noPadding
                  />
                </Col>
                <Col sm={24} md={2} lg={2} />
                <Col sm={24} md={11} lg={11} className="w-100">
                  <MInput
                    name="vehicleColor"
                    label={t('vehicleColor')}
                    hasFeedback
                    require={false}
                    placeholder={t('vehicleColor')}
                    noLabel
                    noPadding
                  />
                </Col>

                <Col sm={24} md={11} lg={11} className="w-100">
                  <MInput
                    name="cylinderCapacity"
                    label={t('cylinderCapacity')}
                    hasFeedback
                    placeholder={t('cylinderCapacity')}
                    noLabel
                    noPadding
                    require={false}
                  />
                </Col>
                <Col sm={24} md={2} lg={2} />
                <Col sm={24} md={11} lg={11} className="w-100">
                  <MInput
                    name="actualValueVehicle"
                    label={t('actualValueVehicle')}
                    hasFeedback
                    require={false}
                    placeholder={t('actualValueVehicle')}
                    noLabel
                    noPadding
                  />
                </Col>
              </>
            )}
          </Row>
        </LayoutForm>

        <Divider />

        {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? (
          <LayoutForm title={t('insuranceFeeInfo')} description={t('')}>
            {billList.map((bill) => (
              <BillItem label={bill.label} value={bill.value} strong={bill.strong} />
            ))}
          </LayoutForm>
        ) : (
          <>
            <LayoutForm title={t('purposeUse')} description={t('')}>
              <Row>
                <Col sm={24} md={24} lg={24} className="w-100">
                  <MRadio
                    name="purpose"
                    label={t('purpose')}
                    noLabel
                    noPadding
                    required={true}
                    spaceSize="middle"
                    defaultValue={1}
                    options={[
                      { value: 1, label: t('business') },
                      { value: 2, label: t('nonBusiness') }
                    ]}
                  />
                </Col>

                <Col sm={24} md={24} lg={24} className="w-100">
                  <MSelect
                    label={t('businessField')}
                    name="businessField"
                    noLabel
                    noPadding
                    size="medium"
                    placeholder={t('businessField')}
                  />
                </Col>
              </Row>
            </LayoutForm>

            <Divider />

            <LayoutForm title={t('otherInfo')} description={t('')}>
              <Row>
                <Col sm={24} md={24} lg={24} className="w-100">
                  <MInput
                    name="routeRegularly"
                    label={t('routeRegularly')}
                    hasFeedback
                    placeholder={t('routeRegularly')}
                    noLabel
                    noPadding
                  />
                </Col>

                <Col sm={24} md={24} lg={24} className="w-100">
                  <MSelect
                    label={t('annualMileageVehicle')}
                    name="annualMileageVehicle"
                    noLabel
                    noPadding
                    size="medium"
                    placeholder={t('annualMileageVehicle')}
                  />
                </Col>

                <Col sm={24} md={24} lg={24} className="w-100">
                  <MInput
                    name="regularParkingLocation"
                    label={t('regularParkingLocation')}
                    hasFeedback
                    placeholder={t('regularParkingLocation')}
                    noLabel
                    noPadding
                  />
                </Col>

                <Col sm={24} md={24} lg={24} className="w-100">
                  <MRadio
                    name="maintenanceSafetyCheck"
                    label={t('maintenanceSafetyCheck')}
                    noLabel
                    noPadding
                    required={true}
                    spaceSize="middle"
                    defaultValue={1}
                    options={[
                      { value: 1, label: t('yes') },
                      { value: 2, label: t('No') }
                    ]}
                  />
                </Col>
                <Col sm={24} md={10} lg={10} className="w-100">
                  <MInputNumberStep2Styled
                    name="conversionSku"
                    min={1}
                    label=""
                    placeholder={t('numberTimesPerYear')}
                    noPadding
                    noLabel
                    hasFeedback={false}
                    formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                    addonAfter={<span style={{ fontSize: '13px' }}>{t('times/year')}</span>}
                  />
                </Col>

                <Col sm={24} md={24} lg={24} className="w-100">
                  <MRadio
                    name="safetyRulesRegulations"
                    label={t('safetyRulesRegulations')}
                    noLabel
                    noPadding
                    required={true}
                    spaceSize="middle"
                    defaultValue={1}
                    options={[
                      { value: 1, label: t('yes') },
                      { value: 2, label: t('No') }
                    ]}
                  />
                </Col>
                <Col sm={24} md={24} lg={24} className="w-100">
                  <MInput
                    name="measuresPreventLosses"
                    label={t('measuresPreventLosses')}
                    hasFeedback
                    placeholder={t('measuresPreventLosses')}
                    noLabel
                    noPadding
                  />
                </Col>
              </Row>
            </LayoutForm>
          </>
        )}

        {props.allowEdit && (
          <>
            <Divider />

            <div className="d-flex justify-content-center align-item-center">
              {props.currentStep && props.currentStep > 0 && <PrevBtn onClick={() => props.prev && props.prev()} />}
              {props.currentStep &&
                props.currentStep < (props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? STEP_LENGTH_CL : STEP_LENGTH_APD) - 1 && (
                  <NextBtn htmlType="submit" />
                )}
            </div>
          </>
        )}
      </div>
    </Form>
  );
};

export default CarInfo;
