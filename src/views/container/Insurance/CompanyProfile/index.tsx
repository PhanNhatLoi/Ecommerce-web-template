import { Form, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { MCKEditor } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type CompanyInfoProps = {
  getUser: any;
  updateUser: any;
  getRoleBase: any;
};

const CompanyInfo: React.FC<CompanyInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const location: any = useLocation();
  const [loading, setLoading] = useState<any>();
  const [data, setData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyProfile, setCompanyProfile] = useState('');
  const [insuranceCompensation, setInsuranceCompensation] = useState('');
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  useEffect(() => {
    setLoading(true);
    props
      .getUser()
      .then((res) => {
        const response = res?.content;
        form.setFieldsValue({
          companyProfile: response?.otherData?.companyProfile,
          compensation: response?.otherData?.compensation
        });
        setData(response);
        setCompanyProfile(response?.otherData?.companyProfile);
        setInsuranceCompensation(response?.otherData?.compensation);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const onFinish = (values: any) => {
    setIsSubmitting(true);

    let body = {
      ...data,
      otherData: {
        companyProfile: values.companyProfile,
        compensation: values.compensation
      }
    };

    props
      .updateUser({ ...body, businessTypeIds: null })
      .then(() => {
        AMessage.success(t('update_company_profile_success'));
        setIsSubmitting(false);
      })
      .catch(() => {
        AMessage.error(t('update_company_profile_failed'));
        setIsSubmitting(false);
      });
  };

  const onCompanyProfileChange = (value) => {
    setCompanyProfile(value);
    form.setFieldsValue({
      companyProfile: value
    });
  };

  const onInsuranceCompensationChange = (value) => {
    setInsuranceCompensation(value);
    form.setFieldsValue({
      compensation: value
    });
  };

  return (
    <HOC>
      <WrapStyleForm>
        <BCard>
          <CardHeader
            titleHeader={
              <div className="d-flex flex-column mr-3 my-5 pb-5 pb-lg-1">
                <h2>{t('company_profile')}</h2>
                <div className="text-muted" style={{ fontSize: '14px', width: '100%' }}>
                  {t('companyDes')}
                </div>
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
              onFinish={onFinish}>
              <LayoutForm title={t('company_profile')}>
                <Skeleton active loading={loading}>
                  <MCKEditor
                    disabled={!fullAccessPage}
                    hasLayoutForm
                    noLabel
                    require={true}
                    name="companyProfile"
                    label=""
                    value={companyProfile}
                    setData={setCompanyProfile}
                    onChange={onCompanyProfileChange}
                  />
                </Skeleton>
              </LayoutForm>
              <Divider />
              <LayoutForm title={t('compensation')}>
                <Skeleton active loading={loading}>
                  <MCKEditor
                    disabled={!fullAccessPage}
                    hasLayoutForm
                    noLabel
                    require={true}
                    name="compensation"
                    label=""
                    value={insuranceCompensation}
                    setValue={setInsuranceCompensation}
                    onChange={onInsuranceCompensationChange}
                  />
                </Skeleton>
              </LayoutForm>
            </Form>

            <div className="d-flex flex-wrap justify-content-center align-item-center">
              <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />
            </div>
          </CardBody>
        </BCard>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getUser: authActions.getUser,
    updateUser: authActions.updateUser
  }
)(CompanyInfo);
