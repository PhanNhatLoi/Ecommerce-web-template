import { Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TABS_REPORT } from '~/configs/const';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';

import GiftCardForm from './Forms/GiftCardForm';
import PromotionForm from './Forms/PromotionForm';
import RevenueForm from './Forms/RevenueForm';
import ServiceForm from './Forms/ServiceForm';
import UserForm from './Forms/UserForm';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type EcommerceReportProps = {};

const { TabPane } = Tabs;

const EcommerceReport: React.FC<EcommerceReportProps> = () => {
  const { t }: any = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS_REPORT.REVENUE);

  const tabList = [
    { title: t('revenue'), key: TABS_REPORT.REVENUE, component: RevenueForm },
    { title: t('service'), key: TABS_REPORT.SERVICE, component: ServiceForm },
    { title: t('users'), key: TABS_REPORT.USER, component: UserForm },
    { title: t('useGiftCard'), key: TABS_REPORT.GIFT_CARD, component: GiftCardForm },
    { title: t('Promotion'), key: TABS_REPORT.PROMOTION, component: PromotionForm }
  ];

  return (
    <WrapStyleForm>
      <BCard>
        <CardHeader titleHeader={t('statistic_report').toString()}>
          {/* <CardHeaderToolbar>
            {
              <AButton type="link" onClick={() => setShowModal(true)} content={t('saved_reports')}/>
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

      {/* ENHANCEMENT LATER */}
      {/* MODALS */}
      {/* <ReportModal //
        modalShow={showModal}
        setModalShow={setShowModal}
      /> */}
      {/* MODALS */}
    </WrapStyleForm>
  );
};

export default EcommerceReport;
