import { Steps, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const { TabPane } = Tabs;
export const STEP_LENGTH = 3;

type InfoFormProps = {
  onFinish: () => void;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<{}>>;
  isSubmitting: boolean;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<number[]>([0]);

  const prev = () => {
    const newProgress = [...progress];
    newProgress.pop();
    setProgress(newProgress);
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: t('generalInfo'),
      content: (
        <Step1
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          progress={progress}
          setProgress={setProgress}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          allowEdit={true}
        />
      )
    },
    {
      title: t('policy'),
      content: (
        <Step2
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          progress={progress}
          setProgress={setProgress}
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          prev={prev}
          allowEdit={true}
        />
      )
    },
    {
      title: t('insuranceFee'),
      content: (
        <Step3
          formValues={props.formValues}
          setFormValues={props.setFormValues}
          currentStep={currentStep}
          prev={prev}
          onFinish={props.onFinish}
          isSubmitting={props.isSubmitting}
          allowEdit={true}
        />
      )
    }
  ];

  const items = steps.map((item, index) => ({
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

      <Tabs defaultActiveKey="0" activeKey={currentStep.toString()}>
        {steps.map((step, index) => (
          <TabPane key={index}>{step.content}</TabPane>
        ))}
      </Tabs>
    </>
  );
};

export default InfoForm;
