import { Col, Form, Row } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import { NextBtn, PrevBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

import { STEP_LENGTH_APD, STEP_LENGTH_CL } from '../Forms/StepProgressForm';

type InsurancePeriodProps = {
  type: string;
  formValues: any;
  setFormValues: any;
  next?: () => void;
  prev?: () => void;
  currentStep?: number;
  allowEdit: boolean;
  selectFieldData: any;
};

const InsurancePeriod: React.FC<InsurancePeriodProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [effectDateTo, setEffectDateTo] = useState<any>();

  const onFinish = (values: any) => {
    const data = {
      insurance: {
        effectDateFrom: values?.effectDateFrom?.toJSON(),
        effectDateTo: effectDateTo ? effectDateTo?.toJSON() : undefined,
        effectYear: values?.effectYear
      }
    };

    props.setFormValues((prevState) => ({ ...prevState, ...data }));
    props.next && props.next();
  };

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
        <LayoutForm title={t('insurancePeriod')} description={t('')}>
          <Row>
            <Col sm={24} md={11} lg={11}>
              <MDatePicker
                label={t('fromDate')}
                labelAlign="left"
                name="effectDateFrom"
                placeholder={t('fromDate')}
                noLabel
                noPadding
                showNow={false}
                showTime={{ format: 'HH:mm' }}
                format="HH:mm, DD-MM-YYYY"
                disabledDate={(current: any) => {
                  return current && current < moment().endOf('day');
                }}
                onChange={(value) => {
                  const effectYear = form.getFieldValue('effectYear');
                  const toDateValue = moment(value).add(effectYear, 'year');
                  setEffectDateTo(toDateValue);
                  form.setFieldValue('toDate', toDateValue.format('HH:mm, DD-MM-YYYY'));
                }}
              />
            </Col>
            <Col sm={24} md={2} lg={2} />
            <Col sm={24} md={11} lg={11} className="w-100">
              <MInput label={t('toDate')} labelAlign="left" name="toDate" placeholder={t('toDate')} noLabel noPadding readOnly={true} />
            </Col>

            <Col sm={24} md={24} lg={24}>
              <MSelect
                label={t('insuranceYear')}
                name="effectYear"
                noLabel
                noPadding
                require
                size="medium"
                placeholder={t('insuranceYear')}
                tooltip={{ title: '', icon: <span></span> }}
                options={props.selectFieldData?.effectYear?.map((value) => ({ label: value.name, value: value.name }))}
              />
            </Col>
          </Row>
        </LayoutForm>

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

export default InsurancePeriod;
