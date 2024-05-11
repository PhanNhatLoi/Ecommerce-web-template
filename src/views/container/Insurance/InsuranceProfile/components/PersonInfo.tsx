import { Col, Form, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import Divider from '~/views/presentation/divider';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput, MInputPhone } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { NextBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

const MDatePickerStyled = styled(MDatePicker)`
  .ant-picker {
    width: 100%;
    margin-top: 6px;
  }
`;

const MInputNumberStyled = styled(MInput)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

type PersonInfoProps = {
  type: string;
  formValues: any;
  setFormValues: any;
  allowEdit: boolean;
  next?: () => void;
  currentStep: number;
};

const PersonInfo: React.FC<PersonInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    form.setFieldsValue({
      code: 241
    });
  }, [props.currentStep]);

  const onFinish = (values: any) => {
    const data = {
      buyer: {
        fullname: values?.buyerFullName,
        fullAddress: values?.buyerFullAddress,
        identificationNumber: values?.buyerIdentificationNumber,
        phone: values?.buyerPhone,
        dateOfBirth: values?.buyerDateOfBirth?.toJSON(),
        email: values?.buyerEmail
      },
      insured: {
        fullname: values?.insuredFullName,
        fullAddress: values?.insuredFullAddress,
        identificationNumber: values?.insuredIdentificationNumber,
        otherInfo: values?.insuredOtherInfo
      }
    };

    props.setFormValues((prevState) => ({ ...prevState, ...data }));
    props.next && props.next();
  };

  const CLLayout = () => (
    <>
      <Col sm={24} md={11} lg={11} className="w-100">
        <MInputNumberStyled
          name="buyerIdentificationNumber"
          label={t('identityCard')}
          hasFeedback
          require={false}
          placeholder={t('identityCard')}
          noLabel
          noPadding
          type="number"
          controls={false}
        />
      </Col>
      <Col sm={24} md={2} lg={2} />
      <Col sm={24} md={11} lg={11} className="w-100">
        <MInputPhone
          label={t('phone_number')}
          name="buyerPhone"
          hasFeedback
          require={true}
          placeholder={t('phone_number')}
          phoneTextTranslate="1px"
          noLabel
          noPadding
        />
      </Col>
    </>
  );

  const APDLayout = () => (
    <>
      <Col sm={24} md={11} lg={11} className="w-100">
        <MInputNumberStyled
          name="identityCard"
          label={t('identityCard')}
          hasFeedback
          required={true}
          placeholder={t('identityCard')}
          noLabel
          noPadding
          type="number"
        />
        <MInputPhone
          label={t('phone_number')}
          name="phone"
          hasFeedback
          required={true}
          placeholder={t('phone_number')}
          phoneTextTranslate="1px"
          noLabel
          noPadding
        />
      </Col>
      <Col sm={24} md={2} lg={2} />
      <Col sm={24} md={11} lg={11} className="my-auto d-flex justify-content-center align-items-center">
        <MUploadImageCrop //
          name="idCard"
          aspect={17 / 10}
          uploadText={t('uploadIdCard')}
          // file={avatarFile}
          // onImageChange={onAvatarChange}
          required={true}
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
        {props.type === INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE && (
          <>
            <LayoutForm title={t('Type')} description={t('')}>
              <MRadio
                name="type"
                label=""
                noLabel
                noPadding
                required={true}
                spaceSize="middle"
                defaultValue={1}
                options={[
                  { value: 1, label: t('personal') },
                  { value: 2, label: t('organization') }
                ]}
                className="mb-6"
              />
            </LayoutForm>
            <Divider />
          </>
        )}

        <LayoutForm title={t('applicant')} description={t('')}>
          <Row>
            <Col sm={24} md={24} lg={24} className="w-100">
              <MInput name="buyerFullName" label={t('fullName')} hasFeedback placeholder={t('fullName')} noLabel noPadding />
            </Col>

            <Col sm={24} md={24} lg={24} className="w-100">
              <MInput name="buyerFullAddress" label={t('address')} hasFeedback placeholder={t('address')} noLabel noPadding />
            </Col>

            {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT ? <CLLayout /> : <APDLayout />}

            <Col sm={24} md={11} lg={11}>
              <MDatePickerStyled
                label={t('dayOfBirth')}
                labelAlign="left"
                disabledDate={false}
                name="buyerDateOfBirth"
                placeholder={t('dayOfBirth')}
                noLabel
                noPadding
              />
            </Col>
            <Col sm={24} md={2} lg={2} />
            <Col sm={24} md={11} lg={11} className="w-100">
              <MInput
                name="buyerEmail"
                label={t('email_address')}
                hasFeedback
                require={false}
                placeholder={t('email_address')}
                noLabel
                noPadding
                type="email"
              />
            </Col>

            {props.type === INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE && (
              <Col sm={24} md={24} lg={24} className="w-100">
                <MInput name="representative" label={t('representative')} hasFeedback placeholder={t('representative')} noLabel noPadding />
              </Col>
            )}
          </Row>
        </LayoutForm>

        <Divider />

        <LayoutForm title={t('beneficiary')} description={t('')}>
          <Row>
            {props.type === INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT && (
              <Col sm={24} md={24} lg={24} className="w-100">
                <MCheckbox
                  name="isApplicant"
                  noLabel
                  noPadding
                  label={t('')}
                  placeholder={t('')}
                  require={false}
                  options={[{ label: t('isApplicant'), value: true }]}
                  onCheckboxChange={(checkedValue) => {
                    if (head(checkedValue)) {
                      form.setFieldsValue({
                        insuredFullName: form.getFieldValue('buyerFullName'),
                        insuredFullAddress: form.getFieldValue('buyerFullAddress'),
                        insuredIdentificationNumber: form.getFieldValue('buyerIdentificationNumber')
                      });
                    }
                  }}
                />
              </Col>
            )}

            <Col sm={24} md={24} lg={24} className="w-100">
              <MInput
                name="insuredFullName"
                label={t('carOwnerFullName')}
                hasFeedback
                placeholder={t('carOwnerFullName')}
                noLabel
                noPadding
              />
            </Col>

            <Col sm={24} md={24} lg={24} className="w-100">
              <MInput
                name="insuredFullAddress"
                label={t('addressCarOwner')}
                hasFeedback
                placeholder={t('addressCarOwner')}
                noLabel
                noPadding
              />
            </Col>

            <Col sm={24} md={11} lg={11} className="w-100">
              <MInputNumberStyled
                name="insuredIdentificationNumber"
                label={t('identityCardCarOwner')}
                hasFeedback
                placeholder={t('identityCardCarOwner')}
                noLabel
                noPadding
                require={false}
                type="number"
              />
            </Col>
            <Col sm={24} md={2} lg={2} />
            <Col sm={24} md={11} lg={11} className="w-100">
              <MInput name="insuredOtherInfo" label={t('taxId')} hasFeedback require={false} placeholder={t('taxId')} noLabel noPadding />
            </Col>

            {props.type === INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE && (
              <Col sm={24} md={24} lg={24} className="w-100">
                <MInputPhone
                  label={t('phone_number')}
                  name="phone"
                  hasFeedback
                  required={true}
                  placeholder={t('phone_number')}
                  phoneTextTranslate="1px"
                  noLabel
                  noPadding
                />
              </Col>
            )}
          </Row>
        </LayoutForm>

        {props.allowEdit && (
          <>
            <Divider />

            <div className="d-flex justify-content-center align-item-center">
              <NextBtn htmlType="submit" />
            </div>
          </>
        )}
      </div>
    </Form>
  );
};

export default connect(null, {})(PersonInfo);
