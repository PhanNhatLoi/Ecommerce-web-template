import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import styled from 'styled-components';
import InfoForm from './Forms/InfoForm';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';

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
    // form.resetFields();
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
            form={form}
            isEditing={true}
            secondarySubmitText={t('create')}
            onCancel={handleCancel}
            submitIcon={<PlusOutlined />}
            submitText={t('create_and_continue')}
          />
        </CardBody>
      </BCard>
    </WrapStyleForm>
  );
};

export default PricingSystemForm;
