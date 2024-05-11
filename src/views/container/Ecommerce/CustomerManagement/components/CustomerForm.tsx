import { Form, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { useBeforeUnload } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { customerActions } from '~/state/ducks/customer';
import { ContactType } from '~/state/ducks/customer/actions';
import HOC from '~/views/container/HOC';
import { BackBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

import InfoForm from '../Forms/InfoForm';
import ContactList from './ContactList';
import { WrapStyleForm } from './Styles';

const { TabPane } = Tabs;

type CustomerFormProps = {
  editCustomer: any;
  createCustomer: any;
};

const CustomerForm: React.FC<CustomerFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const [dirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressId, setAddressId] = useState<number | undefined>();
  const [contactList, setContactList] = useState<ContactType[]>([]);

  // Before unload
  useBeforeUnload(dirty, t('leave_confirm'));
  const onValuesChange = () => {
    setDirty(true);
  };

  const leaveConfirm = () => {
    if (!dirty) setDirty(false);
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    setDirty(false);

    const finalPhone = values.phone.startsWith('0') ? values.phone.slice(1) : values.phone;
    const addressSplit = values?.address1?.split(' ');
    const addressInfo = {
      address: addressSplit[0], // house number
      districtId: values.district,
      provinceId: values.province,
      wardsId: values.ward,
      stateId: values.state,
      countryId: values.country1,
      zipCode: values.zipCode,
      fullAddress: addressSplit.slice(1).join(' ') // street name
    };

    let body = {
      fullname: values.fullName,
      logo: values.avatar,
      avatar: values.avatar,
      phone: finalPhone,
      email: values.email,
      countryId: values.code, // the country code for phone number
      address: addressInfo,
      otherData: {
        debtMaximum: values.debtMaximum,
        currency: values.currency,
        timeDate: values.timeNumber,
        time: values.time,
        digitalContract: values.digitalContract,
        contractFiles: values.contractFiles,
        otherImages: values.otherImages,
        otherDocuments: values.otherDocuments
      },
      contact: contactList
    };

    if (params.profileId) {
      await props
        .editCustomer({ ...body, id: Number.parseInt(params.profileId), address: { ...addressInfo, id: addressId } })
        .then(() => {
          setIsSubmitting(false);
          history.push(PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH);
          AMessage.success(t('update_customer_success'));
        })
        .catch(() => {
          AMessage.error(t('update_customer_fail'));
          setIsSubmitting(false);
        });
    } else {
      await props
        .createCustomer(body)
        .then(() => {
          setIsSubmitting(false);
          history.push(PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH);
          AMessage.success(t('create_customer_success'));
        })
        .catch(() => {
          AMessage.error(t('create_customer_fail'));
          setIsSubmitting(false);
        });
    }

    setIsSubmitting(false);
  };

  return (
    <HOC>
      <WrapStyleForm>
        <BCard>
          <CardHeader
            titleHeader={params.profileId ? t('customer_edit') : t('add_customer')}
            btn={
              <div>
                <BackBtn
                  onClick={() => {
                    leaveConfirm();
                    history.push(PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH);
                  }}
                />
                <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />
              </div>
            }></CardHeader>
          <CardBody>
            <Form //
              {...ANT_FORM_SEP_LABEL_LAYOUT}
              scrollToFirstError={{
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
                scrollMode: 'always'
              }}
              form={form}
              name={'create'}
              onValuesChange={onValuesChange}
              onFinish={onFinish}>
              <Prompt when={dirty} message={t('leave_confirm')} />
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={t('customer_info')} key="1">
                  <InfoForm
                    form={form}
                    isSubmitting={isSubmitting}
                    setDirty={setDirty}
                    setAddressId={setAddressId}
                    setContactList={setContactList}
                  />
                </TabPane>
                <TabPane tab={t('customer_contact')} key="2">
                  <ContactList
                    form={form}
                    contactList={contactList}
                    setContactList={setContactList}
                    isSubmitting={isSubmitting}
                    setDirty={setDirty}
                  />
                </TabPane>
              </Tabs>
            </Form>
          </CardBody>
        </BCard>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(null, {
  createCustomer: customerActions.createCustomer,
  editCustomer: customerActions.editCustomer
})(CustomerForm);
