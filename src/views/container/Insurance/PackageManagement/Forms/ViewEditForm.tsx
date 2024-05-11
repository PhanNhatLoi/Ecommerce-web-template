import { Form, Tabs } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { useLocation } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { packageActions } from '~/state/ducks/insurance/package';
import HOC from '~/views/container/HOC';
import { BackBtn, EditBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step3 from '../components/Step3';

const { TabPane } = Tabs;

type ViewEditFormProps = {
  getPackageDetail: any;
  updatePackage: any;
  getRoleBase: any;
};

const ViewEditForm: React.FC<ViewEditFormProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<any>();
  const [formValues, setFormValues] = useState<any>();
  const [currentTab, setCurrentTab] = useState('0');
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase, params);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      props
        .getPackageDetail(params.id)
        .then((res: any) => {
          const response = res?.content;
          form.setFieldsValue({
            name: response?.name,
            packageType: response?.packageType,
            banner: response?.banner,
            informationSubject: response?.informationSubject,
            details: response?.details,
            policies: response?.policies,
            informationFee: response?.informationFee
          });
          setBannerFile(firstImage(response?.banner));
          setFormValues(response);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('🚀chiendev ~ file: InfoForm.tsx:34 ~ useEffect ~ err:', err);
          setLoading(false);
        });
    }
  }, []);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    setDirty(false);

    let body = {
      name: values?.name,
      banner: values?.banner,
      packageType: values?.packageType,
      informationSubject: values?.informationSubject,
      details: values?.details,
      policies: values?.policies,
      informationFee: values?.informationFee,
      index: 0
    };

    if (params.id) {
      props
        .updatePackage({ ...body, id: +params.id }, params.id)
        .then(() => {
          history.push(PATH.INSURANCE_PACKAGE_LIST_PATH);
          AMessage.success(t('update_insurance_package_success'));
          setIsSubmitting(false);
        })
        .catch(() => {
          AMessage.error(t('update_insurance_package_fail'));
          setIsSubmitting(false);
        });
    }
  };

  const onFinishFailed = async ({ values, errorFields }: any) => {
    const errorField: any = head(errorFields);

    if (head(errorField.name) === 'policies') setCurrentTab('1');
    else if (head(errorField.name) === 'informationFee') setCurrentTab('2');
    else setCurrentTab('0');
  };

  const onValuesChange = () => {
    allowEdit && setDirty(true);
  };

  const leaveConfirm = () => {
    if (!dirty) setDirty(false);
  };

  const steps = [
    {
      title: t('generalInfo'),
      content: (
        <Step1 viewEditForm={form} allowEdit={allowEdit} bannerFile={bannerFile} setBannerFile={setBannerFile} formValues={formValues} />
      )
    },
    {
      title: t('policy'),
      content: <Step2 viewEditForm={form} allowEdit={allowEdit} formValues={formValues} />
    },
    {
      title: t('insuranceFee'),
      content: <Step3 viewEditForm={form} allowEdit={allowEdit} formValues={formValues} />
    }
  ];

  return (
    <HOC>
      <BCard>
        <CardHeader
          titleHeader={t('insurancePackageDetail')}
          btn={
            <div>
              <BackBtn
                onClick={() => {
                  leaveConfirm();
                  history.push(PATH.INSURANCE_PACKAGE_LIST_PATH);
                }}
              />
              {fullAccessPage && (
                <>
                  {!allowEdit && (
                    <EditBtn
                      onClick={() => {
                        setAllowEdit(true);
                      }}
                    />
                  )}
                  {allowEdit && <SubmitBtn onClick={() => form.submit()} loading={isSubmitting} />}
                </>
              )}
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Prompt when={dirty} message={t('leave_confirm')} />
            <ASpinner spinning={loading}>
              <Tabs
                defaultActiveKey="0"
                type="card"
                activeKey={currentTab}
                onChange={(activeKey) => {
                  setCurrentTab(activeKey);
                }}>
                {steps.map((step, index) => (
                  <TabPane tab={t(step.title)} key={index}>
                    <div className="mt-10">{step.content}</div>
                  </TabPane>
                ))}
              </Tabs>
            </ASpinner>
          </Form>
        </CardBody>
      </BCard>
    </HOC>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getPackageDetail: packageActions.getPackageDetail,
    updatePackage: packageActions.updatePackage
  }
)(ViewEditForm);
