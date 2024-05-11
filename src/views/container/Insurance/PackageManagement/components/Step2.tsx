import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '~/views/presentation/divider';
import { MCKEditor } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { NextBtn, PrevBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

import { STEP_LENGTH } from './StepProgressForm';

type InsurancePackageStep2Props = {
  viewEditForm?: any;
  progress?: number[];
  setProgress?: React.Dispatch<React.SetStateAction<number[]>>;
  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  formValues: any;
  setFormValues?: React.Dispatch<React.SetStateAction<{}>>;
  prev?: () => void;
  allowEdit: boolean;
};

const InsurancePackageStep2: React.FC<InsurancePackageStep2Props> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [policies, setPolicies] = useState('');

  useEffect(() => {
    form.setFieldValue('policies', props.formValues?.policies);
    setPolicies(props.formValues?.policies);
  }, [props.formValues]);

  const onFinish = () => {
    if (props.setProgress && props.progress !== undefined && props.setCurrentStep && props.currentStep !== undefined) {
      props.setProgress([...props.progress, props.progress.length]);
      props.setCurrentStep(props.currentStep + 1);
    }
  };

  const onPoliciesChange = (value: string) => {
    props.setFormValues && props.setFormValues((prevState) => ({ ...prevState, policies: value }));
    props.viewEditForm && props.viewEditForm?.setFieldValue('policies', value);
  };

  return (
    <>
      {props.viewEditForm ? (
        <LayoutForm title={t('policy')} description="">
          <MCKEditor
            hasLayoutForm
            noLabel
            noPadding
            require={true}
            disabled={!props.allowEdit}
            name="policies"
            label=""
            value={policies}
            onChange={onPoliciesChange}
          />
        </LayoutForm>
      ) : (
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
          <>
            <LayoutForm title={t('policy')} description="">
              <MCKEditor
                hasLayoutForm
                noLabel
                noPadding
                require={true}
                disabled={!props.allowEdit}
                name="policies"
                label=""
                value={policies}
                onChange={onPoliciesChange}
              />
            </LayoutForm>

            {props.allowEdit && (
              <>
                <Divider />

                <div className="d-flex justify-content-center align-item-center">
                  {props.currentStep && props.currentStep > 0 && <PrevBtn onClick={() => props.prev && props.prev()} />}
                  {props.currentStep && props.currentStep < STEP_LENGTH - 1 && <NextBtn htmlType="submit" />}
                </div>
              </>
            )}
          </>
        </Form>
      )}
    </>
  );
};

export default InsurancePackageStep2;
