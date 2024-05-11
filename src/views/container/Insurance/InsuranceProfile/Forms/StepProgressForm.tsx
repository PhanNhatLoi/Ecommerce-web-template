import { Steps, Tabs } from 'antd/es';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import { packageActions } from '~/state/ducks/insurance/package';

import CarImage from '../components/CarImage';
import CarInfo from '../components/CarInfo';
import InsuranceOrder from '../components/InsuranceOrder';
import InsurancePeriod from '../components/InsurancePeriod';
import InsuranceScope from '../components/InsuranceScope';
import PersonInfo from '../components/PersonInfo';
import ProfileInfo from '../components/ProfileInfo';

const { TabPane } = Tabs;
export const STEP_LENGTH_CL = 5;
export const STEP_LENGTH_APD = 6;

type InfoFormProps = {
  onFinish: () => void;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<{}>>;
  isSubmitting: boolean;
  params: any;
  selectFieldData: any;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const tabsContainerRef: any = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<any>([0]);

  const next = () => {
    setCurrentStep(currentStep + 1);
    setProgress([...progress, progress.length]);
  };

  const prev = () => {
    const newProgress = [...progress];
    newProgress.pop();
    setProgress(newProgress);
    setCurrentStep(currentStep - 1);
  };

  const stepsCL = [
    {
      content: (
        <PersonInfo
          type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          allowEdit={true}
          next={next}
          currentStep={currentStep}
        />
      )
    },
    {
      content: (
        <CarInfo
          type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
        />
      )
    },
    {
      content: (
        <InsurancePeriod
          type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
          selectFieldData={props.selectFieldData}
        />
      )
    },
    {
      content: (
        <InsuranceScope
          type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
          selectFieldData={props.selectFieldData}
        />
      )
    },
    {
      content: (
        <ProfileInfo
          type={INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT}
          formValues={props.formValues}
          selectFieldData={props.selectFieldData}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
        />
      )
    }
  ];

  const stepsAPD = [
    {
      content: (
        <PersonInfo
          type={INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          allowEdit={true}
          currentStep={currentStep}
        />
      )
    },
    {
      content: (
        <CarInfo
          type={INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
        />
      )
    },
    {
      content: (
        <InsuranceScope
          type={INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
          selectFieldData={props.selectFieldData}
        />
      )
    },
    {
      content: (
        <InsurancePeriod
          type={INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
          selectFieldData={props.selectFieldData}
        />
      )
    },
    {
      content: <CarImage type={INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE} />
    },
    {
      content: <InsuranceOrder />
    },
    {
      content: (
        <ProfileInfo
          type={INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE}
          formValues={props.formValues}
          selectFieldData={props.selectFieldData}
          next={next}
          prev={prev}
          currentStep={currentStep}
          allowEdit={true}
        />
      )
    }
  ];

  const items = (props.params.insuranceType === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? stepsCL : stepsAPD).map((item, index) => ({
    title: '',
    icon: (
      <span
        style={{
          width: '32px',
          height: '32px',
          fontSize: '18px',
          borderRadius: '50%',
          color: progress.includes(index) ? '#fff' : 'rgba(0, 0, 0, 0.88)',
          backgroundColor: progress.includes(index) ? '#1677ff' : 'rgba(0, 0, 0, 0.06)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        {index + 1}
      </span>
    )
  }));

  return (
    <>
      <Steps current={currentStep}>
        {items.map((item, index) => (
          <Steps.Step key={index} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      <div ref={tabsContainerRef}>
        <Tabs defaultActiveKey="0" activeKey={currentStep.toString()}>
          {(props.params.insuranceType === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? stepsCL : stepsAPD).map((step, index) => (
            <TabPane key={index}>{step.content}</TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default connect(null, {
  getPackageDetail: packageActions.getPackageDetail,
  createPackage: packageActions.createPackage,
  updatePackage: packageActions.updatePackage
})(InfoForm);
