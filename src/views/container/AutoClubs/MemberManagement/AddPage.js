import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card as BCard, CardBody, CardFooter, CardHeader, CardHeaderToolbar } from '~/views/presentation/ui/card/Card';
import styled from 'styled-components';
import InfoForm from './Forms/InfoForm';
import { UserAddOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import * as PATH from '~/configs/routesConfig';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

const AddPage = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleCancel = () => {
    history.push(PATH.AUTO_CLUB_MEMBER_LIST_PATH);
  };

  return (
    <WrapStyleForm>
      <BCard>
        <CardHeader
          titleHeader={
            <div className="py-3">
              <div className="d-flex align-items-center mb-2">
                <span style={{ fontSize: '24px' }}>{t('member_new')}</span>
              </div>
              <span className="text-muted" style={{ fontSize: '14px' }}>
                {t('member_new_des')}
              </span>
            </div>
          }
          btn={[]}></CardHeader>
        <CardBody>
          <InfoForm
            hasCreateAndContinue
            hasCreate
            isAddPage
            onCancel={handleCancel}
            submitIcon={<UserAddOutlined />}
            submitText={t('create_and_continue')}
          />
        </CardBody>
      </BCard>
    </WrapStyleForm>
  );
};

export default AddPage;
