import { Col, Form, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import Divider from '~/views/presentation/divider';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import { NextBtn, PrevBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import { STEP_LENGTH_APD, STEP_LENGTH_CL } from '../Forms/StepProgressForm';
import { MCheckboxStyled } from './Styles';

type InsuranceScopeProps = {
  type: string;
  formValues: any;
  setFormValues: any;
  next?: () => void;
  prev?: () => void;
  currentStep?: number;
  allowEdit: boolean;
  selectFieldData: any;
};

const InsuranceScope: React.FC<InsuranceScopeProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const joinInsuranceWatch = Form.useWatch('joinInsurance', form) || 1;

  useEffect(() => {
    form.setFieldValue('joinInsurance', 1);
  }, []);

  const onFinish = (values: any) => {
    const data = {
      //   insurance: {
      //     effectDateFrom: values?.effectDateFrom?.toJSON(),
      //     effectDateTo: effectDateTo ? effectDateTo?.toJSON() : undefined,
      //     effectYear: values?.effectYear
      //   }
    };

    props.setFormValues((prevState) => ({ ...prevState, ...data }));
    props.next && props.next();
  };

  const BillItem = ({ label, value }) => {
    return (
      <div className="row mb-5">
        <div className="col-6">
          <ATypography>{label}</ATypography>
        </div>
        <div className="col-1"></div>
        <div className="col-5 text-right">
          <ATypography strong>{value}</ATypography>
        </div>
      </div>
    );
  };

  const billList = [
    {
      label: t('aboutPersons'),
      value: numberFormatDecimal(+head(props.selectFieldData?.responsibilityPerson)?.name || 0, ' đ', '')
    },
    {
      label: t('aboutCustomers'),
      value: numberFormatDecimal(+head(props.selectFieldData?.responsibilityPerson)?.name || 0, ' đ', '')
    },
    {
      label: t('aboutAssets'),
      value: numberFormatDecimal(+head(props.selectFieldData?.responsibilityProperty)?.name || 0, ' đ', ''),
      strong: true
    }
  ];

  const handleVoluntaryFee = (unit, unit1, effectYear) => {
    return numberFormatDecimal((+head(props.selectFieldData?.voluntaryRate)?.name || 0) * unit * unit1 * effectYear || 0, ' đ', '');
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
      {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? (
        <div>
          <LayoutForm title={t('responsibilityLevel')} description={t('')}>
            {billList.map((bill) => (
              <BillItem label={bill.label} value={bill.value} />
            ))}
          </LayoutForm>

          <LayoutForm title={t('insuranceSecondDriver')} description={t('')}>
            <Row>
              <Col sm={24} md={24} lg={24} className="w-100">
                <MRadio
                  name="joinInsurance"
                  label=""
                  noLabel
                  noPadding
                  required={true}
                  spaceSize="middle"
                  defaultValue={1}
                  options={[
                    { value: 1, label: t('join') },
                    { value: 2, label: t('notJoin') }
                  ]}
                  className="mb-6"
                />
              </Col>

              {joinInsuranceWatch === 1 && (
                <>
                  <Col sm={24} md={24} lg={24} className="w-100">
                    <MSelect
                      label={t('responsibilityLevel')}
                      name="unitId"
                      noLabel
                      noPadding
                      require
                      size="medium"
                      placeholder={t('responsibilityLevel')}
                      tooltip={{ title: '', icon: <span></span> }}
                      options={props.selectFieldData?.voluntaryPrice?.map((value) => ({
                        label: numberFormatDecimal(+value.name || 0, ' đ', ''),
                        value: +value.name
                      }))}
                      onChange={(value) => {
                        const unitId1 = form.getFieldValue('unitId1');
                        unitId1 &&
                          form.setFieldValue(
                            'voluntaryInsuranceFee',
                            handleVoluntaryFee(value, unitId1, props.formValues?.insurance?.effectYear)
                          );
                      }}
                    />
                  </Col>

                  <Col sm={24} md={24} lg={24} className="w-100">
                    <MSelect
                      label={t('participantQuantity')}
                      name="unitId1"
                      noLabel
                      noPadding
                      size="medium"
                      require
                      placeholder={t('participantQuantity')}
                      tooltip={{ title: '', icon: <span></span> }}
                      options={props.selectFieldData?.effectYear.map((value) => ({
                        label: value.name,
                        value: +value.name
                      }))}
                      onChange={(value) => {
                        const unitId = form.getFieldValue('unitId');
                        unitId &&
                          form.setFieldValue(
                            'voluntaryInsuranceFee',
                            handleVoluntaryFee(unitId, value, props.formValues?.insurance?.effectYear)
                          );
                      }}
                    />
                  </Col>

                  <Col sm={24} md={24} lg={24} className="w-100">
                    <MInput
                      name="voluntaryInsuranceFee"
                      label={t('voluntaryInsuranceFee')}
                      hasFeedback
                      placeholder={t('voluntaryInsuranceFee')}
                      noLabel
                      noPadding
                      require
                      readOnly={true}
                    />
                  </Col>
                </>
              )}
            </Row>
          </LayoutForm>
        </div>
      ) : (
        <div>
          <LayoutForm title={t('vehicleValue')} description={t('')}>
            <Row>
              <Col sm={24} md={11} lg={11}>
                <MInputNumber
                  name="vehicleCost"
                  min={1}
                  label=""
                  placeholder={t('vehicleCost')}
                  noPadding
                  noLabel
                  hasFeedback={false}
                  formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                />
              </Col>
              <Col sm={24} md={2} lg={2} />
              <Col sm={24} md={11} lg={11} className="w-100">
                <MInputNumber
                  name="insuranceCost"
                  min={1}
                  label=""
                  placeholder={t('insuranceCost')}
                  noPadding
                  noLabel
                  hasFeedback={false}
                  formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                />
              </Col>

              <Col sm={24} md={24} lg={24} className="mt-6">
                <Form.Item name="check">
                  <MCheckboxStyled
                    // name="isApplicant"
                    // noLabel
                    // noPadding
                    // label={t('')}
                    // placeholder={t('')}
                    // require={false}
                    options={[
                      { label: t('002. Điều khoản mở rộng mất cặp bộ phận'), value: 1 },
                      { label: t('004. BH thay thế mới bộ phận'), value: 2 },
                      { label: t('005. BH lựa chọn cơ sở sửa chữa'), value: 3 },
                      { label: t('006. BH thủy kích'), value: 4 }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </LayoutForm>
        </div>
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
    </Form>
  );
};

export default connect(null, {})(InsuranceScope);
