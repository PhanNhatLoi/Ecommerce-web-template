import { Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TABS_REPORT } from '~/configs/const';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';

import ReportModal from './Components/ReportModal';
import CustomerForm from './Forms/CustomerForm';
import OrderForm from './Forms/OrderForm';
import PackageForm from './Forms/PackageForm';
import RevenueForm from './Forms/RevenueForm';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type InsuranceReportProps = {};

const { TabPane } = Tabs;

const InsuranceReport: React.FC<InsuranceReportProps> = () => {
  const { t }: any = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS_REPORT.REVENUE);

  const tabList = [
    { title: t('revenue'), key: TABS_REPORT.REVENUE, component: RevenueForm },
    { title: t('Orders'), key: TABS_REPORT.ORDER, component: OrderForm },
    { title: t('customers'), key: TABS_REPORT.CUSTOMER, component: CustomerForm },
    { title: t('package_insurance'), key: TABS_REPORT.PACKAGE, component: PackageForm }
  ];

  return (
    <WrapStyleForm>
      <BCard>
        <CardHeader titleHeader={t('statistic_report')}>
          {/* <CardHeaderToolbar>
            {
              <AButton type="link" onClick={() => setShowModal(true)} content={t('saved_reports')}>
                
              </AButton>
            }
          </CardHeaderToolbar> */}
        </CardHeader>
        <CardBody>
          <Tabs defaultActiveKey={TABS_REPORT.REVENUE} type="card" onChange={(key: string) => setCurrentTab(key)}>
            {tabList.map((tab) => (
              <TabPane tab={tab.title} key={tab.key}>
                <tab.component tab={currentTab} />
              </TabPane>
            ))}
          </Tabs>
        </CardBody>
      </BCard>

      {/* MODALS */}
      <ReportModal //
        modalShow={showModal}
        setModalShow={setShowModal}
      />
      {/* MODALS */}
    </WrapStyleForm>
  );
};

export default InsuranceReport;
