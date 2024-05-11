import { Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { GENERAL_TYPE } from '~/configs/const';
import * as PATH from '~/configs/routesConfig';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import { appDataActions } from '~/state/ducks/appData';
import { insuranceProfileActions } from '~/state/ducks/insurance/insurance-profile';
import { packageActions } from '~/state/ducks/insurance/package';
import HOC from '~/views/container/HOC';
import { BackBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';

import ProfileInfo from '../components/ProfileInfo';
import StepProgressForm from './StepProgressForm';

const { TabPane } = Tabs;

type InfoFormProps = {
  submissionId?: number; // use for view insurance submission modal
  getInsuranceProfileDetail: any;
  getVehicleType: any;
  getPackageDetail: any;
  getGeneralType: any;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<any>();
  const [viewFormValues, setViewFormValues] = useState<any>();
  const [selectFieldData, setSelectFieldData] = useState<any>();

  const fetchData = (action, param, field, setData, isNewState = false) => {
    setLoading(true);
    action(param)
      .then((res) => {
        if (isNewState) setData(res?.content);
        else setData((data) => ({ ...data, [field]: res?.content || [] }));
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 33 ~ fetchData ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (params.id || props?.submissionId) {
      fetchData(props.getInsuranceProfileDetail, params.id || props?.submissionId, '', setViewFormValues, true);
    } else {
      fetchData(props.getGeneralType, { type: GENERAL_TYPE.AAA_INSURANCE_EFFECT_YEAR }, 'effectYear', setSelectFieldData);
      fetchData(props.getGeneralType, { type: GENERAL_TYPE.AAA_INSURANCE_VOLUNTARY_PREMIUM_PRICE }, 'voluntaryPrice', setSelectFieldData);
      fetchData(props.getGeneralType, { type: GENERAL_TYPE.AAA_INSURANCE_VOLUNTARY_PREMIUM_RATE }, 'voluntaryRate', setSelectFieldData);
    }
    fetchData(
      props.getGeneralType,
      { type: GENERAL_TYPE.AAA_INSURANCE_RESPONSIBILITY_PERSON_PRICE },
      'responsibilityPerson',
      setSelectFieldData
    );
    fetchData(
      props.getGeneralType,
      { type: GENERAL_TYPE.AAA_INSURANCE_RESPONSIBILITY_PROPERTIES_PRICE },
      'responsibilityProperty',
      setSelectFieldData
    );
  }, [props?.submissionId]);

  // get insurance package detail
  useEffect(() => {
    if ((params.id || props?.submissionId) && viewFormValues?.insurance) {
      fetchData(props.getPackageDetail, viewFormValues?.insurance?.insurancePackageId, 'insurancePackage', setViewFormValues);
      fetchData(props.getVehicleType, viewFormValues?.insurance?.insuranceFeeId, 'vehicleType', setViewFormValues);
    }
  }, [viewFormValues?.insurance]);

  const onFinish = () => {
    setIsSubmitting(true);

    let body = {
      name: formValues?.name,
      banner: formValues?.banner,
      packageType: formValues?.packageType,
      informationSubject: formValues?.informationSubject,
      details: formValues?.details,
      policies: formValues?.policies,
      informationFee: formValues?.informationFee,
      index: 0
    };

    setIsSubmitting(false);
    // props
    //   .createPackage(body)
    //   .then(() => {
    //     history.push(PATH.INSURANCE_PACKAGE_LIST_PATH);
    //     AMessage.success(t('create_insurance_package_success'));
    //     setIsSubmitting(false);
    //   })
    //   .catch(() => {
    //     AMessage.error(t('create_insurance_package_fail'));
    //     setIsSubmitting(false);
    //   });
  };

  return (
    <HOC>
      {props?.submissionId ? (
        <ASpinner spinning={loading}>
          <ProfileInfo
            type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
            formValues={viewFormValues}
            selectFieldData={selectFieldData}
            allowEdit={false}
            submissionId={props?.submissionId}
          />
        </ASpinner>
      ) : (
        <BCard>
          <CardHeader
            titleHeader={t('add_insurance_profile')}
            btn={
              <div>
                <BackBtn
                  onClick={() => {
                    history.push(PATH.INSURANCE_PROFILE_LIST_PATH);
                  }}
                />
              </div>
            }></CardHeader>
          <CardBody>
            <ASpinner spinning={loading}>
              {params.id ? (
                <ProfileInfo
                  type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
                  formValues={viewFormValues}
                  selectFieldData={selectFieldData}
                  allowEdit={false}
                  submissionId={props?.submissionId}
                />
              ) : (
                <StepProgressForm
                  onFinish={onFinish}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  isSubmitting={isSubmitting}
                  params={params}
                  selectFieldData={selectFieldData}
                />
              )}
            </ASpinner>
          </CardBody>
        </BCard>
      )}
    </HOC>
  );
};

export default connect(null, {
  getInsuranceProfileDetail: insuranceProfileActions.getInsuranceProfileDetail,
  getVehicleType: insuranceProfileActions.getVehicleType,
  getPackageDetail: packageActions.getPackageDetail,
  getGeneralType: appDataActions.getGeneralType
})(InfoForm);
