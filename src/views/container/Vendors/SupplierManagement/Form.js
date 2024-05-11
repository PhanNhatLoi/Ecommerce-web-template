import { UserAddOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';

import InfoForm from './Forms/InfoForm';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

const PricingSystemForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();

  const handleCancel = () => {
    form.resetFields();
    history.push(PATH.CAR_SERVICES_PRICING_SYSTEM_PATH);
  };

  return (
    <WrapStyleForm>
      <BCard>
        <CardHeader
          titleHeader={
            <div className="py-3">
              <div className="d-flex align-items-center mb-2">
                <span style={{ fontSize: '24px' }}>{t('pricing_system_new')}</span>
              </div>
              <span className="text-muted" style={{ fontSize: '14px' }}>
                {t('pricing_system_new_des')}
              </span>
            </div>
          }
          btn={[]}></CardHeader>
        <CardBody>
          <InfoForm
            isPage
            secondarySubmitText={t('create')}
            onCancel={handleCancel}
            submitIcon={<UserAddOutlined />}
            submitText={t('create_and_continue')}
          />
        </CardBody>
      </BCard>
    </WrapStyleForm>
  );
};

export default PricingSystemForm;
