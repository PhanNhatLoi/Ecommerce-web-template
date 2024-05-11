import { Tabs } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import GeneralForm from './GeneralForm';

const SettingGeneral = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        className="d-flex flex-wrap w-100"
        titleHeader={
          <div className="d-flex flex-column mr-3 my-5 pb-5 pb-lg-1">
            <h2>{t('settings').toUpperCase()}</h2>
            <div className="text-muted" style={{ fontSize: '14px', width: '100%' }}>
              {t('settings_des')}
            </div>
          </div>
        }></CardHeader>
      <CardBody className="pt-4">
        <Tabs type="card">
          <Tabs.TabPane tab={t('general')} key="1">
            <GeneralForm />
          </Tabs.TabPane>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default SettingGeneral;
