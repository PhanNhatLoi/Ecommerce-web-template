import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { PROMOTION_SERVICE_TYPE } from '~/configs/status/car-services/promotionServiceStatus';
import { carTradingActions } from '~/state/ducks/usedCarTrading/carTrading';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { BackBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card, CardBody, CardFooter, CardHeader } from '~/views/presentation/ui/card/Card';

import CarPurchasedTable from '../components/CarPurchasedTable';
import CustomerInfo from '../components/CustomerInfo';
import { customerActions } from '~/state/ducks/customer';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type InfoFormType = {
  getCustomerDetail: any;
  editCustomer: any;
  createCustomer: any;
};

const InfoFormProps: React.FC<InfoFormType> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams<any>();
  const history = useHistory();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idUser, setIdUser] = useState<number>();

  // get promotion detail
  useEffect(() => {
    if (params.id) {
      setLoading(true);
      props
        .getCustomerDetail(params.id)
        .then((res: any) => {
          const respones = res.content;
          setIdUser(respones.id);
          form.setFieldsValue({
            fullname: respones.fullName,
            phone: respones.phone,
            code: respones.country?.phone
          });

          setDirty(false);
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
          console.error(`file: FormInfo.js ~ line 129 ~ useEffect ~ err`, err);
        });
    } else form.setFieldsValue({ promotionType: PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT });
    // eslint-disable-next-line
  }, []);

  const onFinish = (values: any) => {
    setIsSubmitting(false);
    const body = {
      phone: values.phone,
      fullname: values.fullname,
      businessType: CUSTOMER_BUSINESS_TYPE.USED_CAR_DEALERSHIP,
      countryId: values.code === '84' ? 241 : undefined
    };

    if (params.id) {
      props
        .editCustomer({ id: idUser, ...body })
        .then(() => {
          setDirty(false);
          history.push(PATH.USED_CAR_TRADING_CUSTOMER_LIST_PATH);
          AMessage.success(t('updateCustomerSuccess'));
          setIsSubmitting(false);
        })
        .catch(() => {
          AMessage.error(t('updateCustomerFailed'));
          setIsSubmitting(false);
        });
    } else {
      props
        .createCustomer(body)
        .then(() => {
          setDirty(false);
          history.push(PATH.USED_CAR_TRADING_CUSTOMER_LIST_PATH);
          AMessage.success(t('customerCreateSuccess'));
          setIsSubmitting(false);
        })
        .catch(() => {
          AMessage.error(t('customerCreateFailed'));
          setIsSubmitting(false);
        });
    }
  };

  const handleOnValuesChange = () => {
    setDirty(true);
  };

  return (
    <HOC>
      <WrapStyleForm>
        <Card>
          <CardHeader
            titleHeader={params.id ? t('updatePostCarForSale') : t('createPostCarForSale')}
            btn={
              <div>
                <BackBtn onClick={() => history.push(PATH.USED_CAR_TRADING_CUSTOMER_LIST_PATH)} />
                {<SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />}
              </div>
            }></CardHeader>
          <CardBody style={{ minHeight: '500px' }}>
            <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onValuesChange={handleOnValuesChange} onFinish={onFinish}>
              <Prompt when={dirty} message={t('leave_confirm')} />

              <CustomerInfo form={form} allowEdit={true} loading={false} content={''} />

              {params.id && (
                <>
                  <Divider />

                  <CarPurchasedTable customerId={params.id} />
                </>
              )}
            </Form>
          </CardBody>
          <CardFooter className="p-4">
            <div className="d-flex flex-wrap justify-content-center align-item-center">
              <BackBtn onClick={() => history.push(PATH.USED_CAR_TRADING_CUSTOMER_LIST_PATH)} />
              {<SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />}
            </div>
          </CardFooter>
        </Card>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(null, {
  getCustomerDetail: customerActions.getCustomerDetail,
  editCustomer: customerActions.editCustomer,
  createCustomer: customerActions.createCustomer
})(InfoFormProps);
