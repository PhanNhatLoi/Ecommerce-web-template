import { CloseOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GENDER } from '~/configs';
import { ContactType } from '~/state/ducks/customer/actions';
import { KTUtil } from '~/static/js/components/util';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_PAGE_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { typeValidate } from '~/views/utilities/ant-validation';

import { AddressNeedLoadType } from '../components/Types';

type ContactFormProps = {
  contactList: ContactType[];
  setContactList: React.Dispatch<React.SetStateAction<ContactType[]>>;
  contactIndex: number | undefined;
  onCancel: () => void;
  submitIcon?: React.ReactElement;
  submitText?: string;
  cancelText?: string;
};

const ContactForm: React.FC<ContactFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState<AddressNeedLoadType>();
  const countryWatch = Form.useWatch('country1', form);

  useEffect(() => {
    // set default phone code for VN +84
    form.setFieldsValue({ code: 241 });
  }, []);

  useEffect(() => {
    if (props.contactList && props.contactIndex !== undefined) {
      const contact = props.contactList[props.contactIndex];
      form.setFieldsValue({
        fullName: contact?.fullName,
        technician: contact?.technician,
        gender: contact?.gender,
        birthday: contact?.birthday ? moment(contact?.birthday) : null,
        phone: contact?.phone,
        email: contact?.email,
        code: contact?.code,
        // address
        country1: contact?.address?.countryId,
        address1: contact?.address?.address,
        state: contact?.address?.stateId,
        zipCode: contact?.address?.zipCode,
        province: contact?.address?.provinceId,
        district: contact?.address?.districtId,
        ward: contact?.address?.wardsId
      });
      setAddressNeedLoad({
        country: contact?.address?.countryId,
        state: contact?.address?.stateId,
        province: contact?.address?.provinceId,
        district: contact?.address?.districtId,
        ward: contact?.address?.wardsId
      });
    }
  }, [props.contactIndex]);

  const onFinish = (values: any) => {
    setSubmitting(true);

    const finalPhone = values.phone.startsWith('0') ? values.phone.slice(1) : values.phone;
    const finalAddress = values.addressInfo.filter(Boolean).join(', ');

    if (props.contactList && props.contactIndex !== undefined) {
      props.setContactList(
        props.contactList.map((contact: ContactType, index: number) => {
          if (index === props.contactIndex) {
            return {
              ...contact,
              fullName: values.fullName,
              technician: values.technician,
              gender: values.gender,
              birthday: values.birthday,
              phone: finalPhone,
              email: values.email,
              code: values.code,
              address: {
                address: values.address1,
                districtId: values.district,
                provinceId: values.province,
                wardsId: values.ward,
                stateId: values.state,
                countryId: values.country1, // this is the actual country address
                zipCode: values.zipCode
              },
              fullAddress: finalAddress
            };
          } else return contact;
        })
      );
    } else {
      props.setContactList((contact: ContactType[]) =>
        contact
          ? [
              {
                fullName: values.fullName,
                technician: values.technician,
                gender: values.gender,
                birthday: values.birthday,
                phone: finalPhone,
                email: values.email,
                code: values.code,
                address: {
                  address: values.address1,
                  districtId: values.district,
                  provinceId: values.province,
                  wardsId: values.ward,
                  stateId: values.state,
                  countryId: values.country1, // this is the actual country address
                  zipCode: values.zipCode
                },
                fullAddress: finalAddress
              },
              ...contact
            ]
          : [
              {
                fullName: values.fullName,
                technician: values.technician,
                gender: values.gender,
                birthday: values.birthday,
                phone: finalPhone,
                email: values.email,
                code: values.code,
                address: {
                  address: values.address1,
                  districtId: values.district,
                  provinceId: values.province,
                  wardsId: values.ward,
                  stateId: values.state,
                  countryId: values.country1, // this is the actual country address
                  zipCode: values.zipCode
                },
                fullAddress: finalAddress
              }
            ]
      );
    }
    setSubmitting(false);
    props.onCancel();
  };

  return (
    <Form //
      {...ANT_FORM_PAGE_LAYOUT}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      requiredMark={false}
      form={form}
      name="create"
      onFinish={onFinish}>
      <MInput //
        label={t('contact_name')}
        labelAlign="left"
        name="fullName"
        noLabel
        require
        hasFeedback
        placeholder={t('contact_name')}
      />
      <MInput //
        label={t('position')}
        labelAlign="left"
        name="technician"
        noLabel
        require={false}
        hasFeedback
        placeholder={t('position')}
      />
      <MSelect //
        label={t('gender')}
        labelAlign="left"
        name="gender"
        noLabel
        hasFeedback
        open={false}
        options={Object.keys(GENDER).map((gender) => {
          return {
            value: GENDER[gender],
            label: t(GENDER[gender])
          };
        })}
        placeholder={t('gender')}
      />
      <MDatePicker //
        label={t('birthday')}
        labelAlign="left"
        disabledDate={false}
        name="birthday"
        require={false}
        noLabel
        placeholder={t('birthday')}
      />
      <MInputPhone //
        label={t('phone_number')}
        labelAlign="left"
        name="phone"
        noLabel
        require
        hasFeedback
        placeholder={t('phone_number')}
        phoneTextTranslate={KTUtil.isMobileDevice() ? '1px' : countryWatch ? '1px' : '2px'}
      />
      <Form.Item //
        hasFeedback
        label={t('Email')}
        labelAlign="left"
        className="px-4"
        name="email"
        validateFirst
        rules={typeValidate('email')}>
        <Input allowClear className="w-100" size="large" placeholder={t('Email')} />
      </Form.Item>
      <MInputAddress //
        form={form}
        label={t('address')}
        labelAlign="left"
        noLabel
        name="addressInfo"
        hasRegisterLayout
        codeInputStyle={{ paddingTop: '1px' }}
        needLoadData={addressNeedLoad}
        setNeedLoadData={setAddressNeedLoad}
      />

      <Divider />

      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <AButton
            style={{ verticalAlign: 'middle', width: '150px' }}
            className="px-5"
            size="large"
            htmlType="submit"
            loading={submitting}
            type="primary"
            icon={props.submitIcon}>
            {props.submitText}
          </AButton>
          <AButton
            style={{ verticalAlign: 'middle', width: '150px' }}
            className="mt-3 mt-lg-0 ml-lg-3 px-5"
            size="large"
            type="ghost"
            onClick={() => {
              form.resetFields();
              props.onCancel();
            }}
            icon={<CloseOutlined />}>
            {t('close')}
          </AButton>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ContactForm;
