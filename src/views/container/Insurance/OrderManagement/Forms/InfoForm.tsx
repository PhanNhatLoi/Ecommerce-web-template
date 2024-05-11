import { Form } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { orderActions } from '~/state/ducks/insurance/order';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { BackBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';

import OrderInfo from './OrderInfo';
import OrderPayment from './OrderPayment';
import PackageTable from './PackageTable';

type InfoFormProps = {
  getInsuranceOrderDetail: any;
  createInsuranceOrder: any;
  updateInsuranceOrder: any;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<any>();

  const fetch = ({ id, action, setData }) => {
    setLoading(true);
    action(id)
      .then((res) => {
        setData((data) => ({ ...data, ...res?.content }));
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: ViewForm.js ~ line 49 ~ useEffect ~ err', err);

        setLoading(false);
      });
  };

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      props
        .getInsuranceOrderDetail(params.id)
        .then((res) => {
          const response = res?.content;
          setFormValues(res?.content);
          form.setFieldsValue({
            paymentDate: response?.audit?.paymentDate ? moment(response?.audit?.paymentDate) : undefined,
            referenceId: response?.referenceId,
            status: response?.status
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  const onFinish = (values) => {};

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  return (
    <HOC>
      <BCard>
        <CardHeader
          titleHeader={params.profileId ? t('customer_edit') : t('add_customer')}
          btn={
            <div>
              <BackBtn
                onClick={() => {
                  history.push(PATH.INSURANCE_ORDER_LIST_PATH);
                }}
              />
              {/* <SubmitBtn
              //   loading={isSubmitting} onClick={() => form.submit()}
              /> */}
            </div>
          }></CardHeader>
        <CardBody>
          <Form //
            requiredMark={false}
            {...ANT_FORM_SEP_LABEL_LAYOUT}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
              scrollMode: 'always'
            }}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <ASpinner spinning={loading}>
              <OrderInfo formValues={formValues} />

              <Divider />

              <PackageTable formValues={formValues} />

              <OrderPayment formValues={formValues} />

              <Divider />

              <Form.Item>
                <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
                  <BackBtn
                    onClick={() => {
                      history.push(PATH.INSURANCE_ORDER_LIST_PATH);
                    }}
                  />
                  {/* <SubmitBtn
                  //   loading={isSubmitting} onClick={() => form.submit()}
                  /> */}
                </div>
              </Form.Item>
            </ASpinner>
          </Form>
        </CardBody>
      </BCard>
    </HOC>
  );
};

export default connect(null, {
  getInsuranceOrderDetail: orderActions.getInsuranceOrderDetail,
  createInsuranceOrder: orderActions.createInsuranceOrder,
  updateInsuranceOrder: orderActions.updateInsuranceOrder
})(InfoForm);
