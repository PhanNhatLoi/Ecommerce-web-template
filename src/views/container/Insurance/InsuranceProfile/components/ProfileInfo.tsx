import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, NextBtn, PrevBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';

import { STEP_LENGTH_APD, STEP_LENGTH_CL } from '../Forms/StepProgressForm';
import PackageModal from '../Modals/PackageModal';

const TotalPriceStyled = styled.div`
  width: 100px;
  height: 70px;
  background-color: gray;
  border-radius: 10px;
`;

type ProfileInfoProps = {
  type: string;
  formValues: any;
  selectFieldData: any;
  next?: () => void;
  prev?: () => void;
  currentStep?: number;
  allowEdit: boolean;
  submissionId?: any;
};

const ProfileInfo: React.FC<ProfileInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [packageModalShow, setPackageModalShow] = useState(false);
  const [packageId, setPackageId] = useState<any>();

  const InfoItem = ({ label, value, strongLabel = false, setModalShow = undefined }: any) => {
    return (
      <div className="row mb-5">
        <div className={`col-5 ${!value && 'mb-1'}`}>
          <ATypography strong={strongLabel}>{label}</ATypography>
        </div>
        <div className="col-1"></div>
        <div className="col-6 text-right">
          {setModalShow ? (
            <a
              href="*"
              onClick={(e) => {
                e.preventDefault();
                setPackageId(props.formValues?.insurancePackage?.id);
                setModalShow(true);
              }}>
              {value}
            </a>
          ) : (
            <ATypography strong>{value}</ATypography>
          )}
        </div>
      </div>
    );
  };

  const infoList = {
    person: [
      { label: t('applicant'), strongLabel: true },
      { label: t('fullName'), value: props.formValues?.buyer?.fullname || t('no_data') },
      { label: t('address'), value: props.formValues?.buyer?.fullAddress || t('no_data') },
      {
        label: t('identityCardNumber'),
        value: props.formValues?.buyer?.identificationNumber || t('no_data')
      },
      {
        label: t('phone_number'),
        value: props.formValues?.buyer?.phone ? formatPhoneWithCountryCode(props.formValues?.buyer?.phone) : t('no_data')
      },
      {
        label: t('dayOfBirth'),
        value: props.formValues?.buyer?.dateOfBirth ? UtilDate.toDateLocal(props.formValues?.buyer?.dateOfBirth) : t('no_data')
      },
      { label: t('email_address'), value: props.formValues?.buyer?.email || t('no_data') },
      { label: t('beneficiary'), strongLabel: true },
      { label: t('fullName'), value: props.formValues?.insured?.fullname || t('no_data') },
      { label: t('address'), value: props.formValues?.insured?.fullAddress || t('no_data') },
      {
        label: t('identityCardNumber'),
        value: props.formValues?.insured?.identificationNumber || t('no_data')
      },
      {
        label: t('taxId'),
        value: props.formValues?.insured?.otherInfo || t('no_data')
      }
    ],
    car:
      // props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT
      //   ?
      [
        {
          label: t('vehicle_type'),
          value: props.formValues?.insurance?.type === 'COMMERCIAL' ? t('business') : t('nonBusiness'),
          strongLabel: true
        },
        { label: t('car_type'), value: props.formValues?.vehicleType?.name || t('no_data') },
        { label: t('vehicle_info'), strongLabel: true },
        { label: t('licensePlate'), value: props.formValues?.vehicle?.numberPlate || t('no_data') },
        { label: t('chassisNumber'), value: props.formValues?.vehicle?.chassisNumber || t('no_data') },
        { label: t('engineNumber'), value: props.formValues?.vehicle?.machineNumber || t('no_data') }
      ],
    // : [
    //     { label: t('vehicle_info'), strongLabel: true },
    //     { label: t('licensePlate'), value: '51G-77777' },
    //     { label: t('chassisNumber'), value: '123123' },
    //     { label: t('engineNumber'), value: '22222222' },
    //     { label: t('vehicleBrand'), value: 'Toyota' },
    //     { label: t('vehicleModel'), value: 'Vios' },
    //     { label: t('yearOfManufacture'), value: '2020' },
    //     { label: t('purposeUse'), strongLabel: true },
    //     { label: t('purpose'), value: 'Không kinh doanh' },
    //     { label: t('businessField'), value: 'Xe hoạt động trong sân bay' },
    //     { label: t('otherInfo'), strongLabel: true },
    //     { label: t('annualMileageVehicle'), value: 'Dưới 3000 km/năm' },
    //     { label: t('maintenanceSafetyCheck'), value: 'Có' },
    //     { label: t('safetyRulesRegulations'), value: 'Có' }
    //   ],
    package: [
      { label: t('package_insurance'), strongLabel: true },
      {
        label: t('company_name'),
        value: props.formValues?.insurer?.fullName || t('no_data')
      },
      {
        label: t('insurancePackageType'),
        value: t(props.formValues?.insurancePackage?.packageType) || t('no_data')
      },
      {
        label: t('insurancePackageName'),
        value: props.formValues?.insurancePackage?.name || t('no_data'),
        strongLabel: false,
        setModalShow: setPackageModalShow
      }
    ],
    period:
      // props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT
      //   ?
      [
        { label: t('insuranceYear'), value: props.formValues?.insurance?.effectYear || t('no_data'), strongLabel: true },
        {
          label: t('fromDate'),
          value: props.formValues?.insurance?.effectDateFrom
            ? UtilDate.toDateTimeLocal(props.formValues?.insurance?.effectDateFrom)
            : t('no_data')
        },
        {
          label: t('toDate'),
          value: props.formValues?.insurance?.effectDateTo
            ? UtilDate.toDateTimeLocal(props.formValues?.insurance?.effectDateTo)
            : t('no_data')
        }
      ],
    // : [
    //     { label: t('fromDate'), strongLabel: true },
    //     { label: '15:30, 1/1/2023' },
    //     { label: t('toDate'), strongLabel: true },
    //     { label: '15:30, 1/1/2025' }
    //   ],
    scope:
      // props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT
      //   ?
      [
        { label: t('responsibilityLevel'), strongLabel: true },
        {
          label: t('aboutPersons'),
          value:
            props.selectFieldData?.responsibilityPerson?.length > 0
              ? numberFormatDecimal(+props.selectFieldData?.responsibilityPerson[0]?.name, ' đ', '')
              : t('no_data')
        },
        {
          label: t('aboutCustomers'),
          value:
            props.selectFieldData?.responsibilityPerson?.length > 0
              ? numberFormatDecimal(+props.selectFieldData?.responsibilityPerson[0]?.name, ' đ', '')
              : t('no_data')
        },
        {
          label: t('aboutAssets'),
          value:
            props.selectFieldData?.responsibilityProperty?.length > 0
              ? numberFormatDecimal(+props.selectFieldData?.responsibilityProperty[0]?.name, ' đ', '')
              : t('no_data')
        },
        { label: t('insuranceSecondDriver'), strongLabel: true },
        { label: t('join'), value: props.formValues?.insurance?.extraInsurance?.quantity ? t('yes') : t('no') },
        {
          label: t('responsibilityLevel'),
          value: numberFormatDecimal(props.formValues?.insurance?.extraInsurance?.unitPrice, ' đ', '') || t('no_data')
        },
        { label: t('participantQuantity'), value: props.formValues?.insurance?.extraInsurance?.quantity || t('no_data') },
        {
          label: t('voluntaryInsuranceFee'),
          value: numberFormatDecimal(props.formValues?.insurance?.extraInsurance?.total, ' đ', '') || t('no_data')
        }
      ],
    // : [
    //     { label: t('vehicleValue'), strongLabel: true },
    //     { label: t('vehicleCost'), value: numberFormatDecimal(150000000, ' đ', '') },
    //     { label: t('insuranceCost'), value: numberFormatDecimal(150000000, ' đ', '') },
    //     { label: t('004. BH thay thế mới bộ phận') },
    //     { label: t('005. BH lựa chọn cơ sở sửa chữa') },
    //     { label: t('006. BH thủy kích') }
    //   ],
    carImage: []
  };

  return (
    <div className="mt-10">
      <LayoutForm title={t('insuredPersonInfo')} description="">
        {infoList.person
          .filter((info) => info.label.length > 0)
          .map((info) => (
            <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} />
          ))}
      </LayoutForm>

      <Divider />

      <LayoutForm title={t('insuredCarInfo')} description="">
        {infoList.car.map((info) => (
          <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} />
        ))}
      </LayoutForm>

      <Divider />

      <LayoutForm title={t('insuranceInfo')} description="">
        {infoList.package.map((info) => (
          <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} setModalShow={info.setModalShow} />
        ))}
      </LayoutForm>

      <Divider />

      {/* {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? (
        <> */}
      <LayoutForm title={t('insurancePeriod')} description="">
        {infoList.period.map((info) => (
          <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} />
        ))}
      </LayoutForm>

      <Divider />

      <LayoutForm title={t('insuranceScope')} description="">
        {(props.formValues?.insurance?.type === 'COMMERCIAL'
          ? infoList.scope
          : infoList.scope.filter((info) => info.label !== t('aboutCustomers'))
        ).map((info) => (
          <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} />
        ))}
      </LayoutForm>
      {/* </>
      ) : (
        <>
          <LayoutForm title={t('insuranceScope')} description="">
            {infoList.scope.map((info) => (
              <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} />
            ))}
          </LayoutForm>

          <Divider />

          <LayoutForm title={t('carImage')} description=""></LayoutForm>

          <Divider />

          <LayoutForm title={t('insurancePeriod')} description="">
            {infoList.period.map((info) => (
              <InfoItem label={info.label} value={info.value} strongLabel={info.strongLabel} />
            ))}
          </LayoutForm>
        </>
      )} */}

      {/* <Divider />

      <LayoutForm title="" description="">
        <div className="container d-flex justify-content-center align-items-center">
          <div
            className="d-flex justify-content-center align-items-center px-20 py-6"
            style={{ borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
            <div className="text-center">
              <p>{t('totalPrice')}</p>
              <h3>{numberFormatDecimal(props.formValues?.total || 0, ' đ', '')}</h3>
            </div>
          </div>
        </div>
      </LayoutForm> */}

      {!props?.submissionId && (
        <>
          <Divider />

          <div className="d-flex justify-content-center">
            <BackBtn onClick={() => history.push(PATH.INSURANCE_PROFILE_LIST_PATH)} />
          </div>
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

      <PackageModal packageId={packageId} modalShow={packageModalShow} setModalShow={setPackageModalShow} />
    </div>
  );
};

export default ProfileInfo;
