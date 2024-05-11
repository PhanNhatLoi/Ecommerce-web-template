import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '~/views/presentation/divider';
import { MCKEditor } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { PrevBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

type InsurancePackageStep3Props = {
  viewEditForm?: any;
  formValues: any;
  setFormValues?: React.Dispatch<React.SetStateAction<{}>>;
  currentStep?: number;
  prev?: () => void;
  onFinish?: () => void;
  isSubmitting?: boolean;
  allowEdit: boolean;
};

const InsurancePackageStep3: React.FC<InsurancePackageStep3Props> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [informationFee, setInformationFee] = useState('');

  useEffect(() => {
    form.setFieldValue('informationFee', props.formValues?.informationFee);
    setInformationFee(props.formValues?.informationFee);
  }, [props.formValues]);

  const onFinish = () => {
    props.onFinish && props.onFinish();
  };

  const onInformationFeeChange = (value: string) => {
    props.setFormValues && props.setFormValues((prevState) => ({ ...prevState, informationFee: value }));
    props.viewEditForm && props.viewEditForm?.setFieldValue('informationFee', value);
  };

  return (
    <>
      {props.viewEditForm ? (
        <LayoutForm title={t('insuranceFee')} description="">
          <MCKEditor
            name="informationFee"
            hasLayoutForm
            noLabel
            noPadding
            require={true}
            disabled={!props.allowEdit}
            label=""
            value={informationFee}
            onChange={onInformationFeeChange}
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
          <LayoutForm title={t('insuranceFee')} description="">
            <MCKEditor
              name="informationFee"
              hasLayoutForm
              noLabel
              noPadding
              require={true}
              disabled={!props.allowEdit}
              label=""
              value={informationFee}
              onChange={onInformationFeeChange}
            />
          </LayoutForm>

          {props.allowEdit && (
            <>
              <Divider />

              <div className="d-flex justify-content-center align-item-center">
                {props.currentStep && props.currentStep > 0 && <PrevBtn onClick={() => props.prev && props.prev()} />}
                <SubmitBtn loading={props.isSubmitting} />
              </div>
            </>
          )}
        </Form>
      )}
    </>
  );
};

export default InsurancePackageStep3;
